import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { encrypt } from '@/lib/crypto';

// Force dynamic — this route must never be statically analyzed
export const dynamic = 'force-dynamic';

// Lazy initialization to prevent build-time crashes when keys are missing
function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-01-28.clover',
    });
}

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(req: Request) {
    const stripe = getStripe();
    const supabaseAdmin = getSupabaseAdmin();

    const payload = await req.text();
    const signature = req.headers.get('Stripe-Signature');

    let event: Stripe.Event;

    // Cryptographic Gatekeeper — verify Stripe signature
    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`⚠️ Webhook signature verification failed: ${message}`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Business Logic
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;

        if (customerEmail && customerName) {
            // ================================================================
            // [RW-01] ✅ DEPLOYED 2026-02-25 — AES-256-GCM Encryption
            // ================================================================
            // T.C.A. § 1340-03-07 compliance: `legal_name` and `permit_number`
            // are encrypted at the application layer via lib/crypto.ts before
            // any INSERT. The DB stores ciphertext only — never plaintext PII.
            //
            // Key source: process.env.ENCRYPTION_KEY (32-byte hex, .env.local)
            // Format stored: <iv_hex>:<tag_hex>:<ciphertext_hex>
            // ================================================================
            let encryptedName: string;
            let encryptedPermit: string;

            try {
                [encryptedName, encryptedPermit] = await Promise.all([
                    encrypt(customerName),
                    encrypt('PENDING'),
                ]);
            } catch (cryptoErr: unknown) {
                const msg = cryptoErr instanceof Error ? cryptoErr.message : 'Unknown crypto error';
                console.error(`🔐 Encryption failed — student record NOT written: ${msg}`);
                // Return 500 so Stripe retries the webhook delivery
                return NextResponse.json({ error: 'Encryption Error' }, { status: 500 });
            }

            const { error } = await supabaseAdmin
                .from('students_driver_ed')
                .insert([
                    {
                        legal_name: encryptedName,       // ✅ AES-256-GCM encrypted
                        parent_email: customerEmail,
                        permit_number: encryptedPermit,  // ✅ AES-256-GCM encrypted
                        dob: '2000-01-01', // [RW-03] Placeholder — Fillout form needed
                        classroom_hours: 0,
                        driving_hours: 0,
                    }
                ]);

            if (error) {
                console.error('Database Insert Failed:', error);
                return NextResponse.json({ error: 'Database Error' }, { status: 500 });
            }

            // ⚠️ Never log PII — reference only the Stripe session ID
            console.log(`✅ Student record sealed in vault. Session: ${session.id}`);
        }
    }

    return NextResponse.json({ received: true });
}

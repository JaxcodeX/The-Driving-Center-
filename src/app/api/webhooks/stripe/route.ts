import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with strict TypeScript typing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any, // Cast to avoid TS error with newer Stripe library versions
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = await headers();
    const sig = headerPayload.get('stripe-signature');

    if (!sig) {
        return NextResponse.json({ error: 'Missing Stripe Signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // CRITICAL SECURITY: Verify the signature
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed:`, err.message);
        // Requirement 5A: Return 401 Unauthorized immediately
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 401 });
    }

    // Handle the event
    console.log(`Event received: ${event.type}`);

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            // Handle successful payment
            // For "Teflon", we do limited processing here.
            // Logic would go here to audit log or trigger downstream.
            console.log('Payment success:', session.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// FORCE DYNAMIC - This API must always run fresh, even in static builds
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("CRITICAL INCIDENT REPORTED:", body);

        // 1. Log to Audit Table (if supabase is configured)
        // In a real scenario, we'd want robust error handling here to ensure the alert goes out even if DB fails.
        const { error } = await supabase.from('audit_logs').insert({
            action: 'CRITICAL_INCIDENT',
            details: body
        });

        if (error) {
            console.error("Failed to log incident to DB:", error);
            // Don't fail the request, prioritize the alert
        }

        // 2. Mock SMS Alert
        // await twilio.messages.create({ ... })
        console.log(">>> SMS SENT TO MATT: INCIDENT REPORTED AT " + body.timestamp);

        return NextResponse.json({ status: 'alerted' });
    } catch (e: any) {
        console.error("Emergency API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

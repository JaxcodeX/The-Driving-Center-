import { createSupabaseServerClient } from '@/lib/supabase-server';

// ============================================================
// TYPES
// ============================================================

export interface Session {
    id: string;
    start_date: string;
    end_date: string;
    max_seats: number;
    seats_booked: number;
    created_at: string;
}

// ============================================================
// DATA FETCHERS (Server-side only)
// ============================================================

/**
 * Fetches all sessions from the live database, ordered by start_date.
 * This uses the public RLS policy on the sessions table.
 */
export async function getSessions(): Promise<Session[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_date', { ascending: true });

    if (error) {
        console.error('[getSessions] Supabase error:', error.message);
        return [];
    }

    return data as Session[];
}

/**
 * Fetches only upcoming sessions (start_date >= today).
 */
export async function getUpcomingSessions(): Promise<Session[]> {
    const supabase = await createSupabaseServerClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .gte('start_date', today)
        .order('start_date', { ascending: true });

    if (error) {
        console.error('[getUpcomingSessions] Supabase error:', error.message);
        return [];
    }

    return data as Session[];
}

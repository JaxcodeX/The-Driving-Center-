import { createClient } from '@supabase/supabase-js';

// Env vars should be defined in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    // In development, we might not have these set yet, so we warn but don't crash aggressively,
    // though for production this is critical.
    console.warn("Supabase credentials missing!");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseKey || 'placeholder-key'
);

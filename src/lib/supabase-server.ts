import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. This uses the cookie-based auth strategy required
 * by the Next.js App Router.
 */
export async function createSupabaseServerClient() {
    // ============================================================
    // ARCHITECTURAL INVARIANT — Environment Contract
    // ============================================================
    // INSTRUCTOR_UUID is a required runtime configuration. Without it,
    // the Identity Lock in middleware.ts cannot function, making the
    // dashboard accessible to any authenticated Supabase user.
    //
    // To fix: Add INSTRUCTOR_UUID=<your-supabase-user-uuid> to .env.local
    // ============================================================
    if (!process.env.INSTRUCTOR_UUID) {
        throw new Error(
            '[BOS CONFIG ERROR] INSTRUCTOR_UUID is not defined in the environment. ' +
            'This variable is required for the Identity Lock (middleware.ts) to function. ' +
            'Add INSTRUCTOR_UUID=<your-supabase-user-uuid> to your .env.local file. ' +
            'See gemini.md § Architectural Invariants #1 for the specification.'
        );
    }

    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // setAll can fail if called from a Server Component.
                        // This is expected — cookies can only be set from
                        // Server Actions or Route Handlers.
                    }
                },
            },
        }
    );
}

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ============================================================
// PROTECTED ROUTE DEFINITIONS
// ============================================================

const PROTECTED_ROUTES = ['/dashboard', '/api/admin'];
const HOME_URL = '/';

// ============================================================
// MIDDLEWARE
// ============================================================

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only run auth logic on protected routes
    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // --- Build a mutable response for cookie forwarding ---
    // @supabase/ssr requires reading AND writing cookies to keep
    // the session token refreshed transparently on every request.
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Write cookies back to both the request (for downstream
                    // server components) and the response (sent to the browser)
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // --- Validate the session ---
    // IMPORTANT: getUser() makes a network call to Supabase Auth to verify
    // the JWT — it cannot be spoofed like getSession() which only reads cookies.
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        // No valid session — hard redirect to home
        console.warn(
            `[Middleware] Unauthorized access attempt to "${pathname}" — redirecting to home.`
        );

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = HOME_URL;

        // Preserve the originally requested URL so a /login page can redirect
        // back after successful auth (if you add one later)
        redirectUrl.searchParams.set('redirected_from', pathname);

        return NextResponse.redirect(redirectUrl);
    }

    // ============================================================
    // IDENTITY LOCK — [RW-02] B.L.A.S.T. Protocol
    // ============================================================
    // This system has exactly ONE authorized operator. Validating a
    // JWT is not enough — we must verify it belongs to THAT specific
    // user. Any other authenticated Supabase account is rejected here.
    //
    // Required env var: INSTRUCTOR_UUID (set in .env.local)
    // Source of truth:  gemini.md § Architectural Invariants #1
    // ============================================================

    const authorizedInstructorId = process.env.INSTRUCTOR_UUID;

    if (!authorizedInstructorId) {
        // Misconfigured server — fail loudly so it's caught immediately
        console.error(
            '[Middleware] CRITICAL: INSTRUCTOR_UUID is not defined in environment. ' +
            'The dashboard is inaccessible until this is set. See gemini.md.'
        );
        const errorUrl = request.nextUrl.clone();
        errorUrl.pathname = HOME_URL;
        errorUrl.searchParams.set('reason', 'misconfigured');
        return NextResponse.redirect(errorUrl);
    }

    if (user.id !== authorizedInstructorId) {
        // Valid JWT, wrong person. Hard stop.
        console.warn(
            `[Middleware] IDENTITY LOCK: Unauthorized UUID "${user.id}" attempted ` +
            `access to "${pathname}". Access denied.`
        );
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = HOME_URL;
        redirectUrl.searchParams.set('redirected_from', pathname);
        redirectUrl.searchParams.set('reason', 'unauthorized');
        return NextResponse.redirect(redirectUrl);
    }

    // --- Verified: correct instructor, pass the mutated response through ---
    // This ensures refreshed session cookies are written to the browser
    return supabaseResponse;
}

// ============================================================
// MATCHER CONFIG
// ============================================================

export const config = {
    matcher: [
        /*
         * Match all routes EXCEPT:
         * - _next/static  (static files)
         * - _next/image   (image optimization)
         * - favicon.ico   (browser default request)
         * - Public assets (svg, png, jpg, etc.)
         *
         * This ensures the middleware only runs where it needs to,
         * keeping cold-start latency minimal.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

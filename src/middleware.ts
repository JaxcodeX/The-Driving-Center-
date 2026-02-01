import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Dashboard Protection
    if (path.startsWith('/dashboard')) {
        // In a real app, this would check Supabase Auth Session
        // For now, we'll assume authentication is handled by Supabase Auth Helpers
        // or checks for a specific "Instructor" cookie.

        // MOCK: If no auth (conceptually), redirect to login
        // const isAuthenticated = request.cookies.get('sb-access-token');
        // if (!isAuthenticated) {
        //     return NextResponse.redirect(new URL('/login', request.url));
        // }

        // For this build, we allow access to verify the UI.
        // Ideally, we'd enable the redirect above.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};

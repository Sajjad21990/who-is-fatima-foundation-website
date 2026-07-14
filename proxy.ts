import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session-cookie';

/**
 * Cheap edge guard: bounce unauthenticated visitors away from /admin before any
 * server component runs (avoids wasted Firestore reads and blank spinners).
 * This is a presence check only — the authoritative role verification happens in
 * the dashboard layout and in every server action via requireRole().
 */
export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Login page and the session API must stay reachable while signed out.
    if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        const hasSession = request.cookies.has(SESSION_COOKIE);
        if (!hasSession) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { SESSION_COOKIE } from '@/lib/auth';

// Session cookie lifetime: 5 days.
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;

/**
 * Exchange a freshly-minted Firebase ID token for an httpOnly session cookie.
 * Only users who have a role profile in Firestore are allowed a session, so a
 * valid Firebase Auth account with no staff role cannot open the dashboard.
 */
export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        if (!idToken || typeof idToken !== 'string') {
            return NextResponse.json({ error: 'Missing token' }, { status: 400 });
        }

        // Verify the ID token and confirm it was issued recently (guards against stale tokens).
        const decoded = await adminAuth.verifyIdToken(idToken, true);

        const profileSnap = await adminDb.collection('users').doc(decoded.uid).get();
        const role = profileSnap.exists ? (profileSnap.data()?.role as string | undefined) : undefined;
        if (role !== 'admin' && role !== 'editor' && role !== 'viewer') {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRES_IN });

        const response = NextResponse.json({ success: true, role });
        response.cookies.set(SESSION_COOKIE, sessionCookie, {
            maxAge: EXPIRES_IN / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return response;
    } catch (error) {
        console.error('Failed to create session:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}

/** Clear the session cookie on logout. */
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    return response;
}

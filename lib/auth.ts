import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { SESSION_COOKIE } from '@/lib/session-cookie';

export { SESSION_COOKIE };

export type Role = 'admin' | 'editor' | 'viewer';

export interface SessionUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: Role;
}

export class AuthError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'AuthError';
    }
}

/**
 * Resolve the currently authenticated staff user from the session cookie.
 * Returns null when there is no valid session or the user has no role profile.
 * Wrapped in React.cache so repeated calls within one request hit Firestore once.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(SESSION_COOKIE)?.value;
        if (!session) return null;

        const decoded = await adminAuth.verifySessionCookie(session, false);

        const profileSnap = await adminDb.collection('users').doc(decoded.uid).get();
        if (!profileSnap.exists) return null;

        const profile = profileSnap.data() as { role?: Role; email?: string; displayName?: string };
        const role = profile.role;
        if (role !== 'admin' && role !== 'editor' && role !== 'viewer') return null;

        return {
            uid: decoded.uid,
            email: decoded.email ?? profile.email ?? null,
            displayName: profile.displayName ?? decoded.name ?? null,
            role,
        };
    } catch {
        // Invalid/expired cookie, revoked session, or Firestore error — treat as signed out.
        return null;
    }
});

/**
 * Assert that the caller is authenticated and holds one of the allowed roles.
 * Throws AuthError otherwise. Call at the top of every protected server action.
 */
export async function requireRole(...allowed: Role[]): Promise<SessionUser> {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('Not authenticated');
    if (allowed.length > 0 && !allowed.includes(user.role)) {
        throw new AuthError('Insufficient permissions');
    }
    return user;
}

/** Admin only. */
export const requireAdmin = () => requireRole('admin');
/** Admin or editor — anyone who can mutate content. */
export const requireEditor = () => requireRole('admin', 'editor');
/** Any signed-in staff member — read access to the dashboard. */
export const requireStaff = () => requireRole('admin', 'editor', 'viewer');

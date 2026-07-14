// Standalone constant with no dependencies so it can be safely imported from
// the Edge middleware (which must not pull in firebase-admin / Node APIs).
export const SESSION_COOKIE = 'session';

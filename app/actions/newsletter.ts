'use server';

import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

/**
 * Store a newsletter subscription in Firestore. The email is used as the document
 * id so repeat sign-ups are naturally de-duplicated.
 */
export async function subscribeNewsletter(email: string) {
    try {
        const parsed = schema.safeParse({ email });
        if (!parsed.success) {
            return { success: false, message: 'Please enter a valid email address.' };
        }

        const clean = parsed.data.email.toLowerCase().trim();
        await adminDb.collection('newsletter_subscribers').doc(clean).set(
            {
                email: clean,
                createdAt: new Date().toISOString(),
            },
            { merge: true }
        );

        return { success: true, message: 'Thank you for subscribing!' };
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

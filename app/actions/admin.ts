'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getEvents } from '@/lib/events';

export interface DashboardStats {
    totalEvents: number;
    totalSubmissions: number;
    recentSubmissions: any[];
}

export async function getDashboardStats() {
    try {
        const events = await getEvents();

        // Get total submissions count
        const submissionsSnapshot = await adminDb.collection('quiz_submissions').count().get();
        const totalSubmissions = submissionsSnapshot.data().count;

        // Get recent submissions (last 5)
        // Note: This needs an index on timestamp desc, usually auto-created for single field
        const recentSnapshot = await adminDb.collection('quiz_submissions')
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get();

        const recentSubmissions = recentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            totalEvents: events.length,
            totalSubmissions,
            recentSubmissions
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalEvents: 0,
            totalSubmissions: 0,
            recentSubmissions: []
        };
    }
}

export async function getSubmissionCounts(): Promise<Record<string, number>> {
    try {
        const snapshot = await adminDb.collection('quiz_submissions').get();
        const counts: Record<string, number> = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            // Match by slug or eventId for robustness against renames
            const key = data.slug || data.eventId;
            if (key) {
                // If it's an old slug like 'imam-mahdi-quiz', still count it? 
                // Or better, normalize it if we know the mapping.
                // For now, let's just count everything and the page will match what it can.
                counts[key] = (counts[key] || 0) + 1;

                // Also attribute to common prefixes to handle jan-2026 tags
                if (key.includes('-')) {
                    const base = key.split('-').slice(0, 3).join('-'); // e.g. imam-mahdi-quiz
                    if (base !== key) {
                        counts[base] = (counts[base] || 0) + 1;
                    }
                }
            }
        });

        return counts;
    } catch (error) {
        console.error('Error fetching submission counts:', error);
        return {};
    }
}

export async function getEventSubmissions(slug: string) {
    try {
        // Try exact match first
        let snapshot = await adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .get();

        // If no results, try matching by base slug (legacy)
        if (snapshot.empty && slug.includes('-')) {
            const base = slug.split('-').slice(0, 3).join('-');
            snapshot = await adminDb.collection('quiz_submissions')
                .where('slug', '==', base)
                .get();
        }

        const submissions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort manually to avoid index requirement for composite query
        return submissions.sort((a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    } catch (error) {
        console.error('Error fetching event submissions:', error);
        return [];
    }
}

export async function getSubmission(id: string) {
    try {
        const doc = await adminDb.collection('quiz_submissions').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Error fetching submission:', error);
        return null;
    }
}

export async function updateSubmissionScore(submissionId: string, newScore: number, performedBy: string) {
    try {
        const submissionRef = adminDb.collection('quiz_submissions').doc(submissionId);
        const submissionDoc = await submissionRef.get();

        if (!submissionDoc.exists) throw new Error('Submission not found');

        const oldScore = submissionDoc.data()?.score;

        await adminDb.runTransaction(async (t) => {
            // Update score
            t.update(submissionRef, { score: newScore });

            // Create audit log
            const auditRef = adminDb.collection('audit_logs').doc();
            t.set(auditRef, {
                action: 'UPDATE_SCORE',
                submissionId,
                performedBy,
                oldScore,
                newScore,
                timestamp: new Date().toISOString()
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating score:', error);
        return { success: false, error };
    }
}

export async function getAuditLogs(submissionId: string) {
    try {
        const snapshot = await adminDb.collection('audit_logs')
            .where('submissionId', '==', submissionId)
            .orderBy('timestamp', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}

// User Management
import { getAuth } from 'firebase-admin/auth';

export async function getUsers() {
    try {
        const snapshot = await adminDb.collection('users')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function createAdminUser(email: string, password: string, displayName: string, role: 'admin' | 'editor' | 'viewer') {
    try {
        const auth = getAuth();

        // Create Firebase Auth user
        const userRecord = await auth.createUser({
            email,
            password,
            displayName
        });

        // Create Firestore profile with role
        await adminDb.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            displayName,
            role,
            createdAt: new Date().toISOString()
        });

        return { success: true, uid: userRecord.uid };
    } catch (error: any) {
        console.error('Error creating user:', error);
        return { success: false, error: error.message };
    }
}

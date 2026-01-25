'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getEvents } from '@/lib/events';

export interface DashboardStats {
    totalEvents: number;
    totalSubmissions: number;
    totalVolunteers: number;
    totalMessages: number;
    recentSubmissions: any[];
}

export async function getDashboardStats() {
    try {
        const events = await getEvents();

        // Get counts
        const submissionsSnapshot = await adminDb.collection('quiz_submissions').count().get();
        const volunteersSnapshot = await adminDb.collection('volunteer_applications').count().get();
        const messagesSnapshot = await adminDb.collection('contact_messages').count().get();

        const totalSubmissions = submissionsSnapshot.data().count;
        const totalVolunteers = volunteersSnapshot.data().count;
        const totalMessages = messagesSnapshot.data().count;

        // Get recent submissions (last 5)
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
            totalVolunteers,
            totalMessages,
            recentSubmissions
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalEvents: 0,
            totalSubmissions: 0,
            totalVolunteers: 0,
            totalMessages: 0,
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

export async function getEventSubmissions(slug: string, limit: number = 20, afterId?: string) {
    try {
        let query = adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .orderBy('timestamp', 'desc');

        if (afterId) {
            const startDoc = await adminDb.collection('quiz_submissions').doc(afterId).get();
            if (startDoc.exists) {
                query = query.startAfter(startDoc);
            }
        }

        const snapshot = await query.limit(limit + 1).get();
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const hasMore = results.length > limit;
        const items = hasMore ? results.slice(0, limit) : results;
        const nextId = hasMore ? items[items.length - 1].id : null;

        return { items, nextId, hasMore };
    } catch (error) {
        console.error('Error fetching event submissions:', error);
        return { items: [], nextId: null, hasMore: false };
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

// Volunteer Management
export async function getVolunteers(limit: number = 20, afterId?: string) {
    try {
        let query = adminDb.collection('volunteer_applications')
            .orderBy('createdAt', 'desc');

        if (afterId) {
            const startDoc = await adminDb.collection('volunteer_applications').doc(afterId).get();
            if (startDoc.exists) {
                query = query.startAfter(startDoc);
            }
        }

        const snapshot = await query.limit(limit + 1).get();
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const hasMore = results.length > limit;
        const items = hasMore ? results.slice(0, limit) : results;
        const nextId = hasMore ? items[items.length - 1].id : null;

        return { items, nextId, hasMore };
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        return { items: [], nextId: null, hasMore: false };
    }
}

export async function updateVolunteerStatus(id: string, status: string) {
    try {
        await adminDb.collection('volunteer_applications').doc(id).update({
            status,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating volunteer status:', error);
        return { success: false, error };
    }
}

// Contact Management
export async function getContactMessages(limit: number = 20, afterId?: string) {
    try {
        let query = adminDb.collection('contact_messages')
            .orderBy('createdAt', 'desc');

        if (afterId) {
            const startDoc = await adminDb.collection('contact_messages').doc(afterId).get();
            if (startDoc.exists) {
                query = query.startAfter(startDoc);
            }
        }

        const snapshot = await query.limit(limit + 1).get();
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const hasMore = results.length > limit;
        const items = hasMore ? results.slice(0, limit) : results;
        const nextId = hasMore ? items[items.length - 1].id : null;

        return { items, nextId, hasMore };
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return { items: [], nextId: null, hasMore: false };
    }
}

export async function markMessageRead(id: string) {
    try {
        await adminDb.collection('contact_messages').doc(id).update({
            status: 'read',
            readAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Error marking message as read:', error);
        return { success: false, error };
    }
}

'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getEvents, loadRawEvent } from '@/lib/events';
import { gradeQuiz } from '@/lib/grade';
import { QuizEvent } from '@/lib/types';
import { requireStaff, requireEditor, requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Something went wrong';
}

export interface DashboardStats {
    totalEvents: number;
    totalSubmissions: number;
    totalVolunteers: number;
    totalMessages: number;
    recentSubmissions: Record<string, unknown>[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        await requireStaff();

        // All independent — fetch concurrently instead of four serial round-trips.
        const [events, submissionsSnapshot, volunteersSnapshot, messagesSnapshot, recentSnapshot] = await Promise.all([
            getEvents(),
            adminDb.collection('quiz_submissions').count().get(),
            adminDb.collection('volunteer_applications').count().get(),
            adminDb.collection('contact_messages').count().get(),
            adminDb.collection('quiz_submissions').orderBy('timestamp', 'desc').limit(5).get(),
        ]);

        const recentSubmissions = recentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            totalEvents: events.length,
            totalSubmissions: submissionsSnapshot.data().count,
            totalVolunteers: volunteersSnapshot.data().count,
            totalMessages: messagesSnapshot.data().count,
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
        await requireStaff();

        // One count() aggregation per event instead of reading the whole collection.
        const events = await getEvents();
        const entries = await Promise.all(
            events.map(async (event) => {
                const snap = await adminDb
                    .collection('quiz_submissions')
                    .where('slug', '==', event.slug)
                    .count()
                    .get();
                return [event.slug, snap.data().count] as const;
            })
        );

        return Object.fromEntries(entries);
    } catch (error) {
        console.error('Error fetching submission counts:', error);
        return {};
    }
}

export async function getEventSubmissions(slug: string, limit: number = 20, afterId?: string) {
    try {
        await requireStaff();

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

export async function searchEventSubmissions(slug: string, query: string, limit: number = 20) {
    try {
        await requireStaff();

        // Firestore has no native case-insensitive substring search; for the modest
        // per-event submission counts we fetch the event's submissions and filter in memory.
        const snapshot = await adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .orderBy('timestamp', 'desc')
            .get();

        const allSubmissions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Array<{ id: string; userDetails?: { name?: string } }>;

        const lowerQuery = query.toLowerCase();

        const filtered = allSubmissions.filter((sub) => {
            const name = sub.userDetails?.name?.toLowerCase() || '';
            const id = sub.id.toLowerCase();
            return name.includes(lowerQuery) || id.includes(lowerQuery);
        });

        const items = filtered.slice(0, limit);

        // Load-more is disabled for search results (in-memory filter has no stable cursor).
        return { items, nextId: null, hasMore: false };
    } catch (error) {
        console.error('Error searching submissions:', error);
        return { items: [], nextId: null, hasMore: false };
    }
}

export async function getAllEventSubmissions(slug: string) {
    try {
        await requireStaff();

        const snapshot = await adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .orderBy('timestamp', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching all event submissions:', error);
        return [];
    }
}

export async function getSubmission(id: string) {
    try {
        await requireStaff();

        const doc = await adminDb.collection('quiz_submissions').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Error fetching submission:', error);
        return null;
    }
}

export async function updateSubmissionScore(submissionId: string, newScore: number) {
    try {
        const user = await requireEditor();

        if (typeof newScore !== 'number' || !Number.isFinite(newScore) || newScore < 0) {
            return { success: false, error: 'Invalid score' };
        }

        const submissionRef = adminDb.collection('quiz_submissions').doc(submissionId);
        const submissionDoc = await submissionRef.get();

        if (!submissionDoc.exists) {
            return { success: false, error: 'Submission not found' };
        }

        const oldScore = submissionDoc.data()?.score;

        await adminDb.runTransaction(async (t) => {
            t.update(submissionRef, { score: newScore });

            // Audit identity comes from the verified session, never from the client.
            const auditRef = adminDb.collection('audit_logs').doc();
            t.set(auditRef, {
                action: 'UPDATE_SCORE',
                submissionId,
                performedBy: user.email || user.uid,
                oldScore,
                newScore,
                timestamp: new Date().toISOString()
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating score:', error);
        return { success: false, error: errorMessage(error) };
    }
}

/**
 * Re-grade every stored submission for a quiz using the CURRENT (validated) answer key.
 *
 * This is the permanent replacement for the one-off `fix-*.mjs` migration scripts:
 * whenever an answer key is corrected in content/events/*.json, run this to bring all
 * historical scores back in line — no bespoke script required.
 */
export async function recalculateEventScores(slug: string) {
    try {
        const user = await requireEditor();

        const event = await loadRawEvent(slug);
        if (!event || event.type !== 'quiz') {
            return { success: false, error: 'Quiz not found' };
        }
        const quiz = event as QuizEvent;

        const snapshot = await adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .get();

        let updated = 0;
        let batch = adminDb.batch();
        let ops = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const { score, totalPoints } = gradeQuiz(quiz, (data.answers as Record<string, string>) || {});
            if (data.score !== score || data.totalPoints !== totalPoints) {
                batch.update(doc.ref, { score, totalPoints });
                updated++;
                ops++;
                if (ops >= 400) {
                    await batch.commit();
                    batch = adminDb.batch();
                    ops = 0;
                }
            }
        }
        if (ops > 0) await batch.commit();

        await adminDb.collection('audit_logs').add({
            action: 'RECALCULATE_SCORES',
            slug,
            updatedCount: updated,
            totalCount: snapshot.size,
            performedBy: user.email || user.uid,
            timestamp: new Date().toISOString(),
        });

        revalidatePath(`/admin/events/${slug}`);
        return { success: true, updated, total: snapshot.size };
    } catch (error) {
        console.error('Error recalculating scores:', error);
        return { success: false, error: errorMessage(error) };
    }
}

export async function getAuditLogs(submissionId: string) {
    try {
        await requireStaff();

        const snapshot = await adminDb.collection('audit_logs')
            .where('submissionId', '==', submissionId)
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Array<{ id: string; timestamp: string }>;

        // Sorted in memory to avoid a composite index on a small per-submission set.
        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}

// User Management
import { getAuth } from 'firebase-admin/auth';

export async function getUsers() {
    try {
        await requireAdmin();

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
        await requireAdmin();

        if (!['admin', 'editor', 'viewer'].includes(role)) {
            return { success: false, error: 'Invalid role' };
        }

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
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, error: errorMessage(error) };
    }
}

// Volunteer Management
export async function getVolunteers(limit: number = 20, afterId?: string) {
    try {
        await requireStaff();

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
        await requireEditor();

        await adminDb.collection('volunteer_applications').doc(id).update({
            status,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating volunteer status:', error);
        return { success: false, error: errorMessage(error) };
    }
}

// Contact Management
export async function getContactMessages(limit: number = 20, afterId?: string) {
    try {
        await requireStaff();

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
        await requireEditor();

        await adminDb.collection('contact_messages').doc(id).update({
            status: 'read',
            readAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Error marking message as read:', error);
        return { success: false, error: errorMessage(error) };
    }
}

// Winner Management
export interface Winner {
    rank: number;
    submissionId: string;
    userDetails: Record<string, unknown>;
    score: number;
    totalPoints: number;
}

export async function saveEventWinners(slug: string, winners: Winner[]) {
    try {
        const user = await requireEditor();

        const submissions = (await adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .orderBy('timestamp', 'desc')
            .get()).docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<{
                id: string;
                score: number;
                totalPoints?: number;
                timestamp: string;
                userDetails: Record<string, unknown>;
            }>;

        const selectedWinnerIds = new Set(winners.map(w => w.submissionId));

        // Rank everyone who wasn't hand-picked, below the selected winners.
        const remaining = submissions
            .filter((sub) => !selectedWinnerIds.has(sub.id))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });

        const startRank = Math.max(0, ...winners.map(w => w.rank)) + 1;
        const leaderboard: Winner[] = [...winners];

        // Standard competition ranking (ties share a rank; the next distinct score skips).
        let prevScore: number | null = null;
        let prevRank = startRank;
        remaining.forEach((participant, i) => {
            let rank: number;
            if (i === 0) {
                rank = startRank;
            } else if (participant.score === prevScore) {
                rank = prevRank;
            } else {
                rank = startRank + i;
            }
            prevScore = participant.score;
            prevRank = rank;

            leaderboard.push({
                rank,
                submissionId: participant.id,
                userDetails: participant.userDetails,
                score: participant.score,
                totalPoints: participant.totalPoints || 0
            });
        });

        await adminDb.collection('event_winners').doc(slug).set({
            slug,
            winners: leaderboard,
            lockedAt: new Date().toISOString(),
            lockedBy: user.email || user.uid
        });
        return { success: true };
    } catch (error) {
        console.error('Error saving event winners:', error);
        return { success: false, error: errorMessage(error) };
    }
}

export async function resetEventWinners(slug: string) {
    try {
        await requireEditor();

        await adminDb.collection('event_winners').doc(slug).delete();
        return { success: true };
    } catch (error) {
        console.error('Error resetting event winners:', error);
        return { success: false, error: errorMessage(error) };
    }
}

// Public: the winners leaderboard is shown on the public results page.
export async function getEventWinners(slug: string) {
    try {
        const doc = await adminDb.collection('event_winners').doc(slug).get();
        if (!doc.exists) return null;
        return doc.data();
    } catch (error) {
        console.error('Error fetching event winners:', error);
        return null;
    }
}

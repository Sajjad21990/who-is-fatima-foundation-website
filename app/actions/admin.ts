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

export async function searchEventSubmissions(slug: string, query: string, limit: number = 20) {
    try {
        // Fallback Strategy: Fetch ALL submissions for this event and filter in-memory.
        // Why? 
        // 1. Firestore regex/case-insensitive search is not natively supported without third-party services (Algolia/Typesense) or specific schema changes (lowercase fields).
        // 2. The number of submissions per event is reasonable (likely < 5000).
        // 3. This guarantees mostly accurate results for both Name (partial, case-insensitive) and ID (partial).

        const snapshot = await adminDb.collection('quiz_submissions')
            .where('slug', '==', slug)
            .orderBy('timestamp', 'desc')
            .get();

        const allSubmissions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const lowerQuery = query.toLowerCase();

        const filtered = allSubmissions.filter((sub: any) => {
            const name = sub.userDetails?.name?.toLowerCase() || '';
            const id = sub.id.toLowerCase();
            return name.includes(lowerQuery) || id.includes(lowerQuery);
        });

        // Pagination for the search results (client expects paginated structure)
        // We return the top 'limit' of the filtered results. 
        // Note: Real pagination for search results would require keeping state, but here we just return the top matches.
        // If users need to see more search results, we would need to slice differently based on an offset not just 'nextId'. 
        // Valid simplification: Return top 50, or just return first page.

        const hasMore = filtered.length > limit;
        const items = filtered.slice(0, limit);
        const nextId = null; // Search pagination is complex with in-memory filter, disabling 'Load More' for search results for now or implementing simple slice. 

        return { items, nextId, hasMore: false }; // Disable infinite scroll for search results to avoid complexity

    } catch (error) {
        console.error('Error searching submissions:', error);
        return { items: [], nextId: null, hasMore: false };
    }
}

export async function getAllEventSubmissions(slug: string) {
    try {
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
            // .orderBy('timestamp', 'desc') // Removed to avoid composite index requirement
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort in memory
        return logs.sort((a: any, b: any) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
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

// Winner Management
export interface Winner {
    rank: number;
    submissionId: string;
    userDetails: any;
    score: number;
    totalPoints: number;
}

export async function saveEventWinners(slug: string, winners: Winner[]) {
    try {
        // 1. Get ALL submissions for this event
        const submissions = (await getAllEventSubmissions(slug)) as any[];

        // 2. Separate selected winners from the rest
        const selectedWinnerIds = new Set(winners.map(w => w.submissionId));

        // 3. Filter and sort remaining participants
        // We want to rank them after the selected winners (startRank)
        // Sort by score (desc), then by timestamp (asc) to favor early birds in ties for sorting display,
        // though we will assign same rank for same score.
        const remainingParticipants = submissions
            .filter((sub: any) => !selectedWinnerIds.has(sub.id))
            .sort((a: any, b: any) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });

        // 4. Assign ranks to remaining participants
        // The next rank starts after the lowest rank in the selected `winners`
        // Typically this will be 4 if we selected top 3.
        const maxSelectedRank = Math.max(...winners.map(w => w.rank), 0);
        let currentRank = maxSelectedRank + 1;

        const leaderboard: Winner[] = [...winners];

        // Handling ties for remaining participants
        // If scores are equal, they get the same rank.
        // We iterate through the sorted remaining participants.

        for (let i = 0; i < remainingParticipants.length; i++) {
            const participant = remainingParticipants[i];

            // If it's not the first one, check if score is same as previous
            if (i > 0 && participant.score === remainingParticipants[i - 1].score) {
            } else {
                // New rank (update currentRank to current position index + offset)
                // Standard competition ranking: 1, 2, 2, 4... (gaps = number of people tied)
                // OR Dense ranking: 1, 2, 2, 3... (no gaps)
                // "after top 3 there can be same rank if required" -> User implies "same rank" is allowed.
                // Let's use standard competition ranking relative to the list.
                // Actually, simply:
                // If distinct score, rank = (maxSelectedRank + 1) + i
                // If same score, keep same rank as previous iteration.

                // Let's optimize:
                // The logical rank for item `i` is `(maxSelectedRank + 1) + i`
                // BUT if it ties with `i-1`, we want to use `i-1`'s rank.

                // Wait, typically if there is a tie for 4th, both get 4. The next person gets 6.
                // Let's stick to that logic unless "Dense" is preferred. 
                // "after top 3 there can be same rank if required"

                // Implementation:
                // Rank is determined by position in sorted list, but adjusted for ties.
                const rankByPosition = (maxSelectedRank + 1) + i;
                currentRank = rankByPosition;
            }

            // Re-check logic: 
            // i=0: rank = 4 + 0 = 4.
            // i=1 (tied): score matches i=0. Should be rank 4? Yes.
            // i=2 (lower): score lower. Should be rank 6? Yes.

            // Logic for assigning the rank to the object:
            let assignedRank = (maxSelectedRank + 1) + i;
            if (i > 0 && participant.score === remainingParticipants[i - 1].score) {
                // Find the rank of the previous one in our new list? 
                // It's just the one we just pushed? No, leaderboard has winners too.
                // Let's maintain a variable for the 'last assigned rank' and 'last score'.
                // Actually easier:
                const lastAdded = leaderboard[leaderboard.length - 1];
                // Note: leaderboard has winners at start, so "lastAdded" might be a winner if i=0.
                // But we are in remaining loop.
                if (i === 0) {
                    // First remaining person. Rank is definitely (maxSelectedRank + 1).
                    assignedRank = maxSelectedRank + 1;
                } else {
                    // Check if score equals previous remaining participant
                    if (participant.score === remainingParticipants[i - 1].score) {
                        // Get rank of the LAST entry we added (which corresponds to remainingParticipants[i-1])
                        assignedRank = leaderboard[leaderboard.length - 1].rank;
                    } else {
                        // No tie. Standard ranking.
                        assignedRank = (maxSelectedRank + 1) + i;
                    }
                }
            } else {
                if (i === 0) assignedRank = maxSelectedRank + 1;
            }

            leaderboard.push({
                rank: assignedRank,
                submissionId: participant.id,
                userDetails: participant.userDetails,
                score: participant.score,
                totalPoints: participant.totalPoints || 0
            });
        }

        await adminDb.collection('event_winners').doc(slug).set({
            slug,
            winners: leaderboard,
            lockedAt: new Date().toISOString(),
            lockedBy: 'admin' // In a real app we'd track the user ID
        });
        return { success: true };
    } catch (error) {
        console.error('Error saving event winners:', error);
        return { success: false, error };
    }
}

export async function resetEventWinners(slug: string) {
    try {
        await adminDb.collection('event_winners').doc(slug).delete();
        return { success: true };
    } catch (error) {
        console.error('Error resetting event winners:', error);
        return { success: false, error };
    }
}

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

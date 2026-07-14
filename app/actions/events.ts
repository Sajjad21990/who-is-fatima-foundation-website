'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getEventBySlug, loadRawEvent } from '@/lib/events';
import { gradeQuiz } from '@/lib/grade';
import { QuizEvent, UserDetails } from '@/lib/types';

function normalizePhone(value: string | undefined | null): string {
    return (value || '').replace(/\D/g, '');
}

/** Reject obviously malformed answer payloads before touching the database. */
function sanitizeAnswers(answers: unknown, questionIds: Set<string>): Record<string, string> {
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return {};
    }
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(answers as Record<string, unknown>)) {
        if (!questionIds.has(key)) continue; // ignore keys that aren't real questions
        if (typeof value !== 'string') continue;
        clean[key] = value.slice(0, 2000); // cap answer length
    }
    return clean;
}

export async function submitQuiz(slug: string, answers: Record<string, string>, userDetails: UserDetails) {
    try {
        // Load the validated event (with answer key) from the server file system.
        const event = await loadRawEvent(slug);
        if (!event || event.type !== 'quiz') {
            return { success: false, message: 'Event not found' };
        }
        const quiz = event as QuizEvent;

        // Basic input validation.
        const name = (userDetails?.name || '').trim();
        if (!name) {
            return { success: false, message: 'Name is required' };
        }
        const cleanUserDetails: UserDetails = {
            ...userDetails,
            name: name.slice(0, 200),
            email: (userDetails?.email || '').slice(0, 200),
            phone: (userDetails?.phone || '').slice(0, 40),
        };

        const questionIds = new Set(quiz.content.questions.map((q) => q.id));
        const cleanAnswers = sanitizeAnswers(answers, questionIds);

        // Best-effort duplicate guard: one submission per phone per quiz.
        const phone = normalizePhone(cleanUserDetails.phone);
        if (phone) {
            try {
                const existing = await adminDb.collection('quiz_submissions')
                    .where('slug', '==', quiz.slug)
                    .where('userDetails.phone', '==', cleanUserDetails.phone)
                    .limit(1)
                    .get();
                if (!existing.empty) {
                    return { success: false, message: 'You have already submitted this quiz.' };
                }
            } catch (dupeError) {
                // Missing composite index or transient error — fail open so real users aren't blocked.
                console.warn('Duplicate-submission check skipped:', dupeError);
            }
        }

        const { score, totalPoints } = gradeQuiz(quiz, cleanAnswers);

        await adminDb.collection('quiz_submissions').add({
            eventId: quiz.id,
            slug: quiz.slug,
            userDetails: cleanUserDetails,
            answers: cleanAnswers,
            score,
            totalPoints,
            timestamp: new Date().toISOString(),
        });

        if (quiz.showScore) {
            return { success: true, score, totalPoints, message: 'Quiz submitted successfully' };
        }
        return { success: true, message: 'Quiz submitted successfully' };
    } catch (error) {
        console.error('Quiz submission error:', error);
        return { success: false, message: 'Failed to submit quiz' };
    }
}

export async function verifyAndGetSubmission(submissionId: string, phone: string) {
    try {
        const submissionDoc = await adminDb.collection('quiz_submissions').doc(submissionId).get();
        if (!submissionDoc.exists) {
            return { success: false, message: 'Submission not found' };
        }

        const submission = { id: submissionDoc.id, ...submissionDoc.data() } as {
            id: string;
            slug: string;
            answers?: Record<string, string>;
            score?: number;
            totalPoints?: number;
            userDetails?: { name?: string; phone?: string };
        };

        const storedPhone = normalizePhone(submission.userDetails?.phone);
        const inputPhone = normalizePhone(phone);

        // Require a substantial phone number — never match an empty/short string.
        // (Fixes the endsWith("") bypass that returned true for any input.)
        if (inputPhone.length < 7 || storedPhone.length < 7) {
            return { success: false, message: 'Please enter the full phone number used for this submission.' };
        }

        const isMatch =
            storedPhone === inputPhone ||
            storedPhone.endsWith(inputPhone) ||
            inputPhone.endsWith(storedPhone);

        if (!isMatch) {
            return { success: false, message: 'Phone number does not match our records.' };
        }

        const event = await getEventBySlug(submission.slug, true);
        if (!event) {
            return { success: false, message: 'Event not found' };
        }

        const questions = (event as QuizEvent).content?.questions || [];

        return {
            success: true,
            submission: {
                id: submission.id,
                answers: submission.answers,
                score: submission.score,
                totalPoints: submission.totalPoints,
                userDetails: { name: submission.userDetails?.name }, // only the name, not full contact details
            },
            questions,
        };
    } catch (error) {
        console.error('Verify submission error:', error);
        return { success: false, message: 'Failed to verify submission' };
    }
}

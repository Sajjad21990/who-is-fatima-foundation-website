import type { QuizEvent } from '@/lib/types';

export interface GradeResult {
    score: number;
    totalPoints: number;
}

function normalizeText(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Single source of truth for quiz grading.
 *
 * Used by both submitQuiz (grade-on-submit) and the admin recalculate action
 * (re-grade stored submissions after an answer-key correction). Previously the
 * grading logic lived inline in submitQuiz and was duplicated ad-hoc in one-off
 * `fix-*.mjs` scripts every time a key was wrong — this centralizes it.
 */
export function gradeQuiz(event: QuizEvent, answers: Record<string, string>): GradeResult {
    let score = 0;
    let totalPoints = 0;

    for (const question of event.content.questions) {
        // Points default to 1 when unspecified (matches the documented type contract).
        const points = question.points ?? 1;
        totalPoints += points;

        const userAnswer = answers?.[question.id];
        if (userAnswer === undefined || userAnswer === null) continue;

        if (question.type === 'mcq') {
            // Map correct indices to option text, ignoring any out-of-range index.
            const correctTexts = question.correctAnswer
                .map((idx) => question.options[idx])
                .filter((text): text is string => typeof text === 'string');
            if (correctTexts.includes(userAnswer)) {
                score += points;
            }
        } else if (question.type === 'boolean') {
            if (String(question.correctAnswer) === userAnswer) {
                score += points;
            }
        } else if (question.type === 'text') {
            if (question.correctAnswer) {
                // Grade against the provided key (normalized comparison).
                if (normalizeText(userAnswer) === normalizeText(question.correctAnswer)) {
                    score += points;
                }
            } else if ((question as { autoGrade?: boolean }).autoGrade) {
                // Auto-graded free text: any non-empty answer earns the points.
                if (userAnswer.trim().length > 0) {
                    score += points;
                }
            }
            // Otherwise: text answer left for manual review, no automatic points.
        }
    }

    return { score, totalPoints };
}

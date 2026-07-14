import { z } from 'zod';
import type { Event, QuizEvent } from '@/lib/types';

const registrationFieldSchema = z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'tel', 'date', 'number']),
    required: z.boolean(),
    minAge: z.number().optional(),
    maxAge: z.number().optional(),
});

const mcqQuestionSchema = z.object({
    id: z.string(),
    text: z.string(),
    points: z.number().optional(),
    type: z.literal('mcq'),
    options: z.array(z.string()).min(2),
    correctAnswer: z.array(z.number().int().nonnegative()).min(1),
});

const textQuestionSchema = z.object({
    id: z.string(),
    text: z.string(),
    points: z.number().optional(),
    type: z.literal('text'),
    correctAnswer: z.string().optional(),
    autoGrade: z.boolean().optional(),
});

const booleanQuestionSchema = z.object({
    id: z.string(),
    text: z.string(),
    points: z.number().optional(),
    type: z.literal('boolean'),
    correctAnswer: z.boolean(),
});

const questionSchema = z.discriminatedUnion('type', [
    mcqQuestionSchema,
    textQuestionSchema,
    booleanQuestionSchema,
]);

const quizEventSchema = z.object({
    id: z.string(),
    slug: z.string(),
    type: z.literal('quiz'),
    title: z.string(),
    description: z.string(),
    thumbnailUrl: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    endDate: z.string().optional(),
    showScore: z.boolean(),
    registrationFields: z.array(registrationFieldSchema),
    content: z.object({
        questions: z.array(questionSchema),
    }),
});

const webinarEventSchema = z.object({
    id: z.string(),
    slug: z.string(),
    type: z.literal('webinar'),
    title: z.string(),
    description: z.string(),
    thumbnailUrl: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    startDate: z.string(),
    content: z.object({
        webinarUrl: z.string().optional(),
        speaker: z.string().optional(),
        duration: z.string().optional(),
    }),
});

const eventSchema = z.discriminatedUnion('type', [quizEventSchema, webinarEventSchema]);

/**
 * Parse and validate a raw event JSON object.
 *
 * Crucially, this rejects MCQ answer keys whose indices fall outside the options
 * array — the exact defect that shipped in zulhijjah q19 (`correctAnswer: [34]`)
 * and silently mis-graded every submission. A bad key now fails loudly at load
 * time instead of quietly awarding zero.
 */
export function validateEvent(data: unknown, sourceName: string): Event {
    const parsed = eventSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid event "${sourceName}": ${parsed.error.issues.map(i => `${i.path.join('.')} ${i.message}`).join('; ')}`);
    }

    const event = parsed.data as Event;

    if (event.type === 'quiz') {
        for (const q of event.content.questions) {
            if (q.type === 'mcq') {
                for (const idx of q.correctAnswer) {
                    if (idx < 0 || idx >= q.options.length) {
                        throw new Error(
                            `Invalid event "${sourceName}": question "${q.id}" has correctAnswer index ${idx} out of range (options length ${q.options.length}).`
                        );
                    }
                }
            }
        }
    }

    return event as Event;
}

export type ValidatedQuizEvent = QuizEvent;

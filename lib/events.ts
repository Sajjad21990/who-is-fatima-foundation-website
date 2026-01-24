
import fs from 'fs';
import path from 'path';
import { Event, QuizEvent } from './types';

const contentDirectory = path.join(process.cwd(), 'content/events');

export async function getEvents(): Promise<Event[]> {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allEventsData = fileNames.map((fileName) => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const eventData = JSON.parse(fileContents) as Event;
        return eventData;
    });

    // Sort events by date
    return allEventsData.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
    try {
        const fullPath = path.join(contentDirectory, `${slug}.json`);
        // Security check to prevent directory traversal
        if (!fullPath.startsWith(contentDirectory)) {
            return null;
        }

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const eventData = JSON.parse(fileContents) as Event;

        // IMPORTANT: Strip correct answers for Quizzes before sending to client
        if (eventData.type === 'quiz') {
            const quiz = eventData as QuizEvent;
            const strippedQuestions = quiz.content.questions.map(q => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { correctAnswer, ...rest } = q as any;
                // We strip correctAnswer. For MCQs options remain.
                return rest;
            });

            return {
                ...quiz,
                content: {
                    ...quiz.content,
                    questions: strippedQuestions
                }
            };
        }

        return eventData;
    } catch (error) {
        console.error("Error reading event file:", error);
        return null;
    }
}

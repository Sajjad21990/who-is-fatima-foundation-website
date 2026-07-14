import 'server-only';

import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { Event, QuizEvent } from './types';
import { validateEvent } from './validations/event';

const contentDirectory = path.join(process.cwd(), 'content/events');

/** Remove correct answers from a quiz event before it can reach the client. */
function stripAnswers(event: Event): Event {
    if (event.type !== 'quiz') return event;

    const quiz = event as QuizEvent;
    const strippedQuestions = quiz.content.questions.map((q) => {
        const rest = { ...q } as Record<string, unknown>;
        delete rest.correctAnswer;
        return rest;
    });

    return {
        ...quiz,
        content: { ...quiz.content, questions: strippedQuestions },
    } as unknown as Event;
}

/**
 * Server-only: load and validate a single event WITH its answer key.
 * Never expose the result to the client — use getEventBySlug() for that.
 */
export const loadRawEvent = cache(async (slug: string): Promise<Event | null> => {
    const fullPath = path.join(contentDirectory, `${slug}.json`);

    // Guard against path traversal: the resolved path must stay inside the content dir.
    const resolved = path.resolve(fullPath);
    if (!resolved.startsWith(path.resolve(contentDirectory) + path.sep)) {
        return null;
    }

    if (!fs.existsSync(resolved)) {
        return null;
    }

    try {
        const fileContents = fs.readFileSync(resolved, 'utf8');
        return validateEvent(JSON.parse(fileContents), slug);
    } catch (error) {
        console.error(`Error loading event "${slug}":`, error);
        return null;
    }
});

export const getEvents = cache(async (): Promise<Event[]> => {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory).filter((name) => name.endsWith('.json'));
    const events: Event[] = [];

    for (const fileName of fileNames) {
        try {
            const fileContents = fs.readFileSync(path.join(contentDirectory, fileName), 'utf8');
            const event = validateEvent(JSON.parse(fileContents), fileName);
            // Answers stripped here so the events listing can never serialize the key to the browser.
            events.push(stripAnswers(event));
        } catch (error) {
            console.error(`Skipping invalid event file "${fileName}":`, error);
        }
    }

    return events.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
});

export async function getEventBySlug(slug: string, includeAnswers: boolean = false): Promise<Event | null> {
    const event = await loadRawEvent(slug);
    if (!event) return null;
    return includeAnswers ? event : stripAnswers(event);
}

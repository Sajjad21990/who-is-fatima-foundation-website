'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getEventBySlug } from '@/lib/events';
import { QuizEvent, UserDetails } from '@/lib/types';
import fs from 'fs';
import path from 'path';

export async function submitQuiz(slug: string, answers: Record<string, string>, userDetails: UserDetails) {
  try {
    // 1. Read the FULL event data from the server file system
    const contentDirectory = path.join(process.cwd(), 'content/events');
    const fullPath = path.join(contentDirectory, `${slug}.json`);

    if (!fs.existsSync(fullPath)) {
      throw new Error('Event not found');
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const event = JSON.parse(fileContents) as QuizEvent;

    if (event.type !== 'quiz') {
      throw new Error('Invalid event type');
    }

    // 2. Calculate Score
    let score = 0;
    let totalPoints = 0;
    const questions = event.content.questions;

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const points = question.points || 0;
      totalPoints += points;

      if (question.type === 'mcq') {
        const correctIndices = question.correctAnswer;
        const correctOptionTexts = correctIndices.map(idx => question.options[idx]);

        if (correctOptionTexts.includes(userAnswer)) {
          score += points;
        }
      }
      else if (question.type === 'boolean') {
        if (String(question.correctAnswer) === userAnswer) {
          score += points;
        }
      }
    });

    // 3. Store in Firestore
    const submission = {
      eventId: event.id,
      slug: event.slug,
      userDetails,
      answers,
      score,
      totalPoints,
      timestamp: new Date().toISOString()
    };

    await adminDb.collection('quiz_submissions').add(submission);

    // 4. Return result based on showScore setting
    if (event.showScore) {
      return {
        success: true,
        score: score,
        totalPoints: totalPoints,
        message: 'Quiz submitted successfully'
      };
    } else {
      return {
        success: true,
        message: 'Quiz submitted successfully'
      };
    }

  } catch (error) {
    console.error('Quiz submission error:', error);
    return {
      success: false,
      message: 'Failed to submit quiz'
    };
  }
}

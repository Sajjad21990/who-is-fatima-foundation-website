'use client';

import { Check, X } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'mcq' | 'boolean' | 'text';
    options?: string[];
    correctAnswer?: any;
    points: number;
    autoGrade?: boolean;
}

interface SubmissionAnswersDisplayProps {
    questions: Question[];
    answers: Record<string, string>;
    score: number;
    totalPoints: number;
}

export default function SubmissionAnswersDisplay({
    questions,
    answers,
    score,
    totalPoints
}: SubmissionAnswersDisplayProps) {
    return (
        <div className="space-y-4">
            {/* Score Summary */}
            <div className="text-center p-4 bg-[#1D3557] rounded-lg text-white mb-6">
                <p className="text-sm opacity-75 mb-1">Your Score</p>
                <p className="text-3xl font-bold">{score} / {totalPoints}</p>
            </div>

            {/* Questions */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {questions.map((question, index) => {
                    const userAnswer = answers?.[question.id];
                    let isCorrect = false;
                    let correctAnswerText = '';

                    if (question.type === 'mcq') {
                        const correctIndices = question.correctAnswer || [];
                        if (Array.isArray(correctIndices)) {
                            const correctOptions = correctIndices.map((idx: number) => question.options?.[idx] || '');
                            correctAnswerText = correctOptions.join(', ');
                            isCorrect = correctOptions.some(opt => opt.trim() === (userAnswer || '').trim());
                        }
                    } else if (question.type === 'boolean') {
                        isCorrect = String(question.correctAnswer) === userAnswer;
                        correctAnswerText = String(question.correctAnswer);
                    } else if (question.type === 'text' || question.autoGrade) {
                        isCorrect = !!userAnswer;
                    }

                    return (
                        <div
                            key={question.id}
                            className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            Question {index + 1}
                                        </span>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/50 text-gray-500 border border-gray-200">
                                            {question.points} pts
                                        </span>
                                    </div>
                                    <p className="font-semibold text-[#1D3557] mb-3">{question.text}</p>

                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-gray-400 block mb-0.5">Your Answer</span>
                                            <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                {userAnswer || <span className="text-gray-400 italic">No answer provided</span>}
                                            </p>
                                        </div>

                                        {!isCorrect && question.type !== 'text' && !question.autoGrade && (
                                            <div className="mt-2 pt-2 border-t border-black/5">
                                                <span className="text-xs text-gray-400 block mb-0.5">Correct Answer</span>
                                                <p className="font-medium text-[#1D3557]">
                                                    {correctAnswerText}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

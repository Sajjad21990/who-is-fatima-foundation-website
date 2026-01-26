'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, Check, Trophy, Loader2, X } from 'lucide-react';
import { Question, QuizEvent, RegistrationField } from '@/lib/types';
import { toast } from 'sonner';
import { submitQuiz } from '@/app/actions/events';

interface QuizRunnerProps {
    event: QuizEvent;
    questions: Question[];
}

export function QuizRunner({ event, questions }: QuizRunnerProps) {
    const [step, setStep] = useState(0);
    const [details, setDetails] = useState<Record<string, string>>({});
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score?: number, total?: number, message: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const totalSteps = questions.length + 1;
    const progress = (step / totalSteps) * 100;

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Check required fields
        const missingFields = event.registrationFields?.filter(field => field.required && !details[field.id]);
        if (missingFields?.length > 0) {
            setError(`Please fill in all required fields`);
            return;
        }

        // 2. Age Validation
        const ageField = event.registrationFields?.find(f => f.id === 'age' && f.type === 'number');
        if (ageField && details['age']) {
            const age = parseInt(details['age']);

            if (ageField.minAge !== undefined && age < ageField.minAge) {
                setError(`You must be at least ${ageField.minAge} years old to participate.`);
                return;
            }

            if (ageField.maxAge !== undefined && age > ageField.maxAge) {
                setError(`You must be under ${ageField.maxAge} years old to participate.`);
                return;
            }
        }

        setStep(1);
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Map details to UserDetails interface expected by backend (mapping loosely for now)
            const userDetails = {
                name: details['name'] || '',
                email: details['email'] || '',
                phone: details['phone'] || '',
                ...details
            };

            const response = await submitQuiz(event.slug, answers, userDetails);

            if (response.success) {
                setResult({
                    score: response.score,
                    total: response.totalPoints,
                    message: response.message
                });
                setStep(step + 1);
            } else {
                setError('Failed to submit quiz. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentQuestionIndex = step - 1;
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto min-h-[600px] flex flex-col justify-center">
            {/* Error Popup */}
            {error && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-6 text-center"
                    >
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1D3557] mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button
                            onClick={() => setError(null)}
                            className="w-full bg-[#E63946] hover:bg-[#E63946]/90 text-white rounded-xl"
                        >
                            Okay, got it
                        </Button>
                    </motion.div>
                </div>
            )}

            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 text-[#E63946] animate-spin mb-4" />
                    <p className="text-lg font-medium text-[#1D3557]">Submitting your answers...</p>
                </div>
            )}

            {/* Result Popup */}
            {result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative"
                    >
                        <button
                            onClick={() => window.location.href = '/events'}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trophy className="w-10 h-10" />
                            </div>

                            <h2 className="text-2xl font-bold text-[#1D3557] mb-2">{result.message}</h2>

                            {event.showScore && result.score !== undefined ? (
                                <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Your Score</span>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold text-[#E63946]">{result.score}</span>
                                        <span className="text-2xl text-gray-400">/{result.total}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 mb-8">
                                    Thank you for participating in <strong>{event.title}</strong>.
                                    Your submission has been recorded.
                                </p>
                            )}

                            <Button onClick={() => window.location.href = '/events'} className="w-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white h-12 text-lg">
                                Back to Events
                            </Button>
                        </div>
                        {/* Decorative bottom bar */}
                        <div className="h-2 bg-gradient-to-r from-[#1D3557] to-[#E63946]" />
                    </motion.div>
                </div>
            )}

            <AnimatePresence mode='wait'>
                {step === 0 ? (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
                    >
                        <h2 className="text-2xl font-bold text-[#1D3557] mb-2">Almost there!</h2>
                        <p className="text-gray-600 mb-8">Please enter your details to start the quiz.</p>

                        <form onSubmit={handleStart} className="space-y-5">
                            {event.registrationFields?.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id} className="text-base font-medium text-[#1D3557]">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        id={field.id}
                                        type={field.type}
                                        value={details[field.id] || ''}
                                        onChange={e => setDetails(prev => ({ ...prev, [field.id]: e.target.value }))}
                                        required={field.required}
                                        className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#E63946] focus:ring-[#E63946]/5"
                                    />
                                </div>
                            ))}

                            {!event.registrationFields?.length && (
                                <p className="text-sm text-gray-500 italic">No registration details required.</p>
                            )}

                            <Button type="submit" className="w-full h-12 text-lg bg-[#E63946] hover:bg-[#E63946]/90 text-white mt-4 rounded-xl shadow-md hover:shadow-lg transition-all">
                                Start Quiz <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key={`q-${currentQuestion?.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                    >
                        {/* Progress Bar Inside Card */}
                        <div className="h-2 bg-gray-100 w-full">
                            <motion.div
                                className="h-full bg-[#E63946]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <div className="p-8 md:p-10 min-h-[400px] flex flex-col">
                            <div className="mb-4">
                                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Question {step} of {questions.length}</span>
                                <h3 className="text-2xl font-bold text-[#1D3557] mt-2">{currentQuestion?.text}</h3>
                            </div>

                            <div className="flex-1 space-y-4">
                                {currentQuestion?.type === 'mcq' && (
                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, idx) => (
                                            <button
                                                key={option}
                                                onClick={() => handleAnswer(currentQuestion.id, option)}
                                                className={`w-full text-left py-3 px-6 rounded-full border-2 transition-all duration-200 flex items-center gap-4 group relative overflow-hidden
                                                ${answers[currentQuestion.id] === option
                                                        ? 'border-[#E63946] bg-[#FFFAFA] shadow-sm'
                                                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${answers[currentQuestion.id] === option
                                                    ? 'border-[#E63946] bg-[#E63946] text-white'
                                                    : 'border-gray-300 text-gray-500 bg-gray-50 group-hover:border-gray-400'
                                                    }`}>
                                                    {answers[currentQuestion.id] === option ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-sm font-bold">{String.fromCharCode(65 + idx)}</span>
                                                    )}
                                                </div>
                                                <span className={`font-medium text-base leading-snug ${answers[currentQuestion.id] === option ? 'text-[#1D3557]' : 'text-gray-700'}`}>
                                                    {option}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion?.type === 'text' && (
                                    <textarea
                                        className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#E63946] focus:ring-0 min-h-[150px] resize-none"
                                        placeholder="Type your answer here..."
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    />
                                )}
                            </div>

                            <div className="mt-16 mb-2 flex justify-between items-center">
                                <Button
                                    onClick={handleBack}
                                    variant="ghost"
                                    className="text-gray-500 hover:text-[#1D3557] hover:bg-gray-50 px-6 cursor-pointer rounded-xl flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={!answers[currentQuestion?.id]}
                                    className="bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-8 text-lg cursor-pointer rounded-xl"
                                >
                                    {step === questions.length ? 'Submit Quiz' : 'Next Question'}
                                    {step !== questions.length && <ChevronRight className="w-4 h-4 ml-2" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper specific to this component just in case
function getFieldValue(details: Record<string, string>, key: string) {
    return details[key] || '';
}

import { getSubmission, getAuditLogs } from '@/app/actions/admin';
import { getEventBySlug } from '@/lib/events';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, Check, X, History } from 'lucide-react';
import { format } from 'date-fns';
import { ScoreOverride } from '@/components/admin/ScoreOverride';

export default async function SubmissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const submissionData = await getSubmission(id);
    const auditLogs = await getAuditLogs(id);

    if (!submissionData) {
        notFound();
    }

    const submission = submissionData as any;
    const event = await getEventBySlug(submission.slug, true);

    if (!event) {
        return <div>Event data not found for slug: {submission.slug}</div>;
    }

    // Cast to any to access quiz-specific fields without strict type guards for now
    const questions = (event.content as any).questions || [];

    console.log({ submission, questions })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <Link href={`/admin/events/${submission.slug}`} className="hover:text-[#E63946] flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Submissions
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Answers */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#1D3557]">Submission Answers</h2>
                            <span className="text-sm text-gray-400">{questions.length} Questions</span>
                        </div>

                        <div className="space-y-6">
                            {questions.map((question: any, index: number) => {
                                const userAnswer = submission.answers?.[question.id];
                                let isCorrect = false;
                                let correctAnswerText = '';

                                if (question.type === 'mcq') {
                                    const correctIndices = question.correctAnswer || [];
                                    if (Array.isArray(correctIndices)) {
                                        const correctOptions = correctIndices.map((idx: number) => question.options?.[idx] || '');
                                        correctAnswerText = correctOptions.join(', ');
                                        // Compare trimmed strings to be safe
                                        isCorrect = correctOptions.some(opt => opt.trim() === (userAnswer || '').trim());
                                    } else {
                                        isCorrect = false;
                                        correctAnswerText = 'Error: Invalid key';
                                    }
                                } else if (question.type === 'boolean') {
                                    isCorrect = String(question.correctAnswer) === userAnswer;
                                    correctAnswerText = String(question.correctAnswer);
                                } else if (question.type === 'text' || question.autoGrade) {
                                    // For text/autoGrade, we consider it correct if answered (based on our scoring logic update)
                                    // Or strictly speaking, we might not want to mark it red/green if it's subjective, 
                                    // but since we awarded points for it, we can visually indicate it as "accepted".
                                    isCorrect = !!userAnswer;
                                }

                                return (
                                    <div key={question.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
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
                                                        <span className="text-xs text-gray-400 block mb-0.5">User Answer</span>
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
                </div>

                {/* Sidebar: Details & Actions */}
                <div className="space-y-6">
                    {/* User Details Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-[#1D3557] mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" /> Participant
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-500 block">Name</span>
                                <span className="font-medium">{submission.userDetails?.name || 'Anonymous'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Email</span>
                                <span className="font-medium">{submission.userDetails?.email || '-'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Phone</span>
                                <span className="font-medium">{submission.userDetails?.phone || '-'}</span>
                            </div>
                            {submission.userDetails?.dob && (
                                <div>
                                    <span className="text-gray-500 block">DOB</span>
                                    <span className="font-medium">{submission.userDetails.dob}</span>
                                </div>
                            )}
                            <hr className="my-3" />
                            <div>
                                <span className="text-gray-500 block">Submitted</span>
                                <span className="font-medium">
                                    {submission.timestamp ? format(new Date(submission.timestamp), 'PPpp') : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Score Card */}
                    <ScoreOverride
                        submissionId={submission.id}
                        currentScore={submission.score || 0}
                        totalPoints={submission.totalPoints || 0}
                    />

                    {/* Audit Logs */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-[#1D3557] mb-4 flex items-center gap-2">
                            <History className="w-5 h-5 text-gray-400" /> History
                        </h3>
                        <div className="space-y-4 relative pl-2">
                            {/* Timeline line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />

                            {auditLogs.map((log: any) => (
                                <div key={log.id} className="relative pl-6 text-sm">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                    </div>
                                    <p className="text-[#1D3557] font-medium">Score updated</p>
                                    <p className="text-xs text-gray-500">
                                        {log.oldScore} &rarr; <span className="font-bold text-[#E63946]">{log.newScore}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        by {log.performedBy}
                                    </p>
                                    <p className="text-[10px] text-gray-300">
                                        {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            ))}
                            {auditLogs.length === 0 && (
                                <p className="text-gray-400 text-sm ml-4">No changes yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

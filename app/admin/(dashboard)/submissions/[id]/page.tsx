import { getSubmission, getAuditLogs } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, Calendar, Clock, History } from 'lucide-react';
import { format } from 'date-fns';
import { ScoreOverride } from '@/components/admin/ScoreOverride'; // Client Component we'll create

export default async function SubmissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const submissionData = await getSubmission(id);
    const auditLogs = await getAuditLogs(id);

    if (!submissionData) {
        notFound();
    }

    // Cast to any to work with dynamic Firestore data
    const submission = submissionData as any;
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
                        <h2 className="text-xl font-bold text-[#1D3557] mb-6">Submission Answers</h2>
                        <div className="space-y-6">
                            {Object.entries(submission.answers || {}).map(([questionId, answer]: [string, any]) => (
                                <div key={questionId} className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">{questionId}</span>
                                    <p className="font-medium text-[#1D3557] mt-1">{answer}</p>
                                </div>
                            ))}
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

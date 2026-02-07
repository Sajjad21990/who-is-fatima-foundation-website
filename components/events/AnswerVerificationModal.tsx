'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyAndGetSubmission } from '@/app/actions/events';
import SubmissionAnswersDisplay from './SubmissionAnswersDisplay';
import { Loader2, Eye, AlertCircle } from 'lucide-react';

interface AnswerVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    submissionId: string;
    participantName: string;
}

export default function AnswerVerificationModal({
    isOpen,
    onClose,
    submissionId,
    participantName
}: AnswerVerificationModalProps) {
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [submissionData, setSubmissionData] = useState<any>(null);

    const handleVerify = async () => {
        if (!phone.trim()) {
            setError('Please enter your phone number');
            return;
        }

        setIsLoading(true);
        setError('');

        const result = await verifyAndGetSubmission(submissionId, phone);

        setIsLoading(false);

        if (result.success) {
            setSubmissionData(result);
        } else {
            setError(result.message || 'Verification failed');
        }
    };

    const handleClose = () => {
        setPhone('');
        setError('');
        setSubmissionData(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-[#1D3557] flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        {submissionData ? 'Your Answers' : 'View Your Answers'}
                    </DialogTitle>
                </DialogHeader>

                {!submissionData ? (
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">
                            To view the answers for <strong>{participantName}</strong>, please enter the phone number used during quiz submission.
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <Input
                                type="tel"
                                placeholder="Enter last 4 digits or full number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="w-full bg-[#E63946] hover:bg-[#d62828]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                                </span>
                            ) : (
                                'Verify & View Answers'
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden">
                        <SubmissionAnswersDisplay
                            questions={submissionData.questions}
                            answers={submissionData.submission.answers}
                            score={submissionData.submission.score}
                            totalPoints={submissionData.submission.totalPoints}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

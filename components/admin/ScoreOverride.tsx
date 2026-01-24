'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X, Check, AlertCircle } from 'lucide-react';
import { updateSubmissionScore } from '@/app/actions/admin';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

interface ScoreOverrideProps {
    submissionId: string;
    currentScore: number;
    totalPoints: number;
}

export function ScoreOverride({ submissionId, currentScore, totalPoints }: ScoreOverrideProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [score, setScore] = useState(currentScore);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const { userProfile, canEdit } = useAuth();
    const router = useRouter();

    const handleSave = async () => {
        if (!userProfile) return;
        setLoading(true);

        try {
            const result = await updateSubmissionScore(submissionId, Number(score), userProfile.email);
            if (result.success) {
                setPopup({ type: 'success', message: 'Score updated successfully!' });
                setIsEditing(false);
                router.refresh();
            } else {
                setPopup({ type: 'error', message: 'Failed to update score.' });
            }
        } catch (error) {
            console.error(error);
            setPopup({ type: 'error', message: 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Popup Modal */}
            {popup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-6 text-center"
                    >
                        <div className={`w-16 h-16 ${popup.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {popup.type === 'success' ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                        </div>
                        <h3 className="text-xl font-bold text-[#1D3557] mb-2">{popup.type === 'success' ? 'Success' : 'Error'}</h3>
                        <p className="text-gray-600 mb-6">{popup.message}</p>
                        <Button
                            onClick={() => setPopup(null)}
                            className={`w-full ${popup.type === 'success' ? 'bg-[#1D3557] hover:bg-[#1D3557]/90' : 'bg-[#E63946] hover:bg-[#E63946]/90'} text-white rounded-xl`}
                        >
                            Okay, got it
                        </Button>
                    </motion.div>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-[#1D3557] mb-4">Scoring</h3>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500">Total Score</span>
                    <div className="flex items-baseline gap-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={score}
                                    onChange={(e) => setScore(Number(e.target.value))}
                                    className="w-20 h-8 text-right font-bold"
                                />
                            </div>
                        ) : (
                            <span className="text-3xl font-bold text-[#E63946]">{currentScore}</span>
                        )}
                        <span className="text-gray-400">/{totalPoints}</span>
                    </div>
                </div>

                {canEdit && (
                    <div className="mt-4">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handleSave} disabled={loading} className="w-full bg-[#1D3557]">
                                    <Save className="w-4 h-4 mr-2" /> Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="w-4 h-4 mr-2" /> Override Score
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

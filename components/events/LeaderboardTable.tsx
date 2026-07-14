'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/ui/SearchInput';
import AnswerVerificationModal from './AnswerVerificationModal';
import { Eye } from 'lucide-react';

interface LeaderboardTableProps {
    winners: any[];
}

export default function LeaderboardTable({ winners }: LeaderboardTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState<{ id: string; name: string } | null>(null);

    const filteredWinners = winners.filter(w => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return w.userDetails.name.toLowerCase().includes(q) ||
            w.submissionId.toLowerCase().includes(q);
    });

    return (
        <>
            <Card className="max-w-3xl mx-auto border-t-4 border-t-brand-navy">
                <CardHeader className="bg-gray-50 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
                    <CardTitle className="text-xl text-brand-navy">Leaderboard</CardTitle>
                    <div className="w-full sm:w-64">
                        <SearchInput
                            placeholder="Search name or ID..."
                            onChange={setSearchQuery}
                            value={searchQuery}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-3 py-3 md:px-6 md:py-4 font-semibold">Rank</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4 font-semibold">Participant</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4 font-semibold text-center">Score</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4 font-semibold text-right hidden sm:table-cell">Answers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredWinners.map((winner: any) => (
                                    <tr key={winner.submissionId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-900 font-medium">#{winner.rank}</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">
                                            <button
                                                className="text-left sm:hidden hover:text-brand-red transition-colors"
                                                onClick={() => setSelectedSubmission({
                                                    id: winner.submissionId,
                                                    name: winner.userDetails.name
                                                })}
                                            >
                                                {winner.userDetails.name}
                                            </button>
                                            <span className="hidden sm:inline">{winner.userDetails.name}</span>
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-center font-mono text-brand-navy font-bold">
                                            {winner.score}
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-right hidden sm:table-cell">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedSubmission({
                                                    id: winner.submissionId,
                                                    name: winner.userDetails.name
                                                })}
                                                className="text-brand-navy hover:text-brand-red hover:bg-red-50"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredWinners.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No participants found matching &quot;{searchQuery}&quot;
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Verification Modal */}
            <AnswerVerificationModal
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
                submissionId={selectedSubmission?.id || ''}
                participantName={selectedSubmission?.name || ''}
            />
        </>
    );
}

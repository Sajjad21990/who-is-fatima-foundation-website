'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchInput from '@/components/ui/SearchInput';

interface LeaderboardTableProps {
    winners: any[];
}

export default function LeaderboardTable({ winners }: LeaderboardTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredWinners = winners.filter(w => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return w.userDetails.name.toLowerCase().includes(q) ||
            w.submissionId.toLowerCase().includes(q);
    });

    return (
        <Card className="max-w-3xl mx-auto border-t-4 border-t-[#1D3557]">
            <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl text-[#1D3557]">Leaderboard</CardTitle>
                <div className="w-64">
                    <SearchInput
                        placeholder="Search name or ID..."
                        onChange={setSearchQuery}
                        value={searchQuery}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-white text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Rank</th>
                            <th className="px-6 py-4 font-semibold">Participant</th>
                            <th className="px-6 py-4 font-semibold text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredWinners.map((winner: any) => (
                            <tr key={winner.submissionId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-900 font-medium">#{winner.rank}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {winner.userDetails.name}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-[#1D3557] font-bold">
                                    {winner.score}
                                </td>
                            </tr>
                        ))}
                        {filteredWinners.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No participants found matching "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

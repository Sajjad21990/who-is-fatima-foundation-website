'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Dice5, Lock, Save, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { saveEventWinners, resetEventWinners } from '@/app/actions/admin';
import Podium from '@/components/ui/Podium';
import SearchInput from '@/components/ui/SearchInput';
import { cn } from '@/components/ui/utils';
import { useRouter } from 'next/navigation';

interface Winner {
    rank: number;
    submissionId: string;
    userDetails: any;
    score: number;
    totalPoints: number;
}

interface WinnerSelectionInterfaceProps {
    slug: string;
    submissions: any[];
    existingWinners: Winner[] | null;
}

export default function WinnerSelectionInterface({ slug, submissions, existingWinners }: WinnerSelectionInterfaceProps) {
    const router = useRouter();
    const [winners, setWinners] = useState<Winner[]>(existingWinners || []);
    const [isLocked, setIsLocked] = useState(!!existingWinners);
    const [isSaving, setIsSaving] = useState(false);
    const [drawInProgress, setDrawInProgress] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Initial grouping of submissions by score
    const submissionsByScore = useMemo(() => {
        const sorted = [...submissions].sort((a, b) => b.score - a.score);
        const grouped = new Map<number, any[]>();
        sorted.forEach(sub => {
            const list = grouped.get(sub.score) || [];
            list.push(sub);
            grouped.set(sub.score, list);
        });
        return grouped;
    }, [submissions]);

    // Group submissions by score for statistics
    const scoreDistribution = useMemo(() => {
        const counts = new Map<number, number>();
        submissions.forEach(sub => {
            counts.set(sub.score, (counts.get(sub.score) || 0) + 1);
        });
        // Sort by score descending
        return Array.from(counts.entries()).sort((a, b) => b[0] - a[0]);
    }, [submissions]);

    // Calculate ranking sequence - We want 3, 2, 1 order for selection
    const unassignedRanks = useMemo(() => {
        const ranks = [1, 2, 3];
        const assigned = new Set(winners.map(w => w.rank));
        return ranks.filter(r => !assigned.has(r)).sort((a, b) => b - a);
    }, [winners]);

    const currentTargetRank = unassignedRanks.length > 0 ? unassignedRanks[0] : null;

    // Determine the next pool of candidates
    // Logic: Identify what score is required for the current target rank
    const nextRankCandidates = useMemo(() => {
        if (!currentTargetRank) return [];

        // 1. Sort ALL submissions to find the score threshold for the global rank
        // We look at the submission at index (currentTargetRank - 1)
        const sortedAll = [...submissions].sort((a, b) => b.score - a.score);

        // Safety check if we don't have enough submissions for the rank
        if (sortedAll.length < currentTargetRank) {
            // If we are looking for Rank 3 but only have 2 submissions, 
            // usually we shouldn't be here, or we take the lowest score available?
            // Let's just take all unassigned.
            const winnerIds = new Set(winners.map(w => w.submissionId));
            return submissions.filter(s => !winnerIds.has(s.id));
        }

        const thresholdScore = sortedAll[currentTargetRank - 1].score;

        // 2. Filter unassigned submissions that match this threshold score
        const winnerIds = new Set(winners.map(w => w.submissionId));
        return submissions
            .filter(s => !winnerIds.has(s.id))
            .filter(s => s.score === thresholdScore)
            .sort((a, b) => b.score - a.score); // Should all be same score roughly
    }, [submissions, currentTargetRank, winners]);


    // Calculate current state based on selected winners
    // This is kept for the save button condition, but not for candidate selection
    const availableSubmissions = useMemo(() => {
        const winnerIds = new Set(winners.map(w => w.submissionId));
        return submissions
            .filter(s => !winnerIds.has(s.id))
            .sort((a, b) => b.score - a.score);
    }, [submissions, winners]);

    // The top remaining score (this variable is no longer directly used for candidate selection)
    const topRemainingScore = availableSubmissions.length > 0 ? availableSubmissions[0].score : -1;

    const handleLuckyDraw = async () => {
        if (!currentTargetRank || nextRankCandidates.length === 0) return;

        setDrawInProgress(true);

        // Simulation animation effect
        const duration = 3000;

        await new Promise(resolve => setTimeout(resolve, duration));

        // Random selection
        const randomIndex = Math.floor(Math.random() * nextRankCandidates.length);
        const selected = nextRankCandidates[randomIndex];

        const newWinner: Winner = {
            rank: currentTargetRank,
            submissionId: selected.id,
            userDetails: selected.userDetails,
            score: selected.score,
            totalPoints: selected.totalPoints
        };

        setWinners(prev => [...prev, newWinner]);
        setDrawInProgress(false);
        fireConfetti();
        toast.success(`Winner for Rank ${currentTargetRank} selected!`);
    };

    const handleAutoSelect = () => {
        if (!currentTargetRank || nextRankCandidates.length !== 1) return;

        const selected = nextRankCandidates[0];
        const newWinner: Winner = {
            rank: currentTargetRank,
            submissionId: selected.id,
            userDetails: selected.userDetails,
            score: selected.score,
            totalPoints: selected.totalPoints
        };

        setWinners(prev => [...prev, newWinner]);
        toast.success(`Rank ${currentTargetRank} assigned automatically.`);
    };

    // Auto-select if there's only one candidate for the next rank
    useEffect(() => {
        if (!isLocked && currentTargetRank && nextRankCandidates.length === 1 && !drawInProgress) {
            handleAutoSelect();
        }
    }, [currentTargetRank, nextRankCandidates, isLocked, drawInProgress]);

    const handleSave = async () => {
        if (winners.length < 3 && availableSubmissions.length > 0) {
            toast.error("Please select at least top 3 winners before locking (or all candidates if less than 3).");
            return;
        }

        setIsSaving(true);
        const result = await saveEventWinners(slug, winners);
        setIsSaving(false);

        if (result.success) {
            setIsLocked(true);
            toast.success("Winners saved and locked successfully!");
            fireConfetti();
            router.refresh();
        } else {
            toast.error("Failed to save winners.");
        }
    };

    const fireConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    // Determine what UI to show
    const showPodium = winners.length >= 3 || (winners.length > 0 && availableSubmissions.length === 0);
    const selectionComplete = winners.length >= 3;

    return (
        <div className="space-y-8">
            {isLocked && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between text-yellow-800">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5" />
                        <p className="font-medium">Winners have been locked for this event.</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            if (confirm("Are you sure you want to reset the winners? This will clear the current selection and allow you to select again.")) {
                                await resetEventWinners(slug);
                                router.refresh();
                            }
                        }}
                        className="bg-white hover:bg-yellow-100 text-yellow-800 border-yellow-300"
                    >
                        Reset Winners
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Selection Area (only if not locked and not complete) */}
                {!isLocked && !selectionComplete && currentTargetRank && (
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-2 border-[#1D3557]">
                            <CardHeader className="bg-[#1D3557] text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    Select Rank {currentTargetRank}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Score</p>
                                        <p className="text-3xl font-bold text-[#1D3557]">
                                            {nextRankCandidates.length > 0 ? nextRankCandidates[0].score : '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium mb-2 flex items-center justify-between">
                                            Candidates Pool
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                                {nextRankCandidates.length}
                                            </span>
                                        </p>
                                        <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2 bg-gray-50/50">
                                            {nextRankCandidates.map(candidate => (
                                                <div key={candidate.id} className="p-2 bg-white rounded shadow-sm border text-sm flex justify-between items-center">
                                                    <span>{candidate.userDetails.name}</span>
                                                    {/* <span className="text-gray-400 text-xs">{candidate.id.slice(0, 4)}...</span> */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {nextRankCandidates.length > 1 ? (
                                            <Button
                                                onClick={handleLuckyDraw}
                                                disabled={drawInProgress}
                                                className="w-full bg-[#E63946] hover:bg-[#d62828] h-12 text-lg animate-pulse"
                                            >
                                                {drawInProgress ? (
                                                    <span className="flex items-center gap-2">
                                                        <Dice5 className="w-5 h-5 animate-spin" /> Rolling...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 cursor-pointer">
                                                        <Dice5 className="w-5 h-5" /> Start Lucky Draw
                                                    </span>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="text-center text-sm text-green-600 font-medium flex items-center justify-center gap-2 py-2">
                                                <CheckCircle2 className="w-4 h-4" /> Auto-selecting single candidate...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Right Side: Podium & Results */}
                <div className={cn("lg:col-span-3 space-y-12", !isLocked && !selectionComplete && "lg:col-span-2")}>

                    {/* Participation Stats (Only shown when no winners are selected yet) */}
                    {!isLocked && winners.length === 0 && (
                        <Card className="border-dashed border-2">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-blue-500" />
                                    Participation Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {scoreDistribution.map(([score, count]) => (
                                        <div key={score} className="p-4 bg-gray-50 rounded-xl border flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Score</p>
                                                <p className="text-2xl font-black text-[#1D3557]">{score}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Participants</p>
                                                <p className="text-2xl font-black text-[#E63946]">{count}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 text-sm text-gray-400 italic text-center">
                                    Total Submissions: {submissions.length}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Podium (Top 3) */}
                    {winners.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-center text-[#1D3557] mb-8">🏆 Top Winners</h2>
                            <div className="mb-8 mt-[10vh]">
                                <Podium winners={winners.filter(w => w.rank <= 3)} />
                            </div>
                        </div>
                    )}

                    {/* Leaderboard Table (Rest) */}
                    {/* Only show if we have winners with rank > 3 */}
                    {winners.some(w => w.rank > 3) && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle>Leaderboard</CardTitle>
                                <div className="w-64">
                                    <SearchInput
                                        placeholder="Search name or ID..."
                                        onChange={setSearchQuery}
                                        value={searchQuery}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-white rounded-md border text-sm">
                                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-500">
                                        <div className="col-span-1">Rank</div>
                                        <div className="col-span-4">Name</div>
                                        <div className="col-span-4">Score</div>
                                        <div className="col-span-3 text-right">Submission ID</div>
                                    </div>
                                    <div className="divide-y max-h-[500px] overflow-y-auto">
                                        {winners
                                            .filter(w => w.rank > 3)
                                            .filter(w => {
                                                if (!searchQuery) return true;
                                                const q = searchQuery.toLowerCase();
                                                return w.userDetails.name.toLowerCase().includes(q) ||
                                                    w.submissionId.toLowerCase().includes(q);
                                            })
                                            .sort((a, b) => a.rank - b.rank)
                                            .map((winner) => (
                                                <div key={winner.submissionId} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 items-center">
                                                    <div className="col-span-1 font-semibold text-[#1D3557]">
                                                        #{winner.rank}
                                                    </div>
                                                    <div className="col-span-4 font-medium text-gray-900">
                                                        {winner.userDetails.name}
                                                    </div>
                                                    <div className="col-span-4">
                                                        <span className="px-2 py-1 bg-[#1D3557] text-white rounded text-xs font-bold">
                                                            {winner.score}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-3 text-right text-gray-400 font-mono text-xs">
                                                        {winner.submissionId}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Selection Table (Visible during selection before Locking/Full Generation) */}
                    {!isLocked && winners.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Selected Candidates</CardTitle>
                                    {selectionComplete && (
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {isSaving ? "Saving..." : (
                                                <span className="flex items-center gap-2">
                                                    <Save className="w-4 h-4" /> Save & Lock Results
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-white rounded-md border text-sm">
                                    {/* Simple table for current selection */}
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Rank</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {winners.sort((a, b) => a.rank - b.rank).map(w => (
                                                <tr key={w.submissionId} className="border-t">
                                                    <td className="px-4 py-3">#{w.rank}</td>
                                                    <td className="px-4 py-3 font-medium">{w.userDetails.name}</td>
                                                    <td className="px-4 py-3">{w.score}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

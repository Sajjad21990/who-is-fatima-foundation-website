'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistance, format } from 'date-fns';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SubmissionsTable({
    submissions,
    hasMore,
    nextId
}: {
    submissions: any[],
    hasMore: boolean,
    nextId: string | null
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const handleNextPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (nextId) {
            params.set('after', nextId);
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    const handlePrevPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('after');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSubmissions = [...submissions].sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested specific keys if needed
        if (sortConfig.key === 'name') {
            aValue = a.userDetails?.name || '';
            bValue = b.userDetails?.name || '';
        } else if (sortConfig.key === 'email') {
            aValue = a.userDetails?.email || '';
            bValue = b.userDetails?.email || '';
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig?.key !== columnKey) return <span className="ml-2 text-gray-300">↕</span>;
        return sortConfig.direction === 'asc' ? <span className="ml-2 text-[#E63946]">↑</span> : <span className="ml-2 text-[#E63946]">↓</span>;
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-[#1D3557] cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                                User Name <SortIcon columnKey="name" />
                            </TableHead>
                            <TableHead className="font-bold text-[#1D3557] cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('email')}>
                                Contact <SortIcon columnKey="email" />
                            </TableHead>
                            <TableHead className="font-bold text-[#1D3557] cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('score')}>
                                Score <SortIcon columnKey="score" />
                            </TableHead>
                            <TableHead className="font-bold text-[#1D3557] cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('timestamp')}>
                                Submitted <SortIcon columnKey="timestamp" />
                            </TableHead>
                            <TableHead className="text-right font-bold text-[#1D3557]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedSubmissions.map((sub: any) => (
                            <TableRow key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">
                                    {sub.userDetails?.name || 'Anonymous'}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-[#1D3557] font-medium">{sub.userDetails?.email}</div>
                                    <div className="text-xs text-gray-400">{sub.userDetails?.phone}</div>
                                </TableCell>
                                <TableCell>
                                    {sub.score !== undefined ? (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${(sub.score / sub.totalPoints) >= 0.8 ? 'bg-green-50 text-green-700 border border-green-100' :
                                            (sub.score / sub.totalPoints) >= 0.5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                'bg-red-50 text-[#E63946] border border-red-100'
                                            }`}>
                                            {sub.score} / {sub.totalPoints}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 italic text-xs">Processing</span>
                                    )}
                                </TableCell>
                                <TableCell title={sub.timestamp} className="text-sm text-gray-500">
                                    {sub.timestamp ? formatDistance(new Date(sub.timestamp), new Date(), { addSuffix: true }) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/submissions/${sub.id}`}>
                                        <Button size="sm" variant="ghost" className="text-[#1D3557] hover:bg-white border border-transparent hover:border-gray-200 shadow-sm gap-2 rounded-xl">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {submissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                    No submissions found for this event.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2">
                {searchParams.get('after') && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        className="rounded-xl border-gray-200 text-[#1D3557] gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Top
                    </Button>
                )}
                {hasMore && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        className="rounded-xl border-gray-200 text-[#1D3557] gap-1"
                    >
                        Load More <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

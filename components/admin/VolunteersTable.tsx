'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function VolunteersTable({
    volunteers,
    hasMore,
    nextId
}: {
    volunteers: any[],
    hasMore: boolean,
    nextId: string | null
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleNextPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (nextId) {
            params.set('after', nextId);
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    const handlePrevPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('after'); // Simple implementation: go back to first page
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-[#1D3557]">Volunteer</TableHead>
                            <TableHead className="font-bold text-[#1D3557]">Area of Interest</TableHead>
                            <TableHead className="font-bold text-[#1D3557]">Status</TableHead>
                            <TableHead className="font-bold text-[#1D3557]">Applied</TableHead>
                            <TableHead className="text-right font-bold text-[#1D3557]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {volunteers.map((v) => (
                            <TableRow key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1D3557] flex items-center justify-center font-bold">
                                            {v.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1D3557]">{v.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {v.location || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 italic">
                                        {v.areaOfInterest}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${v.status === 'new' ? 'bg-red-50 text-[#E63946] border border-red-100' :
                                            v.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                v.status === 'rejected' ? 'bg-gray-50 text-gray-700 border border-gray-100' :
                                                    'bg-blue-50 text-blue-700 border border-blue-100'
                                        }`}>
                                        {v.status || 'New'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {v.createdAt ? format(new Date(v.createdAt), 'MMM d, yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/volunteers/${v.id}`}>
                                        <Button size="sm" variant="ghost" className="text-[#1D3557] hover:bg-white border border-transparent hover:border-gray-200 shadow-sm gap-2 rounded-xl">
                                            Details <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {volunteers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                    No volunteer applications found.
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

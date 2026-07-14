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
import { Mail, ArrowRight, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function MessagesTable({
    messages,
    hasMore,
    nextId
}: {
    messages: any[],
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
        params.delete('after');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-brand-navy">Sender</TableHead>
                            <TableHead className="font-bold text-brand-navy">Subject</TableHead>
                            <TableHead className="font-bold text-brand-navy hidden md:table-cell">Status</TableHead>
                            <TableHead className="font-bold text-brand-navy hidden md:table-cell">Received</TableHead>
                            <TableHead className="text-right font-bold text-brand-navy">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.map((m) => (
                            <TableRow key={m.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-brand-navy">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className={`text-sm ${m.status !== 'read' ? 'font-bold text-brand-navy' : 'text-gray-600'}`}>
                                        {m.subject}
                                    </p>
                                    <p className="text-xs text-gray-400 line-clamp-1 truncate max-w-[200px]">{m.message}</p>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {m.status !== 'read' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-50 text-brand-red border border-red-100 italic animate-pulse">
                                            New
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-400 border border-gray-100">
                                            Read
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-xs text-gray-500 hidden md:table-cell">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {m.createdAt ? formatDistanceToNow(new Date(m.createdAt), { addSuffix: true }) : '-'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/messages/${m.id}`}>
                                        <Button size="sm" variant="ghost" className="text-brand-navy hover:bg-white border border-transparent hover:border-gray-200 shadow-sm gap-2 rounded-xl">
                                            Read <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {messages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                    No messages found.
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
                        className="rounded-xl border-gray-200 text-brand-navy gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Top
                    </Button>
                )}
                {hasMore && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        className="rounded-xl border-gray-200 text-brand-navy gap-1"
                    >
                        Load More <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

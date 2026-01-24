import { getEventBySlug } from '@/lib/events';
import { getEventSubmissions } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ArrowLeft, MonitorPlay, Pencil } from 'lucide-react';
import { formatDistance, format } from 'date-fns';

export default async function EventSubmissionsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    const submissions = await getEventSubmissions(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header & Breadcrumbs */}
            <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <Link href="/admin" className="hover:text-[#E63946] flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={event.thumbnailUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                        <div>
                            <h1 className="text-3xl font-bold text-[#1D3557]">{event.title}</h1>
                            <p className="text-gray-500 flex items-center gap-2">
                                <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-xs">{event.type}</span>
                                • {submissions.length} Submissions
                            </p>
                        </div>
                    </div>
                    {/* <Button variant="outline" className="gap-2"><Pencil className="w-4 h-4" /> Edit Event</Button> Future */}
                </div>
            </div>

            {/* Stats Row (Optional) */}

            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1D3557]">All Submissions</h2>
                    {/* Filter/Search could go here */}
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((sub: any) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">
                                    {sub.userDetails?.name || 'Anonymous'}
                                    <div className="text-xs text-gray-400 capitalize">{sub.userDetails?.role || 'Participant'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{sub.userDetails?.email}</div>
                                    <div className="text-xs text-gray-400">{sub.userDetails?.phone}</div>
                                </TableCell>
                                <TableCell>
                                    {sub.score !== undefined ? (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${(sub.score / sub.totalPoints) >= 0.8 ? 'bg-green-100 text-green-800' :
                                                (sub.score / sub.totalPoints) >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {sub.score} / {sub.totalPoints}
                                        </span>
                                    ) : '-'}
                                </TableCell>
                                <TableCell title={sub.timestamp}>
                                    {sub.timestamp ? formatDistance(new Date(sub.timestamp), new Date(), { addSuffix: true }) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/submissions/${sub.id}`}>
                                        <Button size="sm" variant="outline">View Details</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {submissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No submissions found for this event.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

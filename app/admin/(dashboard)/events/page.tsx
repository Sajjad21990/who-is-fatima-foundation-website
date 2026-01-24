import { getEvents } from '@/lib/events';
import { getSubmissionCounts } from '@/app/actions/admin';
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
import { ArrowRight, Users } from 'lucide-react';

export default async function EventsPage() {
    const events = await getEvents();
    const submissionCounts = await getSubmissionCounts();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#1D3557]">Events</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <img src={event.thumbnailUrl} alt={event.title} className="w-10 h-10 rounded-lg object-cover" />
                                        <span className="line-clamp-1">{event.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.type === 'quiz' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {event.type}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {event.isActive ? 'Active' : 'Draft'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#1D3557]">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        {submissionCounts[event.slug] || 0}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(event.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/events/${event.slug}`}>
                                        <Button size="sm" variant="outline" className="gap-2">
                                            View <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

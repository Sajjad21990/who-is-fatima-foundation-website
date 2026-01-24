import { getEvents } from '@/lib/events';
import { getDashboardStats } from '@/app/actions/admin';
import { Event } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { BarChart3, Users, Calendar, ArrowRight, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminDashboard() {
    const events = await getEvents();
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#1D3557]">Dashboard</h1>
                {/* <Button>Create Event</Button>  Future: CMS feature */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                        <p className="text-xs text-muted-foreground">Active quizzes and webinars</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">Across all events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-muted-foreground">System functioning normally</p>
                    </CardContent>
                </Card>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-[#1D3557]">Active Events</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
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
                                <TableCell>{new Date(event.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/events/${event.slug}`}>
                                        <Button size="sm" variant="outline" className="gap-2">
                                            View Submissions <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-[#1D3557]">Recent Submissions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats.recentSubmissions.map((sub: any) => (
                        <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <Users className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#1D3557]">{sub.userDetails?.name || 'Anonymous'}</p>
                                    <p className="text-sm text-gray-500">Submitted to <span className="font-medium text-[#E63946]">{sub.slug}</span></p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-400">
                                {sub.timestamp ? formatDistanceToNow(new Date(sub.timestamp), { addSuffix: true }) : 'N/A'}
                            </span>
                        </div>
                    ))}
                    {stats.recentSubmissions.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No submissions yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}

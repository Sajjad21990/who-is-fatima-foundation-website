import { getEventBySlug } from '@/lib/events';
import { getEventSubmissions, searchEventSubmissions } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { DownloadCsvButton } from '@/components/admin/DownloadCsvButton';
import { RecalculateScoresButton } from '@/components/admin/RecalculateScoresButton';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import SearchInput from '@/components/ui/search-input-client'; // We'll create a wrapper or use the existing one but we need to handle URL updates.

export default async function EventSubmissionsPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ after?: string, q?: string }>
}) {
    const { slug } = await params;
    const { after, q: searchQuery } = await searchParams;
    const event = await getEventBySlug(slug);

    let submissionsData;

    if (searchQuery) {
        submissionsData = await searchEventSubmissions(slug, searchQuery);
    } else {
        submissionsData = await getEventSubmissions(slug, 20, after);
    }

    const { items: submissions, nextId, hasMore } = submissionsData;

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header & Breadcrumbs */}
            <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <Link href="/admin" className="hover:text-brand-red flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img src={event.thumbnailUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover shadow-sm ring-1 ring-black/5" />
                        <div>
                            <h1 className="text-3xl font-bold text-brand-navy">{event.title}</h1>
                            <p className="text-gray-500 flex items-center gap-2">
                                <span className="capitalize bg-gray-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-widest">{event.type}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm">Submissions</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <SearchInput placeholder="Search by name..." />
                    <div className="flex items-center gap-3">
                        {event.type === 'quiz' && <RecalculateScoresButton slug={slug} />}
                        <Link href={`/admin/events/${slug}/winners`}>
                            <Button variant="outline" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white">
                                <Trophy className="w-4 h-4 mr-2" />
                                Select Winners
                            </Button>
                        </Link>
                        <DownloadCsvButton slug={slug} />
                    </div>
                </div>
            </div>

            <SubmissionsTable submissions={submissions} hasMore={hasMore} nextId={nextId} />
        </div>
    );
}

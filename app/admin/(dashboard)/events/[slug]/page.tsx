import { getEventBySlug } from '@/lib/events';
import { getEventSubmissions } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SubmissionsTable from '@/components/admin/SubmissionsTable';

export default async function EventSubmissionsPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ after?: string }>
}) {
    const { slug } = await params;
    const { after } = await searchParams;
    const event = await getEventBySlug(slug);
    const { items: submissions, nextId, hasMore } = await getEventSubmissions(slug, 20, after);

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header & Breadcrumbs */}
            <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <Link href="/admin" className="hover:text-[#E63946] flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={event.thumbnailUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover shadow-sm ring-1 ring-black/5" />
                        <div>
                            <h1 className="text-3xl font-bold text-[#1D3557]">{event.title}</h1>
                            <p className="text-gray-500 flex items-center gap-2">
                                <span className="capitalize bg-gray-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-widest">{event.type}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm">Submissions</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <SubmissionsTable submissions={submissions} hasMore={hasMore} nextId={nextId} />
        </div>
    );
}

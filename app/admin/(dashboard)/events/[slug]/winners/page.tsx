import { getEventBySlug } from '@/lib/events';
import { getAllEventSubmissions, getEventWinners } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import WinnerSelectionInterface from '@/components/admin/WinnerSelectionInterface';

export default async function WinnerSelectionPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    // We need ALL submissions to determine winners properly
    const submissions = await getAllEventSubmissions(slug);
    const existingWinnersData = await getEventWinners(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header & Breadcrumbs */}
            <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <Link href={`/admin/events/${slug}`} className="hover:text-[#E63946] flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Submissions
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <img src={event.thumbnailUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover shadow-sm ring-1 ring-black/5" />
                    <div>
                        <h1 className="text-3xl font-bold text-[#1D3557]">Winner Selection</h1>
                        <p className="text-gray-500">{event.title}</p>
                    </div>
                </div>
            </div>

            <WinnerSelectionInterface
                slug={slug}
                submissions={submissions}
                existingWinners={existingWinnersData ? existingWinnersData.winners : null}
            />
        </div>
    );
}

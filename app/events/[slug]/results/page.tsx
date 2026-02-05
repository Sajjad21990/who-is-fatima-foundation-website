import { getEventBySlug } from '@/lib/events';
import { getEventWinners } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Podium from '@/components/ui/Podium';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeaderboardTable from '@/components/events/LeaderboardTable';

export default async function EventResultsPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    const winnersData = await getEventWinners(slug);

    if (!event) {
        notFound();
    }

    if (!winnersData) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
                <Link href="/events" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
                </Link>
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl text-[#1D3557]">Results Not Yet Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-6">
                            The winners for <strong>{event.title}</strong> have not been announced yet.
                            Please check back later!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/events">
                                <Button variant="outline">Browse Other Events</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { winners } = winnersData;
    const top3 = winners.filter((w: any) => w.rank <= 3);
    const others = winners.filter((w: any) => w.rank > 3).sort((a: any, b: any) => a.rank - b.rank);

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Link href="/events" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
            </Link>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#1D3557] mb-2">{event.title} Results</h1>
                <p className="text-gray-500">Congratulations to all our participants!</p>
            </div>

            {/* Podium for Top 3 */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-center text-[#1D3557] mb-8">🏆 Top Winners</h2>
                <Podium winners={top3} />
            </div>

            {/* Leaderboard Table for the Rest */}
            {others.length > 0 && (
                <LeaderboardTable winners={others} />
            )}
        </div>
    );
}

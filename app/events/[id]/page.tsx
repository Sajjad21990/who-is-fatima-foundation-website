
import { QuizRunner } from '@/components/events/QuizRunner';
import { WebinarRegister } from '@/components/events/WebinarRegister';
import { getEventBySlug } from '@/lib/events';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: `${event.title} | Who is Fatima`,
        description: event.description,
    };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            {/* Back Link or Breadcrumb could go here */}

            {event.type === 'quiz' ? (
                <QuizRunner event={event} questions={event.content.questions || []} />
            ) : event.type === 'webinar' ? (
                <WebinarRegister event={event} />
            ) : (
                <div className="text-center">Unknown Event Type</div>
            )}
        </div>
    );
}

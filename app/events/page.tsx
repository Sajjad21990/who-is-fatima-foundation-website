
import { EventCard } from '@/components/events/EventCard';
import { getEvents } from '@/lib/events';

export const metadata = {
  title: 'Events & Quizzes | Who is Fatima',
  description: 'Participate in our interactive quizzes and enlightening webinars to learn, grow, and connect with the community.',
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Upcoming Events & Quizzes</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Participate in our interactive quizzes and enlightening webinars to learn, grow, and connect with the community.
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">

          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-brand-red font-medium">Join Us</span>
            <h2 className="text-3xl lg:text-4xl text-brand-navy mt-2">Explore Our Activities</h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">No active events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

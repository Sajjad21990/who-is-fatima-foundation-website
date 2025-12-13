import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export function Events() {
  const events = [
    {
      title: "Community Health Fair 2025",
      date: "November 15, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Central Park, New York",
      image: "https://images.unsplash.com/photo-1758610840977-8ee55513281c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMGdhdGhlcmluZ3xlbnwxfHx8fDE3NjE1NDQ2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Healthcare"
    },
    {
      title: "Annual Charity Gala Night",
      date: "December 10, 2025",
      time: "6:00 PM - 11:00 PM",
      location: "Grand Hotel, Los Angeles",
      image: "https://images.unsplash.com/photo-1593113702251-272b1bc414a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwdm9sdW50ZWVycyUyMGhlbHBpbmd8ZW58MXx8fHwxNzYxNTY3NzIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Fundraiser"
    },
    {
      title: "Education Workshop Series",
      date: "November 22, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Community Center, Chicago",
      image: "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMGFmcmljYXxlbnwxfHx8fDE3NjE0NzI5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Education"
    }
  ];

  return (
    <section id="events" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full mb-4">
            <span className="text-[#E63946]">Upcoming Events</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1D3557] mb-4">
            Join Our Next <span className="text-[#E63946]">Event</span>
          </h2>
          <p className="text-[#457B9D]">
            Connect with like-minded individuals and be part of something bigger.
            Our events bring communities together for a common cause.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-64">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#E63946] text-white px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-[#1D3557] group-hover:text-[#E63946] transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white gap-2"
                >
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            className="bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white hover:opacity-90 px-8"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}

'use client'

import Link from 'next/link';
import { Calendar, MonitorPlay, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, QuizEvent, WebinarEvent } from '@/lib/types';
import { format } from 'date-fns';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${event.type === 'quiz' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {event.type}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1D3557] mb-2 line-clamp-2">
                    {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {event.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    {event.type === 'webinar' && event.startDate && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                        </div>
                    )}
                    {event.type === 'webinar' && event.content.duration && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{event.content.duration}</span>
                        </div>
                    )}
                    {event.type === 'quiz' && event.endDate && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Ends {format(new Date(event.endDate), 'MMM d, yyyy')}</span>
                        </div>
                    )}
                </div>

                <Link href={`/events/${event.slug}`}>
                    <Button className="w-full gap-2 group-hover:bg-[#E63946] group-hover:text-white transition-colors">
                        {event.type === 'quiz' ? 'Start Quiz' : 'Register Now'}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

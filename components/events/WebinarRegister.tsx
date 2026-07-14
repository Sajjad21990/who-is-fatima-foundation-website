'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Event, WebinarEvent } from '@/lib/types';
import { Calendar, Clock, User, Mail, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WebinarRegisterProps {
    event: WebinarEvent;
}

export function WebinarRegister({ event }: WebinarRegisterProps) {
    const [details, setDetails] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!details.name || !details.email) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsRegistered(true);
            toast.success('Registration successful!');
        }, 1500);
    };

    if (isRegistered) {
        return (
            <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-brand-navy mb-2">You're Registered!</h2>
                <p className="text-gray-600 mb-6">
                    We have sent a confirmation email to <strong>{details.email}</strong> with the webinar link.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left">
                    <p className="font-semibold text-brand-navy mb-1">Webinar Details:</p>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.content.duration}</span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => window.location.href = '/events'} variant="outline" className="w-full">
                    Back to Events
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
            {/* Event Info */}
            <div className="space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-sm">
                    <img
                        src={event.thumbnailUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy mb-3">{event.title}</h1>
                    <p className="text-gray-600 mb-6">{event.description}</p>

                    <div className="space-y-3">
                        {event.content.speaker && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-900">
                                <User className="w-5 h-5" />
                                <span className="font-medium">Speaker: {event.content.speaker}</span>
                            </div>
                        )}
                        {event.startDate && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-5 h-5" />
                                <span>{new Date(event.startDate).toLocaleString()}</span>
                            </div>
                        )}
                        {event.content.duration && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span>{event.content.duration}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Register for Webinar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="name"
                                className="pl-10"
                                placeholder="John Doe"
                                value={details.name}
                                onChange={e => setDetails({ ...details, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-10"
                                placeholder="john@example.com"
                                value={details.email}
                                onChange={e => setDetails({ ...details, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="phone"
                                type="tel"
                                className="pl-10"
                                placeholder="+1 (555) 000-0000"
                                value={details.phone}
                                onChange={e => setDetails({ ...details, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-brand-red hover:bg-brand-red/90 text-white mt-4 h-12 text-lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Secure My Spot'}
                        {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        By registering, you agree to receive event updates.
                    </p>
                </form>
            </div>
        </div>
    );
}

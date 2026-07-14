'use client';

import { useState } from 'react';
import { updateVolunteerStatus } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    Clock3,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function VolunteerDetailView({ volunteer }: { volunteer: any }) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(newStatus);
        const result = await updateVolunteerStatus(volunteer.id, newStatus);
        if (result.success) {
            toast.success(`Status updated to ${newStatus}`);
            router.refresh();
        } else {
            toast.error('Failed to update status');
        }
        setLoading(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Info */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
                    <div className="h-24 bg-brand-navy relative">
                        <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center border-4 border-white">
                            <User className="w-10 h-10 text-brand-navy" />
                        </div>
                    </div>
                    <CardContent className="pt-14 pb-6 px-6">
                        <h2 className="text-2xl font-bold text-brand-navy">{volunteer.name}</h2>
                        <p className="text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" /> {volunteer.location || 'Unknown Location'}
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">Email</p>
                                    <p className="font-medium text-brand-navy break-all">{volunteer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">Phone</p>
                                    <p className="font-medium text-brand-navy">{volunteer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">Age</p>
                                    <p className="font-medium text-brand-navy">{volunteer.age} Years</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-gray-100 p-6">
                    <h3 className="font-bold text-brand-navy mb-4">Application Status</h3>
                    <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 ${volunteer.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                        volunteer.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                            'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                        {volunteer.status === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                            volunteer.status === 'rejected' ? <XCircle className="w-5 h-5" /> :
                                <Clock3 className="w-5 h-5" />
                        }
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider">{volunteer.status || 'New Application'}</p>
                            <p className="text-[10px] opacity-70">Last updated: {volunteer.updatedAt ? format(new Date(volunteer.updatedAt), 'PPp') : 'Never'}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => handleStatusUpdate('approved')}
                            disabled={loading !== null || volunteer.status === 'approved'}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                        >
                            {loading === 'approved' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Approve Application
                        </Button>
                        <Button
                            onClick={() => handleStatusUpdate('rejected')}
                            disabled={loading !== null || volunteer.status === 'rejected'}
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 rounded-xl"
                        >
                            {loading === 'rejected' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Reject Application
                        </Button>
                        {volunteer.status !== 'new' && (
                            <Button
                                onClick={() => handleStatusUpdate('new')}
                                disabled={loading !== null}
                                variant="ghost"
                                className="text-gray-500 rounded-xl"
                            >
                                Set back to Reviewing
                            </Button>
                        )}
                    </div>
                </Card>
            </div>

            {/* Right Column: Experience & Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg text-brand-navy">Application Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-xs uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Area of Interest
                            </Label>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                <p className="text-purple-900 font-medium italic text-lg leading-relaxed">
                                    "{volunteer.areaOfInterest}"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Timeline
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-tight">Submitted On</p>
                                    <p className="text-brand-navy font-medium">{format(new Date(volunteer.createdAt), 'PPPP')}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-tight">Time Received</p>
                                    <p className="text-brand-navy font-medium">{format(new Date(volunteer.createdAt), 'p')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder for internal notes in future */}
                        <div className="pt-4 mt-8 border-t border-gray-100">
                            <p className="text-xs text-gray-400 italic">Internal notes feature coming soon...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

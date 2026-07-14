'use client';

import { useEffect } from 'react';
import { markMessageRead } from '@/app/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MessageDetailView({ message }: { message: any }) {
    useEffect(() => {
        if (message.status !== 'read') {
            markMessageRead(message.id);
        }
    }, [message.id, message.status]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/admin/messages" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Messages
            </Link>

            <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
                <CardHeader className="bg-[#f8f9fa] border-b border-gray-100 p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-brand-navy">{message.subject}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {format(new Date(message.createdAt), 'PPpp')}
                                </span>
                                {message.status === 'read' && (
                                    <span className="text-green-600 font-medium">Read</span>
                                )}
                            </div>
                        </div>
                        {message.status !== 'read' && (
                            <span className="px-3 py-1 bg-red-50 text-brand-red text-xs font-bold rounded-full uppercase tracking-widest border border-red-100 self-start">
                                New Message
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border-b border-gray-50 pb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-navy flex items-center justify-center font-bold">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Sender Name</p>
                                    <p className="font-bold text-brand-navy">{message.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-bold">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Email Address</p>
                                    <p className="font-bold text-brand-navy break-all">{message.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-navy font-bold">
                            <MessageSquare className="w-5 h-5 text-brand-red" />
                            Message Content
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-brand-navy leading-relaxed whitespace-pre-wrap text-lg">
                                {message.message}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end text-sm text-gray-400 italic">
                        Reference ID: {message.id}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

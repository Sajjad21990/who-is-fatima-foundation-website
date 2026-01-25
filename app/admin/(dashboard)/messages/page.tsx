import { getContactMessages } from '@/app/actions/admin';
import MessagesTable from '@/components/admin/MessagesTable';
import { Mail } from 'lucide-react';

export default async function MessagesListPage({ searchParams }: { searchParams: Promise<{ after?: string }> }) {
    const { after } = await searchParams;
    const { items: messages, nextId, hasMore } = await getContactMessages(20, after);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1D3557] flex items-center gap-3">
                        <Mail className="w-8 h-8 text-[#E63946]" />
                        Messages
                    </h1>
                    <p className="text-gray-500 mt-1">Review and manage contact form submissions</p>
                </div>
            </div>

            <MessagesTable messages={messages} hasMore={hasMore} nextId={nextId} />
        </div>
    );
}

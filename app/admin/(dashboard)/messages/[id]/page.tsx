import { adminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import MessageDetailView from '@/components/admin/MessageDetailView';

export default async function MessageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const doc = await adminDb.collection('contact_messages').doc(id).get();

    if (!doc.exists) {
        notFound();
    }

    const message = { id: doc.id, ...doc.data() };

    return (
        <div className="space-y-8">
            <MessageDetailView message={message} />
        </div>
    );
}

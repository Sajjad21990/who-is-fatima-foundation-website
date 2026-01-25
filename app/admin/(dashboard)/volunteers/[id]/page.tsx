import { adminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import VolunteerDetailView from '@/components/admin/VolunteerDetailView';

export default async function VolunteerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const doc = await adminDb.collection('volunteer_applications').doc(id).get();

    if (!doc.exists) {
        notFound();
    }

    const volunteer = { id: doc.id, ...doc.data() };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <Link href="/admin/volunteers" className="hover:text-[#E63946] flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Volunteers
                </Link>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1D3557] flex items-center gap-3">
                        Volunteer Detail
                    </h1>
                    <p className="text-gray-500 mt-1">Review applicant information and manage status</p>
                </div>
            </div>

            <VolunteerDetailView volunteer={volunteer} />
        </div>
    );
}

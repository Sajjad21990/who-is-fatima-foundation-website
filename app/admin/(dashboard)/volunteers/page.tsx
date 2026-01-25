import { getVolunteers } from '@/app/actions/admin';
import VolunteersTable from '@/components/admin/VolunteersTable';
import { Users } from 'lucide-react';

export default async function VolunteersListPage({ searchParams }: { searchParams: Promise<{ after?: string }> }) {
    const { after } = await searchParams;
    const { items: volunteers, nextId, hasMore } = await getVolunteers(20, after);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1D3557] flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#E63946]" />
                        Volunteers
                    </h1>
                    <p className="text-gray-500 mt-1">Manage new applications and volunteer database</p>
                </div>
            </div>

            <VolunteersTable volunteers={volunteers} hasMore={hasMore} nextId={nextId} />
        </div>
    );
}

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardShell } from '@/components/admin/DashboardShell';

// Authoritative server-side gate: no valid staff session → straight to login,
// before any dashboard page runs its Firestore queries.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/admin/login');
    }

    return <DashboardShell>{children}</DashboardShell>;
}

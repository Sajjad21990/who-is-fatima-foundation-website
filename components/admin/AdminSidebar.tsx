'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    LayoutDashboard,
    Calendar,
    Users,
    LogOut,
    Settings,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminSidebar() {
    const pathname = usePathname();
    const { userProfile } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Let the protected layout handle redirect
            toast.success('Logged out');
        } catch (error) {
            console.error(error);
        }
    };

    const isActive = (path: string) => {
        if (path === '/admin') {
            // Dashboard should only be active on exact /admin path
            return pathname === '/admin';
        }
        return pathname === path || pathname?.startsWith(path + '/');
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Events', href: '/admin/events', icon: Calendar },
        { label: 'Users', href: '/admin/users', icon: Users },
    ];

    return (
        <div className="w-64 bg-[#1D3557] text-white min-h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-8">
                <h2 className="text-xl font-bold font-mono tracking-tight">Admin<span className="text-[#E63946]">.</span></h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{userProfile?.role || 'Portal'}</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                            ? 'bg-[#E63946] text-white shadow-lg shadow-red-900/20'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}>
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="mb-4 px-4">
                    <p className="text-sm font-medium truncate">{userProfile?.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{userProfile?.role}</p>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20 gap-3"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

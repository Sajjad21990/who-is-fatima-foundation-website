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
    FileText,
    Mail,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminSidebar() {
    const pathname = usePathname();
    const { userProfile } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await fetch('/api/auth/session', { method: 'DELETE' });
            toast.success('Logged out');
            window.location.href = '/admin/login';
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
        { label: 'Volunteers', href: '/admin/volunteers', icon: Users },
        { label: 'Posts', href: '/admin/posts', icon: FileText },
        { label: 'Messages', href: '/admin/messages', icon: Mail },
        { label: 'Users', href: '/admin/users', icon: User },
        { label: 'Profile', href: '/admin/profile', icon: Settings },
    ];

    return (
        <div className="w-full bg-brand-navy text-white h-full flex flex-col overflow-y-auto">
            <div className="p-8">
                <h2 className="text-xl font-bold font-mono tracking-tight">Admin<span className="text-brand-red">.</span></h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{userProfile?.role || 'Portal'}</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                            ? 'bg-brand-red text-white shadow-lg shadow-red-900/20'
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

'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Loader2, Menu } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/components/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = useIsMobile();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-[#E63946] animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="md:h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 border-r border-gray-200">
                <AdminSidebar />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-50">
                <h1 className="text-lg font-bold">Admin<span className="text-[#E63946]">.</span></h1>
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-none w-64 bg-[#1D3557]">
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

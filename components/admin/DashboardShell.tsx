'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="md:h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 border-r border-gray-200">
                <AdminSidebar />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-50">
                <h1 className="text-lg font-bold">Admin<span className="text-brand-red">.</span></h1>
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-none w-64 bg-brand-navy">
                        <SheetTitle className="sr-only">Admin navigation</SheetTitle>
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

'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SearchInputClient({ placeholder = "Search..." }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [localValue, setLocalValue] = useState(searchParams.get('q')?.toString() || '');

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const currentQ = params.get('q') || '';

            if (currentQ === localValue) return;

            if (localValue) {
                params.set('q', localValue);
            } else {
                params.delete('q');
            }
            replace(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, pathname, replace, searchParams]);

    return (
        <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="pl-9 bg-white"
            />
        </div>
    );
}

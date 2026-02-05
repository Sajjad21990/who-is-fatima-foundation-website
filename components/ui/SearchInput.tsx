'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    debounceMs?: number;
}

export default function SearchInput({
    placeholder = "Search...",
    value: controlledValue,
    onChange,
    className,
    debounceMs = 300
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(controlledValue || '');

    useEffect(() => {
        if (controlledValue !== undefined) {
            setLocalValue(controlledValue);
        }
    }, [controlledValue]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange]);

    return (
        <div className={`relative ${className}`}>
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

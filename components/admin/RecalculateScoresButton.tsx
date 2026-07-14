'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { recalculateEventScores } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function RecalculateScoresButton({ slug }: { slug: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRecalculate = async () => {
        if (!confirm('Re-grade every submission for this quiz using the current answer key?')) return;
        setLoading(true);
        try {
            const result = await recalculateEventScores(slug);
            if (result.success) {
                toast.success(`Recalculated: ${result.updated} of ${result.total} submissions updated.`);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to recalculate scores.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while recalculating.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleRecalculate}
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recalculate Scores
        </Button>
    );
}

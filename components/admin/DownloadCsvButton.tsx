'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { getAllEventSubmissions } from '@/app/actions/admin';
import { format } from 'date-fns';

interface DownloadCsvButtonProps {
    slug: string;
}

export function DownloadCsvButton({ slug }: DownloadCsvButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsLoading(true);
            const submissions = await getAllEventSubmissions(slug);

            if (!submissions || submissions.length === 0) {
                alert('No submissions found to download.');
                return;
            }

            // CSV Header
            const headers = [
                'Submission ID',
                'Timestamp',
                'Name',
                'Email',
                'Phone',
                'Age',
                'Location',
                'Score'
            ];

            // Map data to rows
            const rows = submissions.map((sub: any) => {
                const user = sub.userDetails || {};
                return [
                    sub.id,
                    sub.timestamp ? format(new Date(sub.timestamp), 'yyyy-MM-dd HH:mm:ss') : '',
                    `"${(user.name || '').replace(/"/g, '""')}"`, // Escape quotes
                    `"${(user.email || '').replace(/"/g, '""')}"`,
                    `"${(user.phone || '').replace(/"/g, '""')}"`,
                    user.age || '',
                    `"${(user.location || '').replace(/"/g, '""')}"`,
                    sub.score || 0
                ];
            });

            // Combine header and rows
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            // Create blob and download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${slug}_submissions_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('Failed to download CSV. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownload}
            disabled={isLoading}
        >
            <Download className="w-4 h-4" />
            {isLoading ? 'Preparing...' : 'Download CSV'}
        </Button>
    );
}

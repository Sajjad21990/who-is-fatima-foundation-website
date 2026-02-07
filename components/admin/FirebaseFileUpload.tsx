'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { uploadImage } from '@/lib/storage'; // Note: storage.ts uploadImage function is generic enough for files too
import { toast } from 'sonner';

interface FirebaseFileUploadProps {
    onUploadSuccess: (url: string) => void;
    folder?: string;
    accept?: string;
    fileTypeLabel?: string;
    maxSizeMB?: number;
    children?: (props: { open: () => void; loading: boolean }) => React.ReactNode;
    className?: string;
}

export function FirebaseFileUpload({
    onUploadSuccess,
    folder = 'uploads',
    accept = '*/*',
    fileTypeLabel = 'File',
    maxSizeMB = 10,
    children,
    className
}: FirebaseFileUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size validation
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        try {
            setLoading(true);
            // uploadImage in storage.ts actually just takes a File and folder, it's not restricted to images
            const url = await uploadImage(file, folder);
            onUploadSuccess(url);
            toast.success(`${fileTypeLabel} uploaded successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to upload ${fileTypeLabel.toLowerCase()}`);
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerUpload = () => {
        if (!loading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={className}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
            />

            {children ? (
                children({ open: triggerUpload, loading })
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={triggerUpload}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload {fileTypeLabel}
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

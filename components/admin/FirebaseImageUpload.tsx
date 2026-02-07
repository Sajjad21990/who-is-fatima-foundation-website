'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { toast } from 'sonner';

interface FirebaseImageUploadProps {
    onUploadSuccess: (url: string) => void;
    folder?: string;
    children?: (props: { open: () => void; loading: boolean }) => React.ReactNode;
    className?: string;
}

export function FirebaseImageUpload({
    onUploadSuccess,
    folder = 'uploads',
    children,
    className
}: FirebaseImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('File size must be less than 5MB');
            return;
        }

        try {
            setLoading(true);
            const url = await uploadImage(file, folder);
            onUploadSuccess(url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        } finally {
            setLoading(false);
            // Reset input so same file can be selected again if needed
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
                accept="image/*"
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
                            Upload Image
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

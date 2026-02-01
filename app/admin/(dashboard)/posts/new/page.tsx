import { PostForm } from '@/components/admin/blog/PostForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <PostForm />
        </div>
    );
}

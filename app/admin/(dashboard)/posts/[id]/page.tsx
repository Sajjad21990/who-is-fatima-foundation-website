import { PostForm } from '@/components/admin/blog/PostForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPostById } from '@/lib/blog';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <PostForm post={post} />
        </div>
    );
}

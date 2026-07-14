'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { BlogPost, getPostBySlug } from '@/lib/blog';
import { requireEditor } from '@/lib/auth';
import { sanitizeBlogHtml } from '@/lib/sanitize';

const COLLECTION = 'posts';

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Something went wrong';
}

export async function createPost(data: Partial<BlogPost>) {
    try {
        await requireEditor();

        // Generate slug if not provided or valid
        let slug = data.slug;
        if (!slug && data.title) {
            slug = slugify(data.title, { lower: true, strict: true });
        } else if (slug) {
            slug = slugify(slug, { lower: true, strict: true });
        } else {
            throw new Error('Title or Slug is required');
        }

        // Check for uniqueness
        const existing = await getPostBySlug(slug);
        if (existing) {
            // Append random string to make unique
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        const newPost: Partial<BlogPost> = {
            ...data,
            slug,
            content: sanitizeBlogHtml(data.content),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection(COLLECTION).add(newPost);

        revalidatePath('/blog');
        revalidatePath('/admin/posts');

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: errorMessage(error) };
    }
}

export async function updatePost(id: string, data: Partial<BlogPost>) {
    try {
        await requireEditor();

        // If slug is changing, check uniqueness (simpler to just update for now, maybe warn?)
        // For now let's assume slug handling is careful.
        if (data.slug) {
            data.slug = slugify(data.slug, { lower: true, strict: true });
        }

        const updateData: Partial<BlogPost> = {
            ...data,
            updatedAt: new Date().toISOString()
        };

        // Only re-sanitize when new content is actually supplied.
        if (data.content !== undefined) {
            updateData.content = sanitizeBlogHtml(data.content);
        }

        await adminDb.collection(COLLECTION).doc(id).update(updateData);

        revalidatePath('/blog');
        revalidatePath(`/blog/${data.slug}`); // If we knew the old slug, we should revalidate that too.
        revalidatePath('/admin/posts');

        return { success: true };
    } catch (error) {
        console.error('Error updating post:', error);
        return { success: false, error: errorMessage(error) };
    }
}

export async function getRecentPosts(limit: number = 3) {
    try {
        const snapshot = await adminDb.collection(COLLECTION)
            .where('isPublished', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                slug: data.slug,
                title: data.title,
                description: data.excerpt || '',
                date: data.createdAt,
                author: data.author?.name || 'WFF Team',
                img: data.coverImage || '',
                tags: data.tags || [],
            };
        });
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return [];
    }
}

export async function deletePost(id: string) {
    try {
        await requireEditor();

        await adminDb.collection(COLLECTION).doc(id).delete();
        revalidatePath('/blog');
        revalidatePath('/admin/posts');
        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: errorMessage(error) };
    }
}

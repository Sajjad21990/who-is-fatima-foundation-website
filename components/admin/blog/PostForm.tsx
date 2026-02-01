'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog';
import { TipTapEditor } from './TipTapEditor';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X, Loader2, ArrowLeft, Eye } from 'lucide-react';
import * as React from 'react';
import { useState, KeyboardEvent } from 'react';
import { createPost, updatePost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

const formSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').optional().or(z.literal('')),
    excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional(),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    coverImage: z.string().url('Cover image is required'),
    tags: z.string().optional(), // Stored as comma separated string for form compatibility, handled via separate state in UI
    type: z.enum(['blog', 'news', 'event']),
    isPublished: z.boolean(),
});

interface PostFormProps {
    post?: BlogPost; // If provided, we are in Edit mode
}

export function PostForm({ post }: PostFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const { user, userProfile } = useAuth();

    // Initialize tags state
    const [tags, setTags] = useState<string[]>(
        post?.tags ? post.tags : []
    );
    const [tagInput, setTagInput] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            excerpt: post?.excerpt || '',
            content: post?.content || '<p>Start writing...</p>',
            coverImage: post?.coverImage || '',
            tags: post?.tags?.join(', ') || '',
            type: post?.type || 'blog',
            isPublished: post?.isPublished || false,
        },
    });

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    };

    // Watch title for auto-slug generation
    const titleValue = form.watch('title');

    // Simple debounce implementation using useEffect
    React.useEffect(() => {
        const timer = setTimeout(() => {
            // Only auto-generate if we are creating a new post (no ID) or if the slug is empty
            // checking !post means we are in 'create' mode. 
            // checking !form.getValues('slug') allows it to popuplate if empty in edit mode too.
            if ((!post || !form.getValues('slug')) && titleValue) {
                const newSlug = slugify(titleValue);
                form.setValue('slug', newSlug, { shouldValidate: true });
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [titleValue, form, post]);

    // Update form value when tags change
    const updateTagsFormValue = (newTags: string[]) => {
        form.setValue('tags', newTags.join(','));
    };

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            const newTags = [...tags, trimmed];
            setTags(newTags);
            updateTagsFormValue(newTags);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        updateTagsFormValue(newTags);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setSubmitting(true);

            const postData = {
                ...values,
                tags: tags, // Use our local state array
                author: post?.author || {
                    uid: user?.uid || 'admin',
                    name: userProfile?.displayName || user?.displayName || 'Admin',
                }
            };

            let result;
            if (post?.id) {
                result = await updatePost(post.id, postData);
            } else {
                result = await createPost(postData);
            }

            if (result.success) {
                router.push('/admin/posts');
                router.refresh();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-20">
                {/* Top Actions Bar - Sticky */}
                <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-sm border-b mb-8 py-4 -mx-8 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1D3557]">
                                {post ? 'Edit Post' : 'Create New Post'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {post ? 'Make changes to your content.' : 'Draft a new article, news item, or event announcement.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {form.watch('slug') && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.open(`/blog/${form.watch('slug')}`, '_blank')}
                                title="Preview in new tab (save changes first!)"
                            >
                                <Eye className="w-4 h-4 mr-2" /> Preview
                            </Button>
                        )}
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting} variant={form.watch('isPublished') ? "default" : "secondary"}>
                            {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                            {post ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Main Editor */}
                        <div className="md:col-span-2 space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter post title"
                                                {...field}
                                                className="text-lg font-semibold"
                                                onKeyDown={handleKeyDown}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <TipTapEditor value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Short summary for SEO and preview cards"
                                                {...field}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Appears in blog cards and search results.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Right Column: Settings & Metadata */}
                        <div className="space-y-6">
                            {/* Publishing Status */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <FormField
                                    control={form.control}
                                    name="isPublished"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 border">
                                            <div className="space-y-0.5">
                                                <FormLabel>Publish</FormLabel>
                                                <FormDescription>
                                                    Visible to visitors
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=unchecked]:bg-gray-200" // Ensure visibility when off
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Cover Image */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {field.value ? (
                                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                                                            <img src={field.value} alt="Cover" className="w-full h-full object-cover" />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 right-2 h-6 w-6"
                                                                onClick={() => field.onChange('')}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <CldUploadWidget
                                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default_unsigned'}
                                                            onSuccess={(result: any) => {
                                                                if (result.info?.secure_url) {
                                                                    field.onChange(result.info.secure_url);
                                                                }
                                                            }}
                                                        >
                                                            {({ open }) => (
                                                                <div
                                                                    onClick={(e) => { e.preventDefault(); open(); }}
                                                                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                                                    <span className="text-sm text-gray-500">Upload Cover Image</span>
                                                                </div>
                                                            )}
                                                        </CldUploadWidget>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Metadata */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="auto-generated-from-title"
                                                    {...field}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                URL friendly identifier. Leave empty to auto-generate.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tags Input */}
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="ml-1 hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Type tag and press Enter"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagInputKeyDown}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={handleAddTag}
                                                    disabled={!tagInput.trim()}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Categories for this post.
                                    </FormDescription>
                                </FormItem>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}

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
import { FirebaseImageUpload } from '@/components/admin/FirebaseImageUpload';
import { FirebaseFileUpload } from '@/components/admin/FirebaseFileUpload';
import { ImagePlus, X, Loader2, ArrowLeft, Eye, FileText, FileCheck } from 'lucide-react';
import * as React from 'react';
import { useState, KeyboardEvent } from 'react';
import { createPost, updatePost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').optional().or(z.literal('')),
    excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional(),
    content: z.string().optional(),
    coverImage: z.string().url('Cover image is required'),
    tags: z.string().optional(),
    type: z.enum(['blog', 'news', 'event']),
    postFormat: z.enum(['rich-text', 'pdf']),
    pdfUrl: z.string().url('PDF file is required').optional().or(z.literal('')),
    isPublished: z.boolean(),
}).refine((data) => {
    if (data.postFormat === 'rich-text') {
        return !!data.content && data.content.length >= 10;
    }
    if (data.postFormat === 'pdf') {
        return !!data.pdfUrl;
    }
    return true;
}, {
    message: "Content is required for Rich Text, or PDF for PDF post",
    path: ["content"]
});

interface PostFormProps {
    post?: BlogPost;
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
            content: post?.content || (post?.postFormat === 'pdf' ? '' : '<p>Start writing...</p>'),
            coverImage: post?.coverImage || '',
            tags: post?.tags?.join(', ') || '',
            type: post?.type || 'blog',
            postFormat: post?.postFormat || 'rich-text',
            pdfUrl: post?.pdfUrl || '',
            isPublished: post?.isPublished || false,
        },
    });

    const postFormat = form.watch('postFormat');

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    const titleValue = form.watch('title');

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if ((!post || !form.getValues('slug')) && titleValue) {
                const newSlug = slugify(titleValue);
                form.setValue('slug', newSlug, { shouldValidate: true });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [titleValue, form, post]);

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
                tags: tags,
                author: post?.author || {
                    uid: user?.uid || 'admin',
                    name: userProfile?.displayName || user?.displayName || 'Admin',
                },
                // Ensure field compatibility for old schemas if necessary
                content: values.postFormat === 'pdf' ? '' : (values.content || '')
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
                <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm mb-8 py-4 -mx-4 px-4 md:-mx-8 md:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-navy">
                                {post ? 'Edit Post' : 'Create New Post'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {post ? 'Make changes to your content.' : 'Draft a new article, news item, or event announcement.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

                            {/* Post Format Selector */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                                <FormField
                                    control={form.control}
                                    name="postFormat"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Post Format</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1 lg:flex-row lg:space-y-0 lg:gap-6"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer">
                                                        <FormControl>
                                                            <RadioGroupItem value="rich-text" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-blue-500" />
                                                            Rich Text Article
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer">
                                                        <FormControl>
                                                            <RadioGroupItem value="pdf" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                                            <FileCheck className="w-4 h-4 text-red-500" />
                                                            PDF Announcement
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {postFormat === 'rich-text' ? (
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <TipTapEditor value={field.value || ''} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="pdfUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload PDF Document</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {field.value ? (
                                                        <div className="bg-gray-50 border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                                                            <div className="bg-red-100 p-4 rounded-full">
                                                                <FileText className="w-8 h-8 text-red-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">PDF Document Attached</p>
                                                                <p className="text-sm text-gray-500 truncate max-w-xs">{field.value}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(field.value, '_blank')}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" /> View PDF
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => field.onChange('')}
                                                                >
                                                                    <X className="w-4 h-4 mr-2" /> Remove
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <FirebaseFileUpload
                                                            onUploadSuccess={(url) => field.onChange(url)}
                                                            folder="blog-pdfs"
                                                            accept="application/pdf"
                                                            fileTypeLabel="PDF Document"
                                                        >
                                                            {({ open, loading }) => (
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (!loading) open();
                                                                    }}
                                                                    className={`border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                                                                >
                                                                    {loading ? (
                                                                        <Loader2 className="w-10 h-10 text-gray-400 mb-2 animate-spin" />
                                                                    ) : (
                                                                        <FileText className="w-10 h-10 text-gray-400 mb-2" />
                                                                    )}
                                                                    <div className="text-center">
                                                                        <p className="font-medium text-gray-700">
                                                                            {loading ? 'Uploading PDF...' : 'Click to upload PDF'}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">Max size: 10MB</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </FirebaseFileUpload>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

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
                                                    className="data-[state=unchecked]:bg-gray-200"
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
                                                        <FirebaseImageUpload
                                                            onUploadSuccess={(url) => field.onChange(url)}
                                                            folder="blog-covers"
                                                        >
                                                            {({ open, loading }) => (
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (!loading) open();
                                                                    }}
                                                                    className={`border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                                                                >
                                                                    {loading ? (
                                                                        <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                                                                    ) : (
                                                                        <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                                                    )}
                                                                    <span className="text-sm text-gray-500">
                                                                        {loading ? 'Uploading...' : 'Upload Cover Image'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </FirebaseImageUpload>
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

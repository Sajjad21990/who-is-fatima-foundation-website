import { getAllPosts } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { deletePost } from '@/app/actions/blog';
import { revalidatePath } from 'next/cache';

export default async function AdminPostsPage() {
    const posts = await getAllPosts();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Blog Posts</h1>
                    <p className="text-gray-500">Manage your blog, news, and events content.</p>
                </div>
                <Link href="/admin/posts/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Create New Post
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Post</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    No posts found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {post.coverImage ? (
                                                <img src={post.coverImage} alt={post.title} className="w-12 h-12 rounded object-cover border" />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-gray-100 border flex items-center justify-center text-gray-300">
                                                    <Eye className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-brand-navy line-clamp-1">{post.title}</p>
                                                <p className="text-xs text-gray-400">/{post.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="capitalize bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${post.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank" title="Preview">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-500">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/posts/${post.id}`} title="Edit">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <form action={async () => {
                                                'use server';
                                                await deletePost(post.id);
                                            }}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                                                    type="submit"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Ensure the page is dynamic so we see latest data
export const dynamic = 'force-dynamic';

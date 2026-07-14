'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/blog';
import { getOptimizedUrl } from '@/lib/image';

const CATEGORIES = ['All', 'Blog', 'News', 'Event'] as const;

export function BlogList({ posts }: { posts: BlogPost[] }) {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return posts.filter((post) => {
            const matchesCategory = category === 'All' || post.type === category.toLowerCase();
            const matchesQuery =
                !q ||
                post.title?.toLowerCase().includes(q) ||
                post.excerpt?.toLowerCase().includes(q);
            return matchesCategory && matchesQuery;
        });
    }, [posts, query, category]);

    return (
        <>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-16">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-red transition-colors pointer-events-none" />
                    <Input
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search articles"
                        className="pl-14 h-12 border-gray-200 focus:border-brand-red focus:ring-brand-red rounded-full shadow-sm hover:shadow-md transition-shadow bg-white text-base"
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            variant={cat === category ? 'default' : 'outline'}
                            className={`whitespace-nowrap rounded-full px-6 h-10 transition-all ${cat === category
                                ? 'bg-brand-red hover:bg-brand-red/90 shadow-md hover:shadow-lg'
                                : 'text-brand-navy border-gray-200 hover:border-brand-red hover:text-brand-red bg-white hover:bg-red-50'
                                }`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {posts.length === 0 ? 'No posts published yet. Check back soon!' : 'No articles match your search.'}
                    </div>
                ) : (
                    filtered.map((post) => (
                        <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-1">
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                {post.coverImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={getOptimizedUrl(post.coverImage, { width: 800, height: 448 })}
                                        alt={post.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <span className="text-4xl font-black opacity-20">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white/95 backdrop-blur-sm text-brand-red px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        {post.postFormat === 'pdf' ? (
                                            <>
                                                <FileText className="w-3 h-3" />
                                                PDF
                                            </>
                                        ) : (
                                            post.type
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 sm:p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-brand-red" />
                                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-brand-red" />
                                        {post.author?.name || 'Admin'}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-brand-navy mb-3 line-clamp-2 group-hover:text-brand-red transition-colors leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                                    {post.excerpt || 'Click to read more...'}
                                </p>

                                <Link href={`/blog/${post.slug}`} className="mt-auto">
                                    <Button variant="link" className="p-0 h-auto text-brand-red hover:text-brand-navy font-bold group/btn text-base">
                                        {post.postFormat === 'pdf' ? 'View PDF' : 'Read Article'}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </>
    );
}

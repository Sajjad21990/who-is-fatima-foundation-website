'use client';

import { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { getOptimizedUrl } from '@/lib/image';
import type { GalleryItem } from '@/lib/gallery';

export function GalleryView({ folders, items }: { folders: string[]; items: GalleryItem[] }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [selectedFolder, setSelectedFolder] = useState<string>('All');

    const filteredItems = useMemo(() => {
        if (selectedFolder === 'All') return items;
        return items.filter((item) => item.folder === selectedFolder);
    }, [selectedFolder, items]);

    const slides = filteredItems.map((item) =>
        item.type === 'video'
            ? {
                  type: 'video' as const,
                  sources: [{ src: item.url, type: item.contentType || 'video/mp4' }],
                  title: item.caption,
              }
            : { src: getOptimizedUrl(item.url, { width: 1600 }), title: item.caption }
    );

    return (
        <>
            {/* Filter Tabs */}
            {folders.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                        onClick={() => setSelectedFolder('All')}
                        variant={selectedFolder === 'All' ? 'default' : 'outline'}
                        className={cn(
                            'capitalize rounded-full px-6',
                            selectedFolder === 'All' ? 'bg-brand-navy hover:bg-brand-navy/90' : 'text-gray-600'
                        )}
                    >
                        All
                    </Button>
                    {folders.map((folder) => (
                        <Button
                            key={folder}
                            onClick={() => setSelectedFolder(folder)}
                            variant={selectedFolder === folder ? 'default' : 'outline'}
                            className={cn(
                                'capitalize rounded-full px-6',
                                selectedFolder === folder ? 'bg-brand-navy hover:bg-brand-navy/90' : 'text-gray-600'
                            )}
                        >
                            {folder.replace(/[-_]/g, ' ')}
                        </Button>
                    ))}
                </div>
            )}

            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {filteredItems.map((item, idx) => {
                        const openAt = () => {
                            setIndex(idx);
                            setOpen(true);
                        };
                        return (
                            <button
                                key={item.fullPath}
                                type="button"
                                onClick={openAt}
                                aria-label={`View ${item.caption}`}
                                className="aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full bg-brand-navy relative">
                                        {/* Load just metadata + first frame as the poster (#t=0.1 avoids a black frame). */}
                                        <video
                                            src={`${item.url}#t=0.1`}
                                            muted
                                            playsInline
                                            preload="metadata"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/5 transition-colors">
                                            <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm border border-white/50 group-hover:scale-110 transition-transform">
                                                <Play className="w-7 h-7 text-white fill-white" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={getOptimizedUrl(item.url, { width: 800, height: 800, quality: 80 })}
                                        alt={item.caption}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p>No images or videos in this category yet.</p>
                </div>
            )}

            <Lightbox
                open={open}
                plugins={[Video, Captions]}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
            />
        </>
    );
}

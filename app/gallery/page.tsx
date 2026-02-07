'use client'

import { useState, useEffect, useMemo } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { getFolders, getImages, StorageItem, getOptimizedUrl } from "@/lib/storage";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export default function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [allItems, setAllItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Everything on Mount
  useEffect(() => {
    async function initGallery() {
      try {
        const folderList = await getFolders('website-gallery');
        setFolders(folderList);

        if (folderList.length > 0) {
          // Fetch images from all folders in parallel
          const promises = folderList.map(folder => getImages(`website-gallery/${folder}`));
          const results = await Promise.all(promises);

          // Flatten and Sort by Time (Newest First)
          const combinedItems = results.flat().sort((a, b) => b.timeCreated - a.timeCreated);
          setAllItems(combinedItems);
        }
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    initGallery();
  }, []);

  // 2. Filter Items Client-Side
  const filteredItems = useMemo(() => {
    if (selectedFolder === 'All') return allItems;

    return allItems.filter(item => {
      return item.fullPath.includes(`/website-gallery/${selectedFolder}/`) ||
        item.fullPath.includes(`/${selectedFolder}/`);
    });
  }, [selectedFolder, allItems]);

  // 3. Prepare Lightbox Slides (from filtered view)
  const slides = filteredItems.map((item) => {
    const isVideo = item.contentType?.startsWith('video/');
    if (isVideo) {
      return {
        type: "video" as const,
        sources: [
          {
            src: item.url,
            type: item.contentType || 'video/mp4',
          },
        ],
      };
    }
    return {
      src: getOptimizedUrl(item.url, { width: 1200 })
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 bg-[#1D3557] text-white text-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Gallery</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Glimpses of our activities, events, and the smiles we strive to protect.
          </p>
        </div>
      </section>

      <section className="py-12 min-h-[500px]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 space-y-8">

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => setSelectedFolder('All')}
              variant={selectedFolder === 'All' ? "default" : "outline"}
              className={cn(
                "capitalize rounded-full px-6",
                selectedFolder === 'All' ? "bg-[#1D3557] hover:bg-[#1D3557]/90" : "text-gray-600"
              )}
            >
              All
            </Button>
            {folders.map(folder => (
              <Button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                variant={selectedFolder === folder ? "default" : "outline"}
                className={cn(
                  "capitalize rounded-full px-6",
                  selectedFolder === folder ? "bg-[#1D3557] hover:bg-[#1D3557]/90" : "text-gray-600"
                )}
              >
                {folder.replace(/[-_]/g, ' ')}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            </div>
          ) : filteredItems.length > 0 ? (
            /* Items Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => {
                const isVideo = item.contentType?.startsWith('video/');

                return (
                  <div
                    key={item.fullPath}
                    className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group bg-gray-100 relative"
                    onClick={() => {
                      setIndex(idx);
                      setOpen(true);
                    }}
                  >
                    {isVideo ? (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm border border-white/50">
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <ImageWithFallback
                        src={getOptimizedUrl(item.url, { width: 600, height: 600, quality: 80 })}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 text-gray-500">
              <p>No images or videos found.</p>
              {folders.length === 0 && <p className="text-sm mt-2">Make sure you have created folders inside 'website-gallery' in Firebase Storage.</p>}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={open}
        plugins={[Video]}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </div>
  );
}

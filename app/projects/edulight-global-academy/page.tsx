'use client';

import { useState, useEffect, useMemo } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import { getImages, StorageItem, getOptimizedUrl } from '@/lib/storage';
import { Loader2, Play, Building2, Ruler, IndianRupee, CheckCircle2, HardHat, Heart, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PdfViewer from '@/components/blog/PdfViewer';
import Link from 'next/link';

const ESTIMATE_PDF_URL =
    'https://firebasestorage.googleapis.com/v0/b/who-is-fatima-foundation.firebasestorage.app/o/general%2FEstimate.pdf?alt=media&token=c9906242-32cf-4ff0-a3d9-d8af0c879b88';

export default function EdulightGlobalAcademyPage() {
    // Gallery state
    const [galleryItems, setGalleryItems] = useState<StorageItem[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        async function loadGallery() {
            try {
                const items = await getImages('website-gallery/edulight-global-academy');
                setGalleryItems(items);
            } catch (error) {
                console.error('Failed to load gallery:', error);
            } finally {
                setGalleryLoading(false);
            }
        }
        loadGallery();
    }, []);

    const slides = galleryItems.map((item) => {
        const isVideo = item.contentType?.startsWith('video/');
        if (isVideo) {
            return {
                type: 'video' as const,
                sources: [{ src: item.url, type: item.contentType || 'video/mp4' }],
            };
        }
        return { src: getOptimizedUrl(item.url, { width: 1200 }) };
    });

    const stats = [
        {
            icon: Ruler,
            label: 'Total Area',
            value: '13,200 sq. ft.',
            sub: 'Total construction area',
        },
        {
            icon: IndianRupee,
            label: 'Rate per sq. ft.',
            value: '₹1,121/-',
            sub: 'Lock and key estimate',
        },
        {
            icon: CheckCircle2,
            label: 'Completed',
            value: '~4,400 sq. ft.',
            sub: 'Alhamdulillah — work completed',
        },
        {
            icon: HardHat,
            label: 'Fund Required',
            value: '₹98,67,600/-',
            sub: 'By the grace of God — work in progress',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-20 bg-[#1D3557] text-white">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Our Project</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Edulight Global Academy</h1>
                    <p className="text-lg text-white/70 mb-2">
                        Dargah-e-Alia, Najaf-e-Hind, Jogipura, Bijnor, Uttar Pradesh
                    </p>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto mt-6">
                        Giving children in rural areas access to structured education. Affiliated with Delhi Board, focusing on quality teaching and community values.
                    </p>
                </div>
            </section>

            {/* Project Info */}
            <section className="py-20 bg-[#F1FAEE]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="text-center mb-12">
                        <span className="text-[#E63946] font-medium">Construction Update</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">Building Progress</h2>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-[#F1FAEE] rounded-xl flex items-center justify-center mb-4">
                                    <stat.icon className="w-6 h-6 text-[#E63946]" />
                                </div>
                                <p className="text-sm text-[#457B9D] font-medium mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-[#1D3557]">{stat.value}</p>
                                <p className="text-xs text-[#457B9D] mt-1">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#E63946]/10 rounded-lg flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-[#E63946]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1D3557]">Donors Welcome</h3>
                            </div>
                            <p className="text-[#457B9D] leading-relaxed">
                                Your generous contributions help us build a brighter future for children in rural areas.
                                We welcome donors who share our vision of accessible, quality education for every child.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#1D3557]/10 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#1D3557]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1D3557]">Item-wise Donations</h3>
                            </div>
                            <p className="text-[#457B9D] leading-relaxed">
                                We also accept donations for item-wise materials as mentioned in the construction estimate below.
                                Every brick, bag of cement, and fixture brings us closer to completion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Construction Estimate PDF */}
            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="text-center mb-12">
                        <span className="text-[#E63946] font-medium">Detailed Breakdown</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">Construction Estimate</h2>
                        <p className="text-[#457B9D] mt-3 max-w-2xl mx-auto">
                            View the detailed construction estimate for the Edulight Global Academy building project.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <PdfViewer url={ESTIMATE_PDF_URL} title="Edulight Global Academy — Construction Estimate" />
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 bg-[#F1FAEE]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="text-center mb-12">
                        <span className="text-[#E63946] font-medium">Progress Photos</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">Project Gallery</h2>
                    </div>

                    {galleryLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                        </div>
                    ) : galleryItems.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryItems.map((item, idx) => {
                                const isVideo = item.contentType?.startsWith('video/');
                                return (
                                    <div
                                        key={item.fullPath}
                                        className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group bg-gray-100 relative"
                                        onClick={() => {
                                            setLightboxIndex(idx);
                                            setLightboxOpen(true);
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
                        <div className="text-center py-20 text-gray-500">
                            <p>No images found for this project yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                plugins={[Video]}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
            />

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20 text-center">
                    <Heart className="w-12 h-12 text-[#E63946] mx-auto mb-6 fill-[#E63946]" />
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mb-4">Support This Project</h2>
                    <p className="text-[#457B9D] max-w-2xl mx-auto mb-8 text-lg">
                        Your contribution helps build classrooms, provide education, and transform the lives of children in rural India.
                    </p>
                    <Link href="/donate">
                        <Button className="bg-[#E63946] text-white hover:bg-[#E63946]/90 h-12 px-8 text-base gap-2">
                            Donate Now <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

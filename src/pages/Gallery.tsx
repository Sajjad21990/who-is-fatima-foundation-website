import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function Gallery() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // Generate array of images from 1.jpg to 27.jpg
    const images = Array.from({ length: 27 }, (_, i) => `/images/gallery/${i + 1}.jpg`);

    const slides = images.map((src) => ({ src }));

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Gallery"
                description="View moments of joy and impact from our various activities and events."
                canonical="https://whoisfatima.org/gallery"
            />
            <section className="py-20 bg-[#1D3557] text-white text-center">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Gallery</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Glimpses of our activities, events, and the smiles we strive to protect.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((src, idx) => (
                            <div
                                key={idx}
                                className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
                                onClick={() => {
                                    setIndex(idx);
                                    setOpen(true);
                                }}
                            >
                                <ImageWithFallback
                                    src={src}
                                    alt={`Gallery Image ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
            />
        </div>
    );
}

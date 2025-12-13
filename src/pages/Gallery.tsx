import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";

export function Gallery() {
    const images = [
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1427504746696-ea5abd7dfe5d?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1080&auto=format&fit=crop"
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Gallery"
                description="View moments of joy and impact from our various activities and events."
                canonical="https://whoisfatima.org/gallery"
            />
            <section className="py-20 bg-[#1D3557] text-white text-center">
                <div className="max-w-[1440px] mx-auto px-20">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Gallery</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Glimpses of our activities, events, and the smiles we strive to protect.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((src, index) => (
                            <div key={index} className="aspect-square rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                                <ImageWithFallback
                                    src={src}
                                    alt={`Gallery Image ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

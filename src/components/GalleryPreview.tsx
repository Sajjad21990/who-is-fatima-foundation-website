import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export function GalleryPreview() {
    const images = [
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1427504746696-ea5abd7dfe5d?q=80&w=1080&auto=format&fit=crop"
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full mb-4">
                            <span className="text-[#E63946]">Our Gallery</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl text-[#1D3557]">
                            Moments of <span className="text-[#E63946]">Joy</span>
                        </h2>
                    </div>
                    <Link to="/gallery">
                        <Button variant="outline" className="hidden md:flex border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white">
                            View Full Gallery
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                    {images.map((src, index) => (
                        <div key={index} className="aspect-square rounded-2xl overflow-hidden group">
                            <ImageWithFallback
                                src={src}
                                alt={`Gallery Preview ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/gallery">
                        <Button variant="outline" className="border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white w-full">
                            View Full Gallery
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

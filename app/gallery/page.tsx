import { getGalleryData } from '@/lib/gallery';
import { GalleryView } from '@/components/gallery/GalleryView';

export const metadata = {
    title: 'Gallery',
    description: 'Glimpses of our activities, events, and the smiles we strive to protect at Who is Fatima Foundation.',
};

// Server-rendered and revalidated every 10 minutes so new uploads appear without a redeploy.
export const revalidate = 600;

export default async function GalleryPage() {
    const { folders, items, error } = await getGalleryData();

    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 bg-brand-navy text-white text-center">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Gallery</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Glimpses of our activities, events, and the smiles we strive to protect.
                    </p>
                </div>
            </section>

            <section className="py-12 min-h-[500px]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20 space-y-8">
                    {error ? (
                        <div className="text-center py-20 text-gray-500">
                            <p className="font-medium text-brand-navy">We couldn&apos;t load the gallery right now.</p>
                            <p className="text-sm mt-2">Please refresh the page or check back shortly.</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>No images or videos have been added yet.</p>
                            <p className="text-sm mt-2">Check back soon for glimpses of our work.</p>
                        </div>
                    ) : (
                        <GalleryView folders={folders} items={items} />
                    )}
                </div>
            </section>
        </div>
    );
}

import 'server-only';

import { cache } from 'react';
import { adminStorage } from '@/lib/firebase-admin';

const GALLERY_PREFIX = 'website-gallery/';
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];

export interface GalleryItem {
    name: string;
    fullPath: string;
    folder: string;
    url: string;
    caption: string;
    type: 'image' | 'video';
    contentType: string;
    timeCreated: number;
}

export interface GalleryData {
    folders: string[];
    items: GalleryItem[];
    error: boolean;
}

function isVideo(name: string, contentType: string): boolean {
    if (contentType.startsWith('video/')) return true;
    const lower = name.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Turn a storage filename into a human-readable caption/alt text. */
function toCaption(fileName: string): string {
    const base = fileName.replace(/\.[^/.]+$/, '');        // drop extension
    const withoutTimestamp = base.replace(/^\d{10,}-/, ''); // drop the Date.now() upload prefix
    const cleaned = withoutTimestamp.replace(/[-_]+/g, ' ').trim();
    return cleaned || 'Gallery image';
}

/**
 * List the public gallery from Firebase Storage using the Admin SDK, server-side.
 *
 * Replaces the old client-side pipeline (which shipped the whole Firebase SDK to
 * every visitor and made ~2 requests per image after hydration). The download URL
 * is rebuilt from each object's Firebase download token — identical to what the
 * client getDownloadURL() would have produced — so ImageKit proxying still works.
 */
export const getGalleryData = cache(async (): Promise<GalleryData> => {
    try {
        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        const bucket = bucketName ? adminStorage.bucket(bucketName) : adminStorage.bucket();

        const [files] = await bucket.getFiles({ prefix: GALLERY_PREFIX });

        const items: GalleryItem[] = [];
        const folderSet = new Set<string>();

        for (const file of files) {
            // Skip folder placeholder objects (zero-byte names ending in '/').
            if (file.name.endsWith('/')) continue;

            const relative = file.name.slice(GALLERY_PREFIX.length);
            const segments = relative.split('/');
            // Require at least folder/file so we don't surface stray root objects.
            if (segments.length < 2) continue;
            const folder = segments[0];

            const meta = file.metadata;
            const token = (meta.metadata?.firebaseStorageDownloadTokens as string | undefined)?.split(',')[0];
            const encodedPath = encodeURIComponent(file.name);
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media${token ? `&token=${token}` : ''}`;

            const contentType = (meta.contentType as string) || '';
            const timeCreated = meta.timeCreated ? new Date(meta.timeCreated as string).getTime() : 0;

            folderSet.add(folder);
            items.push({
                name: segments[segments.length - 1],
                fullPath: file.name,
                folder,
                url,
                caption: toCaption(segments[segments.length - 1]),
                type: isVideo(file.name, contentType) ? 'video' : 'image',
                contentType,
                timeCreated,
            });
        }

        items.sort((a, b) => b.timeCreated - a.timeCreated);
        const folders = Array.from(folderSet).sort();

        return { folders, items, error: false };
    } catch (error) {
        console.error('Failed to list gallery from storage:', error);
        return { folders: [], items: [], error: true };
    }
});

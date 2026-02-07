import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, listAll, getMetadata } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage
 * @param file The file object to upload
 * @param folder The folder path (default: 'uploads')
 * @returns The download URL of the uploaded file
 */
export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
    try {
        // Sanitize filename
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}-${cleanName}`;
        const fullPath = `${folder}/${fileName}`;

        const storageRef = ref(storage, fullPath);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);

        return url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

/**
 * Transforms a Firebase Storage URL into an ImageKit Optimized URL
 * Requires NEXT_PUBLIC_IMAGEKIT_URL to be set in environment variables
 * e.g. NEXT_PUBLIC_IMAGEKIT_URL="https://ik.imagekit.io/your_id"
 */
export function getOptimizedUrl(url: string, transform?: { width?: number; height?: number; quality?: number }): string {
    const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

    // If no ImageKit configured or not a firebase url, return original
    if (!imageKitEndpoint || !url.includes('firebasestorage.googleapis.com')) {
        return url;
    }

    try {
        const urlObj = new URL(url);
        const endpoint = imageKitEndpoint.replace(/\/$/, '');

        // Pass everything after the origin (pathname + search) to ImageKit
        // ImageKit will proxy this to https://firebasestorage.googleapis.com/...
        let finalUrl = `${endpoint}${urlObj.pathname}${urlObj.search}`;

        // Build transformations
        const transforms = [];
        if (transform?.width) transforms.push(`w-${transform.width}`);
        if (transform?.height) transforms.push(`h-${transform.height}`);
        if (transform?.quality) transforms.push(`q-${transform.quality}`);

        if (transforms.length > 0) {
            // Append transformation query param
            // Note: ImageKit expects 'tr' query param
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl += `${separator}tr=${transforms.join(',')}`;
        }

        return finalUrl;

    } catch (e) {
        console.error("Error generating optimized URL:", e);
        return url;
    }
}

/**
 * Lists all sub-folders (prefixes) at a given path
 */
export async function getFolders(path: string = 'website-gallery'): Promise<string[]> {
    try {
        const storageRef = ref(storage, path);
        const res = await listAll(storageRef);
        return res.prefixes.map(prefix => prefix.name);
    } catch (error) {
        console.error("Error listing folders:", error);
        return [];
    }
}

export interface StorageItem {
    name: string;
    fullPath: string;
    url: string;
    timeCreated: number;
    contentType?: string;
}

/**
 * Lists all items (images/videos) in a given folder path, sorted by upload time (newest first)
 */
export async function getImages(path: string): Promise<StorageItem[]> {
    try {
        const storageRef = ref(storage, path);
        const res = await listAll(storageRef);

        // Parallel Fetch: Get URL and Metadata for all items
        const itemsWithMetadata = await Promise.all(
            res.items.map(async (itemRef) => {
                const [url, meta] = await Promise.all([
                    getDownloadURL(itemRef),
                    getMetadata(itemRef)
                ]);

                return {
                    name: itemRef.name,
                    fullPath: itemRef.fullPath,
                    url: url,
                    timeCreated: meta.timeCreated ? new Date(meta.timeCreated).getTime() : 0,
                    contentType: meta.contentType
                };
            })
        );

        // Sort by timeCreated descending (Newest first)
        return itemsWithMetadata.sort((a, b) => b.timeCreated - a.timeCreated);

    } catch (error) {
        console.error("Error listing images:", error);
        return [];
    }
}

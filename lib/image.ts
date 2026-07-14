/**
 * Pure image helpers — no Firebase import, safe to use in server or client code.
 */

export interface ImageTransform {
    width?: number;
    height?: number;
    quality?: number;
}

/**
 * Rewrite a Firebase Storage download URL to an ImageKit-optimized URL with
 * on-the-fly resizing and automatic format (WebP/AVIF) negotiation.
 * Falls back to the original URL when ImageKit isn't configured or the URL isn't
 * a Firebase Storage URL.
 */
export function getOptimizedUrl(url: string, transform?: ImageTransform): string {
    const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

    if (!endpoint || !url.includes('firebasestorage.googleapis.com')) {
        if (process.env.NODE_ENV !== 'production' && !endpoint && url.includes('firebasestorage.googleapis.com')) {
            console.warn('NEXT_PUBLIC_IMAGEKIT_URL is not set — serving unoptimized full-size images.');
        }
        return url;
    }

    try {
        const urlObj = new URL(url);
        const base = endpoint.replace(/\/$/, '');
        let finalUrl = `${base}${urlObj.pathname}${urlObj.search}`;

        const transforms: string[] = ['f-auto'];
        if (transform?.width) transforms.push(`w-${transform.width}`);
        if (transform?.height) transforms.push(`h-${transform.height}`);
        transforms.push(`q-${transform?.quality ?? 80}`);

        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl += `${separator}tr=${transforms.join(',')}`;
        return finalUrl;
    } catch {
        return url;
    }
}

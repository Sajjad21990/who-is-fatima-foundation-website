import 'server-only';
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize rich-text HTML produced by the TipTap editor before it is stored or
 * rendered. Strips <script>, event handlers, javascript: URLs, iframes, etc.,
 * while keeping the formatting tags the editor actually emits.
 */
export function sanitizeBlogHtml(dirty: string | undefined | null): string {
    if (!dirty) return '';

    return sanitizeHtml(dirty, {
        allowedTags: [
            'p', 'br', 'hr',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark', 'sub', 'sup',
            'blockquote', 'ul', 'ol', 'li',
            'a', 'img',
            'code', 'pre',
            'span', 'div', 'figure', 'figcaption',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
        ],
        allowedAttributes: {
            a: ['href', 'name', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
            span: ['style'],
            div: ['style'],
            '*': ['class'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: { img: ['http', 'https'] },
        transformTags: {
            a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
        },
        allowedStyles: {
            '*': {
                'text-align': [/^(left|right|center|justify)$/],
            },
        },
    });
}

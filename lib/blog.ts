
import { cache } from 'react';
import { adminDb } from '@/lib/firebase-admin';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  coverImage: string;
  tags: string[];
  type: 'blog' | 'news' | 'event';
  postFormat?: 'rich-text' | 'pdf';
  pdfUrl?: string;
  isPublished: boolean;
  author: {
    uid: string;
    name: string;
    photoURL?: string;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  publishedAt?: string; // ISO string
}

const COLLECTION = 'posts';

export async function getPosts(options: {
  limit?: number;
  tag?: string;
  type?: string;
  publishedOnly?: boolean;
} = {}): Promise<BlogPost[]> {
  try {
    let query = adminDb.collection(COLLECTION).orderBy('createdAt', 'desc');

    if (options.publishedOnly) {
      query = query.where('isPublished', '==', true);
    }

    if (options.type) {
      query = query.where('type', '==', options.type);
    }

    if (options.tag) {
      query = query.where('tags', 'array-contains', options.tag);
    }

    const snapshot = await query.limit(options.limit || 20).get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Wrapped in React.cache so generateMetadata + the page component share one read per request.
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const snapshot = await adminDb.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as BlogPost;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
});

export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data()
    } as BlogPost;
  } catch (error) {
    console.error('Error fetching post by id:', error);
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // Helper for admin list view mostly
  try {
    const snapshot = await adminDb.collection(COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost));
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

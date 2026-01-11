import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    const simplifiedPosts = posts.map(post => ({
      slug: post.slug,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      date: post.frontmatter.date,
      author: post.frontmatter.author,
      img: post.frontmatter.img,
      tags: post.frontmatter.tags,
    }));
    return NextResponse.json(simplifiedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

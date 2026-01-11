import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.img],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div className="h-full bg-[#E63946] w-0 transition-all duration-300" id="progress-bar"></div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Navigation */}
        <Link href="/blog">
          <Button
            variant="ghost"
            className="mb-12 pl-0 hover:pl-2 transition-all text-gray-500 hover:text-[#E63946] group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {frontmatter.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-red-50 text-[#E63946] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-[#1D3557] mb-8 leading-tight">
            {frontmatter.title}
          </h1>

          <div className="flex items-center justify-center gap-8 text-gray-500 text-sm font-medium border-y border-gray-100 py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#E63946]">
                <User className="w-4 h-4" />
              </div>
              {frontmatter.author}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#E63946]">
                <Calendar className="w-4 h-4" />
              </div>
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-16 shadow-2xl aspect-video relative group">
          <ImageWithFallback
            src={frontmatter.img}
            alt={frontmatter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg lg:prose-xl max-w-none
            prose-headings:text-[#1D3557] prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-[#E63946] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-[#E63946] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-strong:text-[#1D3557]
            prose-li:text-gray-600"
        >
          <MDXRemote source={content} />
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 font-medium">Share this article</p>
            <div className="flex gap-4">{/* Add social share buttons here if needed */}</div>
          </div>
        </div>
      </article>
    </div>
  );
}

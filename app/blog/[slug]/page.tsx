import { getPostBySlug, getPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, User, Clock, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { PdfPostContent } from "@/components/blog/PdfPostContent";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author?.name || 'Admin'],
    },
  };
}

// Generate static params if we want partial SSG, but for now we rely on dynamic for ease
// export async function generateStaticParams() {
//     const posts = await getPosts({ publishedOnly: true });
//     return posts.map((post) => ({
//         slug: post.slug,
//     }));
// }

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Estimate read time (words / 200) - only for articles
  const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  const isPdf = post.postFormat === 'pdf';

  return (
    <article className="min-h-screen bg-gray-50 pb-20">
      {/* Draft Warning Banner */}
      {!post.isPublished && (
        <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 px-4 py-3 text-center font-medium sticky top-0 z-50">
          🚧 This post is currently a DRAFT and is not visible to the public.
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1D3557] text-white pt-20 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        {post.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          ></div>
        )}

        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
          <Link href="/blog" className="inline-block mb-6">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 gap-2 h-8 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="bg-[#E63946] text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
              {isPdf ? 'Announcement' : post.type}
            </span>
            {post.tags?.map(tag => (
              <span key={tag} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] md:text-xs font-medium tracking-wide">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-[95%] mx-auto">{post.title}</h1>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm md:text-base text-gray-300 font-medium max-w-sm mx-auto md:max-w-none">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#E63946]" />
              {post.author?.name || 'Admin'}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E63946]" />
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </div>
            {!isPdf && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E63946]" />
                {readTime} min read
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 md:-mt-16 relative z-20">
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 md:mb-12 border-4 border-white aspect-video max-h-[300px] md:max-h-[500px]">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-sm prose prose-slate md:prose-lg max-w-none 
                    prose-img:rounded-xl prose-img:shadow-md
                    prose-headings:text-[#1D3557] prose-headings:font-bold 
                    prose-a:text-[#E63946] prose-a:no-underline hover:prose-a:underline">

          {isPdf && post.pdfUrl ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">Document Attached</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold">PDF Format</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={post.pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>
                </Button>
              </div>

              <div className="w-full">
                <PdfPostContent url={post.pdfUrl} title={post.title} />
              </div>

              <p className="text-center text-sm text-gray-500 italic">
                Cannot see the document? <a href={post.pdfUrl} className="text-[#E63946] font-bold">Click here to open it directly.</a>
              </p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          )}

        </div>
      </div>
    </article>
  );
}

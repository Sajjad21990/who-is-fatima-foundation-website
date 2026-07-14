import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getRecentPosts } from "@/app/actions/blog";
import { getOptimizedUrl } from "@/lib/image";

// Server component: fetched at build/revalidate time so posts are in the initial
// HTML (SEO-visible) instead of popping in after hydration via useEffect.
export async function Blog() {
  const posts = await getRecentPosts(3);

  return (
    <section id="blog" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-brand-cream rounded-full mb-4">
            <span className="text-brand-red">Latest News</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            Our <span className="text-brand-red">Blog & News</span>
          </h2>
          <p className="text-brand-blue">
            Stay updated with our latest stories, impact reports, and news from the field.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48 sm:h-64">
                <ImageWithFallback
                  src={getOptimizedUrl(post.img, { width: 800 })}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-red text-white px-3 py-1 rounded-full text-sm">
                    {post.tags[0]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                <h3 className="text-brand-navy group-hover:text-brand-red transition-colors line-clamp-2 font-bold text-xl">
                  {post.title}
                </h3>

                <p className="text-sm text-brand-blue line-clamp-2 flex-grow">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-brand-blue pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Read More */}
                <Link href={`/blog/${post.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-brand-red hover:text-brand-red hover:bg-brand-cream p-0 h-auto gap-1 mt-4"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button
              variant="outline"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8"
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

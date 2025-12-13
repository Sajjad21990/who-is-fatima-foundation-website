import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  img: string;
  tags: string[];
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      // Import all MDX files from the blog content directory
      const modules = import.meta.glob('../content/blog/*.mdx', { eager: true });

      const loadedPosts = Object.entries(modules).map(([path, module]: [string, any]) => {
        const slug = path.split('/').pop()?.replace('.mdx', '') || '';
        return {
          slug,
          ...module.frontmatter
        };
      });

      // Sort posts by date (newest first) and take top 3
      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPosts(loadedPosts.slice(0, 3));
    };

    loadPosts();
  }, []);

  return (
    <section id="blog" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full mb-4">
            <span className="text-[#E63946]">Latest News</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1D3557] mb-4">
            Our <span className="text-[#E63946]">Blog & News</span>
          </h2>
          <p className="text-[#457B9D]">
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
              <div className="relative overflow-hidden h-64">
                <ImageWithFallback
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#E63946] text-white px-3 py-1 rounded-full text-sm">
                    {post.tags[0]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                <h3 className="text-[#1D3557] group-hover:text-[#E63946] transition-colors line-clamp-2 font-bold text-xl">
                  {post.title}
                </h3>

                <p className="text-sm text-[#457B9D] line-clamp-2 flex-grow">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-[#457B9D] pt-4 border-t border-gray-200 mt-auto">
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
                <Link to={`/blog/${post.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-[#E63946] hover:text-[#E63946] hover:bg-[#F1FAEE] p-0 h-auto gap-1 mt-4"
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
          <Link to="/blog">
            <Button
              variant="outline"
              className="border-[#457B9D] text-[#457B9D] hover:bg-[#457B9D] hover:text-white px-8"
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

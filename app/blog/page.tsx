import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { format } from 'date-fns';

export const metadata = {
  title: "Blog",
  description: "Stories, updates, and insights from our journey of empowering the community.",
};

// Make it dynamic to show latest posts
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Fetch published posts only
  const posts = await getPosts({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-[#1D3557] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Our Blog</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Stories, updates, and insights from our journey of empowering the community.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-16">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#E63946] transition-colors pointer-events-none" />
              <Input
                placeholder="Search articles..."
                className="pl-14 h-12 border-gray-200 focus:border-[#E63946] focus:ring-[#E63946] rounded-full shadow-sm hover:shadow-md transition-shadow bg-white text-base"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
              {["All", "Blog", "News", "Event"].map((category, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? "default" : "outline"}
                  className={`whitespace-nowrap rounded-full px-6 h-10 transition-all ${idx === 0
                    ? "bg-[#E63946] hover:bg-[#E63946]/90 shadow-md hover:shadow-lg"
                    : "text-[#1D3557] border-gray-200 hover:border-[#E63946] hover:text-[#E63946] bg-white hover:bg-red-50"
                    }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No posts published yet. Check back soon!
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-4xl font-black opacity-20">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/95 backdrop-blur-sm text-[#E63946] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        {post.postFormat === 'pdf' ? (
                          <>
                            <FileText className="w-3 h-3" />
                            PDF
                          </>
                        ) : (
                          post.type
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#E63946]" />
                        {post.author?.name || 'Admin'}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-[#1D3557] mb-3 line-clamp-2 group-hover:text-[#E63946] transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {post.excerpt || 'Click to read more...'}
                    </p>

                    <Link href={`/blog/${post.slug}`} className="mt-auto">
                      <Button variant="link" className="p-0 h-auto text-[#E63946] hover:text-[#1D3557] font-bold group/btn text-base">
                        {post.postFormat === 'pdf' ? 'View PDF' : 'Read Article'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

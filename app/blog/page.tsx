import { getPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/BlogList";

export const metadata = {
  title: "Blog",
  description: "Stories, updates, and insights from our journey of empowering the community.",
};

// Statically generated and revalidated hourly; blog mutations call revalidatePath('/blog').
export const revalidate = 3600;

export default async function BlogPage() {
  // Fetch published posts only
  const posts = await getPosts({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-brand-navy text-white text-center relative overflow-hidden">
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
          <BlogList posts={posts} />
        </div>
      </section>
    </div>
  );
}

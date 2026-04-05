import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ArrowRight, School, BookOpen, Target, ExternalLink, GraduationCap, Gift, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Our Projects",
  description: "Explore our initiatives including SUPER 20 scholarship program, Sakina Education & Research Center, and Edulight Global School.",
};

export default function ProjectsPage() {
  const projects = [
    {
      title: "Sakina Education & Research Center",
      location: "Baqariya Shia Jama Masjid, Malwani, Mumbai",
      description: "Providing modern education and skill development within the Shia community. Located inside Shia Jama Masjids, making education accessible and safe.",
      features: ["Computer Basics", "Web Development", "Digital Literacy"],
      image: "/images/projects/serc-malwani.png",
      category: "Skill Development",
      stats: { label: "Students Completed Courses", value: 50 },
    },
    {
      title: "Sakina Education & Research Center",
      location: "Haidery Shia Jama Masjid, Mira Road",
      description: "Empowering youth with technical skills and career guidance. A hub for learning and growth.",
      features: ["Computer Basics", "Web Development Crash Course", "Career Counseling"],
      image: "/images/projects/serc-miraroad.png",
      category: "Skill Development",
      stats: { label: "Students Completed Courses", value: 107 },
    },
    {
      title: "Sakina Education & Research Center",
      location: "Dargah-e-Alia, Najaf-e-Hind, Jogipura, Bijnor, UP",
      description: "Bringing quality education to rural areas. 94 students have completed basic courses including Computer Basics, MS Office, and Typing.",
      features: ["Computer Basics", "MS Office", "Typing"],
      image: "/images/hero/hero-3.jpg",
      category: "Skill Development",
      stats: { label: "Students Completed Courses", value: 94 },
    },
    {
      title: "Edulight Global Academy",
      location: "Dargah-e-Alia, Najaf-e-Hind, Jogipura, Bijnor, UP",
      description: "Giving children in rural areas access to structured education. Affiliated with Delhi Board, focusing on quality teaching and community values.",
      features: ["Pre-Primary", "Primary", "Recognized Curriculum", "Community Values"],
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1080&auto=format&fit=crop",
      category: "Formal Education",
      href: "/projects/edulight-global-academy",
      stats: { label: "Students Enrolled", value: 41 },
    },
    {
      title: "Sakina Sewing Classes",
      location: "Dargah-e-Alia, Najaf-e-Hind, Jogipura, Bijnor, UP",
      description: "Empowering women with vocational skills to achieve financial independence.",
      features: ["Sewing Training", "Design Workshops", "Self-Employment Support"],
      image: "/images/projects/serc-sewing.png",
      category: "Vocational Training",
      stats: { label: "Women Trained", value: 70 },
    }
  ];

  const futurePlans = [
    {
      title: "Expand SERC in Mumbai",
      description: "Establish an SERC at every Shia Jama Masjid in Mumbai to ensure every child has access to computer education.",
      icon: Target,
      location: "Haidery Shia Jama Masjid, Mira Road",
      image: "/images/hero/hero-3.jpg",
    },
    {
      title: "Expand Edulight Global School",
      description: "Expand to primary, secondary and junior college levels (currently pre-primary).",
      icon: School,
      location: "Dargah-e-Alia, Najaf-e-Hind, Jogipura, Bijnor, UP",
      image: "/images/hero/hero-2.jpg",
    },
    {
      title: "Hazrat Fatima Womens University",
      description: "A dedicated university for women's higher education.",
      icon: BookOpen,
      location: "Dargah-e-Alia, Najaf-e-Hind, Jogipura, Bijnor, UP",
      image: "/images/hero/hero-1.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-[#1D3557] text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Work & Projects</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Empowering the community through accessible education and skill development centers.
          </p>
        </div>
      </section>

      {/* SUPER 20 — Flagship Project */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-12">
            <span className="bg-[#E63946] text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              Flagship Initiative
            </span>
            <h2 className="text-3xl lg:text-4xl text-[#1D3557] mt-6">
              SUPER <span className="text-[#E63946]">20</span>
            </h2>
            <p className="text-[#457B9D] mt-3 max-w-2xl mx-auto text-lg">
              Selecting the brightest minds from our community and giving them everything they need to succeed.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1D3557] to-[#264773] rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
              {/* Left — Details */}
              <div className="space-y-8">
                <p className="text-white/80 text-lg leading-relaxed">
                  Our core mission — we identify and select <span className="text-white font-semibold">20 exceptional students</span> from the community and provide comprehensive support so they can focus entirely on their education and future.
                </p>

                {/* Progress: 5 / 20 */}
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-white font-semibold">Students Enrolled</span>
                    <span className="text-[#E63946] font-bold text-2xl">5<span className="text-white/60 text-base font-normal"> / 20</span></span>
                  </div>
                  <Progress value={25} className="h-3 bg-white/15 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-[#E63946] [&>[data-slot=progress-indicator]]:to-[#FF6B6B]" />
                  <p className="text-white/50 text-sm">5 girls currently enrolled — 15 spots remaining</p>
                </div>

                {/* What we provide */}
                <div>
                  <h4 className="text-white font-semibold mb-4">What We Provide</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">College Fees</span>
                        <p className="text-white/50 text-xs mt-0.5">Full tuition support for higher education</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Coaching</span>
                        <p className="text-white/50 text-xs mt-0.5">Professional coaching and academic guidance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Mentorship</span>
                        <p className="text-white/50 text-xs mt-0.5">Dedicated mentors for personal growth</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Monthly Hampers</span>
                        <p className="text-white/50 text-xs mt-0.5">Dry fruits, clothes, and essentials every month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Visual */}
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-sm mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-6 rounded-full border-2 border-white/5" />
                  <div className="absolute inset-12 bg-gradient-to-br from-[#E63946] to-[#FF6B6B] rounded-full flex flex-col items-center justify-center shadow-xl shadow-[#E63946]/20">
                    <span className="text-6xl lg:text-7xl font-black text-white">20</span>
                    <span className="text-white/90 font-medium text-sm tracking-wider uppercase mt-1">Scholars</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                    <span className="text-[#1D3557] font-bold text-lg">5</span>
                    <span className="text-[#457B9D] text-xs block">Enrolled</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                    <span className="text-[#E63946] font-bold text-lg">15</span>
                    <span className="text-[#457B9D] text-xs block">Remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-20 bg-[#F1FAEE]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <span className="text-[#E63946] font-medium">Current Initiatives</span>
            <h2 className="text-3xl lg:text-4xl text-[#1D3557] mt-2">Making a Difference Today</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-[#E63946] px-3 py-1 rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1D3557] mb-2">{project.title}</h3>
                  <p className="text-[#E63946] font-medium mb-4">{project.location}</p>
                  <p className="text-[#457B9D] mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.features.map((feature, idx) => (
                      <span key={idx} className="bg-[#F1FAEE] text-[#1D3557] px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {project.stats && (
                    <div className="flex items-center gap-3 mb-6 bg-[#1D3557] rounded-xl px-5 py-3">
                      <GraduationCap className="w-5 h-5 text-[#E63946] flex-shrink-0" />
                      <div>
                        <span className="text-white font-bold text-lg">{project.stats.value}+</span>
                        <span className="text-white/70 text-sm ml-2">{project.stats.label}</span>
                      </div>
                    </div>
                  )}

                  {project.href && (
                    <Link href={project.href}>
                      <Button className="w-full bg-white border-2 border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white transition-colors group/btn">
                        View Project Details
                        <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <span className="text-[#E63946] font-medium">Our Vision</span>
            <h2 className="text-3xl lg:text-4xl text-[#1D3557] mt-2">Future Plans</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {futurePlans.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1D3557] mb-2">{project.title}</h3>
                  <p className="text-[#E63946] font-medium mb-4">{project.location}</p>
                  <p className="text-[#457B9D] mb-6">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

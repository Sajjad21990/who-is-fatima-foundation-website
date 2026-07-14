import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ArrowRight, GraduationCap, BookOpen, Gift, Users } from "lucide-react";
import Link from "next/link";

export function Causes() {
  const causes = [
    {
      title: "Sakina Education & Research Center",
      category: "Skill Development",
      description: "Providing modern education and skill development within the Shia community. Located inside Shia Jama Masjids.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1080&auto=format&fit=crop",
    },
    {
      title: "Edulight Global School",
      category: "Formal Education",
      description: "Giving children in rural areas access to structured education. Affiliated with Delhi Board.",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1080&auto=format&fit=crop",
    }
  ];

  return (
    <section id="causes" className="py-20 lg:py-28 bg-brand-cream">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full mb-4">
            <span className="text-brand-red">Our Work</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            Featured <span className="text-brand-red">Projects</span>
          </h2>
          <p className="text-brand-blue">
            Explore our current initiatives and see how we are making a difference in education.
          </p>
        </div>

        {/* SUPER 20 — Flagship Project */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative bg-gradient-to-br from-brand-navy to-brand-navy-2 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-72 sm:h-72 bg-brand-red/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-brand-blue/10 rounded-full translate-y-1/3 -translate-x-1/3" />

            <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
              {/* Left — Content */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-red text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                    Flagship Initiative
                  </span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  SUPER <span className="text-brand-red">20</span>
                </h3>

                <p className="text-white/80 text-lg leading-relaxed">
                  We select the <span className="text-white font-semibold">20 brightest minds</span> from our community and support them with college fees, coaching, mentorship, and monthly hampers — everything they need to succeed.
                </p>

                {/* Progress: 5 / 20 */}
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-white font-semibold text-sm">Students Enrolled</span>
                    <span className="text-brand-red font-bold text-2xl">5<span className="text-white/60 text-base font-normal"> / 20</span></span>
                  </div>
                  <Progress value={25} className="h-3 bg-white/15 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-brand-red [&>[data-slot=progress-indicator]]:to-brand-coral" />
                </div>

                {/* What we provide */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-brand-red" />
                    </div>
                    <span className="text-sm">College Fees</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-brand-red" />
                    </div>
                    <span className="text-sm">Coaching</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-brand-red" />
                    </div>
                    <span className="text-sm">Mentorship</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-brand-red" />
                    </div>
                    <span className="text-sm">Monthly Hampers</span>
                  </div>
                </div>

                <Link href="/projects">
                  <Button className="bg-brand-red hover:bg-brand-red-dark text-white gap-2 px-6 mt-2">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Right — Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-sm mx-auto">
                  {/* Large ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />
                  {/* Inner ring */}
                  <div className="absolute inset-6 rounded-full border-2 border-white/5" />

                  {/* Center circle */}
                  <div className="absolute inset-12 bg-gradient-to-br from-brand-red to-brand-coral rounded-full flex flex-col items-center justify-center shadow-xl shadow-brand-red/20">
                    <span className="text-6xl lg:text-7xl font-black text-white">20</span>
                    <span className="text-white/90 font-medium text-sm tracking-wider uppercase mt-1">Scholars</span>
                  </div>

                  {/* Floating stat badges */}
                  <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                    <span className="text-brand-navy font-bold text-lg">5</span>
                    <span className="text-brand-blue text-xs block">Enrolled</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                    <span className="text-brand-red font-bold text-lg">15</span>
                    <span className="text-brand-blue text-xs block">Remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {causes.map((cause, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <ImageWithFallback
                  src={cause.image}
                  alt={cause.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-brand-red px-3 py-1 rounded-full text-sm">
                    {cause.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-brand-navy">{cause.title}</h3>
                <p className="text-sm text-brand-blue line-clamp-2">
                  {cause.description}
                </p>

              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button
              variant="outline"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8"
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

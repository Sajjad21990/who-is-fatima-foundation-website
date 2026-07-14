import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HandHeart, Users, Globe, GraduationCap } from "lucide-react";

export function VolunteerCTA() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-r from-brand-red to-brand-coral relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-white rounded-full"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <HandHeart className="w-5 h-5" />
              <span>Join Our Team</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold">
              Become a Volunteer & Make an Impact
            </h2>

            <p className="text-lg text-white/90">
              Join our global community of passionate volunteers. Whether you can spare
              a few hours a week or want to commit to a long-term project, your contribution
              matters. Together, we can create lasting change.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-red hover:bg-white/90 px-8"
              >
                <Link href="/volunteer">Join as Volunteer</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-red px-8"
              >
                <Link href="/projects">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Users, number: "292+", label: "Students Educated" },
              { icon: HandHeart, number: "70+", label: "Women Trained" },
              { icon: Globe, number: "3", label: "SERC Centers" },
              { icon: GraduationCap, number: "5/20", label: "SUPER 20 Scholars" }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/30 transition-colors"
              >
                <stat.icon className="w-10 h-10 mb-4" />
                <div className="text-3xl mb-2">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

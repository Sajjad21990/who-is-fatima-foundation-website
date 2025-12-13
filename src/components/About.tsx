import { Heart, Users, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function About() {
  const features = [
    {
      icon: Heart,
      title: "Support Communities",
      description: "We work directly with local communities to understand their needs and provide sustainable solutions."
    },
    {
      icon: Users,
      title: "Volunteer Network",
      description: "Join thousands of volunteers worldwide making a real difference in people's lives every day."
    },
    {
      icon: Target,
      title: "Clear Mission",
      description: "Our transparent approach ensures every donation reaches those who need it most."
    },
    {
      icon: Award,
      title: "Proven Impact",
      description: "Over 15 years of experience delivering measurable results and positive change."
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full">
              <span className="text-[#E63946]">About Who is Fatima Foundation</span>
            </div>

            <h2 className="text-4xl lg:text-5xl text-[#1D3557]">
              Uplifting Our <span className="text-[#E63946]">Community</span>
            </h2>

            <p className="text-[#457B9D] leading-relaxed">
              Founded with the vision of uplifting our community, Who is Fatima Foundation is currently running Sakina Education & Research Centers in Mumbai, and Edulight Global School in Jogipura, MP.
            </p>

            <p className="text-[#457B9D] leading-relaxed">
              Our dream is to establish education centers in every Shia Jama Masjid in Mumbai, ensuring quality education is accessible to all.
            </p>

            <div className="pt-4">
              <Link to="/about">
                <Button variant="outline" className="border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white">
                  Read More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#F1FAEE] rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[#1D3557] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#457B9D]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

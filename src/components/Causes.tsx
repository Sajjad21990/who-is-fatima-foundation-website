import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Causes() {
  const causes = [
    {
      title: "Sakina Education & Research Center",
      category: "Skill Development",
      description: "Providing modern education and skill development within the Shia community. Located inside Shia Jama Masjids.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1080&auto=format&fit=crop",
      raised: 15000,
      goal: 50000,
      progress: 30
    },
    {
      title: "Edulight Global School",
      category: "Formal Education",
      description: "Giving children in rural areas access to structured education. Affiliated with Delhi Board.",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1080&auto=format&fit=crop",
      raised: 25000,
      goal: 100000,
      progress: 25
    }
  ];

  return (
    <section id="causes" className="py-20 lg:py-28 bg-[#F1FAEE]">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full mb-4">
            <span className="text-[#E63946]">Our Work</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1D3557] mb-4">
            Featured <span className="text-[#E63946]">Projects</span>
          </h2>
          <p className="text-[#457B9D]">
            Explore our current initiatives and see how we are making a difference in education.
          </p>
        </div>

        {/* Causes Grid */}
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
                  <span className="bg-white text-[#E63946] px-3 py-1 rounded-full text-sm">
                    {cause.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-[#1D3557]">{cause.title}</h3>
                <p className="text-sm text-[#457B9D] line-clamp-2">
                  {cause.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <Progress value={cause.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#E63946]">
                      ₹{cause.raised.toLocaleString()}
                    </span>
                    <span className="text-[#457B9D]">
                      Goal: ₹{cause.goal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  className="w-full bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white hover:opacity-90 gap-2"
                >
                  Donate Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/projects">
            <Button
              variant="outline"
              className="border-[#457B9D] text-[#457B9D] hover:bg-[#457B9D] hover:text-white px-8"
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Button } from "./ui/button";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section id="home" className="relative bg-[#F1FAEE] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-[#E63946]">💝 Empowering the Community</span>
            </div>

            <h1 className="text-5xl lg:text-6xl text-[#1D3557] leading-tight">
              Empowering the Community Through <span className="text-[#E63946]">Education</span>
            </h1>

            <p className="text-lg text-[#457B9D] max-w-xl">
              Who is Fatima Foundation (WFF) is committed to providing quality education to underprivileged children of the community in Mumbai and beyond.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/donate">
                <Button
                  className="bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white hover:opacity-90 px-8 py-6 gap-2"
                >
                  Donate Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/get-involved">
                <Button
                  variant="outline"
                  className="border-[#457B9D] text-[#457B9D] hover:bg-[#457B9D] hover:text-white px-8 py-6 gap-2"
                >
                  Volunteer With Us
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl text-[#E63946]">150+</div>
                <div className="text-sm text-[#457B9D]">Students</div>
              </div>
              <div>
                <div className="text-3xl text-[#E63946]">2</div>
                <div className="text-sm text-[#457B9D]">Centers</div>
              </div>
              <div>
                <div className="text-3xl text-[#E63946]">1</div>
                <div className="text-sm text-[#457B9D]">School</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/images/hero/hero-2.jpg"
                alt="Charity volunteers helping community"
                className="w-full h-[500px] object-cover"
              />
              {/* Floating Card */}
              {/* <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-6 shadow-xl max-w-[280px]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] rounded-full flex items-center justify-center text-white">
                    ❤️
                  </div>
                  <div>
                    <div className="text-2xl text-[#1D3557]">₹2.5M</div>
                    <div className="text-sm text-[#457B9D]">Raised This Year</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

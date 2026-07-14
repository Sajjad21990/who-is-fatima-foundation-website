import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Link from "next/link";

export function Hero() {
  return (
    <section id="home" className="relative bg-brand-cream overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-brand-red">💝 Empowering the Community</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-brand-navy leading-tight">
              Empowering the Community Through <span className="text-brand-red">Education</span>
            </h1>

            <p className="text-lg text-brand-blue max-w-xl">
              Who is Fatima Foundation (WFF) is committed to providing quality education to underprivileged children of the community in Mumbai and beyond.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/donate">
                <Button
                  className="bg-gradient-to-r from-brand-red to-brand-coral text-white hover:opacity-90 px-8 py-6 gap-2"
                >
                  Donate Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/volunteer">
                <Button
                  variant="outline"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-6 gap-2"
                >
                  Volunteer With Us
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-8">
              <div>
                <div className="text-2xl sm:text-3xl text-brand-red">292+</div>
                <div className="text-sm text-brand-blue">Students</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl text-brand-red">3</div>
                <div className="text-sm text-brand-blue">Centers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl text-brand-red">1</div>
                <div className="text-sm text-brand-blue">School</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/images/hero/hero-2.jpg"
                alt="Charity volunteers helping community"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              {/* Floating Card */}
              {/* <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-6 shadow-xl max-w-[280px]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-red to-brand-coral rounded-full flex items-center justify-center text-white">
                    ❤️
                  </div>
                  <div>
                    <div className="text-2xl text-brand-navy">₹2.5M</div>
                    <div className="text-sm text-brand-blue">Raised This Year</div>
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

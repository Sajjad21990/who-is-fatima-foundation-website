import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Causes } from "@/components/Causes";
import { VolunteerCTA } from "@/components/VolunteerCTA";
import { Events } from "@/components/Events";
import { Testimonials } from "@/components/Testimonials";
import { CounterStats } from "@/components/CounterStats";
import { Blog } from "@/components/Blog";
import { Newsletter } from "@/components/Newsletter";
import { GalleryPreview } from "@/components/GalleryPreview";

export const metadata = {
  title: "Home",
  description: "Who is Fatima Foundation - Empowering the community through education, healthcare, and skill development.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Causes />
      <VolunteerCTA />
      <Events />
      <Testimonials />
      <CounterStats />
      <GalleryPreview />
      <Blog />
      <Newsletter />
    </>
  );
}

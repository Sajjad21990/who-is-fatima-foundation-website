import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Causes } from "../components/Causes";
import { VolunteerCTA } from "../components/VolunteerCTA";
import { Events } from "../components/Events";
import { Testimonials } from "../components/Testimonials";
import { CounterStats } from "../components/CounterStats";
import { Blog } from "../components/Blog";
import { Newsletter } from "../components/Newsletter";
import { GalleryPreview } from "../components/GalleryPreview";
import { SEO } from "../components/SEO";

export function Home() {
    return (
        <>
            <SEO
                title="Home"
                description="Who is Fatima Foundation - Empowering the community through education, healthcare, and skill development."
                canonical="https://whoisfatima.org/"
            />
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

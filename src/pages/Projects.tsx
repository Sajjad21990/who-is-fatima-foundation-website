import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowRight, School, BookOpen, Target } from "lucide-react";
import { SEO } from "../components/SEO";

export function Projects() {
    const projects = [
        {
            title: "Sakina Education & Research Center",
            location: "Mumbai (Malad & Mira Road)",
            description: "Providing modern education and skill development within the Shia community. Located inside Shia Jama Masjids, making education accessible and safe.",
            features: ["Computer Classes", "Educational Workshops", "Digital Literacy"],
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1080&auto=format&fit=crop",
            category: "Skill Development"
        },
        {
            title: "Edulight Global School",
            location: "Jogipura, Madhya Pradesh",
            description: "Giving children in rural areas access to structured education. Affiliated with Delhi Board, focusing on quality teaching and community values.",
            features: ["Nursery to 5th Standard", "Recognized Curriculum", "Community Values"],
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1080&auto=format&fit=crop",
            category: "Formal Education"
        }
    ];

    const futurePlans = [
        {
            title: "Expand SERC in Mumbai",
            description: "Establish an SERC at every Shia Jama Masjid in Mumbai to ensure every child has access to computer education.",
            icon: Target
        },
        {
            title: "Expand Edulight Global School",
            description: "Add higher classes (6th onwards), introduce computer education, and provide scholarships.",
            icon: School
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Our Projects"
                description="Explore our initiatives including Sakina Education & Research Center and Edulight Global School."
                canonical="https://whoisfatima.org/projects"
            />
            {/* Hero Section */}
            <section className="py-20 bg-[#1D3557] text-white">
                <div className="max-w-[1440px] mx-auto px-20 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Work & Projects</h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">
                        Empowering the community through accessible education and skill development centers.
                    </p>
                </div>
            </section>

            {/* Current Projects */}
            <section className="py-20 bg-[#F1FAEE]">
                <div className="max-w-[1440px] mx-auto px-20">
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
                                    <Button className="w-full bg-[#1D3557] text-white hover:bg-[#1D3557]/90">
                                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Future Plans */}
            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="text-center mb-16">
                        <span className="text-[#E63946] font-medium">Our Vision</span>
                        <h2 className="text-3xl lg:text-4xl text-[#1D3557] mt-2">Future Plans</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {futurePlans.map((plan, index) => (
                            <div key={index} className="border border-gray-100 rounded-2xl p-8 hover:border-[#E63946] transition-colors">
                                <div className="w-12 h-12 bg-[#F1FAEE] rounded-xl flex items-center justify-center mb-6">
                                    <plan.icon className="w-6 h-6 text-[#E63946]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1D3557] mb-4">{plan.title}</h3>
                                <p className="text-[#457B9D]">{plan.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

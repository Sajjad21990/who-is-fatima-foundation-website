import { About as AboutComponent } from "../components/About";
import { CounterStats } from "../components/CounterStats";
import { VolunteerCTA } from "../components/VolunteerCTA";
import { Target, Eye, Users, BookOpen } from "lucide-react";
import { SEO } from "../components/SEO";

export function About() {
    return (
        <>
            <SEO
                title="About Us"
                description="Learn about Who is Fatima Foundation's mission, vision, and our dedicated team working to uplift the community."
                canonical="https://whoisfatima.org/about"
            />
            <AboutComponent />

            {/* Vision & Mission */}
            <section className="py-20 bg-[#F1FAEE]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-[#E63946]/10 rounded-xl flex items-center justify-center mb-6">
                                <Eye className="w-6 h-6 text-[#E63946]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1D3557] mb-4">Our Vision</h3>
                            <p className="text-[#457B9D] leading-relaxed">
                                To establish Sakina Education & Research Centers (SERCs) at every Shia Jama Masjid in Mumbai and provide quality education that builds skills, confidence, and opportunities for the next generation.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-[#1D3557]/10 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-[#1D3557]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1D3557] mb-4">Our Mission</h3>
                            <ul className="space-y-3 text-[#457B9D]">
                                <li className="flex gap-3">
                                    <span className="text-[#E63946] font-bold">•</span>
                                    Provide affordable and accessible education to underprivileged children.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[#E63946] font-bold">•</span>
                                    Run schools and learning centers that blend modern education with community values.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[#E63946] font-bold">•</span>
                                    Empower youth with practical skills like computer education.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="py-20 bg-white">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="text-center mb-16">
                        <span className="text-[#E63946] font-medium">Dedicated People</span>
                        <h2 className="text-3xl lg:text-4xl text-[#1D3557] mt-2">Meet Our Team</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full mb-6 overflow-hidden">
                                <Users className="w-full h-full p-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1D3557]">Founder & Director</h3>
                            <p className="text-[#E63946] text-sm mb-3">Visionary Leadership</p>
                            <p className="text-[#457B9D] text-sm">Working to establish education centers across Mumbai and beyond.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full mb-6 overflow-hidden">
                                <BookOpen className="w-full h-full p-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1D3557]">SERC Team</h3>
                            <p className="text-[#E63946] text-sm mb-3">Mumbai</p>
                            <p className="text-[#457B9D] text-sm">Teachers and trainers running computer classes in Malad and Mira Road.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full mb-6 overflow-hidden">
                                <Users className="w-full h-full p-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1D3557]">Edulight Team</h3>
                            <p className="text-[#E63946] text-sm mb-3">Jogipura, MP</p>
                            <p className="text-[#457B9D] text-sm">Qualified teachers managing classes till 5th standard.</p>
                        </div>
                    </div>
                </div>
            </section>

            <CounterStats />
            <VolunteerCTA />
        </>
    );
}

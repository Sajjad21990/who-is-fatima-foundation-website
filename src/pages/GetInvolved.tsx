import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { HandHeart, Users, Briefcase, CheckCircle2 } from "lucide-react";
import { SEO } from "../components/SEO";

export function GetInvolved() {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Get Involved"
                description="Join us as a volunteer, partner, or team member to make a difference in the community."
                canonical="https://whoisfatima.org/get-involved"
            />
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
                </div>
                <div className="max-w-[1440px] mx-auto px-20 relative z-10 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Get Involved</h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        Join us in our mission to uplift the community through education. Whether you volunteer, partner, or work with us, your contribution matters.
                    </p>
                </div>
            </section>

            {/* Volunteer Section */}
            <section id="volunteer" className="py-20">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F1FAEE] rounded-full text-[#E63946] mb-6">
                                <HandHeart className="w-5 h-5" />
                                <span className="font-medium">Volunteer With Us</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl text-[#1D3557] mb-6">Make a Difference</h2>
                            <p className="text-[#457B9D] mb-8 leading-relaxed">
                                Volunteers play a key role in helping us reach more children. Share your skills in teaching, management, or fundraising and be part of a growing movement.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Teach computer classes or support school education",
                                    "Conduct workshops (English, career guidance)",
                                    "Help in event organization",
                                    "Support fundraising campaigns"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-[#1D3557]">
                                        <CheckCircle2 className="w-5 h-5 text-[#E63946]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-[#1D3557] mb-6">Volunteer Sign Up</h3>
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#1D3557]">Full Name</label>
                                        <Input placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#1D3557]">Age</label>
                                        <Input placeholder="25" type="number" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#1D3557]">Phone</label>
                                        <Input placeholder="+1 234 567 8900" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#1D3557]">Email</label>
                                        <Input placeholder="john@example.com" type="email" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1D3557]">Area of Interest</label>
                                    <Input placeholder="Teaching, Events, Admin..." />
                                </div>
                                <Button className="w-full bg-[#E63946] hover:bg-[#E63946]/90 text-white h-12">
                                    Submit Application
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Section */}
            <section id="partner" className="py-20 bg-[#F1FAEE]">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#1D3557] mb-6">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Partner With Us</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl text-[#1D3557] mb-6">Collaborate for Change</h2>
                        <p className="text-[#457B9D]">
                            We invite partnerships with Masjids, schools, and CSR initiatives to expand the reach of education.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Masjids",
                                description: "Open a Sakina Education & Research Center (SERC) inside your Jama Masjid. We provide structure and support."
                            },
                            {
                                title: "Schools",
                                description: "Collaborate to strengthen curriculum, teacher training, and introduce skill-based programs."
                            },
                            {
                                title: "CSR Companies",
                                description: "Support education projects, sponsor classrooms, or fund scholarships under CSR initiatives."
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-[#1D3557] mb-4">{item.title}</h3>
                                <p className="text-[#457B9D] mb-6">{item.description}</p>
                                <Button variant="outline" className="w-full border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white">
                                    Partner With Us
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Careers Section */}
            <section id="careers" className="py-20">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-[#1D3557] text-white p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-6">Apply for a Position</h3>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input className="bg-white/10 border-white/20 text-white placeholder:text-white/50" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Qualification</label>
                                        <Input className="bg-white/10 border-white/20 text-white placeholder:text-white/50" placeholder="Degree / Certification" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Position of Interest</label>
                                        <Input className="bg-white/10 border-white/20 text-white placeholder:text-white/50" placeholder="Teacher, Trainer, Admin..." />
                                    </div>
                                    <Button className="w-full bg-white text-[#1D3557] hover:bg-white/90 h-12">
                                        Apply Now
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F1FAEE] rounded-full text-[#1D3557] mb-6">
                                <Briefcase className="w-5 h-5" />
                                <span className="font-medium">Careers</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl text-[#1D3557] mb-6">Join Our Team</h2>
                            <p className="text-[#457B9D] mb-8 leading-relaxed">
                                We are looking for dedicated educators and support staff. Opportunities available for Teaching Positions, Computer Instructors, and Administrative Roles.
                            </p>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-[#1D3557]">Why Join Us?</h4>
                                <ul className="space-y-2">
                                    {[
                                        "Mission-driven NGO environment",
                                        "Direct impact on children's lives",
                                        "Opportunities for growth and training",
                                        "Supportive community"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3 text-[#457B9D]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

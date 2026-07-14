import { About as AboutComponent } from "@/components/About";
import { CounterStats } from "@/components/CounterStats";
import { VolunteerCTA } from "@/components/VolunteerCTA";
import { Target, Eye, Users, BookOpen } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about Who is Fatima Foundation's mission, vision, and our dedicated team working to uplift the community.",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">About Who is Fatima Foundation</h1>
      <AboutComponent />

      {/* Vision & Mission */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative bg-gradient-to-br from-brand-navy to-brand-navy-2 p-8 rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-white/70 leading-relaxed">
                  To establish Sakina Education & Research Centers (SERCs) at every Shia Jama Masjid in Mumbai and provide quality education that builds skills, confidence, and opportunities for the next generation.
                </p>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-brand-navy to-brand-navy-2 p-8 rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex gap-3">
                    <span className="text-brand-red font-bold">•</span>
                    Provide affordable and accessible education to underprivileged children.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-red font-bold">•</span>
                    Run schools and learning centers that blend modern education with community values.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-red font-bold">•</span>
                    Empower youth with practical skills like computer education.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <span className="text-brand-red font-medium">Dedicated People</span>
            <h2 className="text-3xl lg:text-4xl text-brand-navy mt-2">Meet Our Team</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Anwar Merchant */}
            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="p-8 flex justify-center bg-white border-b border-gray-100">
                <img
                  src="/images/team/anwar-merchant.png"
                  alt="Mr. Anwar Merchant"
                  className="rounded-full object-cover object-top shadow-lg border-4 border-white w-36 h-36 sm:w-48 sm:h-48"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-navy mb-1">Mr. Anwar Merchant</h3>
                <p className="text-brand-red font-medium mb-6">Chairman & Founder</p>

                <div className="space-y-6 text-sm text-brand-blue">
                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Education</h4>
                    <p>B.Com – Mumbai University</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Social Involvement</h4>
                    <ul className="space-y-1 list-disc pl-4 marker:text-brand-red">
                      <li>Trustee – Twelve Lamp Charitable Trust</li>
                      <li>Trustee – Saqqaye Sakina Trust</li>
                      <li>Coordinator – Construction of Haidery & Baqariya Jama Masjid</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Contributions</h4>
                    <p>Active in community welfare for 10+ years: paying school fees, ration distribution, and medical assistance.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Business</h4>
                    <p>Proprietor: Central Impax, Covera Agro | Partner: Fortune Reclaim</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Abrar Husain Syed */}
            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="p-8 flex justify-center bg-white border-b border-gray-100">
                <img
                  src="/images/team/abrar.jpg"
                  alt="Mr. Abrar Husain Syed"
                  className="rounded-full object-cover object-top shadow-lg border-4 border-white w-36 h-36 sm:w-48 sm:h-48"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-navy mb-1">Mr. Abrar Husain Syed</h3>
                <p className="text-brand-red font-medium mb-6">Founder</p>

                <div className="space-y-6 text-sm text-brand-blue">
                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Education</h4>
                    <p>B.A. (Hons) – Mumbai University</p>
                    <p>Diploma Sanitary Instructor & L.S.G.D.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Key Roles</h4>
                    <ul className="space-y-1 list-disc pl-4 marker:text-brand-red">
                      <li>Gen. Secretary – Mumbai Suburban Social Welfare Committee</li>
                      <li>Founder & CEO – Prof Sompson's Teacher Training Institute</li>
                      <li>Founder – Who is Fatima S.A. Foundation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Visionary Projects</h4>
                    <p className="mb-2">Founder of "Super-20" Mission (Competitive exam prep) at Baqariya & Haidery Jama Masjid.</p>
                    <p>Aiming to establish Hazrat Fatima Women's University.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2 uppercase tracking-wide text-xs">Business</h4>
                    <p>MD – Yawar Property Developers | Director – Next Unified Infotech</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CounterStats />
      <VolunteerCTA />
    </>
  );
}

import { HandHeart, CheckCircle2 } from "lucide-react";
import { VolunteerForm } from "@/components/VolunteerForm";
import { volunteers } from "@/lib/config/volunteers";

export const metadata = {
  title: "Volunteer",
  description: "Join us as a volunteer to make a difference in the community through education.",
};

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Volunteer With Us</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join our mission to uplift the community through education. Your time and skills can transform lives.
          </p>
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F1FAEE] rounded-full text-[#E63946] mb-6">
                <HandHeart className="w-5 h-5" />
                <span className="font-medium">Make a Difference</span>
              </div>
              <h2 className="text-3xl lg:text-4xl text-[#1D3557] mb-6">Why Volunteer?</h2>
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

            {/* Volunteer Form */}
            <VolunteerForm />
          </div>
        </div>
      </section>

      {/* Volunteer Spotlights Section */}
      <section className="py-20 bg-[#F1FAEE]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mb-4">Meet Our Volunteers</h2>
            <p className="text-[#457B9D] max-w-2xl mx-auto">
              Dedicated individuals making a difference in the lives of children through education.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {volunteers.map((volunteer, index) => (
              <div key={index} className="text-center">
                {/* Avatar Container */}
                <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center overflow-hidden mx-auto shadow-md border border-gray-100">
                  {volunteer.avatar ? (
                    <img src={volunteer.avatar} alt={volunteer.name} className="w-20 h-20 object-contain" />
                  ) : (
                    <span className="text-4xl font-bold text-[#1D3557]">{volunteer.initial}</span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-semibold text-lg text-[#1D3557] mt-4">{volunteer.name}</h3>

                {/* Designation */}
                <p className="text-[#E63946] text-sm mt-1 font-medium">{volunteer.designation}</p>
              </div>
            ))}
          </div>

          {/* Icon Attributions */}
          <p style={{ backgroundColor: 'transparent', marginTop: '50px', opacity: 0.1 }}>
            Icons by{" "}
            <a href="https://www.flaticon.com/free-icons/influencer" className="hover:text-[#457B9D]/50" target="_blank" rel="noopener noreferrer">srip</a>
            {" & "}
            <a href="https://www.flaticon.com/free-icons/computer" className="hover:text-[#457B9D]/50" target="_blank" rel="noopener noreferrer">Freepik</a>
            {" - Flaticon"}
          </p>
        </div>
      </section>

    </div>
  );
}

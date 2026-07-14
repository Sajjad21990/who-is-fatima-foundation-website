import { Button } from "@/components/ui/button";
import { Heart, CreditCard, Landmark, FileCheck, Scroll, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Donate",
  description: "Support our cause. Your donation helps provide education and essential services to those in need.",
};

export default function DonatePage() {
  const donationOptions = [
    {
      title: "Sponsor a Child (Tuition)",
      description: "Edulight Global Academy - 750 x 12 (9,000) + 1,500 term fees. Total ₹10,500/-",
      icon: User,
      action: "Sponsor"
    },
    {
      title: "Full Child Sponsorship",
      description: "Edulight Global Academy - Term fees (10,500) + Books, Bag, Uniform & Stationary (2,500). Total ₹13,000/- yearly.",
      icon: Heart,
      action: "Sponsor Yearly"
    },
    {
      title: "Donate a Classroom",
      description: "Edulight Global Academy is under construction. Donate ₹5 Lacs and become a one-time donor of a classroom.",
      icon: Landmark,
      action: "Become a Donor"
    },
    {
      title: "Sponsor a SERC Centre",
      description: "Support an entire Special Education Research Center for ₹48,000/- per month.",
      icon: Landmark,
      action: "Partner"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-brand-navy text-white text-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <Heart className="w-16 h-16 text-brand-red mx-auto mb-6 fill-brand-red" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Support Our Cause</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            "Your support helps a child study." Every contribution brings us closer to our mission of educating the community.
          </p>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationOptions.map((option, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center mb-6">
                  <option.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{option.title}</h3>
                <p className="text-brand-blue text-sm mb-6 min-h-[60px]">{option.description}</p>
                <Button asChild className="w-full bg-white border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
                  <a href="#ways-to-donate">{option.action}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Donate */}
      <section id="ways-to-donate" className="py-20 bg-brand-cream scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Online Payment */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-brand-red" />
                </div>
                <h2 className="text-2xl font-bold text-brand-navy">Online Donation</h2>
              </div>
              <p className="text-brand-blue mb-6">
                Secure and quick payments via UPI, Credit/Debit Cards, Net Banking, and Wallets.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["Google Pay", "PhonePe", "Paytm", "Cards"].map((method, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600 font-medium">
                    {method}
                  </span>
                ))}
              </div>
              <Button asChild className="w-full bg-brand-red text-white hover:bg-brand-red/90 h-12">
                <a href="#bank-transfer">Donate via UPI / Bank</a>
              </Button>
            </div>

            {/* Bank Transfer */}
            <div id="bank-transfer" className="bg-white p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-brand-navy" />
                </div>
                <h2 className="text-2xl font-bold text-brand-navy">Bank Transfer</h2>
              </div>
              <p className="text-brand-blue mb-6">
                Directly transfer funds to our NGO bank account.
              </p>
              <div className="space-y-3 bg-gray-50 p-6 rounded-xl text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Account Name</span>
                  <span className="font-medium text-brand-navy">WHO IS FATIMA FOUNDATION</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Account Number</span>
                  <span className="font-medium text-brand-navy">923010056415480</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Bank Name</span>
                  <span className="font-medium text-brand-navy">Axis Bank</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">IFSC Code</span>
                  <span className="font-medium text-brand-navy">UTIB0003024</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Branch</span>
                  <span className="font-medium text-brand-navy">Orlem, Malad West</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">UPI ID</span>
                  <span className="font-medium text-brand-navy">foundation@upi</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <span className="text-sm font-medium text-brand-navy mb-3">Scan to Pay via UPI</span>
                <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <img
                    src="/images/common/qr.jpg"
                    alt="UPI QR Code"
                    className="w-32 sm:w-48 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">Tax Benefits</h3>
                </div>
                <p className="text-brand-blue leading-relaxed">
                  Maximize your impact with tax benefits. We are registered under sections <span className="font-semibold text-brand-navy">12A & 80G</span>, so you receive tax benefits on every donation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-navy/10 rounded-lg flex items-center justify-center">
                    <Scroll className="w-5 h-5 text-brand-navy" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">Religious Dues</h3>
                </div>
                <ul className="space-y-2 text-brand-blue">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                    <span>We have <a href="/images/common/ijaza.jpg" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-navy hover:text-brand-red underline decoration-dotted underline-offset-4">Ejaza</a> to collect Sahme Imam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                    <span>We accept <span className="font-semibold text-brand-navy">Sahme Sadat</span> for Sadat students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                    <span>We accept <span className="font-semibold text-brand-navy">Sadqa</span> of Imame Zamana (atfs)</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <a
                    href="/images/common/ijaza.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-brand-red font-medium hover:underline gap-1"
                  >
                    Check Ijaza from Grand Ayatullah Sayyid Ali Husaini Sistani
                    <Scroll className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

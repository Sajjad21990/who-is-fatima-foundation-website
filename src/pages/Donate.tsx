import { Button } from "../components/ui/button";
import { Heart, CreditCard, Landmark, FileCheck, Scroll, Calendar, User } from "lucide-react";
import { SEO } from "../components/SEO";

export function Donate() {
    const donationOptions = [
        {
            title: "One-Time Donation",
            description: "A single contribution to support our ongoing projects and immediate needs.",
            icon: Heart,
            action: "Donate Now"
        },
        {
            title: "Monthly Support",
            description: "Become a monthly supporter to help us run schools and centers smoothly.",
            icon: Calendar,
            action: "Subscribe"
        },
        {
            title: "Sponsor a Child",
            description: "Cover the education cost of one child including books, fees, and basic needs.",
            icon: User,
            action: "Sponsor"
        },
        {
            title: "Sponsor a Center",
            description: "Support an entire SERC center covering rent, salaries, and materials.",
            icon: Landmark,
            action: "Partner"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Donate"
                description="Support our cause. Your donation helps provide education and essential services to those in need."
                canonical="https://whoisfatima.org/donate"
            />
            {/* Hero Section */}
            <section className="py-20 bg-[#1D3557] text-white text-center">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <Heart className="w-16 h-16 text-[#E63946] mx-auto mb-6 fill-[#E63946]" />
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Support Our Cause</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                        "Your support helps a child study." Every contribution brings us closer to our mission of educating the community.
                    </p>
                </div>
            </section>

            {/* Donation Options */}
            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {donationOptions.map((option, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-[#F1FAEE] rounded-xl flex items-center justify-center mb-6">
                                    <option.icon className="w-6 h-6 text-[#E63946]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1D3557] mb-3">{option.title}</h3>
                                <p className="text-[#457B9D] text-sm mb-6 min-h-[60px]">{option.description}</p>
                                <Button className="w-full bg-white border-2 border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white">
                                    {option.action}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ways to Donate */}
            <section className="py-20 bg-[#F1FAEE]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Online Payment */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#E63946]/10 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-[#E63946]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#1D3557]">Online Donation</h2>
                            </div>
                            <p className="text-[#457B9D] mb-6">
                                Secure and quick payments via UPI, Credit/Debit Cards, Net Banking, and Wallets.
                            </p>
                            <div className="flex gap-4 mb-8">
                                {["Google Pay", "PhonePe", "Paytm", "Cards"].map((method, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600 font-medium">
                                        {method}
                                    </span>
                                ))}
                            </div>
                            <Button className="w-full bg-[#E63946] text-white hover:bg-[#E63946]/90 h-12">
                                Donate Online Now
                            </Button>
                        </div>

                        {/* Bank Transfer */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#1D3557]/10 rounded-full flex items-center justify-center">
                                    <Landmark className="w-6 h-6 text-[#1D3557]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#1D3557]">Bank Transfer</h2>
                            </div>
                            <p className="text-[#457B9D] mb-6">
                                Directly transfer funds to our NGO bank account.
                            </p>
                            <div className="space-y-3 bg-gray-50 p-6 rounded-xl text-sm">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Account Name</span>
                                    <span className="font-medium text-[#1D3557]">Who is Fatima Foundation</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Account Number</span>
                                    <span className="font-medium text-[#1D3557]">XXXXXXXXXXXX</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Bank Name</span>
                                    <span className="font-medium text-[#1D3557]">Your Bank Name</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">IFSC Code</span>
                                    <span className="font-medium text-[#1D3557]">XXXX0000000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">UPI ID</span>
                                    <span className="font-medium text-[#1D3557]">foundation@upi</span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col items-center">
                                <span className="text-sm font-medium text-[#1D3557] mb-3">Scan to Pay via UPI</span>
                                <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <img
                                        src="/images/common/qr.jpg"
                                        alt="UPI QR Code"
                                        className="w-48 h-auto"
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
                                    <div className="w-10 h-10 bg-[#E63946]/10 rounded-lg flex items-center justify-center">
                                        <FileCheck className="w-5 h-5 text-[#E63946]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1D3557]">Tax Benefits</h3>
                                </div>
                                <p className="text-[#457B9D] leading-relaxed">
                                    Maximize your impact with tax benefits. We are registered under sections <span className="font-semibold text-[#1D3557]">12A & 80G</span>. get benefit on every donation.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#1D3557]/10 rounded-lg flex items-center justify-center">
                                        <Scroll className="w-5 h-5 text-[#1D3557]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1D3557]">Religious Dues</h3>
                                </div>
                                <ul className="space-y-2 text-[#457B9D]">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0" />
                                        <span>We have <a href="/images/common/ijaza.jpg" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1D3557] hover:text-[#E63946] underline decoration-dotted underline-offset-4">Ejaza</a> to collect Sahme Imam</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0" />
                                        <span>We accept <span className="font-semibold text-[#1D3557]">Sahme Sadat</span> for Sadat students</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0" />
                                        <span>We accept <span className="font-semibold text-[#1D3557]">Sadqa</span> of Imame Zamana (atfs)</span>
                                    </li>
                                </ul>
                                <div className="pt-2">
                                    <a
                                        href="/images/common/ijaza.jpg"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-[#E63946] font-medium hover:underline gap-1"
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

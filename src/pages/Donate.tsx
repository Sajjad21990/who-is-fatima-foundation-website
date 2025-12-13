import { Button } from "../components/ui/button";
import { Heart, CreditCard, Landmark, Gift, Calendar, User } from "lucide-react";
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
                <div className="max-w-[1440px] mx-auto px-20">
                    <Heart className="w-16 h-16 text-[#E63946] mx-auto mb-6 fill-[#E63946]" />
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Support Our Cause</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                        "Your support helps a child study." Every contribution brings us closer to our mission of educating the community.
                    </p>
                </div>
            </section>

            {/* Donation Options */}
            <section className="py-20">
                <div className="max-w-[1440px] mx-auto px-20">
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
                <div className="max-w-[1440px] mx-auto px-20">
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
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F1FAEE]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#E63946] to-[#FF6B6B] rounded-3xl p-12 lg:p-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white rounded-full"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl lg:text-4xl text-white">
                Subscribe to Our Newsletter
              </h2>

              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Get the latest updates on our projects, success stories, and ways
                you can make a difference. Join our community today!
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white border-none h-14 px-6 text-[#1D3557] placeholder:text-[#457B9D]"
                  />
                  <Button
                    type="submit"
                    className="bg-[#1D3557] text-white hover:bg-[#1D3557]/90 h-14 px-8 whitespace-nowrap"
                  >
                    Subscribe Now
                  </Button>
                </div>
                <p className="text-sm text-white/70 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

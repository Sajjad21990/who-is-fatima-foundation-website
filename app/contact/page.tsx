import { MapPin, Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Who is Fatima Foundation. We are here to answer your queries and welcome your support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-brand-navy text-white text-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us for any queries, support, or feedback.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-brand-navy mb-6">Get in Touch</h2>
                <p className="text-brand-blue mb-8">
                  Have questions about our programs or want to get involved? We are here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-3">Our Centers</h3>
                    <div className="flex flex-col gap-4 text-brand-blue text-sm">
                      <div>
                        <p className="font-medium text-brand-navy mb-0.5">Baqariya Shia Jama Masjid</p>
                        <p>Malwani, Mumbai</p>
                      </div>
                      <div>
                        <p className="font-medium text-brand-navy mb-0.5">Haidery Shia Jama Masjid</p>
                        <p>Mira Road</p>
                      </div>
                      <div>
                        <p className="font-medium text-brand-navy mb-0.5">Dargah E Najaf E Hind</p>
                        <p>Jogipura, Bijnore UP</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-1">Phone / WhatsApp</h3>
                    <p className="text-brand-blue">9920111072</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-1">Email Us</h3>
                    <p className="text-brand-blue">admin@whoisfatima.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

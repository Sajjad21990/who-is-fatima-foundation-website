import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Projects", href: "/projects" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" }
  ];

  const projects = [
    { label: "Sakina Education Center", href: "/projects" },
    { label: "Edulight Global Academy", href: "/projects/edulight-global-academy" },
    { label: "Computer Literacy", href: "/projects" },
    { label: "Skill Development", href: "/projects" },
    { label: "Community Outreach", href: "/projects" }
  ];

  const resources = [
    { label: "Become a Volunteer", href: "/volunteer" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" }
  ];

  const socialLinks = [
    { icon: Youtube, href: "https://youtube.com/@whoisfatima_org?si=ou2yq1VMVpkgkhA8", label: "YouTube" },
    { icon: Facebook, href: "https://www.facebook.com/share/1AFBAeJawu/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/whoisfatima_org?igsh=YW03d2Y1dDM5anZu", label: "Instagram" }
  ];

  return (
    <footer className="bg-[#1D3557] text-white">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Who is Fatima Foundation" className="h-12 w-auto" />
              <span className="text-white font-semibold text-xl">Who is Fatima</span>
            </div>

            <p className="text-white/70 leading-relaxed">
              "Deen ke sath, Duniya bhi." Uplifting the community through education and skill development.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Malwani & Mira Road (Mumbai)<br />Jogipura, Bijnore (UP)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>9920111072</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>admin@whoisfatima.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-white mb-6">Our Projects</h3>
            <ul className="space-y-3">
              {projects.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/70 text-sm">
              Follow us on social media for updates
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-[#E63946] rounded-full flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#0F1F2F] py-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-[#E63946] fill-[#E63946]" /> by Who is Fatima Foundation
            </p>
            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} Who is Fatima. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

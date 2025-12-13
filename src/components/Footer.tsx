import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Projects", href: "/projects" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Donate", href: "/donate" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" }
  ];

  const projects = [
    { label: "Sakina Education Center", href: "/projects" },
    { label: "Edulight Global School", href: "/projects" },
    { label: "Computer Literacy", href: "/projects" },
    { label: "Skill Development", href: "/projects" },
    { label: "Community Outreach", href: "/projects" }
  ];

  const resources = [
    { label: "Volunteer", href: "/get-involved#volunteer" },
    { label: "Partner With Us", href: "/get-involved#partner" },
    { label: "Careers", href: "/get-involved#careers" },
    { label: "FAQs", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-[#1D3557] text-white">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-20 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
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
                <span>Malad & Mira Road (Mumbai)<br />Jogipura (MP)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@whoisfatima.org</span>
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
                    to={link.href}
                    className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Projects */}
          <div>
            <h3 className="text-white mb-6">Our Projects</h3>
            <ul className="space-y-3">
              {projects.map((project, index) => (
                <li key={index}>
                  <Link
                    to={project.href}
                    className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                  >
                    {project.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white mb-6">Get Involved</h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  {resource.href.startsWith("/") ? (
                    <Link
                      to={resource.href}
                      className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                    >
                      {resource.label}
                    </Link>
                  ) : (
                    <a
                      href={resource.href}
                      className="text-white/70 hover:text-[#E63946] transition-colors text-sm"
                    >
                      {resource.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-white/70">
              © 2025 HopeGive. All rights reserved. Built with ❤️ for a better world.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-[#E63946] rounded-full flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

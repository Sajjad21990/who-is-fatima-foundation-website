'use client'

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Who is Fatima Foundation" className="h-12 w-auto" />
            <span className="text-[#E63946] font-semibold text-xl">Who is Fatima</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`transition-colors ${isActive('/') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Home</Link>
            <Link href="/about" className={`transition-colors ${isActive('/about') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>About</Link>
            <Link href="/projects" className={`transition-colors ${isActive('/projects') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Projects</Link>
            <Link href="/events" className={`transition-colors ${isActive('/events') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Events</Link>
            <Link href="/volunteer" className={`transition-colors ${isActive('/volunteer') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Volunteer</Link>
            <Link href="/gallery" className={`transition-colors ${isActive('/gallery') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Gallery</Link>
            <Link href="/blog" className={`transition-colors ${isActive('/blog') || pathname?.startsWith('/blog/') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Blog</Link>
            <Link href="/contact" className={`transition-colors ${isActive('/contact') ? 'text-[#E63946]' : 'text-[#1D3557] hover:text-[#E63946]'}`}>Contact</Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/donate">
              <Button
                className="bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white hover:opacity-90 px-8 py-6"
              >
                Donate Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1D3557]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/about" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link href="/projects" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</Link>
              <Link href="/events" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Events</Link>
              <Link href="/volunteer" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Volunteer</Link>
              <Link href="/gallery" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <Link href="/blog" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link href="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button
                  className="bg-gradient-to-r from-[#E63946] to-[#FF6B6B] text-white hover:opacity-90 w-full"
                >
                  Donate Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

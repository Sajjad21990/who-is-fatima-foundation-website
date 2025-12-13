import { Button } from "./ui/button";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Who is Fatima Foundation" className="h-12 w-auto" />
            <span className="text-[#E63946] font-semibold text-xl">Who is Fatima</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[#1D3557] hover:text-[#E63946] transition-colors">Home</Link>
            <Link to="/about" className="text-[#1D3557] hover:text-[#E63946] transition-colors">About</Link>
            <Link to="/projects" className="text-[#1D3557] hover:text-[#E63946] transition-colors">Projects</Link>
            <Link to="/get-involved" className="text-[#1D3557] hover:text-[#E63946] transition-colors">Get Involved</Link>
            <Link to="/gallery" className="text-[#1D3557] hover:text-[#E63946] transition-colors">Gallery</Link>
            <Link to="/blog" className="text-[#1D3557] hover:text-[#E63946] transition-colors">Blog</Link>
            <Link to="/contact" className="text-[#1D3557] hover:text-[#E63946] transition-colors">Contact</Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/donate">
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
              <Link to="/" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/projects" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</Link>
              <Link to="/get-involved" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Get Involved</Link>
              <Link to="/gallery" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <Link to="/blog" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link to="/contact" className="text-[#1D3557] hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
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


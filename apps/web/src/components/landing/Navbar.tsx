"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-4 z-50 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? "translate-y-[-4px]" : ""
      }`}
    >
      {/* Outer rounded container making the navbar float */}
      <div className={`relative overflow-hidden rounded-[24px] border border-[#E8E1D3]/70 shadow-xs transition-all duration-300 py-3.5 px-6 sm:px-8`}>
        
        {/* Background Image Layer matching Hero (Static) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/bghero.webp"
            alt="Navbar Background"
            className="w-full h-full object-cover opacity-[0.95]"
          />
          {/* Blending overlay with backdrop-blur */}
          <div className="absolute inset-0 bg-[#FAF9F6]/30 backdrop-blur-md" />
        </div>

        {/* Content Container (relative z-10 to render above bg) */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Logo */}
          <a href="#" onClick={scrollToTop} className="flex items-center gap-2.5 group cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Kimito Logo"
              width={38}
              height={38}
              className="w-9.5 h-9.5 object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-[#1D1B16]">
                kimito
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Características", href: "#features" },
              { label: "Cómo Funciona", href: "#how-it-works" },
              { label: "Marketplace", href: "#marketplace" },
              { label: "Reputación", href: "#reputation" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 text-sm font-semibold text-[#1D1B16]/70 hover:text-[#1D1B16] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#855300] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Button: Google Sign-in Styled, Static */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 bg-[#EFE9DB] hover:bg-[#E2D9C6] text-[#1D1B16] border border-[#1D1B16] text-sm font-semibold px-5 py-2 rounded-full shadow-xs transition-all duration-200"
            >
              {/* Google Icon SVG */}
              <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Empieza con Google</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#1D1B16] hover:bg-[#F4EFE6] transition-colors relative z-20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown inside the rounded container */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E1D3] mt-4 pt-4 pb-2 space-y-4 animate-in slide-in-from-top-4 duration-200 relative z-10">
            <nav className="flex flex-col space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1D1B16]/80 hover:text-[#1D1B16] hover:bg-[#F4EFE6] rounded-xl transition-colors"
              >
                Características
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1D1B16]/80 hover:text-[#1D1B16] hover:bg-[#F4EFE6] rounded-xl transition-colors"
              >
                Cómo Funciona
              </a>
              <a
                href="#marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1D1B16]/80 hover:text-[#1D1B16] hover:bg-[#F4EFE6] rounded-xl transition-colors"
              >
                Marketplace
              </a>
              <a
                href="#reputation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1D1B16]/80 hover:text-[#1D1B16] hover:bg-[#F4EFE6] rounded-xl transition-colors"
              >
                Reputación
              </a>
            </nav>
            <div className="pt-2 border-t border-[#E8E1D3] flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#EFE9DB] hover:bg-[#E2D9C6] text-[#1D1B16] border border-[#1D1B16] text-base font-semibold py-3 rounded-full shadow-xs"
              >
                {/* Google Icon SVG */}
                <svg className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Empieza con Google</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

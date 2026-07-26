"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF9F6]/85 backdrop-blur-md border-b border-[#E8E1D3]/70 shadow-xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
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
              <span className="text-2xl font-black text-[#F59E0B]">.</span>
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

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#855300] hover:bg-[#6C4300] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md shadow-[#855300]/20 hover:shadow-lg hover:shadow-[#855300]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#1D1B16] hover:bg-[#F4EFE6] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E1D3] bg-[#FAF9F6] px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
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
              className="w-full inline-flex items-center justify-center gap-2 bg-[#855300] text-white text-base font-bold py-3 rounded-full shadow-md"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

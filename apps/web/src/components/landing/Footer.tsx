"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="reputation" className="bg-[#1D1B16] text-[#CDC5B4] border-t border-[#4D4639] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#4D4639]/70">
          {/* Column 1: Brand & Bio - 6 cols */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Kimito Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight text-white">
                  kimito
                </span>
                <span className="text-2xl font-black text-[#F59E0B]">.</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[#CDC5B4]/80 max-w-md">
              La plataforma definitiva para organizar y gestionar la limpieza de áreas comunes en casas compartidas mediante reparto justo, evidencia fotográfica y pasaporte de reputación.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* GitHub SVG */}
              <a
                href="https://github.com/PatoCrazy2/kimito"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2823] border border-[#4D4639] flex items-center justify-center text-[#CDC5B4] hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* Twitter / X SVG */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2823] border border-[#4D4639] flex items-center justify-center text-[#CDC5B4] hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2823] border border-[#4D4639] flex items-center justify-center text-[#CDC5B4] hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Producto - 3 cols */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Producto
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-[#F59E0B] transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">
                  Algoritmo Equitativo
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-[#F59E0B] transition-colors">
                  Marketplace Roommates
                </a>
              </li>
              <li>
                <a href="#reputation" className="hover:text-[#F59E0B] transition-colors">
                  Pasaporte de Reputación
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Acceso - 3 cols */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Acceso
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="text-[#F59E0B] font-bold hover:underline">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#F59E0B] transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#CDC5B4]/60 gap-4">
          <p>© 2026 Kimito. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

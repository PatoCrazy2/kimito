"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="reputation" className="relative overflow-hidden border-t border-[#E8E1D3] pt-16 pb-12 bg-[#FAF9F6]">
      {/* Static Background Image (No Animation) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/bghero.webp"
          alt="Footer Background"
          className="w-full h-full object-cover opacity-[0.95]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E8E1D3]/70">
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
                <span className="text-2xl font-black tracking-tight text-[#1D1B16]">
                  kimito
                </span>
                <span className="text-2xl font-black text-[#1D1B16]">.</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[#6b6659]/95 max-w-md font-medium">
              La plataforma definitiva para organizar y gestionar la limpieza de áreas comunes en casas compartidas mediante reparto justo, evidencia fotográfica y pasaporte de reputación.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* GitHub SVG */}
              <a
                href="https://github.com/PatoCrazy2/kimito"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#EFE9DB]/70 border border-[#E8E1D3] flex items-center justify-center text-[#6b6659] hover:text-[#1D1B16] hover:border-[#1D1B16] transition-colors backdrop-blur-xs"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Producto - 3 cols */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1D1B16]">
              Producto
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#features" className="hover:text-[#1D1B16] transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#1D1B16] transition-colors">
                  Algoritmo Equitativo
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-[#1D1B16] transition-colors">
                  Marketplace Roommates
                </a>
              </li>
              <li>
                <a href="#reputation" className="hover:text-[#1D1B16] transition-colors">
                  Pasaporte de Reputación
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Acceso - 3 cols */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1D1B16]">
              Acceso
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/login" className="text-[#1D1B16] font-bold hover:underline">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#1D1B16] transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b6659]/80 gap-4 font-medium">
          <p>© 2026 Kimito. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

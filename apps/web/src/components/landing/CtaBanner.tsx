"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#006B5F] via-[#00574D] to-[#004A41] text-white rounded-[32px] p-8 sm:p-12 md:p-16 shadow-2xl shadow-[#006B5F]/20">
          {/* Decorative Background Patterns */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[30px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[20px] border-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Transforma la convivencia hoy</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Listo para vivir en una casa limpia y sin discusiones?
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              Únete a Kimito hoy mismo. Organiza tu hogar con el algoritmo equitativo y empieza a construir tu reputación como roommate en menos de 2 minutos.
            </p>

            {/* CTA Button */}
            <div className="pt-4 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-3 bg-[#F59E0B] hover:bg-[#E08E00] text-[#1D1B16] text-base font-extrabold px-8 py-4 rounded-full shadow-lg shadow-[#F59E0B]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Google Icon SVG */}
                <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
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
                <span>Empieza Gratis con Google</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

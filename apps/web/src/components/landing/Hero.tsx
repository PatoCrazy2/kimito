"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Hero() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev);
    }, 4000); // 4 seconds interval for a slower, calmer transition
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 mb-16 sm:mb-24 select-none">
      {/* GPU Optimized Keyframes & Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bg-pan-zoom {
          0% { transform: translate(-15px, -12px) scale(1.02); }
          50% { transform: translate(15px, 12px) scale(1.06); }
          100% { transform: translate(-15px, -12px) scale(1.02); }
        }
        .animate-bg-pan-zoom {
          animation: bg-pan-zoom 30s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes grain-shift {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 1%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-1%, 2%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(2%, -1%); }
          70% { transform: translate(1%, 1%); }
          80% { transform: translate(-1%, -1%); }
          90% { transform: translate(1%, 1%); }
        }
        .animate-grain {
          animation: grain-shift 8s steps(6) infinite;
          will-change: transform;
        }

        @keyframes float-gradient-a {
          0% { transform: translate(-5%, -5%) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.08); }
          100% { transform: translate(-5%, -5%) scale(1); }
        }
        @keyframes float-gradient-b {
          0% { transform: translate(5%, 5%) scale(1.08); }
          50% { transform: translate(-5%, -5%) scale(1); }
          100% { transform: translate(5%, 5%) scale(1.08); }
        }
        .animate-grad-a {
          animation: float-gradient-a 25s ease-in-out infinite;
          will-change: transform;
        }
        .animate-grad-b {
          animation: float-gradient-b 28s ease-in-out infinite;
          will-change: transform;
        }
      `}} />

      {/* Main Hero Container ("Stage") */}
      <div className="relative w-full overflow-hidden rounded-[32px] border border-[#E8E1D3]/60 bg-[#FAF9F6] shadow-sm min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center items-center text-center p-6 sm:p-12 md:p-24">
        
        {/* Layer 1: GPU Animated Background Image (z-0 to render on top of container bg) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/bghero.webp"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-[0.95] animate-bg-pan-zoom"
          />
        </div>

        {/* Layer 2: Slow-Moving Ambient CSS Radial Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-color-burn">
          {/* Amber Gradient */}
          <div 
            className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(133,83,0,0.06)_0%,transparent_70%)] animate-grad-a"
          />
          {/* Warm Cream / Light Terracotta Gradient */}
          <div 
            className="absolute -bottom-[20%] -right-[10%] w-[85%] h-[85%] rounded-full bg-[radial-gradient(circle_at_center,rgba(172,52,0,0.04)_0%,transparent_70%)] animate-grad-b"
          />
        </div>

        {/* Layer 3: Animated Grain/Noise Overlay */}
        <div className="absolute inset-[-50%] z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light overflow-hidden">
          <div 
            className="w-[200%] h-[200%] animate-grain"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Layer 4: Content Overlay (z-10 to stay on top of the background layers) */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center px-4">
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1] text-[#1D1B16] font-normal mb-6">
            <span className="font-serif italic block sm:inline text-[#1D1B16]/90">Hogar compartido,</span>
            <span className="font-sans font-black block sm:inline sm:ml-4 text-[#1D1B16]">paz mental garantizada.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#1D1B16]/75 font-normal max-w-xl leading-relaxed mb-10 sm:mb-12">
            Equilibra las tareas domésticas y valida el cumplimiento para una convivencia perfecta.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-3.5">
            <Link
              href="/login"
              className="relative inline-flex items-center justify-center bg-[#EFE9DB] hover:bg-[#E2D9C6] text-[#1D1B16] border border-[#1D1B16] text-base font-semibold rounded-full shadow-sm hover:shadow transition-all duration-300 w-72 h-14 overflow-hidden"
            >
              {/* Slide-in Logo State */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{
                  opacity: showLogo ? 1 : 0,
                  transform: showLogo ? "translateY(0)" : "translateY(25px)",
                }}
              >
                <img
                  src="/logo.svg"
                  alt="Kimito Logo"
                  className="w-9 h-9 filter grayscale contrast-200"
                />
              </div>

              {/* Slide-in Text State */}
              <div
                className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500 ease-in-out"
                style={{
                  opacity: !showLogo ? 1 : 0,
                  transform: !showLogo ? "translateY(0)" : "translateY(-25px)",
                }}
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
                <span>Empieza gratis con Google</span>
              </div>
            </Link>
            <p className="text-xs text-[#1D1B16]/50 tracking-wide">
              Disponible para web y dispositivos móviles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function AppPreloader() {
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Stage 1: Trigger fade-out animation after 1.4s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1400);

    // Stage 2: Completely unmount component after animation ends (2.1s total)
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
    }, 2100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#FAF9F6] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-out select-none pointer-events-none ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* GPU Optimized Keyframes & Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes preloader-logo-spin {
          0% { transform: rotate(0deg) scale(0.95); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(0.95); }
        }
        .animate-preloader-logo {
          animation: preloader-logo-spin 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        @keyframes preloader-grain-shift {
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
        .animate-preloader-grain {
          animation: preloader-grain-shift 8s steps(6) infinite;
          will-change: transform;
        }

        @keyframes preloader-gradient-pulse-a {
          0% { transform: translate(-5%, -5%) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.15); }
          100% { transform: translate(-5%, -5%) scale(1); }
        }
        @keyframes preloader-gradient-pulse-b {
          0% { transform: translate(5%, 5%) scale(1.15); }
          50% { transform: translate(-5%, -5%) scale(1); }
          100% { transform: translate(5%, 5%) scale(1.15); }
        }
        .animate-preloader-grad-a {
          animation: preloader-gradient-pulse-a 12s ease-in-out infinite;
          will-change: transform;
        }
        .animate-preloader-grad-b {
          animation: preloader-gradient-pulse-b 14s ease-in-out infinite;
          will-change: transform;
        }
      `}} />

      {/* Layer 1: Static Hero Background Image (No blur) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/bghero.webp"
          alt="Preloader Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.95]"
        />
      </div>

      {/* Layer 2: Pulse radial gradients in background */}
      <div className="absolute inset-0 z-10 overflow-hidden mix-blend-multiply opacity-55 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#FFB95B]/40 to-transparent blur-[120px] animate-preloader-grad-a" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#FFB49C]/45 to-transparent blur-[120px] animate-preloader-grad-b" />
      </div>

      {/* Layer 3: Analogic Noise Texture (SVG Grain) */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.06] mix-blend-soft-light">
        <svg className="w-full h-full animate-preloader-grain" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Layer 4: Brand Identity Logo (Spinning Centerpiece without background) */}
      <div className="relative z-30 flex flex-col items-center gap-4 text-center">
        {/* Animated Brand Isotype */}
        <div className="animate-preloader-logo w-16 h-16 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Kimito Logo"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

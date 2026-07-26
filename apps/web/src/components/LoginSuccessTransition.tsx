"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { KimitoLogo } from "./KimitoLogo";

interface LoginSuccessTransitionProps {
  /** Callback fired when the transition completes — triggers navigation */
  onComplete: () => void;
}

/**
 * Post-login transition: a soft veil rises over the login card while the
 * Kimito logomark appears as a continuity anchor. The overlay stays visible
 * while navigation happens underneath, then fades out gracefully once the
 * new page is ready.
 *
 * Total duration: ~1100ms
 * Only animates: opacity, transform (GPU-composited, 60 FPS)
 */
export const LoginSuccessTransition: React.FC<LoginSuccessTransitionProps> = ({
  onComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  // Skip animation entirely for users who prefer reduced motion
  useEffect(() => {
    if (shouldReduceMotion) {
      onComplete();
    }
  }, [shouldReduceMotion, onComplete]);

  // Phase progression: enter → hold → exit (navigate during exit)
  useEffect(() => {
    if (shouldReduceMotion) return;

    if (phase === "enter") {
      // Logo fades in and settles
      const timer = setTimeout(() => setPhase("hold"), 500);
      return () => clearTimeout(timer);
    }
    if (phase === "hold") {
      // Hold the logo visible, then start exit + navigate simultaneously
      const timer = setTimeout(() => {
        setPhase("exit");
        // Navigate while the overlay is still covering the screen
        // This hides any page flash/redirect underneath
        onComplete();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [phase, shouldReduceMotion, onComplete]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#FAF9F6",
        willChange: "opacity",
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: phase === "exit" ? 0 : 1,
      }}
      transition={{
        duration: phase === "exit" ? 0.6 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Logo — fades in with subtle scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{
          opacity: phase === "exit" ? 0 : 1,
          scale: phase === "hold" ? 1 : 0.94,
        }}
        transition={{
          opacity: { duration: 0.35, ease: "easeOut" },
          scale: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        }}
        style={{ willChange: "opacity, transform" }}
      >
        <KimitoLogo animate size={56} />
      </motion.div>

      {/* Wordmark — appears during hold phase */}
      <motion.p
        className="mt-5 font-sans font-extrabold text-2xl tracking-tight select-none"
        style={{ color: "#1D1B16" }}
        initial={{ opacity: 0, y: 4 }}
        animate={{
          opacity: phase === "hold" ? 0.8 : 0,
          y: phase === "hold" ? 0 : 4,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        Kimito
      </motion.p>
    </motion.div>
  );
};

export default LoginSuccessTransition;

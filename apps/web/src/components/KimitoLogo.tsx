"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface KimitoLogoProps {
  /** Whether to animate with a subtle fade-in + scale entrance */
  animate?: boolean;
  /** Size of the logomark in px */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Kimito logomark — renders the brand logo from /public/logo.svg.
 * Uses CSS filter to apply the brand green color.
 *
 * When `animate` is true, the logo fades in with a subtle scale transition.
 * When false, renders as a static image.
 */
export const KimitoLogo: React.FC<KimitoLogoProps> = ({
  animate = false,
  size = 56,
  className = "",
}) => {
  const logo = (
    <Image
      src="/logo.svg"
      alt="Kimito"
      width={size}
      height={size}
      className={className}
      priority
    />
  );

  if (!animate) {
    return logo;
  }

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {logo}
    </motion.div>
  );
};

export default KimitoLogo;

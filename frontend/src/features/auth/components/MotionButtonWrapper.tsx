"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION, EASING } from "@/constants/animation";

interface MotionButtonWrapperProps {
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Adds a gentle press scale to buttons without spring exaggeration.
 */
export function MotionButtonWrapper({
  children,
  disabled = false,
}: MotionButtonWrapperProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: EASING.enter }}
    >
      {children}
    </motion.div>
  );
}

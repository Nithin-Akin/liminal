"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Returns whether the user prefers reduced motion.
 * Wraps Framer Motion's hook for consistent use across motion components.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

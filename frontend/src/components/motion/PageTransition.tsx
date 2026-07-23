"use client";

import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  pageTransitionVariants,
  reducedMotionVariants,
} from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

export interface PageTransitionProps extends HTMLMotionProps<"div"> {
  /** Unique key used by AnimatePresence to detect route/content changes. */
  transitionKey: string;
  children: React.ReactNode;
}

/**
 * Wrap route-level content for enter/exit transitions between screens.
 * Pass a stable `transitionKey` (typically the pathname) from the page layout.
 */
export function PageTransition({
  transitionKey,
  className,
  children,
  ...props
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : pageTransitionVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className={cn("flex flex-1 flex-col", className)}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  reducedMotionVariants,
  slideUpVariants,
} from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

export interface SlideUpProps extends HTMLMotionProps<"div"> {
  /** Delay before animation starts (seconds). */
  delay?: number;
  children: React.ReactNode;
}

/**
 * Mobile-first upward slide for cards, sheets, and list items.
 * Respects `prefers-reduced-motion` automatically.
 */
export function SlideUp({
  delay = 0,
  className,
  children,
  ...props
}: SlideUpProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : slideUpVariants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

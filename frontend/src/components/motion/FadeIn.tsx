"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  fadeInVariants,
  reducedMotionVariants,
} from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

export interface FadeInProps extends HTMLMotionProps<"div"> {
  /** Delay before animation starts (seconds). */
  delay?: number;
  children: React.ReactNode;
}

/**
 * Gentle fade-in with subtle upward drift.
 * Respects `prefers-reduced-motion` automatically.
 */
export function FadeIn({
  delay = 0,
  className,
  children,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : fadeInVariants;

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

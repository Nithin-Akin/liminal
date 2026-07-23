/**
 * Liminal animation timing tokens.
 * Used by Framer Motion wrappers and CSS transitions.
 */
export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  cinematic: 1,
} as const;

export const EASING = {
  enter: [0.22, 1, 0.36, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  standard: [0.4, 0, 0.2, 1] as const,
};

export const STAGGER = {
  default: 0.06,
  maxAnimatedItems: 8,
} as const;

export const MOTION_OFFSET = {
  fade: 8,
  slide: 16,
} as const;

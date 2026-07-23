import type { Transition, Variants } from "framer-motion";

import {
  DURATION,
  EASING,
  MOTION_OFFSET,
  STAGGER,
} from "@/constants/animation";

const enterTransition: Transition = {
  duration: DURATION.normal,
  ease: EASING.enter,
};

const exitTransition: Transition = {
  duration: DURATION.fast,
  ease: EASING.exit,
};

/** Gentle fade with subtle upward drift — default entrance. */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: MOTION_OFFSET.fade },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
  exit: {
    opacity: 0,
    y: MOTION_OFFSET.fade / 2,
    transition: exitTransition,
  },
};

/** Mobile-first upward slide for sheets, cards, and lists. */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: MOTION_OFFSET.slide },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
  exit: {
    opacity: 0,
    y: MOTION_OFFSET.slide / 2,
    transition: exitTransition,
  },
};

/** Route-level page enter and exit. */
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: MOTION_OFFSET.fade },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.enter,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION.fast,
      ease: EASING.exit,
    },
  },
};

/** Reduced-motion fallback — opacity only, no positional shift. */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.instant },
  },
};

/** Container variant for staggered child reveals. */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.default,
      delayChildren: 0.05,
    },
  },
};

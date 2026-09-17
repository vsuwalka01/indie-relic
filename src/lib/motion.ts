// Shared motion tokens, so animation feels like one system rather than
// per-component guesswork (durations/easings drawn from the bencium-controlled-ux-designer
// motion spec and cross-checked against ui-ux-pro-max's GSAP preset data).
import type { Transition, Variants } from 'framer-motion';

export const EASE = {
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  inOut: [0.4, 0, 0.2, 1],
} as const;

export const DURATION = {
  instant: 0.1, // button press
  fast: 0.15, // hover state
  base: 0.2, // tooltip, small toggles
  standard: 0.3, // cards, accordions, modals
  slow: 0.4, // page transitions
} as const;

export const tapScale = { scale: 0.97 };
export const hoverLift = { y: -4, transition: { duration: DURATION.fast, ease: EASE.out } };

/** Drop onto any <motion.button>/<motion.a> for the standard press/hover feel. */
export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: tapScale,
  transition: { duration: DURATION.fast, ease: EASE.out } as Transition,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.standard, ease: EASE.out } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.standard, ease: EASE.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.standard, ease: EASE.out } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: DURATION.base, ease: EASE.in } },
};

/** For a list container: pass to `variants`, pair with `slideUp` on each child. */
export function stagger(staggerChildren = 0.08): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren } } };
}

/** Toast slide-in-from-top, used by the cart confirmation toast. */
export const toastIn: Variants = {
  hidden: { opacity: 0, y: -24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.standard, ease: EASE.out } },
  exit: { opacity: 0, y: -16, scale: 0.95, transition: { duration: DURATION.base, ease: EASE.in } },
};

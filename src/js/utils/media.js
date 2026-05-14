/**
 * Media query utilities
 *
 * All checks use matchMedia — consistent with CSS breakpoints and reliable
 * on modern devices. Avoids UA string sniffing which is brittle and outdated.
 */

/** Returns true if the user prefers reduced motion */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Returns true if viewport ≤ 1024px (tablet or below) */
export const isTabletOrBelow = () =>
  window.matchMedia("(max-width: 1024px)").matches;

/**
 * Returns true if viewport is mobile-sized (≤ 768px).
 * Matches the Tailwind `m` breakpoint (640px) approximately.
 * Adjust the breakpoint here to match your project's definition of "mobile".
 */
export const isMobile = () =>
  window.matchMedia("(max-width: 768px)").matches;

/** Returns true if viewport is on a large/4K screen (≥ 2190px) */
export const isLargeScreen = () =>
  window.matchMedia("(min-width: 2190px)").matches;

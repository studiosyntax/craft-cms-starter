/**
 * Dev-only logging
 *
 * Routes decorative console.log output through Vite's import.meta.env.DEV
 * flag so informational status logs never ship to production builds.
 */

/** console.log, but only in development builds */
export const log = (...args) => {
  if (import.meta.env.DEV) console.log(...args);
};

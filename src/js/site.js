/**
 * Site Entry Point
 *
 * Importing this file starts the application. App auto-initializes
 * and orchestrates: fonts, preloader, module lifecycle, scroll, and
 * page transitions.
 *
 * Configuration lives in app.config.js:
 *   usePreloader  — toggle preloader on/off per project
 *   useTransitions — toggle Taxi.js page transitions on/off
 *
 * Development helpers:
 *   ?skip-preloader  — skip the preloader animation (handled by App)
 *   window.App       — expose App in DevTools (enabled in DEV below)
 */

import { App } from "./app.js";

if (import.meta.env?.DEV) {
  window.App = App;
}

export { App };

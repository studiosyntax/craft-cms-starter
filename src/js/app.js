import { Scroll } from "./scroll";
import { Dom } from "./dom";
import { Preloader } from "./persistent/preloader";
import { Navigation } from "./persistent/navigation";
import { Header } from "./persistent/header";
import { CopyEmail } from "./persistent/copy-email";
import { isMobile, isLargeScreen } from "./utils/media";
import { Resize } from "./utils/subscribable";
import { config as defaultConfig } from "./app.config";
import hey from "./hey";

/**
 * App — Main Application Controller
 *
 * Orchestrates the full initialization sequence and owns all lifecycle calls.
 * Import App from site.js; do not use it as a service locator.
 *
 * Lifecycle (first visit):
 *   1. Dom.create()       → modules set initial hidden state
 *   2. Preloader.init()   → resolves at the "reveal" moment
 *   3. Dom.start()        → observers begin, elements animate in
 *   4. Pages constructed  → Taxi.js page transitions active
 *
 * Lifecycle (navigation via Taxi):
 *   1. Dom.transitionOut() → modules animate out & destroy
 *   2. Page swap
 *   3. Dom.transitionIn()  → create + start new modules
 */
class _App {
  isMobile = isMobile();
  isLargeScreen = isLargeScreen();
  #initialized = false;
  #config;

  constructor(config = {}) {
    this.#config = { ...defaultConfig, ...config };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.#init());
    } else {
      this.#init();
    }
  }

  async #init() {
    if (this.#initialized) return;
    this.#initialized = true;

    console.log("🚀 App initializing...");

    // Persistent modules that survive page transitions
    new Navigation();
    new Header();
    new CopyEmail();

    await document.fonts.ready;

    Scroll.stop();

    // PHASE 1: Create modules BEFORE preloader hides.
    // Module constructors set initial hidden state (opacity: 0, yPercent: 110, etc.)
    // so when the preloader reveals the page, elements are already hidden.
    Dom.create();

    // PHASE 2: Run preloader if enabled.
    // init() resolves at the "reveal" moment, not when animation fully completes.
    // The final slide-out continues while modules start animating below.
    if (this.#config.usePreloader) {
      // Allow ?skip-preloader in the URL during development
      if (new URLSearchParams(window.location.search).has("skip-preloader")) {
        Preloader.skip();
      } else {
        await Preloader.init();
      }
    }

    // PHASE 3: App (not Preloader) owns this call.
    // Observers begin, isIn() fires, elements animate in.
    Dom.start();
    Scroll.start();

    // PHASE 4: Taxi.js page transitions
    if (this.#config.useTransitions) {
      const { Pages } = await import("./pages.js");
      new Pages();
    }

    hey.APP_READY = true;
    console.log("✨ App ready");

    // Keep mobile/screen flags current on resize
    Resize.subscribe(() => {
      this.isMobile = isMobile();
      this.isLargeScreen = isLargeScreen();
    });
  }
}

export const App = new _App();
export { _App };

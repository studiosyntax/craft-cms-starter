import { createModules } from "./modules/_/index";
import { NoMobile } from "./modules/nomobile";
import { ScrollTrigger } from "./gsap";
import { log } from "./utils/log";
import hey from "./hey";

/**
 * Dom — Module Lifecycle Manager
 *
 * Manages creation, starting, stopping, and destruction of page modules.
 * The two-phase lifecycle prevents flash of unstyled content:
 *
 *   create() — instantiate modules so they set their initial hidden state
 *              BEFORE the preloader reveals the page.
 *
 *   start()  — begin IntersectionObservers / scroll tracking
 *              AFTER the preloader's reveal moment (called by App).
 *
 * On navigation (Taxi):
 *   transitionOut() → destroy current modules
 *   transitionIn()  → reset + create for new page
 *                     (transitions call Dom.start() at their own timing offset)
 */
export class _Dom {
  #items = [];

  #created = false;
  #started = false;

  get items() {
    return this.#items;
  }

  get created() {
    return this.#created;
  }

  get started() {
    return this.#started;
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * PHASE 1: Instantiate modules.
   * Call BEFORE the preloader hides — module constructors set hidden state.
   */
  create() {
    if (this.#created) return;
    this.#created = true;

    document.querySelectorAll("[data-nomobile]").forEach((el) => {
      new NoMobile(el);
    });

    this.#items = createModules();

    log(`📦 Created ${this.#items.length} modules`);
  }

  /**
   * PHASE 2: Start module observers.
   * Call AFTER the preloader reveal moment — observers fire, elements animate in.
   * Controlled by App (first load) or by transitions (navigation).
   */
  start() {
    if (this.#started) return;
    this.#started = true;

    this.#items.forEach((item) => item.start?.());

    hey.DOM_READY = true;
    log(`▶️ Started ${this.#items.length} modules`);
  }

  stop() {
    this.#items.forEach((item) => item.stop?.());
  }

  destroy() {
    this.#items.forEach((item) => item.destroy?.());
    this.#items = [];
    this.#created = false;
    this.#started = false;

    // Kill page-level ScrollTriggers.
    // Note: persistent module triggers (Navigation) should be refreshed
    // separately via hey.on("PAGE_IN") — they are not page-scoped.
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  /**
   * Called before navigating away. Lets modules animate out, then destroys all.
   */
  async transitionOut() {
    await Promise.all(this.#items.map((item) => item.transitionOut?.()));
    this.destroy();
  }

  /**
   * Called by transitions after new page content is injected.
   * Resets flags and creates modules (sets hidden state).
   * Dom.start() is NOT called here — each transition controls that timing.
   */
  transitionIn() {
    this.#created = false;
    this.#started = false;
    this.create();
  }
}

export const Dom = new _Dom();

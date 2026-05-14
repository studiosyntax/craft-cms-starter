import { Core } from "@unseenco/taxi";
import { CoverTransition } from "./transitions/cover";
import { LoopTransition } from "./transitions/loop";
import { FadeTransition } from "./transitions/fade";
import hey from "./hey";

/**
 * Pages — Taxi.js page transition manager
 *
 * Instantiated by App.init() (not at module evaluation time) so Taxi
 * doesn't become active before the application has initialised.
 *
 * Adding a new transition:
 *   1. Create src/js/transitions/my-transition.js (extend BaseTransition)
 *   2. Import it here and add it to the transitions map
 *   3. Use it: <a href="/page" data-taxi-transition="my-transition">
 */
export class Pages extends Core {
  constructor() {
    super({
      // Fixed: closing parenthesis was missing on the last :not()
      links: "a:not([target]):not([href^='#']):not([data-taxi-ignore]):not([data-nav-item])",
      removeOldContent: false,
      allowInterruption: false,
      bypassCache: true,
      transitions: {
        default: CoverTransition,
        loop: LoopTransition,
        fade: FadeTransition,
      },
    });

    hey.PAGE_SLUG = window.location.pathname;

    console.log("🚕 Taxi ready");
  }
}

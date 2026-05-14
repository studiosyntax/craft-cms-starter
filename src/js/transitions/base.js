import { Dom } from "../dom";
import { Scroll } from "../scroll";
import hey from "../hey";

/**
 * BaseTransition — shared scaffolding for all Taxi transitions
 *
 * Eliminates the boilerplate that every transition class otherwise duplicates:
 *   - leave() / enter() Promise wrappers required by Taxi
 *   - Standard onLeave scaffold (stop scroll, transitionOut, toTop, remove)
 *   - Standard onEnter scaffold (Dom.create, state updates, resume scroll)
 *
 * Subclasses override animateLeave() and/or animateEnter() to add visuals,
 * or override onLeave() / onEnter() entirely for non-standard flows (LoopTransition).
 *
 * Dom.start() is called inside animateEnter() — subclasses control exactly
 * when it fires relative to their animation. The default fires it immediately.
 */
export class BaseTransition {
  constructor({ wrapper }) {
    this.wrapper = wrapper;
  }

  // ─── Taxi contract ──────────────────────────────────────────────────────────

  leave(props) {
    return new Promise((resolve) => this.onLeave({ ...props, done: resolve }));
  }

  enter(props) {
    return new Promise((resolve) => this.onEnter({ ...props, done: resolve }));
  }

  // ─── Standard flow — override in subclasses ─────────────────────────────────

  async onLeave({ from, done }) {
    hey.PAGE_OUT = from;
    Scroll.stop();

    await Dom.transitionOut();
    await this.animateLeave(from);

    Scroll.toTop();
    from.remove();
    done();
  }

  async onEnter({ to, done }) {
    Dom.transitionIn();       // create modules, set hidden state
    await this.animateEnter(to); // subclass controls when Dom.start() fires

    hey.PAGE_SLUG = window.location.pathname;
    hey.PAGE_IN = to;
    Scroll.start();
    Scroll.resize();
    done();

    this.wrapper.removeAttribute("style");
  }

  // ─── Hooks — override for custom animations ─────────────────────────────────

  /** Called after Dom.transitionOut(), before old page is removed. */
  async animateLeave(from) {}

  /**
   * Called during onEnter. Must call Dom.start() — either immediately (default)
   * or at a specific offset within a GSAP timeline for timed reveals.
   */
  async animateEnter(to) {
    Dom.start();
  }
}

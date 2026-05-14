import { BaseTransition } from "./base";
import { Dom } from "../dom";
import { Scroll } from "../scroll";
import hey from "../hey";
import gsap, { easeMenu } from "../gsap";

/**
 * LoopTransition — slide-up reveal
 *
 * The new page starts below the viewport and slides up over the old page,
 * which simultaneously slides up and out. Both move at the same speed for
 * a "continuous loop" feel.
 *
 * This transition has a fundamentally different flow to the base (the old
 * page is kept visible during the enter phase) so it overrides onLeave and
 * onEnter fully rather than using the animateLeave / animateEnter hooks.
 *
 * Usage: <a href="/page" data-taxi-transition="loop">
 */
export class LoopTransition extends BaseTransition {
  #oldPage = null;

  async onLeave({ from, done }) {
    hey.PAGE_OUT = from;
    this.#oldPage = from;

    Scroll.stop();
    await Dom.transitionOut();

    // Don't remove old page yet — it stays visible during the enter animation
    done();
  }

  async onEnter({ to, done }) {
    // Place new page below the viewport
    gsap.set(to, { y: window.innerHeight });
    this.wrapper.removeAttribute("style");

    // Fix old page in place so it doesn't scroll
    if (this.#oldPage) {
      Object.assign(this.#oldPage.style, {
        position: "fixed",
        width: "100%",
        bottom: "0",
        zIndex: "5",
      });
    }

    Scroll.toTop();

    // Old page slides up and out
    gsap.to(this.#oldPage, {
      y: -window.innerHeight,
      duration: 1.2,
      ease: easeMenu,
    });

    // New page slides up into view; create modules while animating
    Dom.transitionIn();
    Dom.start();

    await gsap.to(to, { y: 0, duration: 1.2, ease: easeMenu });

    this.#oldPage?.remove();
    this.#oldPage = null;

    Scroll.start();
    Scroll.resize();

    hey.PAGE_SLUG = window.location.pathname;
    hey.PAGE_IN = to;

    done();
  }
}

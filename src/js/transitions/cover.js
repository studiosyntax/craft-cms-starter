import { BaseTransition } from "./base";
import { Dom } from "../dom";
import gsap from "../gsap";

/**
 * CoverTransition — clip-path curtain (default)
 *
 * Leave: a full-screen cover slides down over the old page.
 * Enter: the cover slides up to reveal the new page. Dom.start() fires
 *        slightly before the cover finishes exiting so modules begin
 *        animating while the curtain is still leaving — smoother result.
 *
 * Requires in layout-page.twig:
 *   <div class="transition-cover" data-transition-cover>
 *     <div class="transition-cover__inner"></div>
 *   </div>
 *
 * Usage: default transition (no data-taxi-transition needed).
 */
export class CoverTransition extends BaseTransition {
  constructor(props) {
    super(props);
    this.cover = document.querySelector("[data-transition-cover] > *");
  }

  async animateLeave(from) {
    await gsap.fromTo(
      this.cover,
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power3.inOut" }
    );
  }

  async animateEnter(to) {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Reset cover for next use
          gsap.set(this.cover, { clipPath: "inset(100% 0 0 0)" });
          resolve();
        },
      });

      tl.to(this.cover, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power3.inOut",
      });

      // Start modules slightly before the cover finishes exiting.
      // Elements begin animating in while the curtain is still moving out.
      tl.call(() => Dom.start(), null, "-=0.6");
    });
  }
}

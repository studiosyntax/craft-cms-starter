import { BaseTransition } from "./base";
import { Dom } from "../dom";
import gsap from "../gsap";

/**
 * FadeTransition — simple crossfade
 *
 * Old page fades out, new page fades in.
 *
 * Usage: <a href="/page" data-taxi-transition="fade">
 */
export class FadeTransition extends BaseTransition {
  async animateLeave(from) {
    await gsap.to(from, { opacity: 0, duration: 0.5, ease: "power2.out" });
  }

  async animateEnter(to) {
    gsap.set(to, { opacity: 0 });
    Dom.start();
    await gsap.to(to, { opacity: 1, duration: 0.5, ease: "power2.out" });
  }
}

import { Observe } from "./_/observe";
import gsap, { reduced, resetInitial } from "../gsap";

/**
 * Fade Module
 * 
 * Simple fade-in animation when element enters viewport.
 * 
 * Usage:
 * <div data-module="fade">Content fades in when scrolled into view</div>
 * <div data-module="fade" data-delay="0.5">With custom delay</div>
 */
export class Fade extends Observe {
  #anim;

  a = {
    duration: 1.2,
    delay: 0.1,
    opacity: 1,
    y: 0,
  };

  constructor(element) {
    super(element, { threshold: 0.1 });

    // Parse custom delay from data attribute
    const delay = element.dataset.delay;
    if (delay) this.a.delay = parseFloat(delay);

    this.#setInitialState();
    resetInitial(element);
  }

  #setInitialState() {
    if (reduced) return;
    
    gsap.set(this.element, {
      opacity: 0,
      y: 30,
    });
  }

  isIn = () => {
    if (reduced) return;

    this.#anim = gsap.to(this.element, {
      ...this.a,
    });
  };

  isOut = () => {
    // Optional: reset state when scrolling back up
    // Uncomment if you want elements to fade in again when re-entering viewport
    /*
    if (reduced) return;
    if (this.#anim) this.#anim.kill();
    gsap.set(this.element, {
      opacity: 0,
      y: 30,
    });
    */
  };

  transitionOut() {
    this.destroy();
  }
}


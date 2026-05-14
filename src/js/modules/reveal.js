import { Observe } from "./_/observe";
import gsap, { reduced, resetInitial } from "../gsap";

/**
 * Reveal Module
 *
 * Reveals an image from top to bottom using clip-path polygon, with a subtle
 * scale-from-above effect. The image scales from configurable value (default 1.1)
 * down to 1 as it's revealed.
 *
 * Usage:
 * <figure data-module="reveal">
 *   <img src="..." alt="...">
 * </figure>
 * <figure data-module="reveal" data-scale="1.2" data-delay="0.2">
 *   <img src="..." alt="...">
 * </figure>
 */
export class Reveal extends Observe {
  #anim;
  #img;
  #wrapper;

  a = {
    duration: 1.5,
    delay: 0,
    scale: 1.1,
  };

  constructor(element) {
    super(element, { threshold: 0.1, once: true });

    this.#img = element.querySelector("img");
    if (!this.#img) {
      console.warn("Reveal module: no img found inside", element);
      return;
    }

    const delay = element.dataset.delay;
    if (delay != null) this.a.delay = parseFloat(delay);

    const scale = element.dataset.scale;
    if (scale != null) this.a.scale = parseFloat(scale);

    const duration = element.dataset.duration;
    if (duration != null) this.a.duration = parseFloat(duration);

    this.create();
    resetInitial(element);
  }

  create() {
    if (reduced || !this.#img) return;

    // Create a wrapper div that will be clipped
    // This keeps the outer element's dimensions intact for IntersectionObserver
    this.#wrapper = document.createElement("div");
    this.#wrapper.style.cssText = "width: 100%; height: 100%; overflow: hidden;";
    
    // Wrap the image
    this.#img.parentNode.insertBefore(this.#wrapper, this.#img);
    this.#wrapper.appendChild(this.#img);

    // Set initial clip-path on the wrapper (not the outer element)
    // Using polygon instead of inset for better GSAP compatibility
    gsap.set(this.#wrapper, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    gsap.set(this.#img, {
      scale: this.a.scale,
    });
  }


  isIn = () => {
    if (reduced || !this.#img || !this.#wrapper) return;

    this.#anim = gsap.timeline();

    // Animate clip-path reveal on wrapper (top to bottom)
    this.#anim.to(
      this.#wrapper,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: this.a.duration,
        delay: this.a.delay,
        ease: "power3.inOut",
      },
      0
    );

    // Animate image scale (counter zoom effect)
    this.#anim.to(
      this.#img,
      {
        scale: 1,
        duration: this.a.duration,
        delay: this.a.delay,
        ease: "power3.inOut",
      },
      0
    );
  };

  transitionOut() {
    if (this.#anim) this.#anim.kill();
    this.destroy();
  }
}

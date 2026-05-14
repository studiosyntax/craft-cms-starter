import { Observe } from "./_/observe";
import gsap, { reduced } from "../gsap";

export class Alpha extends Observe {
  #anim;
  #animated;

  a = {
    duration: 1.2,
    delay: 0.1,
    autoAlpha: 1,
    yPercent: 0,
    ease: "slow.in",
  };

  constructor(element, config = {}) {
    super(element);

    if (config.delay !== undefined) this.a.delay = config.delay;

    this.create();
    // this.isOut();

    gsap.set(this.#animated, {
      autoAlpha: 0,
      yPercent: 20,
    });
  }

  create() {
    this.#animated = this.element;
    // data-delay replaces (not adds to) default - matches Fade module pattern
    const delay = this.element.dataset.delay;
    if (delay != null) this.a.delay = parseFloat(delay);
  }

  isIn = () => {
    this.#anim = gsap.to(this.#animated, {
      ...this.a,
    });
  };

  isOut = () => {
    // if (this.#anim) this.#anim.kill();
    // gsap.set(this.#animated, {
    //   autoAlpha: 0,
    //   yPercent: 20,
    // });
  };

  transitionOut() {
    this.destroy();
  }
}

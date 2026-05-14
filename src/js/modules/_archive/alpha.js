import { Observe } from "./_/observe";
import gsap, { reduced } from "../gsap";
import { computeParams } from "./_/index";

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

    if (config.delay) this.a.delay = config.delay;

    this.create();
    this.isOut();
  }

  create() {
    this.#animated = this.element;
    computeParams(this.element, this.a);
  }

  isIn = () => {
    this.#anim = gsap.to(this.#animated, {
      ...this.a,
    });
  };

  isOut = () => {
    if (this.#anim) this.#anim.kill();
    gsap.set(this.#animated, {
      autoAlpha: 0,
      yPercent: 20,
    });
  };

  transitionOut() {
    this.destroy();
  }
}


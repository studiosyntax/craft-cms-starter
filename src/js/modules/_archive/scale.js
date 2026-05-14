import { Observe } from "./_/observe";
import gsap, { reduced } from "../gsap";
import { computeParams } from "./_/index";

export class Scale extends Observe {
  #anim;
  #animated;

  a = {
    duration: 1.2,
    delay: 0.1,
    autoAlpha: 1,
    scale: 1,
    ease: "slow.in",

    stagger: {
      each: 0.02,
    },
  };

  constructor(element, config = {}) {
    super(element);

    if (config.delay) this.a.delay = config.delay;

    this.create();
    this.isOut();
  }

  create() {
    if (reduced) return;
    this.#animated = this.element;
    computeParams(this.element, this.a);
  }

  isIn = () => {
    if (reduced) return;

    this.#anim = gsap.to(this.#animated, {
      ...this.a,
    });
  };

  isOut = () => {
    if (reduced) return;

    if (this.#anim) this.#anim.kill();
    gsap.set(this.#animated, {
      autoAlpha: 0,
      scale: 0,
    });
  };

  transitionOut() {
    this.destroy();
  }
}


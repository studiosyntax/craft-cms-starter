import gsap, { reduced, SplitText } from "../gsap";
import { Observe } from "./_/observe";
import { computeParams } from "./_/index";

export class Par extends Observe {
  #anim;
  #split;

  a = {
    duration: 1.2,
    delay: 0.1,
    autoAlpha: 1,
    ease: "slow.out",
    stagger: {
      each: 0.08,
    },
  };

  constructor(element) {
    super(element);

    this.create();
    this.isOut();
  }

  create() {
    if (reduced) return;
    this.#split = this.element;
    computeParams(this.element, this.a);
  }

  isIn = () => {
    if (reduced) return;

    this.#anim = gsap.to(this.#split, {
      ...this.a,
    });
  };

  isOut = () => {
    if (reduced) return;

    if (this.#anim) this.#anim.kill();
    gsap.set(this.#split, {
      autoAlpha: 0,
    });
  };

  transitionOut() {
    this.destroy();
  }
}


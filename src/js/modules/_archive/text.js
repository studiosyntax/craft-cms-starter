import { Observe } from "./_/observe";
import gsap, { reduced, resetInitial } from "../gsap";
import { computeParams } from "./_/index";
import { split } from "./utils/split";

export class Text extends Observe {
  #anim;
  #split;

  a = {
    duration: 1.2,
    delay: 0.2,
    yPercent: 0,
    stagger: {
      each: 0.02,
    },
  };

  constructor(element) {
    super(element);

    this.create();
    this.isOut();
    resetInitial(element);
  }

  create() {
    if (reduced) return;
    this.#split = split(this.element).result;
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
      yPercent: 110,
    });
  };

  transitionOut() {
    this.destroy();
  }
}

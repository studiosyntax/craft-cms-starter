import { Observe } from "./_";
import gsap from "../gsap";

export class TypeSvg extends Observe {
  items = [];

  constructor(element) {
    super(element);

    this.items = Array.from(element.querySelectorAll("svg")).map((iut) => {
      return iut.children[0];
    });
  }

  #a_in = null;

  isIn() {
    this.#a_in = gsap.to(this.items, {
      yPercent: 0,
      delay: 0.3,
      stagger: {
        each: 0.1,
      },
    });
  }

  isOut() {
    if (this.#a_in) {
      this.#a_in.kill();
    }
    gsap.set(this.items, {
      yPercent: 150,
    });
  }

  transitionOut() {
    this.destroy();
  }
}


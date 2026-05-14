import { Observe } from "./_";
import gsap from "../gsap";

export class TypeSize extends Observe {
  items = [];

  constructor(element) {
    super(element);

    this.items = Array.from(this.element.children).map((item) => {
      item.children[0].style.overflow = "clip";
      return item.children[0].children[0];
    });
  }

  #a_in = null;

  isIn() {
    if (this.#a_in) this.#a_in.kill();
    this.#a_in = gsap.to(this.items, {
      yPercent: 0,
      delay: 0.1,
      duration: 1.3,
      stagger: {
        each: 0.1,
      },
    });
  }

  isOut() {
    if (this.#a_in) this.#a_in.kill();

    this.#a_in = gsap.set(this.items, {
      yPercent: 150,
    });
  }
}


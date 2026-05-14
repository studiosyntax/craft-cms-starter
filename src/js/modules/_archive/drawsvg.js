import { Observe } from "./_";
import gsap from "../gsap";

export class DrawSvg extends Observe {
  #a_draw = null;

  constructor(element, config = { once: false }) {
    super(element);
    this.isOut();
  }

  isIn() {
    if (this.#a_draw) this.#a_draw.kill();
    this.#a_draw = gsap.to(this.element, {
      drawSVG: this.element.getTotalLength(),
      delay: 0.2,
      duration: 3,
    });
  }

  isOut() {
    if (this.#a_draw) this.#a_draw.kill();

    gsap.set(this.element, {
      drawSVG: 0,
    });
  }

  transitionOut() {
    this.destroy();
  }
}


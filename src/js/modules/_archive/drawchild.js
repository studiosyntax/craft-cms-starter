import { Observe, Track } from "./_";
import gsap from "../gsap";

const movement = 50;

export class DrawChild extends Track {
  #svgs = [];

  constructor(element) {
    super(element, {
      top: "bottom",
      bottom: "top",
    });

    this.#svgs = Array.from(element.querySelectorAll("svg")).flatMap((svg) =>
      Array.from(svg.children).filter((item) => {
        if (item.tagName === "defs") return false;

        if (item instanceof SVGGeometryElement) {
          try {
            return (
              typeof item.getTotalLength === "function" &&
              !isNaN(item.getTotalLength())
            );
          } catch (e) {
            return false;
          }
        }
        return false;
      })
    );

    this.instances = this.#svgs.map((svg) => {
      return new SvgDraw(svg);
    });
  }

  start() {
    super.start();
    this.instances.forEach((instance) => {
      instance.start?.();
    });
  }

  isIn = () => {
    this.instances.forEach((instance) => {
      instance.isIn?.();
    });
  };

  isOut = () => {
    this.instances.forEach((instance) => {
      instance.isOut?.();
    });
  };

  handleScroll = (value) => {
    this.instances.forEach((instance) => {
      instance.handleScroll(value);
    });
  };

  transitionOut() {
    this.destroy();

    this.instances.forEach((instance) => {
      instance.transitionOut();
    });
  }
}

class SvgDraw extends Observe {
  #a_draw = null;
  #a_random = Math.random();

  constructor(element, config = { once: true }) {
    super(element);
    this.isOut();
  }

  isIn() {
    if (this.#a_draw) this.#a_draw.kill();
    this.#a_draw = gsap.to(this.element, {
      drawSVG: this.element.getTotalLength(),
      delay: this.#a_random * 0.2,
      duration: this.element.getTotalLength() / 300,
    });
  }

  isOut() {
    if (this.#a_draw) this.#a_draw.kill();

    gsap.set(this.element, {
      drawSVG: 0,
    });
  }

  handleScroll(value) {
    this.element.style.transform = `translateY(${
      ((-movement / 2 + value * movement) / 2) * this.#a_random
    }%)`;
  }

  transitionOut() {
    this.destroy();
  }
}


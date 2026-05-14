import gsap from "../gsap";
import { Observe } from "./_";

const mainColor = ["#CBC2FF", "#130032", "#4508F4"];

export class Elements extends Observe {
  #tl;
  #svg;
  #main;
  #cubes;
  #stack;

  constructor(element) {
    super(element);

    this.#svg = this.element.querySelector("svg");
    this.#main = this.#svg.querySelector(".main");
    this.#cubes = this.#svg.querySelector(".cubes");
    this.#stack = this.#svg.querySelector(".stack");

    gsap.set(this.#stack.children, {
      yPercent: 200,
    });

    gsap.set(this.#stack.children, {
      scaleY: 0.8,
    });

    this.#svg.style.overflow = "visible";
  }

  start() {
    super.start();
  }

  isIn() {
    this.transitionIn();
  }

  transitionIn() {
    this.#tl = gsap.timeline({
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: this.element,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    this.#tl.to(this.#svg, {
      yPercent: -30,
      duration: 1,
      ease: "none",
    });

    this.#tl.to(this.#cubes, {
      yPercent: -80,
      duration: 1,
      ease: "none",
    });

    this.#tl.to(
      this.#main.children,
      {
        fill: (i) => mainColor[i],
        stroke: (i) => mainColor[i],
        duration: 1,
        ease: "none",
      },
      "<"
    );

    const xMvmt = 800;

    this.#tl.to(this.#main.children, {
      xPercent: (i) => {
        if (i === 0) return xMvmt;
        if (i === 1) return -xMvmt;
        if (i === 2) return 0;
      },
      yPercent: (i) => {
        if (i === 0 || i === 1) return 50;
        if (i === 2) return 0;
      },
      duration: 1,
      ease: "none",
    });

    this.#tl.to(
      this.#main,
      {
        scale: 1.5,
        duration: 1,
        transformOrigin: "center",
      },
      "<"
    );

    this.#tl.to(this.#stack.children, {
      yPercent: -15,
      duration: 1,
      ease: "none",
    });

    this.#tl.to(this.#main.children[2], {
      autoAlpha: 0,
      duration: 0.1,
      ease: "none",
    });

    this.#tl.to(this.#stack.children, {
      autoAlpha: (i) => {
        return 0;
      },
      delay: 0.3,
      stagger: {
        each: 0.2,
        from: "end",
      },
      duration: 0.6,
      ease: "none",
    });
  }
}


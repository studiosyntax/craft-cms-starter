import { Track } from "./_";
import gsap from "../gsap";

export class Stack {
  #stacks;
  #tl;

  constructor(element) {
    this.element = element;
    this.#stacks = Array.from(
      element.querySelector("g")?.querySelectorAll("g") ?? []
    );
  }

  get _tl() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.to(this.#stacks, {
      yPercent: -10,
      duration: 1 / this.#stacks.length,
      stagger: 1 / this.#stacks.length,
    });

    return tl;
  }
}


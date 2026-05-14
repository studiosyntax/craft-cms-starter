import { Track } from "./_";
import gsap from "../gsap";

export class HeroLogo extends Track {
  gradients = [];

  constructor(element) {
    super(element, {
      top: "top",
      bottom: "top",
    });

    this.element = element;
    this.gradients = this.element.querySelector("[data-hero='gradient']");

    this.tl = gsap.timeline({
      repeat: -1,
    });

    const dur = 8.5;
  }
}


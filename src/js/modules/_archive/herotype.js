import { Observe, Track } from "./_";
import gsap, { resetInitial } from "../gsap";

const scale = 1.2;

export class HeroType extends Track {
  svg;
  pills = null;
  handles = null;

  constructor(element) {
    super(element, {
      top: "top",
      bottom: "top",
    });

    this.svg = this.element.querySelector("svg");
    this.pills = this.element.querySelectorAll(".pill");
    this.handles = this.element.querySelectorAll(".handle");

    this.svg.style.transform = `scale(${scale})`;
    gsap.set([this.svg, this.pills, this.handles], {
      autoAlpha: 0,
    });

    gsap.set(this.pills, {
      translateX: () => Math.random() * 200 - 100,
      translateY: () => Math.random() * 200 - 100,
    });

    gsap.set(this.handles, {
      rotate: () => Math.random() * 60 - 30,
      transformOrigin: "center",
    });

    this.animateIn();
  }

  animateIn() {
    resetInitial(this.element);

    gsap.to(this.svg, {
      autoAlpha: 1,
      duration: 1,
      ease: "power2.inOut",
    });

    gsap.to(this.handles, {
      autoAlpha: 1,
      rotate: 0,
      duration: 0.8,
      delay: 0.1,
      stagger: 0.2,
      ease: "power2.inOut",
    });

    gsap.to(this.pills, {
      autoAlpha: 1,
      duration: 0.4,
      delay: 0.2,
      stagger: 0.2,
      ease: "slow.in",
    });

    gsap.to(this.pills, {
      translateX: 0,
      translateY: 0,
      duration: () => Math.random() + 0.9,
      delay: 0.2,
      stagger: 0.2,
      ease: "slow.inOut",
    });
  }

  handleScroll = (value) => {
    if (!this.inView) return;

    this.svg.style.transform = `
        translateY(${value * 50}%)
        scale(${scale})
      `;
  };

  transitinOut() {
    this.destroy();
  }
}


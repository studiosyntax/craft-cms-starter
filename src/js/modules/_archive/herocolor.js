import { Track } from "./_";
import gsap, { resetInitial } from "../gsap";

const fills = ["#CBC2FF", "#4C00FF", "#130032"];

export class HeroColor {
  element;
  tl;
  svg;
  groups;
  fills;

  constructor(element) {
    this.element = element;

    this.svg = this.element.querySelector("svg");
    this.groups = this.svg.querySelectorAll("g");
    this.fills = this.svg.querySelectorAll(".flat");

    gsap.set(this.groups, {
      autoAlpha: 0,
    });

    this.transitionIn();
  }

  start() {
    this.tl = this._tl;
  }

  transitionIn() {
    resetInitial(this.element);

    gsap.to(this.groups, {
      autoAlpha: 1,
      duration: 1,
      stagger: {
        each: 0.1,
        from: "end",
      },
      delay: 0.5,
      ease: "slow.in",
    });
  }

  get _tl() {
    const duration = 1;
    const movement = 30;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.element,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.to(this.groups, {
      duration,
      yPercent: (t) => (t === 0 ? 0 : t === 1 ? -movement : -movement * 3.2),
    });

    tl.to(
      this.fills,
      {
        duration,
        fill: (t) => fills[t],
      },
      "<"
    );

    return tl;
  }
}


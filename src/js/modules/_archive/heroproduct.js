import { App } from "../app";
import { Track } from "./_";
import gsap, { resetInitial } from "../gsap";

export class HeroProduct extends Track {
  contract = null;
  pills = [];
  wrapper;
  tl;

  constructor(element) {
    super(element, {
      top: "top",
      bottom: "center",
    });

    this.contract = this.element.querySelector("[data-contract]");
    this.pills = Array.from(this.element.querySelectorAll("[data-pill]"));
    this.wrapper = this.contract?.parentElement;

    gsap.set(this.wrapper, {
      yPercent: 150,
    });

    gsap.set(this.pills, {
      scale: 0,
    });

    this.animateIn();
  }

  animateIn() {
    resetInitial(this.element);

    gsap.to(this.wrapper, {
      yPercent: 0,
      delay: 0.3,
    });

    this.tl = this._tl;
  }

  get _tl() {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(this.wrapper, {
      scale: 0.8,
      duration: 1,
      ease: "linear",
    });

    tl.to(
      this.pills,
      {
        scale: App.isMobile ? 0.6 : 1,
        yPercent: 0,
        duration: 0.2,
        stagger: 0.2,
        delay: 0.4,
        ease: "back.out",
      },
      "<"
    );

    return tl;
  }

  handleScroll = (value) => {
    if (!this.inView || !this.tl) return;
    this.tl?.seek(value);
  };

  transitionOut() {
    this.destroy();
  }
}


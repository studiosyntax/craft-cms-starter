import gsap, { easeMenu } from "../gsap";
import { Dom } from "../dom";

const timecut = 1;

export class Preloader {
  static instance;
  #bar;
  #wrap;

  constructor(element) {
    this.element = element;

    gsap.set(this.element, {
      autoAlpha: 0,
    });

    this.#bar = this.element.querySelector("#progress-bar");
    this.#wrap = this.element.querySelector("[data-preloader='wrap']");

    Dom.nav.animateOut(0);
    this.load();
  }

  async load() {
    await gsap.to(this.element, {
      autoAlpha: 1,
      duration: 0.4 * timecut,
      delay: 0.2,
    });

    await this.animateLoad();
  }

  async animateLoad() {
    await gsap.to(this.#bar.querySelector("#load-progress"), {
      drawSVG: "0% 100%",
      duration: 1.8 * timecut,
      ease: easeMenu,
    });

    this.fadeOut();
    Dom.carousel.animateIn();
    Dom.nav.animateIn(0.4);
    Dom.homevideo.animateIn(0.6);
  }

  async fadeOut() {
    gsap.to(this.#wrap.children, {
      autoAlpha: 0,
      scale: 1.6,
      duration: 0.8 * timecut,
      stagger: 0.15,
      ease: easeMenu,
      onComplete: () => this.destroy(),
    });
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}


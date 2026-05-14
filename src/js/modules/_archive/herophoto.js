import { Track } from "./_";
import gsap, { resetInitial } from "../gsap";

export class HeroPhoto extends Track {
  #images;
  #tl;
  #wrapper;
  #gradients;

  constructor(element) {
    super(element, {
      top: "top",
      bottom: "center",
    });

    this.#images = Array.from(this.element.querySelectorAll("img"));
    this.#wrapper = this.#images[0].parentElement;
    this.#gradients = this.element.querySelectorAll("[data-gradients]");

    this.animateIn();
  }

  animateIn() {
    gsap.set(this.#wrapper, {
      scale: 3,
    });

    gsap.set(this.#images, {
      autoAlpha: 0,
    });

    resetInitial(this.element);

    gsap.to(this.#images[0], {
      autoAlpha: 1,
      stagger: 0.1,
    });

    gsap.to(this.#wrapper, {
      scale: 1,
      yPercent: 0,
      ease: "slow.in",
      onComplete: () => {
        this.#tl = this._tl;
      },
    });
  }

  get _tl() {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(this.#wrapper, {
      duration: 1,
    });

    tl.to(
      this.#gradients,
      {
        yPercent: -50,
        duration: 1,
        stagger: {
          each: 0.1,
          from: "end",
        },
      },
      "<"
    );

    this.#images.slice(1);

    tl.to(
      this.#images,
      {
        autoAlpha: 1,
        duration: 1 / 5,
        stagger: 1 / 5,
      },
      "<"
    );

    return tl;
  }

  handleScroll = (value) => {
    if (!this.inView || !this.#tl) return;

    this.#tl.seek(value);
  };

  transitionOut() {
    this.destroy();
  }
}


import gsap from "../gsap";
import { App } from "../app";
import { Observe } from "./_";

export class PhotoSticky extends Observe {
  #texts;
  #img;
  #bg;
  #tl;
  #isInit = false;
  #pops = null;
  #pops2 = null;

  constructor(element) {
    super(element);
    this.#texts = this.element.querySelectorAll("[data-text]");
    this.#bg = this.element.querySelector("[data-bg]");
    this.#img = this.element.querySelector("[data-image]")?.children[1];

    const pops = Array.from(this.element.querySelectorAll("[data-pops]"));

    this.#pops = pops[0];
    this.#pops2 = pops[1];

    gsap.set(this.#pops, {
      scale: 0,
    });

    gsap.set(this.#pops2, {
      scale: 0,
    });
  }

  isIn() {
    if (this.#isInit) return;
    this.#isInit = true;
    this.#tl = this._tl;
  }

  get _tl() {
    const tl = gsap.timeline({
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: this.element,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.set(this.#pops, {
      scale: 0,
    });

    tl.set(this.#pops2, {
      scale: 0,
    });

    tl.to(this.#bg, {
      backgroundColor: "#CBC2FF",
      duration: 1,
    });

    tl.to(
      this.#img,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        delay: 0.3,
        ease: "linear",
        duration: 0.6,
      },
      "<"
    );

    tl.to(
      this.#texts[0].children,
      {
        yPercent: -120,
        duration: 0.4,
      },
      "<"
    );

    tl.to(
      this.#texts[1].children,
      {
        yPercent: -120,
        duration: 0.35,
        delay: 0.2,
      },
      "<"
    );

    const popsTl = gsap.timeline({});

    popsTl.to(this.#pops, {
      scale: 1,
      duration: 0.2,
      ease: "expo.out",
    });

    popsTl.to(this.#pops, {
      scale: 0,
      autoAlpha: 1,
      duration: 0.2,
      ease: "expo.out",
      delay: 0.35,
      onComplete: () => {
        gsap.set(this.#pops, {
          autoAlpha: 0,
        });
      },
    });

    popsTl.to(this.#pops2, {
      scale: 1,
      duration: 0.2,
      ease: "expo.out",
    });

    tl.add(popsTl, 0);

    return tl;
  }

  transitionOut() {
    if (this.#tl) {
      this.#tl.kill();
    }
    super.destroy();
  }
}


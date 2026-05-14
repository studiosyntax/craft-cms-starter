import { Track } from "./_";
import gsap from "../gsap";
import { App } from "../app";

export class HeroVideo extends Track {
  wrapper;
  video;
  tl;

  constructor(element) {
    super(element, {
      top: "top",
      bottom: "top",
    });

    this.wrapper = this.element.querySelector("[data-video]");
    this.video = this.wrapper.children[1];
    this.tl = this._tl;
  }

  get _tl() {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(this.wrapper, {
      duration: 1,
      scale: App.isMobile ? 1 : 1.54,
      ease: "slow.out",
    });

    tl.to(
      this.video,
      {
        duration: 0.6,
        autoAlpha: 1,
      },
      "<"
    );

    return tl;
  }

  handleScroll = (value) => {
    if (!this.inView || !this.tl) return;
    this.tl.seek(value);
  };

  transitionOut() {
    this.destroy();
  }
}


import gsap from "../gsap";
import { Track } from "./_";
import { split } from "./utils/split";

export class ColorText extends Track {
  tl;

  constructor(element) {
    super(element, {
      top: "bottom",
      bottom: "center",
    });

    this.target = this.element.dataset.target;
    this.split = split(this.element, "chars").result;

    this.tl = this._tl;
  }

  get _tl() {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(this.split, {
      color: "#" + this.target,
      stagger: {
        each: 1 / this.split.length,
      },
      duration: 1 / this.split.length,
    });

    return tl;
  }

  handleScroll = (value) => {
    if (!this.inView) return;
    if (this.tl) this.tl.seek(value);
  };

  transitionOut = () => {
    this.destroy();
  };
}


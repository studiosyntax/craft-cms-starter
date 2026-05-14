import { Track } from "./_";
import { Pages } from "../pages";
import { Scroll } from "../scroll";
import gsap from "../gsap";
import { App } from "../app";

const Y_TRANSFORM = 90;
const ROTATE = 180;

export class Transition extends Track {
  isTransitioning = false;
  target = null;

  element;
  items;
  svg;
  path;

  tl;

  constructor(element) {
    super(element, {
      bounds: [0, 1],
      top: "bottom",
      bottom: "bottom",
    });

    this.stop();

    this.element = element;
    this.target = element.dataset.target;

    this.svg = this.element.querySelector("svg");
    this.path = this.svg.children[1];
    this.items = this.element.querySelector("[data-next='items']");

    this.tl = gsap.timeline({
      paused: true,
    });

    this.tl.fromTo(
      this.path,
      {
        drawSVG: 0,
      },
      {
        drawSVG: "100%",

        duration: 0.9,
        ease: "linear",
      }
    );
  }

  isIn = () => {
    Pages.preload("/" + this.target, true);
  };

  handleScroll = (value) => {
    if (this.isTransitioning) return;

    this.svg.style.transform = `rotate(${ROTATE - value * ROTATE}deg)`;
    this.items.style.transform = `translateY(${Y_TRANSFORM - value * Y_TRANSFORM}%)`;
    this.items.style.opacity = `${value}`;
    this.tl.seek(value);

    if (value > (App.isMobile ? 0.95 : 0.99) && !this.isTransitioning) {
      this.isTransitioning = true;
      this.triggerTransition();
    }
  };

  async triggerTransition() {
    Scroll.stop();
    setTimeout(async () => {
      this.transitionOut();
      await Pages.navigateTo("/" + this.target, "loop");
    }, 100);
  }

  transitionOut() {
    this.destroy();
  }
}


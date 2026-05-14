import { Track } from "./_";

export class Scroller extends Track {
  slides;
  scrollableWidth = 0;

  constructor(element) {
    super(element, {
      top: "bottom",
      bottom: "top",
    });

    this.slides = this.element.querySelector("[data-scroller='slides']")
      ?.children[0];
  }

  resize = () => {
    this.scrollableWidth = this.element.scrollWidth - window.innerWidth;
  };

  handleScroll = (value) => {
    if (!this.inView) return;

    this.slides.style.transform = `translateX(${-value * this.scrollableWidth}px)`;
  };

  transitionOut() {
    this.destroy();
  }
}


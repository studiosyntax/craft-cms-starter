import { Track } from "./_";

export class OppositeScroll extends Track {
  scrolling;
  tl;
  directions;

  #lerp = 0;

  constructor(element) {
    super(element);

    this.scrolling = Array.from(this.element.children);
    this.directions = this.scrolling.map((_, i) => (i % 2 === 0 ? -1 : 1));
  }

  handleScroll = (value) => {
    if (!this.inView) return;

    this.scrolling.forEach((item, i) => {
      item.style.transform = `translate3d(${value * 50 * this.directions[i]}%,0,0)`;
    });
  };

  transitionIn() {}

  transitionOut() {
    super.destroy();
  }
}


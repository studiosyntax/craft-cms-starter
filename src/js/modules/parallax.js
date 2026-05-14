import { Track } from "./_/track";

const scale = 1.2;

export class Parallax extends Track {
  move;

  constructor(element) {
    super(element, {
      top: "bottom",
      bottom: "top",
      bounds: [-1, 1],
    });

    this.move = Array.from(this.element.querySelectorAll("[data-move]"));
    this.move.forEach((item) => {
      item.style.transform = `scale(${scale})`;
    });
  }

  handleScroll = (value) => {
    this.move.forEach((item) => {
      item.style.transform = `translateY(${value * 20}%) scale(${scale})`;
    });
  };
}


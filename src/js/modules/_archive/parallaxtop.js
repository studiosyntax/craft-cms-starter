import { Track } from "./_/track";

export class Parallax extends Track {
  constructor(element) {
    super(element, {
      top: "top",
      bottom: "top",
      bounds: [-1, 1],
    });

    this.move = this.element.querySelector("[data-move]");
  }

  handleScroll = (value) => {
    this.move.style.transform = `translateY(${value * 30}%) scale(2.2)`;
  };

  transitionOut = () => {
    this.destroy();
  };
}


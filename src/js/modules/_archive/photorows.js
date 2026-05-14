import { Track } from "./_";

export class PhotoRows extends Track {
  #move;

  constructor(element) {
    super(element);

    this.#move = Array.from(this.element.querySelectorAll("[data-move]"));
  }

  handleScroll = (value) => {
    if (!this.inView) return;

    this.#move.forEach((item, index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      item.style.transform = `translateX(${value * dir * 10}%)`;
    });
  };
}


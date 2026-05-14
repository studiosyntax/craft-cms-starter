import { Track } from "./_";

export class Move extends Track {
  #move;
  #directions;
  #quantity;

  constructor(element) {
    super(element);

    this.#move = Array.from(this.element.querySelectorAll("[data-move]"));
    this.#directions = this.#move.map((move) =>
      move.getAttribute("data-move") === "-" ? -1 : 1
    );

    this.#quantity = this.#move.map((move) => {
      const qty = move.getAttribute("data-quantity");
      if (qty === "full") return 80;
      if (qty) return parseInt(qty);
      return 30;
    });
  }

  handleScroll = (value) => {
    this.#move.forEach((move, index) => {
      move.style.transform = `translateX(${value * this.#quantity[index] * this.#directions[index]}%)`;
    });
  };

  transitionOut() {
    this.destroy();
  }
}


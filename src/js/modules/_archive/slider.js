import EmblaCarousel from "embla-carousel";

export class Slider {
  #element;
  #node;
  #slides;
  #total;
  #current;
  #next;
  #embla;
  #progressBar;

  constructor(element) {
    this.#element = element;

    this.#node = this.#element.querySelector("[data-slider='slides']");

    this.#slides = this.#node.children[0].children;
    this.#total = this.#element.querySelector("[data-slider='total']");

    this.#current = this.#element.querySelectorAll("[data-slider='current']");
    this.#next = this.#element.querySelectorAll("[data-slider='next']");
    this.#progressBar = null;

    const prog = this.#element.querySelector("[data-slider='progress']");

    if (prog) {
      this.#progressBar = {
        element: prog,
        bar: prog.children[0],
      };
    }

    this.#embla = EmblaCarousel(this.#node, {
      loop: true,
    });

    this.#total.textContent = this.#slides.length.toString();

    if (this.#next) {
      this.#next.forEach((nextButton) => {
        nextButton.onclick = () => {
          this.#embla.scrollNext();
        };
      });
    }

    this.#embla.on("select", () => {
      if (this.#current) {
        const currentIndex = (this.#embla.selectedScrollSnap() + 1).toString();
        this.#current.forEach((currentElement) => {
          currentElement.textContent = currentIndex;
        });
      }
    });

    if (this.#progressBar) {
      const bar = this.#progressBar.bar;
      bar.style.transform = `scale(0)`;
      bar.style.transformOrigin = `left`;
      bar.style.transition = `transform 0.1s ease-in-out`;
      this.#embla.on("scroll", () => {
        const progress = this.#embla.scrollProgress();
        bar.style.transform = `scale(${progress * 100}%)`;
      });
    }
  }

  transitionOut() {
    this.#embla.destroy();
  }
}


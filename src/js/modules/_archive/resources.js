export class Resources {
  constructor() {
    this.resources = [];
    this.links = document.querySelectorAll("[data-hover]");
    this.images = document.querySelectorAll("[data-image]");

    this.mouseEnterHandler = (index) => () => {
      this.images[index].classList.add("active");
    };

    this.mouseLeaveHandler = (index) => () => {
      this.images[index].classList.remove("active");
    };

    this.links.forEach((link, index) => {
      link.addEventListener("mouseenter", this.mouseEnterHandler(index));
      link.addEventListener("mouseleave", this.mouseLeaveHandler(index));
    });
  }

  transitionOut() {
    this.links.forEach((link, index) => {
      link.removeEventListener("mouseenter", this.mouseEnterHandler(index));
      link.removeEventListener("mouseleave", this.mouseLeaveHandler(index));
    });
  }
}


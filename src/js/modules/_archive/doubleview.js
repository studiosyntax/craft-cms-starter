import gsap from "../gsap";

export class DoubleView {
  state = "closed";

  element;
  trigger;
  slides;

  constructor(element) {
    this.element = element;
    this.slides = [...this.element.children];
    this.trigger = this.slides.pop();

    this.trigger.onclick = () => this.toggle();

    gsap.set(this.slides[1], {
      autoAlpha: 0,
    });

    this.slides[1].style.display = "block";
  }

  toggle() {
    if (this.state === "open") {
      this.element.classList.remove("open");
      this.state = "closed";

      gsap.to(this.slides[1], {
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
      });
    } else {
      this.state = "open";
      this.element.classList.add("open");

      gsap.to(this.slides[1], {
        autoAlpha: 1,
        duration: 1.1,
        ease: "expo.out",
      });
    }
  }

  transitionOut() {
    this.trigger.onclick = null;
  }
}


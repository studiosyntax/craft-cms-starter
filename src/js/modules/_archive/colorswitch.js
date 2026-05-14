import gsap from "../gsap";

export class ColorSwitch {
  colors = [];
  switch = [];
  alts = [];
  currentIndex = 0;

  constructor(element) {
    this.element = element;
    this.alts = Array.from(
      this.element.querySelector("[data-alts]")?.children || []
    );

    this.colors = Array.from(
      this.element.querySelectorAll("[data-colors]")
    ).map((item) => {
      const variants = item.dataset.colors?.split(",") || [];

      return {
        element: item,
        color: variants,
      };
    });

    this.switch = [
      ...Array.from(
        this.element.querySelector("[data-switch]")?.children || []
      ),
    ];

    this.switch.forEach((switchElement, index) => {
      if (index === 0) {
        switchElement.classList.add("active");
      }

      switchElement.onclick = () => {
        this.switch.forEach((switchElement) =>
          switchElement.classList.remove("active")
        );
        switchElement.classList.add("active");

        this.colors.forEach((item) => {
          gsap.to(item.element, {
            fill: "#" + item.color[index],
            backgroundColor: "#" + item.color[index],
          });
        });

        if (this.alts.length > 0) {
          this.alts.forEach((alt, i) => {
            gsap.to(alt, {
              autoAlpha: i === index ? 1 : 0,
            });
          });
        }
      };

      this.currentIndex = index;
    });
  }

  transitionOut() {
    this.switch.forEach(
      (switchElement, index) => (switchElement.onclick = null)
    );
  }
}


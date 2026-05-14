import gsap from "../gsap";

const COM_1 = [
  ["#4C00FF", "#4C00FF", "#4C00FF", "#FFFFFF"],
  ["#CBC2FF", "#4C00FF", "#4C00FF", "#FFFFFF"],
  ["#CBC2FF", "#4C00FF", "#26065D", "#FFFFFF"],
];

const COM_2 = [
  ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#4C00FF"],
  ["#FF5252", "#26065D", "#26065D", "#FFFFFF"],
  ["#FF5252", "#4C00FF", "#26065D", "#FFFFFF"],
];

const ALT_1 = [
  ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#26065D"],
  ["#CBC2FF", "#FFFFFF", "#FFFFFF", "#26065D"],
  ["#4C00FF", "#CBC2FF", "#FFFFFF", "#26065D"],
];

const ALT_2 = [
  ["#CBC2FF", "#CBC2FF", "#CBC2FF", "#26065D"],
  ["#FF5252", "#CBC2FF", "#CBC2FF", "#26065D"],
  ["#FF5252", "#CBC2FF", "#FFFFFF", "#26065D"],
];

const anim = {
  duration: 0.8,
  ease: "slow.inOut",
};

export class PieChart {
  #balance = 0;
  #struct = 0;

  switch;
  toggle;
  svgs;

  constructor(element) {
    this.element = element;
    this.switch = Array.from(
      this.element
        .querySelector("[data-piechart='switch']")
        ?.querySelectorAll("button") ?? []
    );

    this.toggle = Array.from(
      this.element
        .querySelector("[data-switch='toggle']")
        ?.querySelectorAll("button") ?? []
    );

    this.svgs = Array.from(this.element.querySelectorAll("svg"));

    this.switch.forEach((button, index) => {
      button.onclick = () => {
        this.#balance = index;

        this.changeColor();

        this.switch.forEach((button) => button.classList.remove("current"));
        button.classList.add("current");
      };
    });

    this.toggle.forEach((button, index) => {
      if (index === 0) button.classList.add("active");

      button.onclick = () => {
        this.#struct = index;

        this.changeColor();

        this.toggle.forEach((button) => button.classList.remove("active"));
        button.classList.add("active");
      };
    });

    this.changeColor(0);
  }

  changeColor(duration = anim.duration) {
    const o1 = this.#struct === 0 ? COM_1 : ALT_1;
    const o2 = this.#struct === 0 ? COM_2 : ALT_2;

    gsap.to(this.svgs[0].children, {
      ...anim,
      duration: duration,
      fill: (index) => {
        return o1[this.#balance][index];
      },
    });

    gsap.to(this.svgs[1].children, {
      ...anim,
      duration: duration,
      fill: (index) => {
        return o2[this.#balance][index];
      },
    });
  }
}


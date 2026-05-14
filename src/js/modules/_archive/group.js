import { Observe } from "./_";
import { Alpha } from "./alpha";
import { Scale } from "./scale";
import { Par } from "./par";

const LIB = [
  { name: "alpha", class: Alpha },
  { name: "scale", class: Scale },
  { name: "par", class: Par },
];

const BASE_DELAY = 0.01;

function getLib(element) {
  let delay = BASE_DELAY;
  if (element.dataset.delay) {
    delay = parseFloat(element.dataset.delay);
  }

  return Array.from(element.querySelectorAll("[data-a]")).map((child, i) => {
    const lib = LIB.find((item) => item.name === child.dataset.a);
    child.setAttribute("data-delay", `${i * delay}`);

    if (lib) return new lib.class(child);
    return null;
  });
}

export class Group {
  instances = [];

  constructor(element) {
    this.instances = getLib(element);
  }

  start() {
    this.instances.forEach((instance) => {
      instance?.start?.();
    });
  }
}


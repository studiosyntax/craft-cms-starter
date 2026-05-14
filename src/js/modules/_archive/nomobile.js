import { App } from "../app";

export class NoMobile {
  #items;

  constructor(element) {
    this.element = element;

    if (App.isMobile) {
      this.#items = this.element.querySelectorAll("[data-module]");

      this.#items.forEach((element) => {
        element.removeAttribute("data-module");
      });
    }
  }
}


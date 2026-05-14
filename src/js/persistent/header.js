import { Scroll } from "../scroll";

const SCROLL_THRESHOLD = 120;

/**
 * Header — scroll-state class toggling
 *
 * Adds `has-scrolled` to <html> and [data-header] once the user has
 * scrolled past SCROLL_THRESHOLD pixels. Persistent across page transitions.
 *
 * Usage: add data-header to your <header> element.
 */
export class Header {
  #header;
  #unsub;

  constructor() {
    this.#header = document.querySelector("[data-header]");
    if (!this.#header) return;

    const update = ({ scroll }) => {
      const scrolled = scroll > SCROLL_THRESHOLD;
      document.documentElement.classList.toggle("has-scrolled", scrolled);
      this.#header.classList.toggle("has-scrolled", scrolled);
    };

    this.#unsub = Scroll.subscribe(update, 5);

    // Sync immediately with current scroll position
    update({ scroll: Scroll.y });
  }
}

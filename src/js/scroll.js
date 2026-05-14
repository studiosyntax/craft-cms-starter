import Lenis from "lenis";
import gsap, { ScrollTrigger } from "./gsap";
import { Subscribable } from "./utils/subscribable";

/**
 * Scroll — Smooth scroll wrapper
 *
 * Composes Lenis rather than extending it, so changes to the Lenis API
 * don't break consumers. Extends Subscribable so modules can subscribe
 * using the same priority-sorted pattern as Resize/Raf.
 *
 * Subscribe: const unsub = Scroll.subscribe(({ scroll }) => { ... });
 * Unsubscribe: unsub();
 */
class _Scroll extends Subscribable {
  #lenis;

  y = 0;
  max = window.innerHeight;
  speed = 0;
  percent = 0;

  constructor() {
    super();
    this.#lenis = new Lenis({ autoResize: true });
    this.#init();
  }

  #init() {
    this.#lenis.on("scroll", this.#handleScroll);

    // Drive Lenis via GSAP ticker so both stay in sync
    gsap.ticker.add((time) => this.#lenis.raf(time * 1000));

    // Trigger Lenis resize whenever document height changes (images loading, etc.)
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(document.body);
  }

  #handleScroll = ({ scroll, limit, velocity, progress, direction }) => {
    this.y = scroll;
    this.max = limit;
    this.speed = velocity;
    this.percent = progress;

    ScrollTrigger.update();

    // Notify all subscribers (Subscribable.subs setter)
    this.subs = { scroll, limit, velocity, progress, direction };
  };

  // ─── Public API ────────────────────────────────────────────────────────────

  stop() {
    this.#lenis.stop();
  }

  start() {
    this.#lenis.start();
  }

  resize() {
    this.#lenis.resize();
  }

  scrollTo(target, options) {
    this.#lenis.scrollTo(target, options);
  }

  toTop() {
    this.#lenis.scrollTo(0, { immediate: true, force: true });
  }
}

export const Scroll = new _Scroll();

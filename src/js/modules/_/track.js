import { clientRect } from "../../utils/client-rect";
import { clamp, map } from "../../utils/math";
import { Observe } from "./observe";
import { Scroll } from "../../scroll";
import { Resize } from "../../utils/subscribable";

const DEFAULT_CONFIG = {
  bounds: [0, 1],
  top: "bottom",
  bottom: "top",
  callback: undefined,
};

/**
 * Track — base class for scroll-progress driven modules
 *
 * Extends Observe (for the inView gate) and subscribes to both Scroll
 * and Resize. While the element is in view, handleScroll(value) is called
 * on every scroll tick with a value interpolated between config.bounds.
 *
 * Bounds calculation uses a ResizeObserver on the element itself to catch
 * size changes from images loading, font changes, etc. — more reliable than
 * a fixed timeout.
 */
export class Track extends Observe {
  value = 0;
  #init = false;

  bounds;
  config;

  #scrollSub;
  #resizeSub;
  #elementObserver;

  constructor(element, config = {}) {
    super(element, {
      autoStart: false,
      once: false,
      threshold: 0,
    });

    this.element = element;
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.#resize();
    this.#scrollSub = Scroll.subscribe(this.#handleScroll);
    this.#resizeSub = Resize.subscribe(this.#resize);

    // Use a ResizeObserver on the element itself to recalculate bounds when
    // the element's size settles (e.g. images loading, font rendering).
    // More reliable than a fixed timeout.
    this.#elementObserver = new ResizeObserver(this.#resize);
    this.#elementObserver.observe(element);

    this.#handleScroll();
    this.#init = true;
  }

  triggerResize() {
    this.#resize();
  }

  #resize = () => {
    this.bounds = computeBounds(this.element, this.config);
    this.resize?.(this.bounds);
    this.#handleScroll();
  };

  #handleScroll = () => {
    if (!this.inView || !this.#init) return;
    this.value = clamp(
      this.config.bounds[0],
      this.config.bounds[1],
      map(
        Scroll.y,
        this.bounds.top,
        this.bounds.bottom,
        this.config.bounds[0],
        this.config.bounds[1]
      )
    );

    this.handleScroll?.(this.value);
    this.config.callback?.(this.value);
  };

  destroy() {
    this.config.callback = undefined;
    this.#scrollSub?.();
    this.#resizeSub?.();
    this.#elementObserver?.disconnect();
    this.#elementObserver = null;
    super.destroy();
  }
}

function computeBounds(el, config) {
  const bounds = clientRect(el);
  const { top: topPos, bottom: bottomPos, wh } = bounds;

  const centerOffset = wh / 2;

  bounds.top =
    topPos -
    (config.top === "center" ? centerOffset : config.top === "bottom" ? wh : 0);

  bounds.bottom =
    bottomPos -
    (config.bottom === "center"
      ? centerOffset
      : config.bottom === "bottom"
        ? wh
        : 0);

  return bounds;
}

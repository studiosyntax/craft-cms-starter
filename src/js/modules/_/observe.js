import { BaseModule } from "./base";

/**
 * ObserverManager — pools IntersectionObservers by config
 *
 * Reuses a single IntersectionObserver for all elements that share
 * the same root/rootMargin/threshold config, minimising observer count.
 *
 * Exported as a singleton instance (not a class with getInstance()).
 */
class ObserverManager {
  #groups = [];

  #configsMatch(a, b) {
    return (
      a.root === b.root &&
      a.rootMargin === b.rootMargin &&
      a.threshold === b.threshold
    );
  }

  #handleIntersection = (entries) => {
    entries.forEach((entry) => {
      // Use Map.has() — O(1) instead of Array.from().includes()
      const group = this.#groups.find((g) => g.elements.has(entry.target));
      if (!group) return;

      const elementData = group.elements.get(entry.target);
      if (!elementData) return;

      const { isIntersecting, intersectionRatio, boundingClientRect } = entry;
      const threshold = group.config.threshold ?? 0.1;

      // Direction: positive = scrolling down (element entering from below),
      // negative = scrolling up (element entering from above).
      // Derived from element position relative to viewport on every call,
      // so the first intersection is correct rather than always -1.
      const direction = boundingClientRect.top > 0 ? 1 : -1;

      if (intersectionRatio === 0) {
        elementData.callbacks.isOut?.({ entry, direction });
        elementData.callbacks.callback?.({ entry, direction, isIn: false });
      } else if (intersectionRatio >= threshold) {
        elementData.callbacks.isIn?.({ entry, direction });
        elementData.callbacks.callback?.({ entry, direction, isIn: true });

        if (elementData.once) {
          this.removeElement(entry.target);
        }
      }
    });
  };

  addElement(element, config, callbacks) {
    // Remove from any existing group first
    this.removeElement(element);

    let group = this.#groups.find((g) => this.#configsMatch(g.config, config));

    if (!group) {
      const observer = new IntersectionObserver(this.#handleIntersection, {
        root: config.root ?? null,
        rootMargin: config.rootMargin ?? "0px",
        threshold: [0, config.threshold ?? 0.1],
      });

      group = { config, observer, elements: new Map() };
      this.#groups.push(group);
    }

    group.elements.set(element, {
      callbacks,
      once: config.once ?? false,
    });
    group.observer.observe(element);

    return group;
  }

  removeElement(element) {
    const group = this.#groups.find((g) => g.elements.has(element));
    if (!group) return;

    group.observer.unobserve(element);
    group.elements.delete(element);

    if (group.elements.size === 0) {
      group.observer.disconnect();
      this.#groups = this.#groups.filter((g) => g !== group);
    }
  }
}

// Singleton instance — ES modules are singletons by nature; no getInstance() needed
export const observerManager = new ObserverManager();

/**
 * Observe — base class for viewport-triggered modules
 *
 * Extends BaseModule. Registers with ObserverManager on start(),
 * calls isIn() / isOut() when the element crosses the threshold.
 *
 * Usage:
 *   class MyModule extends Observe {
 *     constructor(el) { super(el, { threshold: 0.2, once: true }); }
 *     isIn({ direction }) { ... }
 *   }
 */
export class Observe extends BaseModule {
  #config;
  inView = false;
  callback;

  constructor(
    element,
    config = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
      once: false,
      callback: null,
    }
  ) {
    super(element);
    this.#config = config;
    this.callback = config.callback ?? null;
  }

  /** Override in subclass — called when element enters viewport */
  isIn(data) {}

  /** Override in subclass — called when element exits viewport */
  isOut(data) {}

  start() {
    observerManager.addElement(this.element, this.#config, {
      isIn: (data) => {
        this.inView = true;
        this.isIn(data);
      },
      isOut: (data) => {
        this.inView = false;
        this.isOut(data);
      },
      callback: this.callback,
    });
  }

  stop() {
    observerManager.removeElement(this.element);
    this.inView = false;
  }

  destroy() {
    this.stop();
  }
}

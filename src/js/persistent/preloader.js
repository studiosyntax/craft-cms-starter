import gsap from "../gsap";
import hey from "../hey";

/**
 * Preloader
 *
 * Masks the page with a full-screen overlay that animates out when ready.
 * No knowledge of Dom or module lifecycle — App owns those calls.
 *
 * init() resolves at the "reveal" moment (when Dom.start() should fire),
 * not when the animation is fully complete. The final slide-out continues
 * independently. This lets modules start animating while the cover is still
 * leaving the screen, keeping the transition smooth.
 *
 * If the [data-preloader] element is absent, init() resolves immediately
 * and the project behaves as if usePreloader: false.
 */
class _Preloader {
  #element;
  #progress;
  #content;
  #hasRun = false;
  #isComplete = false;
  #onCompleteCallbacks = [];

  constructor() {
    this.#element = document.querySelector("[data-preloader]");

    if (this.#element) {
      const progressEl = this.#element.querySelector(
        "[data-preloader-progress]"
      );
      this.#progress =
        progressEl?.querySelector(".progress-bar") || progressEl;
      this.#content = this.#element.querySelector("[data-preloader-content]");
    }
  }

  get exists() {
    return !!this.#element;
  }

  get isComplete() {
    return this.#isComplete;
  }

  /**
   * Run the preloader sequence.
   *
   * Resolves when modules should begin animating (the "reveal" moment),
   * which is slightly before the overlay finishes sliding out. App calls
   * Dom.start() immediately after this resolves.
   */
  async init() {
    if (!this.#element || this.#hasRun) {
      return Promise.resolve();
    }

    this.#hasRun = true;
    hey.PRELOADER_START = true;

    await this.#waitForReady();

    return new Promise((resolve) => {
      this.#animate(resolve);
    });
  }

  async #waitForReady() {
    if (this.#progress) {
      gsap.set(this.#progress, { scaleX: 0 });
    }

    const loadPromise =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) => {
            window.addEventListener("load", resolve, { once: true });
          });

    const minDelay = 1000;
    const start = performance.now();
    const duration = minDelay * 0.7;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / duration);
      this.setProgress(easeOutCubic(t) * 0.85);
    }, 50);

    await loadPromise;
    clearInterval(progressInterval);

    const remaining = Math.max(0, minDelay - (performance.now() - start));
    await new Promise((resolve) => setTimeout(resolve, remaining));

    this.setProgress(1);
  }

  /**
   * @param {Function} onReveal - Called when Dom.start() should fire.
   *   Happens before the animation fully completes, so modules begin
   *   animating while the overlay is still exiting.
   */
  #animate(onReveal) {
    const tl = gsap.timeline({
      onComplete: () => {
        if (this.#element) this.#element.style.display = "none";
        this.#isComplete = true;
        hey.PRELOADER_COMPLETE = true;
        this.#onCompleteCallbacks.forEach((cb) => cb());
      },
    });

    tl.to(this.#content || this.#element, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "expo.out",
    });

    tl.to(
      this.#element,
      { yPercent: -100, duration: 0.8, ease: "expo.inOut" },
      "-=0.2"
    );

    // Resolve here — App calls Dom.start() at this point.
    // Modules begin animating while the overlay is still sliding out.
    tl.call(() => onReveal(), null, "-=0.4");
  }

  setProgress(value) {
    if (this.#progress) {
      gsap.to(this.#progress, {
        scaleX: Math.min(1, Math.max(0, value)),
        duration: 0.5,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });
    }
  }

  onComplete(callback) {
    if (this.#isComplete) {
      callback();
    } else {
      this.#onCompleteCallbacks.push(callback);
    }
  }

  skip() {
    if (this.#element) this.#element.style.display = "none";
    this.#hasRun = true;
    this.#isComplete = true;
    hey.PRELOADER_COMPLETE = true;
    // Dom.start() is NOT called here — App owns that after await Preloader.init()
  }
}

export const Preloader = new _Preloader();

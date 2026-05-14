import { Observe } from "./_";
import lottie from "lottie-web";
import { Resize } from "../utils/subscribable";

export class Lottie extends Observe {
  #src;
  #canvas;
  #loaded = false;
  #animation;
  #loop;

  constructor(element) {
    super(element);
    this.#src = this.element.dataset.src;
    this.#loop = this.element.dataset.loop === "true";
    this.#canvas = this.element;

    this.load();
  }

  async load() {
    if (!this.#canvas) return;

    const existingCanvas = this.#canvas.querySelector("canvas");
    if (existingCanvas) {
      const existingAnimation = lottie
        .getRegisteredAnimations()
        .find((anim) => anim.wrapper === this.#canvas);

      if (existingAnimation) {
        this.#animation = existingAnimation;
        this.#loaded = true;
        return;
      }
    }

    this.#animation = lottie.loadAnimation({
      container: this.#canvas,
      renderer: "canvas",
      loop: this.#loop,
      autoplay: false,
      path: this.#src,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    this.#animation.addEventListener("data_failed", () => {
      console.alert("Error loading animation:", this.#src);
    });

    this.#animation.addEventListener("DOMLoaded", () => {
      this.#loaded = true;
    });
  }

  isIn() {
    if (!this.#animation) return;

    if (this.#loaded) {
      this.#animation.play();
    } else {
      const playOnLoad = () => {
        this.#animation.play();
        this.#animation.removeEventListener("DOMLoaded", playOnLoad);
      };
      this.#animation.addEventListener("DOMLoaded", playOnLoad);
    }
  }

  isOut() {
    if (!this.#animation) return;

    if (this.#loaded) {
      this.#animation.stop();
    }
  }

  destroy() {
    if (this.#animation) {
      this.#animation.destroy();
      this.#animation = null;
    }
  }

  getOriginalAspectRatio() {
    if (!this.#loaded || !this.#animation?.animationData) {
      return null;
    }
    return this.#animation.animationData.w / this.#animation.animationData.h;
  }
}


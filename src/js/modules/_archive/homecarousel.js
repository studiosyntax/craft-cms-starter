import gsap from "../gsap";
import { Pages } from "../pages";
import { App } from "../app";

import VirtualScroll from "virtual-scroll";

export class HomeCarousel extends VirtualScroll {
  name = "carousel";

  items = [];
  itemsChild = [];
  wrapper;

  #currentY = 0;
  #targetY = 0;
  #progress = 0;
  #animationFrameId = null;
  #isAnimating = false;
  #currentFrontIndex = 0;
  #previousFrontIndex = 0;
  #isStopped = false;
  #onFrontImageChange;

  IS_SMOOTH = true;
  LERP_FACTOR = 0.1;
  VERTICAL_MOVEMENT_SCALE = 0.1;
  BASE_SCALE = 0.8;
  MIN_SCALE = 0.4;
  RADIUS = 1500;
  BASE_Z_OFFSET = !App.isMobile ? -1200 : -1700;
  PERSPECTIVE = 2000;
  SCROLL_SPEED = !App.isMobile ? 50 : 10;
  MIN_OPACITY = 0.2;

  guidelineText = document.querySelector("[data-guidelines]");

  #logFrontImageChange(prevIndex, newIndex) {
    this.textTarget.textContent = this.texts[newIndex];
  }

  constructor(element) {
    super(element, {});

    this.element = element;

    this.items = Array.from(
      this.element.querySelectorAll("[data-carousel='item']")
    );

    this.wrapper = this.items[0].parentElement;

    if (this.wrapper) {
      this.wrapper.style.perspective = `${this.PERSPECTIVE}px`;
      this.wrapper.style.transformStyle = "preserve-3d";
    }

    this.texts = this.items.map((item) => item.dataset.text);
    this.textTarget = this.element.querySelector("[data-target='text']");
    this.textTarget.textContent = this.texts[0];
    gsap.set(this.textTarget, {
      autoAlpha: 0,
      yPercent: 200,
    });

    gsap.set(this.guidelineText, {
      yPercent: -500,
    });

    if (this.IS_SMOOTH) {
      this.#startAnimation();
    } else {
      this.#updateCarousel(0);
    }

    this.#onFrontImageChange = this.#logFrontImageChange.bind(this);

    this.items.forEach((item) => {
      const src = item.dataset.link;

      item.onclick = async () => {
        this.animateOut();
        Pages.navigateTo("/" + src.toLowerCase(), "loop");
      };
    });

    this.on((e) => this.#onScroll(e));
  }

  #startAnimation() {
    if (!this.#isAnimating) {
      this.#isAnimating = true;
      this.#animate();
    }
  }

  #onScroll({ deltaY }) {
    if (this.#isStopped) return;

    if (this.IS_SMOOTH) {
      this.#targetY += deltaY;
    } else {
      this.#currentY += deltaY;
      this.#progress = this.#currentY;
      this.#updateCarousel(this.#progress);
    }
  }

  #animate = () => {
    if (this.IS_SMOOTH) {
      const delta = this.#targetY - this.#currentY;
      this.#currentY += delta * this.LERP_FACTOR;

      const progressDelta = this.#currentY - this.#progress;
      this.#progress += progressDelta * this.LERP_FACTOR;

      this.#updateCarousel(this.#progress);

      this.#animationFrameId = requestAnimationFrame(this.#animate);
    }
  };

  #updateCarousel(y) {
    const totalItems = this.items.length;
    const totalAngle = 360;
    const anglePerItem = totalAngle / totalItems;

    let maxZ = -Infinity;
    let frontIndex = 0;

    this.items.forEach((item, i) => {
      let baseAngle = y / this.SCROLL_SPEED + i * anglePerItem;

      baseAngle = baseAngle % 360;
      if (baseAngle < 0) baseAngle += 360;

      const angleRad = (baseAngle * Math.PI) / 180;

      const zPos = this.BASE_Z_OFFSET + this.RADIUS * Math.cos(angleRad);
      const yPos =
        this.RADIUS * Math.sin(angleRad) * this.VERTICAL_MOVEMENT_SCALE;

      if (zPos > maxZ) {
        maxZ = zPos;
        frontIndex = i;
      }

      const normalizedPos =
        (zPos - this.BASE_Z_OFFSET + this.RADIUS) / (this.RADIUS * 2);
      const scale =
        this.MIN_SCALE + (this.BASE_SCALE - this.MIN_SCALE) * normalizedPos;

      const opacity = Math.min(1, Math.max(this.MIN_OPACITY, normalizedPos));

      item.style.transform = `
        translateZ(${zPos}px)
        translateY(${yPos}px)
        scale(${scale})
        `;

      item.style.opacity = opacity.toString();
    });

    if (frontIndex !== this.#currentFrontIndex) {
      this.#previousFrontIndex = this.#currentFrontIndex;
      this.#currentFrontIndex = frontIndex;

      this.#onFrontImageChange?.(
        this.#previousFrontIndex,
        this.#currentFrontIndex
      );
    }
  }

  init() {}

  destroy() {
    this.#isAnimating = false;
    if (this.#animationFrameId) {
      cancelAnimationFrame(this.#animationFrameId);
    }
  }

  setFrontImageChangeCallback(callback) {
    this.#onFrontImageChange = callback;
  }

  animateIn() {
    this.#isStopped = false;
    this.itemsChild = this.items.map((item) => item.children[0]);
    this.itemsChild.forEach((item) => {
      gsap.set(item, {
        autoAlpha: 1,
      });
    });

    gsap.set(this.itemsChild, {
      autoAlpha: 1,
    });

    gsap.fromTo(
      this.itemsChild,
      {
        yPercent: (i) => (i % 2 === 0 ? -180 * i : 180 * i),
        scale: 0,
      },
      {
        yPercent: 0,
        scale: 1,
        stagger: {
          each: 0.01,
          from: "start",
        },
        duration: 1.8,
        ease: "expo.out",
        delay: 0.3,
      }
    );

    gsap.to(this.textTarget, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.4,
      ease: "expo.out",
      delay: 0.5,
    });

    gsap.to(this.guidelineText, {
      yPercent: 0,
      duration: 1.4,
      ease: "expo.out",
      delay: 0.8,
    });
  }

  async animateOut(duration = 1.2) {
    this.#isStopped = true;

    await gsap.to(this.itemsChild, {
      yPercent: !App.isMobile ? -180 : -400,
      scale: 0.6,
      stagger: {
        each: 0.002,
        from: "end",
      },
      duration: duration,
      delay: 0.1,
      ease: "expo.out",
    });
  }
}


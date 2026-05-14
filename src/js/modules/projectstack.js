/**
 * ProjectStack Module
 *
 * Cards scroll into view one by one. Each card pins at a set position, then the
 * next card scrolls up over it while the previous scales down and fades.
 *
 * Flow:
 * 1. First card scrolls into view from below
 * 2. Pins at PIN_TOP (e.g. 20% from top)
 * 3. Second card scrolls up over the first
 * 4. First card scales down and fades
 * 5. Repeat for each card
 *
 * Usage:
 * <section data-module="projectstack">
 *   <div data-project-stack>
 *     <div data-project>...</div>
 *     <div data-project>...</div>
 *   </div>
 * </section>
 */

import gsap from "../gsap";
import { ScrollTrigger } from "../gsap";
import { reduced } from "../gsap";

const SEGMENT_HEIGHT = 0.8; // Viewport heights per card
const PIN_TOP = 0.2; // Pin position: 20% from top of viewport
const SCALE_EXIT = 0.9;
const OPACITY_EXIT = 0.5;
const ENTER_DISTANCE = 1; // Cards enter from 1 viewport below

export class ProjectStack {
  element;
  cards;
  container;
  #triggers = [];

  constructor(element) {
    this.element = element;
    this.container =
      element.querySelector("[data-project-stack]") ||
      element.querySelector(".flex.flex-col");
    this.cards = Array.from(
      this.container?.querySelectorAll("[data-project]") || []
    );

    if (reduced || this.cards.length < 2) return;

    this.#init();
  }

  #init() {
    if (!this.container || this.cards.length === 0) return;

    const vh = window.innerHeight;
    const totalHeight = vh * SEGMENT_HEIGHT * this.cards.length;
    const pinTopPx = vh * PIN_TOP;

    // Container = viewport-sized stage
    gsap.set(this.container, {
      position: "relative",
      height: `${vh}px`,
      minHeight: `${vh}px`,
      paddingTop: 0,
      display: "block",
      overflow: "visible",
    });

    // Position cards: absolute, stacked by z-index (later cards on top)
    this.cards.forEach((card, i) => {
      gsap.set(card, {
        position: "absolute",
        top: pinTopPx,
        left: "50%",
        xPercent: -50,
        width: "100%",
        maxWidth: "min(90vw, 1200px)",
        zIndex: i,
      });
    });

    // Pin when container hits viewport top
    const pinTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: `+=${totalHeight}`,
      pin: this.container,
      pinSpacing: true,
      invalidateOnRefresh: true,
    });
    this.#triggers.push(pinTrigger);

    const scrubTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: `+=${totalHeight}`,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => this.#updateCards(self.progress, vh),
    });
    this.#triggers.push(scrubTrigger);
  }

  #updateCards(progress, vh) {
    const n = this.cards.length;
    const segmentDuration = 1 / n;

    this.cards.forEach((card, i) => {
      const segmentStart = i / n;
      const nextSegmentStart = (i + 1) / n;

      // Enter: first half of our segment - scroll up from below into pin position
      const enterProgress = Math.max(
        0,
        Math.min(1, (progress - segmentStart) / (segmentDuration * 0.5))
      );

      // Exit: when next card enters (next segment's first half) - scale down as it scrolls over us
      const exitProgress =
        i === n - 1
          ? 0
          : Math.max(
              0,
              Math.min(
                1,
                (progress - nextSegmentStart) / (segmentDuration * 0.5)
              )
            );

      // Y: start below viewport (vh), animate up to pin position (0)
      const enterY = (1 - enterProgress) * vh * ENTER_DISTANCE;

      // Scale and opacity: full when pinned, reduced when next card scrolls over
      const scale = 1 - exitProgress * (1 - SCALE_EXIT);
      const opacity = 1 - exitProgress * (1 - OPACITY_EXIT);

      gsap.set(card, {
        y: enterY,
        scale,
        opacity,
      });
    });
  }

  transitionOut() {
    this.#triggers.forEach((t) => t.kill());
    this.#triggers = [];
  }
}

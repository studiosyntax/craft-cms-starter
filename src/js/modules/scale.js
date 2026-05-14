import { Track } from "./_/track";
import gsap from "../gsap";

/**
 * Scale Module
 * 
 * Scales an element based on scroll position within viewport.
 * 
 * Usage:
 * <div data-module="scale">
 *   <img data-scale src="..." />
 * </div>
 */
export class Scale extends Track {
  target;
  startScale;
  endScale;

  constructor(element) {
    super(element, {
      top: "bottom",
      bottom: "top",
      bounds: [0, 1],
    });

    this.target = element.querySelector("[data-scale]") || element;
    this.startScale = parseFloat(element.dataset.startScale) || 0.8;
    this.endScale = parseFloat(element.dataset.endScale) || 1;
  }

  handleScroll = (value) => {
    const scale = this.startScale + (this.endScale - this.startScale) * value;
    gsap.set(this.target, { scale });
  };
}


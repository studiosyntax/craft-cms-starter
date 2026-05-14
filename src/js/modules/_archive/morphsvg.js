import { Observe } from "./_";
import gsap, { MorphSVGPlugin } from "../gsap";

export class MorphSVG extends Observe {
  svgs;
  paths;
  currentIndex = 0;
  autoMorph = null;

  constructor(element) {
    super(element);
    this.svgs = Array.from(element.querySelectorAll("svg"));

    MorphSVGPlugin.convertToPath(
      "circle, rect, ellipse, line, polygon, polyline"
    );

    this.paths = this.svgs.map((svg) =>
      Array.from(svg.children).filter((child) => child)
    );

    this.paths.forEach((pathGroup) => {
      pathGroup.forEach((path, index) => {
        gsap.set(path, {
          visibility: index === 0 ? "visible" : "hidden",
        });
      });
    });
  }

  isIn() {
    this.startAutoMorph();
  }

  isOut() {
    this.stopAutoMorph();
  }

  #morphToNext() {
    this.paths.forEach((pathGroup) => {
      const currentPath = pathGroup[this.currentIndex];
      const nextIndex = (this.currentIndex + 1) % pathGroup.length;
      const nextPath = pathGroup[nextIndex];

      gsap.set(nextPath, { visibility: "hidden" });

      const tl = gsap.timeline({
        onComplete: () => {
          this.currentIndex = nextIndex;
        },
      });

      tl.to(currentPath, {
        duration: 0.875,
        morphSVG: {
          shape: nextPath,
          type: "rotational",
          map: "position",
          updateTarget: true,
        },
        ease: "power4.inOut",
      });

      tl.set(currentPath, { visibility: "hidden" }).set(nextPath, {
        visibility: "visible",
      });
    });
  }

  startAutoMorph(delay = 2) {
    this.autoMorph = gsap.delayedCall(delay, () => {
      this.#morphToNext();
      this.autoMorph?.restart(true);
    });
  }

  stopAutoMorph() {
    if (this.autoMorph) {
      this.autoMorph.kill();
      this.autoMorph = null;
    }
  }

  addShapeHint(fromPathIndex, toPathIndex, fromPosition, toPosition) {
    this.paths.forEach((pathGroup) => {
      const fromPath = pathGroup[fromPathIndex];
      const toPath = pathGroup[toPathIndex];
      if (fromPath && toPath) {
        MorphSVGPlugin.addShapeHint(fromPath, toPath, fromPosition, toPosition);
      }
    });
  }
}


import gsap from "gsap";

import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

import { prefersReducedMotion } from "./utils/media";

gsap.registerPlugin(CustomEase, ScrollTrigger, Flip, SplitText);

const easeMenu = CustomEase.create("custom", "M0,0 C0.47,0.03 0,0.92 1,1");
const easeVideo = CustomEase.create("custom", "M0,0 C0.19,1 0.22,1 1,1");

const defaults = {
  ease: "expo.out",
  duration: 1.2,
};

gsap.defaults(defaults);

const reduced = prefersReducedMotion();

const resetInitial = (element) => {
  const hidden = element.querySelectorAll("[data-start='hidden']");
  gsap.set(hidden.length ? hidden : element, {
    visibility: "visible",
  });
};

gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({
  ignoreMobileResize: true,
});

gsap.config({
  nullTargetWarn: false,
});

export default gsap;
export { defaults, reduced, easeMenu, resetInitial, easeVideo };
export { ScrollTrigger, Flip, SplitText };

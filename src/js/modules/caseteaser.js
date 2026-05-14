import { Track } from "./_";

export class CaseTeaser extends Track {
    scrolling;
    tl;
    directions;

    constructor(element) {
        super(element, {
            top: "bottom",
            bottom: "center",
            bounds: [0, 200]
          });

        this.scrolling = element.querySelector('figure');
    }

    // handleScroll =  (value) => {
    //     if (!this.inView) return;
    //     this.scrolling.style.clipPath = `inset(0 ${(1 - value) * 50}% 0 ${(1 - value) * 50}%)`;
    // }

    handleScroll = (value) => {
        // More granular control over the reveal
        const progress = Math.min(value / 200, 1); // Normalize to 0-1
        const clipLeft = (1 - progress) * 35;  // Left side clips 0-30%
        const clipRight = (1 - progress) * 35;  // Right side clips 0-50%
        this.scrolling.style.clipPath = `inset(0 ${clipRight}% 0 ${clipLeft}%)`;
      }
}
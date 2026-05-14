import gsap, { Flip, ScrollTrigger, SplitText } from "../gsap";
import { reduced, resetInitial } from "../gsap";
import { isTabletOrBelow } from "../utils/media";
import { Observe } from "./_/observe";
import { Resize } from "../utils/subscribable";

/**
 * Hero sequence uses a SINGLE trigger: when the hero section enters the viewport.
 * All animations (H1, subtitle, image) start from that moment with their delays.
 *
 * This fixes the issue where independent Text/Alpha modules each trigger on their
 * own element's viewport entry — causing unpredictable order since each element
 * can enter at different times.
 */
export class HeroHome extends Observe {
    #box;
    #markerStart;
    #markerFinal;
    #titleEl;
    #subtitleEl;
    #imageEl;
    #titleSplit;
    #subtitleSplit;
    #introRun = false;
    #ctx;
    #resizeSub;

    constructor(element) {
        super(element, { threshold: 0.1, once: true });
        this.create();
    }

    create() {
        this.#box = this.element.querySelector("[data-flip-box]");
        this.#markerStart = this.element.querySelector("[data-flip-marker-start]");
        this.#markerFinal = this.element.querySelector("[data-flip-marker-final]");
        this.#titleEl = this.element.querySelector("[data-hero-title]") || this.element.querySelector("h1");
        this.#subtitleEl = this.element.querySelector("[data-hero-subtitle]") || this.element.querySelector("h2");
        this.#imageEl = this.element.querySelector("[data-hero-image]") || this.element.querySelector("[data-flip-box] > div");

        if (!this.#box || !this.#markerStart || !this.#markerFinal) {
            console.warn("HeroHome: Missing data-flip-box, data-flip-marker-start, or data-flip-marker-final");
            return;
        }

        this.#setStartStates();
        this.#createTimeline();

        this.#resizeSub = Resize.subscribe(this.#handleResize);
    }

    #setStartStates = () => {
        if (reduced) return;

        // H1 – SplitText + hidden lines (before preloader reveals)
        if (this.#titleEl) {
            resetInitial(this.#titleEl);
            this.#titleSplit = SplitText.create(this.#titleEl, {
                type: "lines",
                mask: "lines",
                linesClass: "line",
            });
            gsap.set(this.#titleSplit.lines, { yPercent: 110 });
        }

        // Subtitle – SplitText + hidden lines
        if (this.#subtitleEl) {
            this.#subtitleSplit = SplitText.create(this.#subtitleEl, {
                type: "lines",
                mask: "lines",
                linesClass: "line",
            });
            gsap.set(this.#subtitleSplit.lines, { yPercent: 110 });
        }

        // Image – hidden
        if (this.#imageEl) {
            gsap.set(this.#imageEl, { autoAlpha: 0 });
        }
    };

    isIn = () => {
        if (!this.#introRun) this.#runIntroSequence();
    };

    #runIntroSequence = () => {
        if (reduced || this.#introRun) return;
        this.#introRun = true;

        const tl = gsap.timeline({
            defaults: { ease: "expo.out", duration: 1.2 },
        });

        // 1. H1 – animate lines in (start states already set in create)
        if (this.#titleSplit?.lines) {
            tl.to(this.#titleSplit.lines, {
                yPercent: 0,
                stagger: { each: 0.05 },
                duration: 1.2,
                onComplete: () => {
                    this.#titleSplit?.revert();
                    this.#titleSplit = null;
                },
            }, 0);
        }

        // 2. Subtitle – animate lines in, starts 0.5s after H1
        if (this.#subtitleSplit?.lines) {
            tl.to(
                this.#subtitleSplit.lines,
                {
                    yPercent: 0,
                    stagger: { each: 0.05 },
                    duration: 1.2,
                    onComplete: () => {
                        this.#subtitleSplit?.revert();
                        this.#subtitleSplit = null;
                    },
                },
                0.5
            );
        }

        // 3. Image fade – starts 1.2s after hero enters
        if (this.#imageEl) {
            tl.to(
                this.#imageEl,
                { autoAlpha: 1, duration: 1.5 },
                0.7
            );
        }
    };

    #createTimeline = () => {
        // Clean up previous context if it exists
        this.#ctx?.revert();

        this.#ctx = gsap.context(() => {
            // On mobile: just fit to start marker, no animation
            if (isTabletOrBelow()) {
                Flip.fit(this.#box, this.#markerStart, { duration: 0 });
                return;
            }

            // Get the state of both markers (these define our waypoints)
            const startState = Flip.getState(this.#markerStart);
            const finalState = Flip.getState(this.#markerFinal);

            // Fit box to start position initially
            Flip.fit(this.#box, startState, { duration: 0 });

            // Create timeline with ScrollTrigger
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.#markerStart,
                    start: "bottom 90%",
                    endTrigger: this.#markerFinal,
                    end: "bottom bottom",
                    scrub: true,
                    // markers: true, // Uncomment for debugging
                },
            });

            // Add the flip animation to the timeline
            tl.add(
                Flip.fit(this.#box, finalState, {
                    duration: 1,
                    ease: "none",
                })
            );
        });
    };

    #handleResize = () => {
        this.#createTimeline();
    };

    destroy() {
        this.#resizeSub?.();
        this.#titleSplit?.revert();
        this.#subtitleSplit?.revert();
        this.#ctx?.revert();
        super.destroy();
    }
}

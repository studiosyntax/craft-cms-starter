import { Observe } from "./_/observe";
import gsap, { reduced, resetInitial, SplitText } from "../gsap";
import { computeParams } from "./_/index";

export class Text extends Observe {
  #anim;
  #splitInstance;
  #splitElements;
  type;

  a = {
    duration: 1.2,
    delay: 0.2,
    yPercent: 0,
    stagger: {
      each: 0.05,
    },
  };

  constructor(element) {
    super(element);

    this.create();
    // this.isOut();
    resetInitial(element);


  }

  create() {
    if (reduced) return;

    this.type = this.element.dataset.type || "lines";

    // Store original text before splitting (for aria-label)
    const originalText = this.element.textContent || this.element.innerText;

    // Create SplitText instance with mask option
    // The mask option wraps each split unit in an extra element (div with overflow: clip)
    // This gives us an extra wrapper element for more flexible animations
    this.#splitInstance = SplitText.create(this.element, {
      type: this.type,
      mask: this.type, // Wrap each split unit in an extra element
    //   autoSplit: true,
      charsClass: "char",
      linesClass: "line",
      wordsClass: "word",
      onSplit: (instance) => {

        if (this.type === "chars") {
            this.#splitElements = instance.chars;
        } else if (this.type === "words") {
            this.#splitElements = instance.words;
        } else {
        // Default to words
            this.#splitElements = instance.lines;
        }

        gsap.set(instance[this.type], {
            yPercent: 110
        })
      }
    });

    // Set aria-label from original text (like the old split utility did)
    if (originalText) {
        this.element.setAttribute("aria-label", originalText.trim());
    }


    computeParams(this.element, this.a);
  }

  isIn = () => {
    if (reduced) return;
    if (this.#anim) return;


    this.#anim = gsap.to(this.#splitElements, {
      ...this.a,
      onComplete: () => {
        this.#splitInstance.revert();

      }
    });

  };

  isOut = () => {
    if (reduced) return;

    // if (this.#anim) this.#anim.kill();
    // gsap.set(this.#splitElements, {
    //   yPercent: 110,
    // });
  };

  resize = () => {
    this.isIn();
  }

  transitionOut() {
    // Clean up SplitText instance
    if (this.#splitInstance) {
      this.#splitInstance.revert();
    }
    this.destroy();
  }
}

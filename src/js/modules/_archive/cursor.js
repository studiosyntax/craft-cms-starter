import { Observe } from "./_";
import { Raf } from "../utils/subscribable";

export class Cursor extends Observe {
  #raf = Raf.subscribe(this.raf.bind(this));
  mouseX = 0;
  mouseY = 0;

  cursor;
  text;
  #target = document.querySelector("[data-cursor='target']");

  constructor(element) {
    super(element);
    this.cursor = this.element.children[0];

    this.#target.onmousemove = (e) => {
      const rect = this.#target.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };

    let lasttargetHover = 0;
    this.#target.children[0].classList.add("active");

    Array.from(this.#target.children).forEach((child, index) => {
      child.onmouseenter = () => {
        lasttargetHover = index;
        child.classList.add("active");
      };

      child.onmouseleave = () => {
        child.classList.remove("active");
      };
    });

    this.text = this.cursor.querySelector(".cursor-tx");

    this.#target.onmouseenter = () => {
      this.cursor.style.visibility = "visible";
      this.#target.children[lasttargetHover].classList.remove("active");
    };

    this.#target.onmouseleave = () => {
      this.cursor.style.visibility = "hidden";
      this.#target.children[lasttargetHover].classList.add("active");
    };

    Array.from(this.#target.children).forEach((child) => {
      child.onclick = async () => {
        const color = child.dataset.copy;

        try {
          const textArea = document.createElement("textarea");
          textArea.value = color;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);

          await navigator.clipboard.writeText(color);
          this.text.textContent = "Copied";

          setTimeout(() => {
            this.text.textContent = "Copy";
          }, 2000);
        } catch (err) {
          console.warn("Failed to copy color to clipboard:", err);
        }
      };
    });
  }

  raf() {
    this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
  }

  transitionOut() {
    this.#raf();
    document.onmousemove = null;
  }
}


/**
 * CopyEmail — clipboard copy for [data-copy-email] buttons
 *
 * Persistent across page transitions. Reads the email from the button's
 * data-copy-email attribute, or from a child [data-copy-email-element].
 *
 * Usage:
 *   <button data-copy-email="hello@example.com" aria-label="Copy email">...</button>
 *   <button data-copy-email aria-label="Copy email">
 *     <span data-copy-email-element>hello@example.com</span>
 *   </button>
 */
export class CopyEmail {
  constructor() {
    document.querySelectorAll("[data-copy-email]").forEach((button) => {
      button.addEventListener("click", this.#handleInteraction);
      button.addEventListener("keydown", this.#handleInteraction);
      button.addEventListener("mouseleave", () => this.#reset(button));
      button.addEventListener("blur", () => this.#reset(button));
    });
  }

  #handleInteraction = (e) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" && (e.key === "Enter" || e.key === " "))
    ) {
      e.preventDefault();
      this.#copy(e.currentTarget);
    }
  };

  #copy(button) {
    const email =
      button.getAttribute("data-copy-email") ||
      button.querySelector("[data-copy-email-element]")?.textContent.trim();

    if (!email) return;

    navigator.clipboard.writeText(email).then(() => {
      button.setAttribute("data-copy-button", "copied");
      button.setAttribute("aria-label", "Email copied to clipboard!");
    });
  }

  #reset(button) {
    button.removeAttribute("data-copy-button");
    button.setAttribute("aria-label", "Copy email to clipboard");
    button.blur();
  }
}

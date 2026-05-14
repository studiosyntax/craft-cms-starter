import { Scroll } from "../scroll";
import { ScrollTrigger } from "../gsap";
import hey from "../hey";

/**
 * Navigation — progress nav with scroll-anchor active states
 *
 * Handles:
 *   [data-navbar]       — sliding progress indicator between nav items
 *   [data-nav-anchor]   — ScrollTrigger per section to set is-active states
 *   [data-nav-mobile]   — mobile nav open/close with scroll-to-anchor
 *
 * Persistent: survives page transitions.
 * ScrollTrigger instances are re-created on PAGE_IN so they target the
 * correct anchors in the newly loaded page.
 *
 * Copy-to-clipboard and header scroll state have been moved to their
 * own persistent modules (copy-email.js, header.js).
 */
export class Navigation {
  #navbar = null;
  #items = null;
  #indicator = null;
  #mobileNav = null;
  #scrollTriggers = [];

  constructor() {
    this.#initNav();
    this.#initMobileNav();

    // Re-create ScrollTriggers after each page transition.
    // Dom.destroy() kills all ScrollTriggers (page-scoped), so nav triggers
    // must be rebuilt for the new page's anchors.
    hey.on("PAGE_IN", () => {
      this.#destroyScrollTriggers();
      this.#initScrollTriggers();
    });
  }

  #initNav() {
    this.#navbar = document.querySelector("[data-navbar]");
    if (!this.#navbar) return;

    this.#items = this.#navbar.querySelector("[data-navbar-items]");
    this.#indicator = this.#items.querySelector(".progress-nav__indicator");

    if (!this.#indicator) {
      this.#indicator = document.createElement("div");
      this.#indicator.className = "progress-nav__indicator";
      this.#items.appendChild(this.#indicator);
    }

    // Scroll-to-anchor on desktop nav item click
    this.#navbar.querySelectorAll("[data-navbar-item]").forEach((item) => {
      item.addEventListener("click", (e) => {
        const href = item.getAttribute("href");
        if (!href?.startsWith("#") || href === "#") return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();
        Scroll.scrollTo(target, { offset: 0 });
      });
    });

    // Initial ScrollTrigger setup
    this.#initScrollTriggers();
  }

  #initScrollTriggers() {
    if (!this.#navbar) return;

    document.querySelectorAll("[data-nav-anchor]").forEach((anchor) => {
      const anchorId = anchor.getAttribute("id");
      if (!anchorId) return;

      const trigger = ScrollTrigger.create({
        trigger: anchor,
        start: "0% 50%",
        end: "100% 50%",
        onEnter: () => this.#setActive(anchorId),
        onEnterBack: () => this.#setActive(anchorId),
      });

      this.#scrollTriggers.push(trigger);
    });
  }

  #destroyScrollTriggers() {
    this.#scrollTriggers.forEach((t) => t.kill());
    this.#scrollTriggers = [];
  }

  #setActive(anchorId) {
    if (!this.#items) return;

    const activeLink = this.#items.querySelector(
      `[data-navbar-item="#${anchorId}"]`
    );
    if (!activeLink) return;

    this.#items
      .querySelectorAll("[data-navbar-item]")
      .forEach((sib) => sib.classList.remove("is-active"));

    activeLink.classList.add("is-active");
    this.#updateIndicator(activeLink);
  }

  #updateIndicator(activeLink) {
    const parentW = this.#items.offsetWidth;
    const parentH = this.#items.offsetHeight;
    const parentRect = this.#items.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    this.#indicator.style.left =
      ((linkRect.left - parentRect.left) / parentW) * 100 + "%";
    this.#indicator.style.top =
      ((linkRect.top - parentRect.top) / parentH) * 100 + "%";
    this.#indicator.style.width =
      (activeLink.offsetWidth / parentW) * 100 + "%";
    this.#indicator.style.height =
      (activeLink.offsetHeight / parentH) * 100 + "%";
  }

  #initMobileNav() {
    this.#mobileNav = document.querySelector("[data-nav-mobile]");
    if (!this.#mobileNav) return;

    const trigger = this.#mobileNav.querySelector(".nav-mobile__trigger");
    const closeLayer = this.#mobileNav.querySelector("[data-nav-close]");
    const topButton = this.#mobileNav.querySelector("[data-nav-top]");

    trigger?.addEventListener("click", () => {
      this.#mobileNav.classList.toggle("is-open");
    });

    closeLayer?.addEventListener("click", () => {
      this.#mobileNav.classList.remove("is-open");
    });

    this.#mobileNav.querySelectorAll("[data-navbar-item]").forEach((item) => {
      item.addEventListener("click", (e) => {
        const href = item.getAttribute("href");
        if (!href?.startsWith("#") || href === "#") return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();
        this.#mobileNav.classList.remove("is-open");

        setTimeout(() => Scroll.scrollTo(target, { offset: 0 }), 300);
      });
    });

    topButton?.addEventListener("click", (e) => {
      e.preventDefault();
      this.#mobileNav.classList.remove("is-open");
      setTimeout(() => Scroll.toTop(), 300);
    });
  }
}

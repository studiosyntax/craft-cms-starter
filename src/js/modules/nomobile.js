import { App } from "../app";

/**
 * NoMobile Module
 * 
 * Removes data-module attributes from child elements when on mobile devices.
 * This effectively disables modules for mobile users.
 * 
 * Usage:
 * <div data-nomobile>
 *   <div data-module="parallax">This won't be initialized on mobile</div>
 * </div>
 */
export class NoMobile {
  constructor(element) {
    if (App.isMobile) {
      element.querySelectorAll("[data-module]").forEach((el) => {
        el.removeAttribute("data-module");
      });
    }
  }
}


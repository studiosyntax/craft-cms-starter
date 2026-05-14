import { Alpha } from "./alpha";
import { Scale } from "./scale";
import { Par } from "./par";
import { Fade } from "./fade";
import { Text } from "./text";
import { Reveal } from "./reveal";

/**
 * Group — staggered child animations
 *
 * Applies animation modules to child elements marked with [data-a].
 * Children animate with a configurable stagger delay.
 *
 * Usage:
 *   <div data-module="group" data-delay="0.05">
 *     <div data-a="alpha">Item 1</div>
 *     <div data-a="alpha">Item 2</div>
 *     <div data-a="text" data-type="words">Heading</div>
 *   </div>
 *
 * Adding a module as a group child:
 *   1. Import the class above
 *   2. Add it to the LIB map below
 *   (New modules are auto-registered for [data-module] use via import.meta.glob,
 *   but group children still need manual registration here.)
 */
const LIB = {
  alpha: Alpha,
  scale: Scale,
  par: Par,
  fade: Fade,
  text: Text,
  reveal: Reveal,
};

const BASE_DELAY = 0.01;

export class Group {
  element;
  instances = [];

  constructor(element) {
    this.element = element;

    const delay = element.dataset.delay
      ? parseFloat(element.dataset.delay)
      : BASE_DELAY;

    this.instances = Array.from(element.querySelectorAll("[data-a]"))
      .map((child, i) => {
        const ModuleClass = LIB[child.dataset.a];
        if (!ModuleClass) {
          console.warn(`[Group] Unknown child type: "${child.dataset.a}"`);
          return null;
        }
        child.setAttribute("data-delay", String(i * delay));
        return new ModuleClass(child);
      })
      .filter(Boolean);
  }

  start() {
    this.instances.forEach((instance) => instance?.start?.());
  }

  transitionOut() {
    this.instances.forEach((instance) => instance?.transitionOut?.());
  }

  destroy() {
    this.instances.forEach((instance) => instance?.destroy?.());
    this.instances = [];
  }
}

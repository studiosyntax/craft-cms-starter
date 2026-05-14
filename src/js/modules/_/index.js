export { BaseModule } from "./base";
export { Observe, observerManager } from "./observe";
export { Track } from "./track";
export { modules, createModules } from "./create";

/**
 * computeParams — adds data-delay to an animation params object.
 *
 * @param {HTMLElement} element
 * @param {{ delay: number }} a - animation params object (mutated in place)
 */
export function computeParams(element, a) {
  const delay = element.dataset.delay;
  if (delay) a.delay += parseFloat(delay);
}

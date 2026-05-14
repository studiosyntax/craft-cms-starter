import SplitText from "@activetheory/split-text";

const DEFAULT = "words";

export const split = (element, injectType = DEFAULT) => {
  const type = element.dataset.type || injectType;

  const split = new SplitText(element, { type, noBalance: true });
  element.setAttribute("aria-label", split.originals[0]);
  split.result = split[type];
  return split;
};


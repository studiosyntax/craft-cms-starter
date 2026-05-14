/**
 * hey — Reactive State Store
 *
 * A simple reactive store for cross-module communication.
 * Set a key to emit to all subscribers. Subscribe to a key with `hey.on()`.
 *
 * Usage:
 *   hey.PAGE_SLUG = "/about";          // set + emit
 *   hey.PAGE_SLUG                       // read current value
 *   const off = hey.on("PAGE_SLUG", (v) => console.log(v));
 *   off();                              // unsubscribe
 *
 * Canonical keys live in AGENTS.md under "Common state keys".
 */

const state = {};
const handlers = {};

const emit = (key, value) => handlers[key]?.forEach((fn) => fn(value));

const store = {
  on(key, fn) {
    (handlers[key] ??= []).push(fn);
    return () => {
      handlers[key] = handlers[key]?.filter((h) => h !== fn);
    };
  },

  off(key, fn) {
    handlers[key] = handlers[key]?.filter((h) => h !== fn);
  },
};

export default new Proxy(store, {
  set(_, key, value) {
    state[key] = value;
    emit(key, value);
    return true;
  },

  get(target, key) {
    if (key in target) return target[key].bind(target);
    return state[key];
  },
});

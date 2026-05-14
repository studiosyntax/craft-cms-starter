/**
 * BaseModule — Abstract base class for all modules
 *
 * Defines the lifecycle contract that Dom expects from every module.
 * All modules (whether they extend Observe, Track, or neither) ultimately
 * extend this class.
 *
 * Lifecycle:
 *   new Module(element)  — set initial hidden state, do NOT start observers yet
 *   start()              — begin IntersectionObserver / scroll tracking
 *   stop()               — pause observers / tracking without destroying
 *   destroy()            — full cleanup, remove all subscriptions and listeners
 *   transitionOut()      — called by Dom before page navigation; default: destroy()
 */
export class BaseModule {
  element;

  constructor(element) {
    this.element = element;
  }

  /** Begin observing / tracking. Called by Dom after preloader completes. */
  start() {}

  /** Pause observing / tracking. */
  stop() {}

  /** Full cleanup — remove all subscriptions, kill animations, free references. */
  destroy() {}

  /**
   * Called by Dom.transitionOut() before page navigation.
   * Default behaviour: destroy(). Override when you need a custom exit animation
   * that should play before the page transition begins.
   */
  transitionOut() {
    this.destroy();
  }
}

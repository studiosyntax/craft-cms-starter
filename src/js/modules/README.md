# JS Modules

## Auto-discovery convention

Files in `src/js/modules/` are auto-discovered by `import.meta.glob` in
`_/create.js`. **The file name IS the module name** — `modules/fade.js`
matches `data-module="fade"`. Only direct children of `modules/` are scanned
(`_/` base classes and `_archive/` are excluded).

- Export **exactly one class** per file (the first exported class wins).
- Adding a module is one step: create the file. No registration needed.
- Every module extends `BaseModule` (`_/base.js`), or `Observe` / `Track`
  (`_/observe.js`, `_/track.js`) — both of which extend `BaseModule`.

Use **`Observe`** for viewport-triggered modules (fires `isIn` / `isOut` when
the element crosses a threshold). Use **`Track`** for scroll-progress-driven
modules (fires `handleScroll(value)` on every scroll tick while in view).

## JS module lifecycle contract

Dom drives every module through this contract. Implement the hooks you need;
all are no-ops on `BaseModule` by default.

| Hook | Rule |
| --- | --- |
| `constructor(element)` | Set **initial hidden state only** — `gsap.set` hidden, create `SplitText`, build scrubbed timelines. Do **not** register IntersectionObservers or subscribe to Scroll/Resize here. |
| `start()` | Begin observers / Scroll+Resize subscriptions. Called by Dom **after** the preloader reveal (first load) or by a transition (navigation). |
| `stop()` | Pause observers/subscriptions **without** tearing down. |
| `destroy()` | Full cleanup — unsubscribe everything, kill animations/timelines, revert `SplitText`, then call `super.destroy()`. |
| `transitionOut()` | Defaults to `destroy()`. Only override for a custom exit animation. Never write `transitionOut() { this.destroy(); }` — that is already the default. |

### Why it matters

Constructor work runs at `Dom.create()` time, **before** the preloader reveals
the page. Observers or subscriptions started in the constructor fire too early,
which produces the classic "works on first load, breaks after a page
transition" bug. Keep the constructor passive; start live behaviour in
`start()`.

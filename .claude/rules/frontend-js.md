<!-- craftcms-claude-skills -->
# Front-end JavaScript

The site uses a custom auto-discovered module system in `src/js/modules/`.
The canonical contract lives in `src/js/modules/README.md` — read it before
touching module code. Summary:

## Module discovery

- File name **is** the module name: `modules/fade.js` ↔ `data-module="fade"`.
- Only direct children of `modules/` are scanned. `_/` (base classes) are excluded.
- Export exactly one class per file. Adding a module = creating the file; no registration.

## Base classes

- `BaseModule` (`_/base.js`) — the root.
- `Observe` (`_/observe.js`) — viewport-triggered (`isIn` / `isOut`).
- `Track` (`_/track.js`) — scroll-progress-driven (`handleScroll(value)`).

## Lifecycle contract

| Hook | Rule |
| --- | --- |
| `constructor(element)` | Initial hidden state **only** — `gsap.set` hidden, build `SplitText`, create scrubbed timelines. Never register observers or Scroll/Resize subscriptions here. |
| `start()` | Begin observers / subscriptions. Called after the preloader reveal or by a transition. |
| `stop()` | Pause observers/subscriptions without tearing down. |
| `destroy()` | Full cleanup — unsubscribe, kill animations/timelines, revert `SplitText`, then `super.destroy()`. |
| `transitionOut()` | Defaults to `destroy()`. Override only for a custom exit animation — never re-implement the default. |

**Why it matters**: constructor work runs before the preloader reveals the
page. Observers started in the constructor fire too early — the classic "works
on first load, breaks after a page transition" bug. Keep the constructor
passive; start live behaviour in `start()`.

## Build

Vite (`vite.config.mjs`). Entry is `src/js/index.js`. Run via `ddev npm run dev`.

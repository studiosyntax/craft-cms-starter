<!-- craftcms-claude-skills -->
# Frontend JS Architecture

## Application Lifecycle

Strict initialisation order to prevent FOUC:

```
FIRST VISIT:
1. App.init()         → wait for fonts
2. Scroll.stop()      → prevent scrolling
3. Dom.create()       → modules set hidden state (yPercent: 110, opacity: 0…)
4. Preloader.init()   → preloader animates out
5. Dom.start()        → observers begin → elements animate in
6. Scroll.start()     → enable scrolling

NAVIGATION (Taxi.js):
1. Dom.transitionOut() → modules animate out & destroy
2. Page swap
3. Dom.transitionIn() → create + start new modules
```

## Core Singletons

All core systems are exported as singleton instances from `src/js/`:

| Singleton | File | Purpose |
|-----------|------|---------|
| `App` | `app.js` | Main orchestrator |
| `Dom` | `dom.js` | Module lifecycle manager |
| `Pages` | `pages.js` | Taxi.js page transitions |
| `Scroll` | `scroll.js` | Lenis smooth scroll |
| `Preloader` | `persistent/preloader.js` | Initial load animation |
| `hey` | `hey.js` | Reactive state store (Proxy-based) |

## Reactive State (`hey.js`)

```javascript
import hey from "./hey";

hey.PAGE_SLUG = "/about";          // set
hey.on("PAGE_SLUG", (v) => …);     // subscribe
```

Common keys: `APP_READY`, `DOM_READY`, `PRELOADER_START`, `PRELOADER_COMPLETE`, `PAGE_SLUG`, `PAGE_IN`, `PAGE_OUT`.

## Module System

Modules are auto-discovered via `data-module` attributes:

```html
<div data-module="text" data-type="lines" data-delay="0.3">…</div>
```

To add a module:

1. Create a class file in `src/js/modules/` extending `Observe` or `Track`.
2. Import + register in `src/js/modules/_/create.js`.
3. Use `data-module="<key>"` in templates.

### Base Classes

- **`Observe`** — viewport-triggered (IntersectionObserver). Override `isIn({ entry, direction })` and `isOut(...)`. Always implement `transitionOut() { this.destroy(); }`.
- **`Track`** — scroll-progress driven. Override `handleScroll(value)` (interpolated to `bounds`) and `resize(bounds)`.

### Existing Modules

| Module | Base | Purpose |
|--------|------|---------|
| `text` | Observe | Split text animation (lines/words/chars) |
| `fade` | Observe | Simple fade-in |
| `alpha` | Observe | Fade + translate up |
| `par` | Observe | Paragraph reveal |
| `parallax` | Track | Parallax effect |
| `scale` | Track | Scale on scroll |
| `oppositescroll` | Track | Alternating scroll direction |
| `group` | — | Group child animations via `data-a` |

### Group Pattern

```html
<div data-module="group" data-delay="0.04">
  <div data-a="alpha">Child 1</div>
  <div data-a="scale">Child 2</div>
</div>
```

Children use `data-a` (not `data-module`) and inherit the parent's stagger.

## Module Conventions

- PascalCase class, lowercase `data-module` key.
- Private fields with `#` prefix (`#anim`, `#element`).
- Animation params stored in an `a = {…}` object so consumers can override per-instance via `computeParams(element, this.a)`.
- Always implement both `transitionOut()` and `destroy()` for cleanup.
- Always check `reduced` (prefers-reduced-motion) before running animations.

```javascript
import { Observe } from "./_/observe";
import gsap, { reduced, resetInitial } from "../gsap";
import { computeParams } from "./_/index";

export class MyModule extends Observe {
  #anim;
  a = { duration: 1.2, delay: 0.1, opacity: 1 };

  constructor(element) {
    super(element);
    this.create();
    resetInitial(element);
  }

  create() {
    if (reduced) return;
    gsap.set(this.element, { opacity: 0 });
    computeParams(this.element, this.a);
  }

  isIn = () => {
    if (reduced) return;
    this.#anim = gsap.to(this.element, { ...this.a });
  };

  transitionOut() { this.destroy(); }
}
```

## Vite Aliases

```javascript
// vite.config.mjs
"@"   → ./src
"@css" → ./src/css
"@js"  → ./src/js
```

## Constraints

- Vanilla JS + Twig only. **No React.**
- Tailwind v4 (`@theme` syntax) — there is no `tailwind.config.js`.
- Always implement `transitionOut()` for cleanup.
- Always check `reduced` before animating.
- Always pair `data-start="hidden"` with `resetInitial()` to avoid FOUC.

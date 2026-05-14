<!-- craftcms-claude-skills -->
# Frontend — CSS, GSAP, Transitions

## Tailwind v4 Theme

Defined in `src/css/site.css` with the `@theme` directive (no `tailwind.config.js`):

```css
@theme {
  --font-display: "Corp";
  --font-sans: "Suisse Int'l", sans-serif;
  --color-neutral: #f9f8f8;
  --color-primary: #00ff00;
  --color-black: #1f1f27;

  --breakpoint-s: 448px;
  --breakpoint-m: 640px;
  --breakpoint-l: 1040px;
  --breakpoint-xl: 1800px;
}
```

Custom breakpoints expose responsive prefixes: `s:`, `m:`, `l:`, `xl:`.

## Layout Helpers

| Class | Purpose |
|-------|---------|
| `.site-max` | Max-width container with padding |
| `.site-grid` | 4 → 6 → 12 column responsive grid |
| `.heading-display` | Display font (Corp) |
| `.h1` … `.h4` | Heading styles |

## CSS Conventions

- BEM-ish for custom components: `.transition-cover__inner`.
- Tailwind for layout/utilities.
- Custom properties for theming (`--font-display`).
- Mobile-first; layer up with `s:`, `m:`, `l:`, `xl:`.

## Hidden / Reveal Pattern

```html
<div data-module="text" data-start="hidden">…</div>
```

```css
[data-start="hidden"] { visibility: hidden; }
```

Module sets initial GSAP transform/opacity, then `resetInitial(element)` flips visibility. Required to prevent FOUC.

## GSAP

Defaults:

```javascript
gsap.defaults({ ease: "expo.out", duration: 1.2 });
```

Imports from `src/js/gsap.js`:

```javascript
import gsap, {
  ScrollTrigger,
  Flip,
  SplitText,
  reduced,        // prefers-reduced-motion
  resetInitial,   // visibility helper
  easeMenu,       // menu-tuned ease
  easeVideo,      // video-tuned ease
} from "./gsap";
```

Always check `reduced` before animating:

```javascript
if (reduced) return;
gsap.to(element, { y: 100 });
```

## Page Transitions (Taxi.js)

```javascript
transitions: {
  default: CoverTransition,  // clip-path reveal
  loop:    LoopTransition,   // slide-up overlay
  fade:    FadeTransition,   // crossfade
}
```

Template usage:

```html
<a href="/about">About</a>                            <!-- default -->
<a href="/work" data-taxi-transition="loop">Work</a>  <!-- specific -->
<a href="/external" data-taxi-ignore>External</a>     <!-- skip Taxi -->
<a href="/external" target="_blank">New tab</a>       <!-- skip Taxi -->
```

Required cover element in `layout-page.twig`:

```html
<div class="transition-cover" data-transition-cover="">
  <div class="transition-cover__inner"></div>
</div>
```

## Smooth Scroll (Lenis)

`Scroll` singleton in `scroll.js` wraps Lenis. Use `Scroll.stop()` / `Scroll.start()` rather than touching Lenis directly.

## Utilities

- `utils/media.js`: `isMobile`, `isTabletOrBelow`, `isLargeScreen`, `prefersReducedMotion`.
- `utils/client-rect.js`: `clientRect(el)` → `{ top, bottom, width, height, left, right, wh, ww, offset, centery, centerx }`.
- `utils/subscribable.js`: `Resize`, `Raf` — call `.subscribe(cb)` and store the returned unsubscriber.

## Debug Helpers

- `?skip-preloader` URL param skips the preloader.
- `window.App` is exposed in dev.
- Add `show-grid` to body for the column-grid overlay.

## Lifecycle Console Markers

The app logs at key moments — useful when reading console output:

- `🚀 App initializing...`
- `📦 Created X modules`
- `▶️ Started X modules`
- `🚕 Taxi ready`
- `✨ App ready`

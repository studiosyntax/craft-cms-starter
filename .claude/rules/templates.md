<!-- craftcms-claude-skills -->
# Template Conventions

## Structure

Templates are organised by role, not by atomic-design tier:

- `_layouts/` — the base layout chain. Views `{% extends %}` a layout.
- `_views/` — page-level templates, grouped by entry type (`article/`, `pages/`).
- `_components/` — reusable components grouped by domain (`global/`, `content/`, `seo/`, `text/`, `gtm/`).
- `_partials/` — smaller shared fragments.

## Layout Inheritance

```
layout-base.twig          → HTML shell, <head>, <body>
  └── layout-page.twig    → Preloader, header, footer, Taxi wrapper
        └── index.twig    → Page-specific content
  └── layout-landing.twig → Landing-page variant
```

## Taxi.js Required Structure

Page transitions need this wrapper inside the layout:

```twig
<main data-taxi>
  <div data-taxi-view>
    {% block content %}{% endblock %}
  </div>
</main>
```

A `data-transition-cover` element must also exist in `layout-page.twig` for the cover transition.

## Includes

Use the `include()` **function** (Twig's recommended method since 2.0), not the `{% include %}` tag. Always pass `with_context = false` to isolate the template's scope.

```twig
{{ include("_components/text/block-header.twig", {
    kicker: kicker,
    heading: heading,
    caption: caption,
}, with_context = false) }}
```

- `with_context = false` is mandatory. No exceptions — without it, ambient variables leak in and create invisible coupling.
- Matrix block rendering with dynamic path:
  ```twig
  {{ include("_partials/content/#{block.type.handle|lower}.twig", {
      row: block,
  }, with_context = false, ignore_missing = true) }}
  ```
- No props at all? Still pass an empty hash + `with_context = false`:
  ```twig
  {{ include("_components/global/footer.twig", {}, with_context = false) }}
  ```
- Need whitespace trimming? Wrap with `{{-` / `-}}`: `{{- include('…') -}}`.
- No macros for UI components — use `include()` with isolation.

## Data & null handling

- `??` for null handling. The `???` operator is **not** available (no empty-coalesce / SEOmatic plugin).
- If you find yourself writing `value ?: fallback` chains, reach for `??` instead.

## Eager Loading

- `.eagerly()` on every relational field access inside loops.

## HTML Minification

This project uses `nystudio107/craft-minify` for output minification. **Do not** use Twig `{%- minify -%}` blocks — rely on whitespace control (`{%- ... -%}`, `{{- ... -}}`) and let the plugin handle the rest.

## Variables & Props

- Single descriptive words when possible: `heading`, `image`, `button`.
- Multi-word uses camelCase: `buttonText`, `containerClass`. Never snake_case.
- Pass props via `collect({})`; build class strings via named-key collections.
- No hardcoded content that belongs in a field.

## CSS Hooks for Animation

Elements that animate in must start hidden:

```html
<div data-module="text" data-start="hidden">…</div>
```

`[data-start="hidden"] { visibility: hidden; }` is set globally in `layout-base.twig`. The JS module sets initial GSAP state, then `resetInitial()` toggles visibility. See `frontend-js.md` for the module system.

## Styling

- Tailwind v4 utility classes; design tokens come from `@theme` in `src/css/site.css`.

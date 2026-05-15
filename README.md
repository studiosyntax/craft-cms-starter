# Craft CMS 5 Starter

An opinionated Craft CMS 5 boilerplate with a modern buildchain, a curated plugin set, and Claude Code project guidelines baked in.

## What this is

A starting point for new Craft CMS 5 sites. It pairs a DDEV-based local environment with a Vite 8 + Tailwind v4 front-end buildchain, a hand-picked set of plugins, and a vanilla-JS module system for scroll-driven animation and page transitions.

It also ships Claude Code project guidelines — a `CLAUDE.md`, a set of `.claude/rules/`, and skills — so AI-assisted work follows the project's conventions out of the box.

## Stack

- **CMS**: Craft CMS 5.9
- **Environment**: DDEV — PHP 8.4, MySQL 8.0, nginx-fpm
- **Front-end build**: Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`)
- **JavaScript**: vanilla ES modules with a custom auto-discovered module system (`src/js/modules/`), GSAP for animation, Lenis for smooth scroll, and `@unseenco/taxi` for page transitions

## Plugins

- **CKEditor** — rich text
- **nystudio107 Vite** — Vite asset integration
- **nystudio107 Minify** — HTML output minification
- **Imager-X** — image transforms and optimization
- **Formie** — forms
- **Hyper** — links
- **Expanded Singles** — single-section editing improvements
- **statikbe Config Values** — config-driven values
- **Cloudflare R2** — object storage filesystem

## Getting started

```bash
composer create-project studiosyntax/craft-cms-starter my-project
cd my-project
ddev start
ddev craft install
ddev npm install
ddev npm run dev
```

All tooling runs through DDEV — use `ddev composer`, `ddev craft`, and `ddev npm` rather than the host equivalents. The Vite dev server is exposed on port 3000.

## Project structure

```
templates/
├── _layouts/      # Base layout chain (layout-base, layout-page, layout-exception)
├── _views/        # Page-level templates by entry type (article/, pages/, index.twig)
├── _components/   # Reusable components (content/, global/, …)
├── _partials/     # Smaller shared fragments
├── _emails/       # Email templates
└── _errors/       # Error pages

src/
├── css/           # Tailwind v4 styles (site.css, @theme tokens)
└── js/            # Auto-discovered module system, entry at src/js/index.js

config/
└── project/       # Project config — sections, entry types, fields (source of truth)
```

## Claude Code integration

The repository ships with Claude Code configuration so AI-assisted development respects the project's conventions:

- **`CLAUDE.md`** — project overview, tooling rules, and stack notes
- **`.claude/rules/`** — focused guidelines for architecture, templates, front-end CSS/JS, git workflow, and security
- **Skills** — Craft-specific skills for templates, PHP, content modeling, and more

## License

MIT

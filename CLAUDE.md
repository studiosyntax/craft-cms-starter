<!-- craftcms-claude-skills v1.3.0 -->
# Studio Syntax — Craft CMS 5 Site

@.claude/rules/architecture.md
@.claude/rules/templates.md
@.claude/rules/frontend.md
@.claude/rules/frontend-js.md
@.claude/rules/git-workflow.md
@.claude/rules/security.md

## General

Be critical. We're equals — push back when something doesn't make sense.

Do not excessively use emojis. Do not include AI attribution in commits, PRs, issues, or comments.

Do not include "Test plan" sections in PR descriptions.

## Tools

Use `ddev` shorthand commands: `ddev composer`, `ddev craft`, `ddev npm`. Never run `php`, `composer`, or `npm` on the host — everything goes through DDEV.

Never install Craft plugins (`ddev composer require`) without explicit approval. Plugin selection is a planning decision.

Use `gh` for all GitHub operations.

## Environment

DDEV project `craftcms` — PHP 8.3, MySQL 8.0, nginx-fpm. Vite dev server is exposed on port 3000.

```bash
ddev npm run dev                     # Vite dev server (port 3000)
ddev npm run build                   # Production build
ddev craft up                        # Migrations + project config apply
ddev composer install                # Install deps
ddev craft make                      # Scaffold (craftcms/generator)
```

## Stack

- **Front-end build**: Vite 7 + Tailwind CSS v4 (`@tailwindcss/vite`). Config in `vite.config.mjs`, styles in `src/css/site.css`.
- **JS**: vanilla ES modules with a custom auto-discovered module system (`src/js/modules/`), GSAP, Lenis (smooth scroll), `@unseenco/taxi` (page transitions). See `.claude/rules/frontend-js.md`.
- **Plugins**: CKEditor, nystudio107 Vite + Minify, Imager-X, Formie, Hyper (links), Expanded Singles, statikbe Config Values, Cloudflare R2.

## Template Structure

```
templates/
├── _layouts/        # Base layout chain (layout-base, layout-page, layout-exception)
├── _views/          # Page-level templates by entry type (article/, pages/, index.twig)
├── _components/     # Reusable components (content/blocks, content/rows, global/)
├── _partials/       # Smaller shared fragments (entry/)
├── _emails/         # Email templates
└── _errors/         # Error pages
```

## Content Model

Sections, entry types, and fields live in `config/project/`. Document the key
content model here once it stabilises.

## Permissions

`.claude/settings.local.json` pre-approves DDEV and git commands so work runs
without permission prompts. It is gitignored — adjust locally as needed. If
commands are being blocked, check this file first.

## Changelog & releases

Manually-curated `CHANGELOG.md` using Conventional Commits + Keep a Changelog format.

**When making user-visible changes**, add a bullet to `## [Unreleased]` in the same commit.

User-visible: new plugin, Twig structure change, new convention, `.env.example` update, config change affecting setup.
Not user-visible: internal renames, comments, tests, dev-only tooling.

**Commit format**: `feat:`, `fix:`, `refactor:`, `chore:`, `perf:`, `docs:`, `test:`. Add `!` or `BREAKING CHANGE:` for breaking.

**To release**: run `/release-notes`, review, then follow the commands it outputs. Create a GitHub Release with the new CHANGELOG section as the body.

**Versioning**: SemVer. During 0.x, breaking changes bump MINOR.

## Documentation

- Craft CMS Twig: https://craftcms.com/docs/5.x/development/twig.html
- Template tags: https://craftcms.com/docs/5.x/reference/twig/tags.html
- Field types: https://craftcms.com/docs/5.x/reference/field-types/

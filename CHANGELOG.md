# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com). Versioning follows [SemVer](https://semver.org).

## [Unreleased]

### What's changed
- Release workflow consolidated into the `/release` command: drafts the changelog, then commits, tags, pushes, and publishes the GitHub release behind one approval.
- Upgraded the buildchain to Vite 8 (`@tailwindcss/vite` and `tailwindcss` bumped to 4.3 for Vite 8 support).
- Packaged the repo as a Composer project (`studiosyntax/craft-cms-starter`): `composer create-project` installs the full stack, then `post-create-project-cmd` strips the starter's own metadata and docs from the generated project. Added a `README.md` describing the starter.
- Added a `Makefile` with install, setup, build, and DDEV helper targets. Run `make help` to list them.
- Added an MIT `LICENSE.md`.

## [0.1.0] - 2026-05-14

### What's new
- Initial public release of the Studio Syntax Craft CMS 5 site.
- Vite 7 + Tailwind v4 buildchain.
- Auto-discovered JS module system with GSAP, Lenis, and Taxi.js page transitions.
- Claude Code project guidelines and the changelog/release workflow.
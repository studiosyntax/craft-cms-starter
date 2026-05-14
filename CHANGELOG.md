# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com). Versioning follows [SemVer](https://semver.org).

## [Unreleased]

## [0.2.0] - 2026-05-14

### What's new
- Packaged the repo as a Composer project starter (`studiosyntax/craft-cms-starter`): `composer create-project` installs the full Craft stack, then a `post-create-project-cmd` hook seeds `.env` from `.env.example` and removes the starter's own meta-docs (`CHANGELOG.md`, `LICENSE.md`, `README.md`) from the generated project. Added a `README.md` describing the starter. 67dad33
- Added a `Makefile` with install, setup, build, and DDEV helper targets — run `make help` to list them. 67dad33

### What's changed
- Upgraded the front-end buildchain to Vite 8 (`@tailwindcss/vite` and `tailwindcss` bumped to 4.3). 0486979
- Consolidated the release workflow into the `/release` command. 21e6e51
- Added an MIT `LICENSE.md`. 67dad33

## [0.1.0] - 2026-05-14

### What's new
- Initial public release of the Studio Syntax Craft CMS 5 site.
- Vite 7 + Tailwind v4 buildchain.
- Auto-discovered JS module system with GSAP, Lenis, and Taxi.js page transitions.
- Claude Code project guidelines and the changelog/release workflow.
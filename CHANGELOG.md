# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com). Versioning follows [SemVer](https://semver.org).

## [Unreleased]

### What's new
- Added the Imager X Cloudflare Images Transformer plugin (`spacecatninja/imager-x-cloudflare-images-transformer`), enabling Cloudflare Images as an Imager X transformer.
- Added a Cloudflare R2 filesystem and a local `Transforms` filesystem, with the `images` volume now writing transforms to the latter. New `CLOUDFLARE_R2_*` env vars in `.env.example`.
- Wired Imager X to the Cloudflare Images transformer via `config/imager-x.php` and `config/imager-x-cloudflare-images-transformer.php` (zone domain, default `format=auto`/`quality=80`, auto-gravity). Bumped the Imager X edition from `lite` to `pro` — required for third-party transformers.

### What's changed
- Upgraded DDEV (`.ddev/config.yaml`) and the Composer platform pin (`composer.json` → `config.platform.php`) from PHP 8.3 to 8.4. The platform pin ensures `composer create-project` resolves the same dependencies whether it runs on the host or inside DDEV.

## [0.3.0] - 2026-05-14

### What's new
- `make install` now renames the DDEV project from the starter default (`craftcms`) to the project directory name, before starting it — avoiding name collisions in a freshly created project. Override with `make install PROJECT_NAME=foo`, or set it anytime with the new `make rename PROJECT_NAME=foo` target. d366bd4

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
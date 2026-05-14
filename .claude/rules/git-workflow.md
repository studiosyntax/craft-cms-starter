<!-- craftcms-claude-skills -->
# Git Workflow

- **Default branch**: `main`. Feature branches off `main` (`feature/<name>`, current: `feature/redesign`).
- **Conventional commits**: `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs:`, `test:`, `chore:`.
- **Subject line only** for most commits. One line, under 72 characters, describes the what: `feat(blog): add hero image preset for card thumbnails`.
- **Body only when the why isn't obvious** — a content model change that affects existing entries, a breaking template change, a multi-site propagation decision. Even then, keep it to 3-5 lines max. If the commit message is longer than the diff, something is wrong.
- Never include: "Verification" sections, "How to undo" sections, "Follow-up" sections, file-by-file change lists, or test count reports. The diff shows what changed.
- `--amend` for fixes to the most recent unpushed commit. New commit once pushed.
- **No AI attribution** in commit messages. No "Co-Authored-By" lines referencing AI tools.
- All comments, commit messages, and documentation in English only.
- Use absolute paths in git commands. Never `cd path && git commit` — the target directory may have untrusted hooks.

## Project Config

`config/project/*.yaml` is source of truth. After editing field/section settings in the CP, commit the YAML diff. After pulling YAML changes, run `ddev craft up`.

Database dumps (`dump.sql`, `dump-local.sql`) are gitignored — never commit them.

<!-- craftcms-claude-skills -->
# Security

- Sensitive data (API keys, tracking IDs, R2 credentials) via env vars, surfaced through `craft.app.config.custom` — never hardcoded in templates or committed.
- No secrets in CLAUDE.md, committed files, or template output. `.env*` is gitignored — keep it that way.
- CSRF tokens on all forms: `{{ csrfInput() }}`. Formie handles this for its own forms.
- Escape user-generated content: rely on Twig auto-escaping; use `|e` where output context differs.
- CKEditor / rich text output is purified — keep `config/htmlpurifier/` config in sync with allowed markup.
- Content Security Policy headers configured for production.

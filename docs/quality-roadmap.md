# Quality Roadmap

## In Place

- ESLint (`@typescript-eslint` + `eslint-plugin-security`) — lint gate on pre-commit and CI
- TypeScript strict mode — structural type safety
- Husky pre-commit: lint-staged → typecheck → test:unit → audit
- GitHub Actions CI: lint → typecheck → test (with coverage) → audit
- Jest coverage thresholds: 80% lines/statements/branches/functions

## Planned

### dependency-cruiser
Enforce architectural boundaries: prevent domain from importing infrastructure, prevent application from importing HTTP layer, etc.
- Config: `.dependency-cruiser.cjs`
- Wire into: pre-commit (on changed files), CI

### commitlint
Enforce conventional commit message format (`feat:`, `fix:`, `chore:`, etc.).
- Config: `commitlint.config.cjs`
- Wire into: `commit-msg` Husky hook

### Prettier
Consistent formatting (tabs vs spaces, trailing commas, line length).
- Config: `.prettierrc`
- Wire into: lint-staged (format before ESLint), CI format check
- Decision needed: tabs or spaces, 80 or 120 column width

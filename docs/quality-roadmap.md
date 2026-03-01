# Quality Roadmap

## In Place

- ESLint (`@typescript-eslint` + `eslint-plugin-security`) — lint gate on pre-commit and CI
- TypeScript strict mode — structural type safety
- Husky pre-commit: lint-staged → typecheck → test:unit → audit
- Husky pre-push: full suite with coverage thresholds — catches coverage failures before CI
- GitHub Actions CI: lint → typecheck → test (with coverage) → audit
- Jest coverage thresholds: 80% lines/statements/branches/functions
- `docs/specs/` — specs as source of truth before any feature implementation
- Secretlint — scans all staged files for credential patterns on pre-commit and CI; `.env.example` excluded via `.secretlintignore`
- commitlint — enforces conventional commit format (`feat:`, `fix:`, `chore:`, etc.) on `commit-msg` hook
- dependency-cruiser — static import graph rules; three forbidden boundary rules enforced at pre-commit and CI
- knip — unused files, exports, and dependencies; CI only; `src/**/*.dto.ts` treated as entry points to avoid decorator false positives

## Planned

### Stryker — mutation testing
Validates test quality, not just coverage. Makes small mutations to production code (flips `>` to `>=`, deletes a `throw`, inverts a condition) and checks whether the test suite catches them. A surviving mutation means logic exists with no test asserting it.
- Scope to start: `src/domain/` only — fast, high signal, directly tests TDD discipline on invariants
- Wire into: scheduled CI job (weekly), not every push — it is slow
- Implement after: Orders acceptance test is GREEN

### Renovate — automated dependency updates
Opens PRs automatically when dependencies have updates; CI runs against each PR. Proactive complement to `npm audit` (which is reactive — fires only after a CVE is published).
- Config: `renovate.json` at repo root
- Group strategy: patch/minor together, major separate
- Wire into: GitHub App (no local tooling needed)

### Prettier — formatting
Consistent formatting (indentation, trailing commas, line length). Eliminates formatting noise in diffs and reviews.
- Config: `.prettierrc`
- Wire into: lint-staged (format before ESLint), CI format check
- Decision needed: tabs or spaces, 80 or 120 column width

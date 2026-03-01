# Quality Roadmap

## In Place

- ESLint (`@typescript-eslint` + `eslint-plugin-security`) — lint gate on pre-commit and CI
- TypeScript strict mode — structural type safety
- Husky pre-commit: lint-staged → typecheck → test:unit → audit
- Husky pre-push: full suite with coverage thresholds — catches coverage failures before CI
- GitHub Actions CI: lint → typecheck → test (with coverage) → audit
- Jest coverage thresholds: 80% lines/statements/branches/functions
- `docs/specs/` — specs as source of truth before any feature implementation

## Planned

### ts-arch — architecture fitness functions
Express hexagonal boundary rules as Jest tests. A boundary violation goes RED like any other failing test; the error names the offending import.
- Rules: domain must not import from infrastructure or application; application must not import from infrastructure/http
- Location: `test/architecture/hexagonal.spec.ts`
- Wire into: CI (`npm test` picks it up automatically)
- Note: replaces dependency-cruiser as the primary expression of architectural intent. dependency-cruiser may still be kept for fast staged-file pre-commit checks, but ts-arch is the authoritative gate.

### Secretlint — secrets detection
Scans staged files for strings matching known secret formats (AWS keys, JWTs, high-entropy tokens). Complements `eslint-plugin-security`, which catches unsafe code patterns but not credential strings.
- Wire into: lint-staged (before ESLint), CI
- Priority: high — one committed secret is a breach

### Stryker — mutation testing
Validates test quality, not just coverage. Makes small mutations to production code (flips `>` to `>=`, deletes a `throw`, inverts a condition) and checks whether the test suite catches them. A surviving mutation means logic exists with no test asserting it.
- Scope to start: `src/domain/` only — fast, high signal, directly tests TDD discipline on invariants
- Wire into: scheduled CI job (weekly), not every push — it is slow
- Implement after: Orders acceptance test is GREEN

### knip — unused code detection
Finds unused files, unused exports, and unused entries in `package.json` dependencies. In a hexagonal architecture this catches repository interface methods no use case calls, commands with unread fields, and orphaned modules.
- Wire into: CI only (whole-project scope is too slow for pre-commit)
- Implement after: Orders slice is complete

### Renovate — automated dependency updates
Opens PRs automatically when dependencies have updates; CI runs against each PR. Proactive complement to `npm audit` (which is reactive — fires only after a CVE is published).
- Config: `renovate.json` at repo root
- Group strategy: patch/minor together, major separate
- Wire into: GitHub App (no local tooling needed)

### dependency-cruiser — static import graph rules
Config-file-based architectural boundary enforcement. Faster than ts-arch for staged-file pre-commit checks.
- Config: `.dependency-cruiser.cjs`
- Wire into: pre-commit (on changed files only), CI
- See ts-arch note above for relationship between the two

### commitlint — commit message format
Enforce conventional commit message format (`feat:`, `fix:`, `chore:`, etc.). Enables automated changelog generation downstream (release-please, standard-version).
- Config: `commitlint.config.cjs`
- Wire into: `commit-msg` Husky hook

### Prettier — formatting
Consistent formatting (indentation, trailing commas, line length). Eliminates formatting noise in diffs and reviews.
- Config: `.prettierrc`
- Wire into: lint-staged (format before ESLint), CI format check
- Decision needed: tabs or spaces, 80 or 120 column width

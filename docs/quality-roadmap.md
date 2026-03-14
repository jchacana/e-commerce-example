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
- knip — unused files, exports, and dependencies; pre-push and CI; `src/**/*.dto.ts` treated as entry points to avoid decorator false positives; `@nestjs/typeorm` and `testcontainers` added to `ignoreDependencies` (indirect usage, not false positives)

## Known Warnings (no direct fix available)

Deprecation warnings that appear on `npm ci` with no actionable fix path:

- `glob@7` (×1) + `inflight` — via `babel-plugin-istanbul` → `test-exclude`, a jest internal. Will clear when jest updates `babel-plugin-istanbul` or `test-exclude` to use a newer glob.
- `glob@10.4.5` — via `@nestjs/cli`. Will clear when `@nestjs/cli` updates its dependency tree.

`npm audit --audit-level=high --omit=dev` is clean. Remaining findings are moderate severity only.

## Known Vulnerabilities (no direct fix available)

Moderate-severity CVEs in production dependencies with no actionable fix path:

- **GHSA-5v7r-6r5c-r473** / **GHSA-j47w-4g3g-c36v** (`file-type`) — infinite loop / ZIP decompression bomb via `@nestjs/common >= 11.0.16`. No direct fix; awaiting NestJS upstream resolution. Audit gate remains at `--audit-level=high` (these are moderate only).

## Planned

### Stryker — mutation testing
Validates test quality, not just coverage. Makes small mutations to production code (flips `>` to `>=`, deletes a `throw`, inverts a condition) and checks whether the test suite catches them. A surviving mutation means logic exists with no test asserting it.
- Scope to start: `src/domain/` only — fast, high signal, directly tests TDD discipline on invariants
- Wire into: scheduled CI job (weekly), not every push — it is slow
- Implement after: Orders acceptance test is GREEN

**Incremental mode**: Stryker supports `--incremental`, which caches results to `.stryker-tmp/incremental.json` and on subsequent runs only re-mutates files that changed, files whose tests changed, and previously surviving mutants. This makes PR-level runs fast after the first warm-up run.
- Pair with GitHub Actions cache keyed on branch name or source file hash
- Suggested split: PR runs use incremental mode (fast, targets what changed); weekly scheduled run uses full mode (no cache, resets the baseline)
- For this project's small `src/domain/` scope, even full runs should be manageable — but incremental is still worth having as the codebase grows

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

## Backlog

### Raise coverage thresholds
Current thresholds are 80% across all metrics, but actual coverage is ~99%. The floor should reflect reality to prevent silent regression. Raise all thresholds to 95% (leaving a small buffer) and update the quality-roadmap and quality skill accordingly.

### Tighten relaxed `tsconfig` flags
Three flags were left at `false` from the NestJS CLI scaffold:
- `strictBindCallApply` — catches incorrect `call`/`apply`/`bind` usage
- `noFallthroughCasesInSwitch` — prevents accidental fallthrough in switch statements
- `forceConsistentCasingInFileNames` — prevents import casing bugs on case-insensitive file systems

Enable all three. Low risk given current test coverage.

### GitHub PR template
Add `.github/pull_request_template.md` to enforce a checklist in team settings: spec reference, acceptance criteria coverage, tests green, architecture updated. High value for client project transfers.

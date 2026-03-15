# Quality Roadmap

## In Place

- ESLint (`@typescript-eslint` + `eslint-plugin-security`) — lint gate on pre-commit and CI
- TypeScript strict mode — structural type safety
- Husky pre-commit: lint-staged → typecheck → test:unit → audit
- Husky pre-push: full suite with coverage thresholds — catches coverage failures before CI
- GitHub Actions CI: lint → typecheck → test (with coverage) → audit
- Jest coverage thresholds: lines 95% / statements 95% / branches 85% / functions 95% (raised from 80% to reflect actual coverage)
- `docs/specs/` — specs as source of truth before any feature implementation
- Secretlint — scans all staged files for credential patterns on pre-commit and CI; `.env.example` excluded via `.secretlintignore`
- commitlint — enforces conventional commit format (`feat:`, `fix:`, `chore:`, etc.) on `commit-msg` hook
- dependency-cruiser — static import graph rules; three forbidden boundary rules enforced at pre-commit and CI
- knip — unused files, exports, and dependencies; pre-push and CI; `src/**/*.dto.ts` treated as entry points to avoid decorator false positives; `@nestjs/typeorm` and `testcontainers` added to `ignoreDependencies` (indirect usage, not false positives)
- Stryker mutation testing — validates test quality on `src/domain/**` (pure business logic); incremental mode on PRs (fast, caches results keyed on branch name); full weekly scheduled run resets the baseline; mutation score 100% at initial setup; HTML report written to `.stryker-tmp/reports/mutation/mutation.html`; thresholds: high 80 / low 60 / break 50. **Guarantee strategy**: (1) `crafter` skill runs `npm run mutation` locally after any new domain behaviour and requires 0 surviving mutants before committing; (2) the PR mutation CI check should be set as a required status check in GitHub branch protection rules for `main` — this ensures nothing merges with surviving mutants without adding overhead to local hooks
- Prettier — consistent formatting enforced on `{src,test}/**/*.ts`; config: `.prettierrc` (tabs, 120 col width, single quotes, trailing commas `all`, semicolons); wired into lint-staged (format before ESLint) and CI format check step (`npm run format:check`)

## Known Warnings (no direct fix available)

Deprecation warnings that appear on `npm ci` with no actionable fix path:

- `glob@7` (×1) + `inflight` — via `babel-plugin-istanbul` → `test-exclude`, a jest internal. Will clear when jest updates `babel-plugin-istanbul` or `test-exclude` to use a newer glob.
- `glob@10.4.5` — via `@nestjs/cli`. Will clear when `@nestjs/cli` updates its dependency tree.

`npm audit --audit-level=high --omit=dev` is clean. Remaining findings are moderate severity only.

## Known Vulnerabilities (no direct fix available)

Moderate-severity CVEs in production dependencies with no actionable fix path:

- **GHSA-5v7r-6r5c-r473** / **GHSA-j47w-4g3g-c36v** (`file-type`) — infinite loop / ZIP decompression bomb via `@nestjs/common >= 11.0.16`. No direct fix; awaiting NestJS upstream resolution. Audit gate remains at `--audit-level=high` (these are moderate only).

## Planned

### Renovate — automated dependency updates
Opens PRs automatically when dependencies have updates; CI runs against each PR. Proactive complement to `npm audit` (which is reactive — fires only after a CVE is published).
- Config: `renovate.json` at repo root
- Group strategy: patch/minor together, major separate
- Wire into: GitHub App (no local tooling needed)

## Backlog

### Enable `strictBindCallApply`
The remaining relaxed `tsconfig` flag from the NestJS CLI scaffold. Catches incorrect argument types passed to `.call()`, `.bind()`, and `.apply()`. Left for separate treatment — requires reviewing all usages before enabling.

### GitHub PR template
Add `.github/pull_request_template.md` to enforce a checklist in team settings: spec reference, acceptance criteria coverage, tests green, architecture updated. High value for client project transfers.

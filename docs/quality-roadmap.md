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
- knip — unused files, exports, and dependencies; pre-push and CI; `src/**/*.dto.ts`, `data-source.ts`, and `migrations/*.ts` treated as entry points; `testcontainers` in `ignoreDependencies` (indirect usage via Testcontainers internals)
- Stryker mutation testing — validates test quality on `src/domain/**` (pure business logic); incremental mode runs on pre-push (fast — only re-tests mutants affected by local changes); full weekly scheduled run resets the baseline and seeds the CI incremental cache (`stryker-incremental-main`); mutation score 100% at initial setup; HTML report written to `.stryker-tmp/reports/mutation/mutation.html`; thresholds: high 80 / low 60 / break 80. **Guarantee strategy**: `crafter` skill runs `npm run mutation` locally after any new domain behaviour and requires 0 surviving mutants before committing
- Prettier — consistent formatting enforced on `{src,test}/**/*.ts`; config: `.prettierrc` (tabs, 120 col width, single quotes, trailing commas `all`, semicolons); wired into lint-staged (format before ESLint) and CI format check step (`npm run format:check`)
- OpenAPI / Swagger — `@nestjs/swagger` wired into `src/main.ts`; docs served at `/api/docs`
- Health check — `GET /health` via `@nestjs/terminus`; returns `{ status: 'ok' }`; acceptance-tested
- TypeORM persistence layer — `TypeOrmProductRepository` and `TypeOrmOrderRepository` implement domain port interfaces; conditional wiring via `DATABASE_URL` presence (see ADR-005); migrations in `src/infrastructure/persistence/typeorm/migrations/`
- `experiment` skill — formalises the worktree experiment pattern as a callable skill
- AC coverage check — `scripts/check-ac-coverage.js` verifies every `AC-XXX` ID in `docs/specs/` is referenced in at least one test file, and vice versa; wired into pre-commit hook and CI (`npm run check:ac`)

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

### Architecture & Design

- **Remove NestJS decorators from application layer use cases** — `@Injectable()` and `@Inject()` in use cases couple the application layer to the NestJS framework, violating hexagonal principles. Use cases should be plain classes; DI wiring should be the module's responsibility. Affects: `create-product.use-case.ts`, `get-all-products.use-case.ts`, `get-product.use-case.ts`, `place-order.use-case.ts`, `get-order.use-case.ts`.

- **Dependency-cruiser rule: no framework imports in `application/`** — forbid `@nestjs/*` imports in `src/application/**`; enforced at pre-commit and CI. Automates the architectural invariant and directly addresses the decorator item above.

- **Dependency-cruiser rule: no framework imports in `domain/`** — forbid any non-stdlib import in `src/domain/**` except project-internal domain files. Hardens the purity guarantee currently enforced only by convention.

### AI Development Guardrails

- **Uncommitted changes gate** — pre-push hook that fails if any tracked file is modified or any untracked file exists in `src/` or `test/`. Prevents AI from committing partial work and leaving the repo in a half-baked state.

- **Commit identity check** — pre-commit hook that verifies `git config user.email` is set to a non-default, expected value. Prevents commits being attributed to a ghost or misconfigured identity.

- **Commit signing** — enforce GPG/SSH signed commits via GitHub branch protection rules on `main`. Cryptographically verifiable authorship. Must be configured by repo owner in GitHub settings.

- **Secrets scanning** — already covered by Secretlint (pre-commit + CI, scans all staged files). No action needed.

- **Fitness functions** — define and automate architectural fitness functions for this codebase beyond what is already in place. Candidates: cyclomatic complexity per function (ESLint `complexity` rule), domain layer size vs. infrastructure size ratio, test-to-code file ratio, max dependency depth. Existing fitness functions: dependency-cruiser (boundary rules), coverage thresholds (95%/85%), mutation score (≥80%), `knip` (no dead code).

### Process (not automatable)

- **Overconfidence rule** — strengthen CLAUDE.md: AI must explicitly flag uncertainty *before* acting, propose a plan, and wait for confirmation when outcome is unclear. Complements the experiment/worktree pattern.

- **Commit scope review heuristic** — during review, flag commits touching more than one architectural layer without a clear reason. Not automated (too noisy), but worth making explicit as a review discipline.

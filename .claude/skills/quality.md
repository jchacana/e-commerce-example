---
name: quality
description: Quality gates, pre-commit checks, CI pipeline, and coverage thresholds — load when running gates or debugging CI failures
disable-model-invocation: true
---

## Pre-commit gates (in order)

1. `npx lint-staged` — Prettier format + ESLint on staged `.ts` files, `--max-warnings=0`
2. `npm run typecheck` — `tsc --noEmit`, full project
3. `npm run arch:check` — hexagonal boundary enforcement
4. `npm run test:unit` — unit tests only (acceptance and integration excluded)
5. `npm run audit` — blocks on high/critical CVEs (conditional: only when `src/`, `test/`, or `package*.json` are staged)

## Pre-push gates (in order)

1. `npx knip` — unused files, exports, and dependencies
2. `npm run test:cov` — full suite (unit + acceptance + integration) with coverage thresholds

## CI (`.github/workflows/ci.yml`)

Runs on push and PR to `main`:
secretlint → lint → format:check → arch:check → knip → typecheck → test --coverage → audit

Uses `node-version-file: .tool-versions` and `npm ci`.

## Coverage

- Thresholds: lines 95% / statements 95% / branches 85% / functions 95%
- Denominator: all `src/**/*.ts` except `src/main.ts`
- `--coverage` is NOT in the base `test` script — keeps watch mode fast
- Run `npm run test:cov` to check locally on demand

## Mutation testing (`.github/workflows/mutation.yml`)

- Scope: `src/domain/**/*.ts` only
- PR runs: incremental mode (`--incremental`), branch-keyed cache — fast
- Weekly scheduled run: full reset, no cache
- Local: `npm run mutation` — run after any new domain behaviour; 0 surviving mutants required before committing (enforced by `crafter` skill)

## Roadmap

Full quality tooling history and planned work: `docs/quality-roadmap.md`.

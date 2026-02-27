---
name: quality
description: Quality gates, pre-commit checks, CI pipeline, and coverage thresholds — load when running gates or debugging CI failures
disable-model-invocation: true
---

## Pre-commit gates (in order)

1. `npx lint-staged` — ESLint on staged `.ts` files, `--max-warnings=0`
2. `npm run typecheck` — `tsc --noEmit`, full project
3. `npm run test:unit` — unit tests only (acceptance excluded)
4. `npm run audit` — blocks on high/critical CVEs

## CI (`.github/workflows/ci.yml`)

Runs on push and PR to `main`: lint → typecheck → test --coverage → audit.
Uses `node-version-file: .tool-versions` and `npm ci`.

## Coverage

- Thresholds: 80% lines / statements / branches / functions
- Denominator: all `src/**/*.ts` except `src/main.ts`
- `--coverage` is NOT in the base `test` script — keeps watch mode fast
- Run `npm run test:cov` to check locally on demand

## Backlog

Planned quality tools (ts-arch, Stryker, Secretlint, knip, Renovate, and others) are tracked in `docs/quality-roadmap.md`.

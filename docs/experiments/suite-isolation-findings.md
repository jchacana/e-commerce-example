# Experiment: Jest Suite Isolation

Evaluated three approaches for isolating a Tier 2 integration test suite (`test/integration/`) from
the existing Tier 1 unit and acceptance tests. Stub integration test files were created at
`test/integration/product.repository.integration.spec.ts` and
`test/integration/order.repository.integration.spec.ts`.

---

## Approach 1 — `--testPathPatterns` selector

**What was done:**
- Added `test:integration` script: `jest --testPathPatterns=integration --runInBand`
- Updated `test:unit` script to also exclude `integration`: added a second `--testPathIgnorePatterns=integration` flag alongside the existing `--testPathIgnorePatterns=acceptance`
- No changes to the Jest config block in `package.json`

**Commands verified:**

`npm run test:unit` — 8 suites, 25 tests (no integration files):
```
Test Suites: 8 passed, 8 total
Tests:       25 passed, 25 total
```

`npm run test:integration` — 2 suites, 5 tests (integration only):
```
PASS test/integration/product.repository.integration.spec.ts
PASS test/integration/order.repository.integration.spec.ts
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

`npm test` — 12 suites, 41 tests (all tiers):
```
Test Suites: 12 passed, 12 total
Tests:       41 passed, 41 total
```

**Note on the deprecated `--testPathPattern` flag:** The existing `test:acceptance` script uses
`--testPathPattern` (singular), which Jest 30 reports as replaced by `--testPathPatterns`. This
experiment used the correct `--testPathPatterns` flag for the new `test:integration` script. The
`test:acceptance` script should also be updated, but that is out of scope for this experiment.

**Pros:**
- Minimal change. The Jest config block in `package.json` is untouched.
- Consistent with the existing pattern used by `test:acceptance`.
- `npm test` (and `npm run test:cov`) pick up all three tiers automatically — no pre-push hook
  change needed for full-suite coverage.
- Readable intent: the scripts themselves tell you what each tier contains.

**Cons:**
- The `test:unit` update (adding the second `--testPathIgnorePatterns`) is a silent behavioral
  change — future contributors must remember to add a third exclusion if a new tier is added.
- Pattern-based exclusion is positional, not structural: if a unit test file were placed under a
  path matching `integration`, it would be excluded from `test:unit`.
- Relies on directory naming convention to work; there is no config-level enforcement.

**Pre-push hook change needed:**
None. The pre-push hook runs `jest --coverage` (all suites). Integration tests are discovered
automatically. To run integration separately and in sequence:
```sh
npm run test:unit
npm run test:integration
npm run test:acceptance
```
This would require a pre-push hook update only if Tier 2 tests need to be gated separately (e.g.,
skipped when no DB is available). For now, all tiers pass since stubs have no DB dependency.

---

## Approach 2 — Separate config file

**What was done:**
- Created `jest.integration.config.js` pointing `roots` at `<rootDir>/test/integration/` only
- Added `test:integration` script: `jest --config jest.integration.config.js --runInBand`
- The base Jest config (in `package.json`) and `test:unit` script were **not** changed

**Note on TypeScript config files:** `jest.integration.config.ts` was attempted first but failed:
```
Error: Jest: 'ts-node' is required for the TypeScript configuration files.
```
`ts-node` is not installed in this project. A `.js` config file was used instead.

**Commands verified:**

`npm run test:unit` (unchanged) — 10 suites, 30 tests. Integration tests **ARE** included because
the base config roots include `test/` and `test:unit` only excludes `acceptance`:
```
PASS test/integration/product.repository.integration.spec.ts
PASS test/integration/order.repository.integration.spec.ts
Test Suites: 10 passed, 10 total
Tests:       30 passed, 30 total
```

`npm run test:integration` (via separate config) — 2 suites, 5 tests (integration only):
```
PASS test/integration/product.repository.integration.spec.ts
PASS test/integration/order.repository.integration.spec.ts
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

`npm test` — 12 suites, 41 tests (all tiers, integration included via base config roots).

**To fix `test:unit` isolation:** The `test:unit` script would still need the same
`--testPathIgnorePatterns=integration` flag added, same as Approach 1. The separate config file
provides no benefit for unit-suite exclusion.

**Pros:**
- The integration config can express integration-specific settings independently: custom timeout,
  `globalSetup`/`globalTeardown` for Testcontainers lifecycle, custom `testEnvironment`, separate
  `coverageDirectory`, or a `testTimeout` that differs from unit tests. These cannot be expressed
  per-suite in Approach 1.
- Clear boundary: the integration config file is the single authoritative definition of what
  constitutes an integration test.
- No dependency on directory naming conventions for the runner itself (just for `roots`).

**Cons:**
- Requires a `.js` config file (or `ts-node` to use `.ts`). `ts-node` is not currently installed.
- Does not solve `test:unit` isolation on its own — the unit script still needs patching (same
  change as Approach 1).
- `npm test` and `npm run test:cov` pick up integration tests via the base config, but `--coverage`
  only runs against the base config. Running `jest --config jest.integration.config.js --coverage`
  would produce a separate coverage report, which could cause confusion or double-counting.
- Two config surfaces to maintain (the `jest` block in `package.json` and the external file).

**Pre-push hook change needed:**
To include integration tests in the coverage gate, no change needed (base `npm run test:cov` already
picks them up). If integration tests need their own coverage gate or separate lifecycle (e.g.,
Testcontainers), the hook would need to be updated to:
```sh
npm run test:cov        # Tier 1 only (once test:unit is fixed)
npm run test:integration
```

---

## Approach 3 — Jest projects

**What was done:**
- Replaced the `roots`, `testRegex`, `transform`, `testEnvironment`, and `setupFiles` keys in the
  `jest` block with a `projects` array containing three named projects: `unit`, `acceptance`, and
  `integration`
- `unit` project roots: `src/` only (pure unit tests, co-located with source)
- `acceptance` project roots: `test/acceptance/`
- `integration` project roots: `test/integration/`
- `collectCoverageFrom` and `coverageThreshold` remain at the top level (they apply globally across
  all projects)
- Updated `test:unit` script to: `jest --selectProjects unit --runInBand`
- Updated `test:acceptance` script to: `jest --selectProjects acceptance --runInBand`
- Added `test:integration` script: `jest --selectProjects integration --runInBand`

**Commands verified:**

`npm run test:unit` — 8 suites, 25 tests (src/ only, no acceptance, no integration):
```
PASS unit src/infrastructure/http/product/product.controller.spec.ts
PASS unit src/infrastructure/http/order/order.controller.spec.ts
...
Test Suites: 8 passed, 8 total
Tests:       25 passed, 25 total
```

`npm run test:acceptance` — 2 suites, 11 tests (acceptance only):
```
PASS acceptance test/acceptance/products.acceptance.spec.ts
PASS acceptance test/acceptance/orders.acceptance.spec.ts
Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
```

`npm run test:integration` — 2 suites, 5 tests (integration only):
```
PASS integration test/integration/product.repository.integration.spec.ts
PASS integration test/integration/order.repository.integration.spec.ts
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

`npm test -- --coverage` — 12 suites, 41 tests, coverage thresholds pass:
```
All files  |   99.31 |       90 |   96.42 |    99.2
Test Suites: 12 passed, 12 total
Tests:       41 passed, 41 total
```

`npm run typecheck` and `npm run arch:check` — both pass with no errors.

**Note on `test:unit` with `--testPathIgnorePatterns`:** When the projects config is active, the
old `--testPathIgnorePatterns=acceptance` flag partially works but does not provide clean isolation
— it excludes acceptance paths from the `unit` project but still runs the `integration` project.
The `test:unit` script must use `--selectProjects unit`.

**Pros:**
- The strongest isolation guarantee. Each project's `roots` is explicit and positive (no exclusion
  patterns). Adding a new tier requires adding a new project entry — you cannot accidentally leak
  tests between tiers.
- `displayName` labels appear in all test output, making it immediately obvious which tier a test
  belongs to.
- Each project can express its own `transform`, `testEnvironment`, `globalSetup`/`globalTeardown`,
  and `testTimeout` independently — critical when Testcontainers are wired up (integration tests
  will need a longer timeout and a DB lifecycle hook that unit tests must not share).
- Coverage collection spans all projects in a single run; the threshold applies globally.
- The `acceptance` project is now an explicit first-class citizen rather than a pattern-matched
  subset of the flat config. Its boundary is structural, not nominal.

**Cons:**
- Most invasive change to `package.json`: the flat Jest config is restructured into a `projects`
  array. Every script that calls `jest` now implicitly runs all projects unless `--selectProjects`
  is specified.
- `ts-jest` transform config must be repeated in each project entry — no top-level inheritance for
  project-level keys. This is minor in practice; the entries are short.
- Slightly more mental overhead when reading the config cold.

**Pre-push hook change needed:**
None for the all-tiers pass. The current hook (`npm run test:cov`) runs all three projects and
collects coverage — no change required. If the integration project is ever skipped in environments
without a DB, the hook would change to:
```sh
npm run test:unit -- --coverage
npm run test:acceptance -- --coverage
npm run test:integration
```

---

## Recommendation

**Adopt Approach 3** (implemented in this branch).

**Initial assessment** recommended Approach 1 on the grounds that Testcontainers did not exist yet
and the smallest change was sufficient. That was overturned by the team on the following reasoning:

Testcontainers `globalSetup`/`globalTeardown` hooks are a known near-term requirement, and they
*require* Jest projects — there is no way to attach per-suite lifecycle hooks in a flat Jest config.
Deferring to Approach 1 would mean migrating to Approach 3 anyway the moment the first real
integration test is written. Doing that migration mid-feature adds unnecessary churn.

Taking Approach 3 now costs one additional edit to `package.json` over Approach 1. The benefit is
that the config is already in the right shape: when `globalSetup`/`globalTeardown` entries are
needed for the `integration` project, they are added to the relevant project entry with no
structural change to the config.

Approach 2 remains the weakest option and was not adopted: it introduces a second config surface
without solving unit-suite isolation, and does not provide per-project lifecycle hooks — it converges
on Approach 3's interface without Approach 3's guarantees.

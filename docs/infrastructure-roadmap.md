# Infrastructure Roadmap

## Goal

Reproducible environments and build artifacts across developer machines, CI, and production.

## Guiding Principle

Two local dev paths are supported and complementary — neither replaces the other:

| Path | When to use |
|---|---|
| **Native** (asdf + `.tool-versions`) | Day-to-day TDD loops. Zero overhead, native filesystem speed. |
| **Dev container** (Docker) | Onboarding, cross-OS consistency, or preference. |

`.tool-versions` is the single source of truth for the Node version. The dev container
derives its Node version from it — one pin, two surfaces.

---

## In Place

- `.tool-versions` — pins Node version for asdf; consumed by CI via `node-version-file`

---

## Planned

### Dev container — reproducible dev environment

A `.devcontainer/devcontainer.json` that defines a Docker image with the correct Node
version (read from `.tool-versions`), npm, and all tooling pre-installed.

- Removes "works on my machine" issues for cross-OS teams and onboarding
- Supported natively by Claude Code, VS Code, and GitHub Codespaces
- CI can optionally adopt the same image for full parity
- Does not affect the native path — asdf users are unaffected

### Dockerfile — reproducible production artifact

Multi-stage build:
1. **Build stage**: `node:22-alpine`, installs deps, compiles TypeScript
2. **Runtime stage**: minimal image, copies `dist/` only — no devDependencies, no source

Makes the production deployment auditable and environment-independent.

### Docker Compose — test database for acceptance tests

Relevant when the in-memory repositories are replaced with a real persistence layer
(TypeORM + PostgreSQL). Compose spins up a clean, isolated PostgreSQL instance for the
acceptance test suite.

**Impact on the crafter cycle:** the acceptance layer setup would extend to:
```
beforeAll: docker compose up db → buildApp()
afterAll:  app.close() → docker compose down
```
The inside-out TDD cycle (controller → use case → domain) is unaffected — those layers
are unit-tested with mocks and never touch the database.

**Implement after:** first TypeORM/PostgreSQL persistence slice is planned.

---

## Relationship to Quality Roadmap

These items are infrastructure/DX concerns, not quality gates. They do not belong in
`docs/quality-roadmap.md`. Cross-reference: the quality roadmap's coverage, lint, and
audit gates apply regardless of which dev path is used.

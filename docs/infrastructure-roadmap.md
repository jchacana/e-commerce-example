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
`ARG NODE_VERSION` in `.devcontainer/Dockerfile` must be kept in sync manually; a
`postCreateCommand` validation warns immediately if they diverge.

---

## In Place

- `.tool-versions` — pins Node version for asdf; consumed by CI via `node-version-file`
- `.devcontainer/` — reproducible dev environment via Docker; Node version pinned in `.devcontainer/Dockerfile` with drift detection against `.tool-versions`; includes Docker CLI (docker-outside-of-docker feature) and Claude Code CLI; supported by VS Code, GitHub Codespaces, and `@devcontainers/cli`
- `docker-compose.yml` — local Postgres 16 for dev use with TypeORM repositories; credentials match `.env.example`; not wired into the test suite (integration tests use Testcontainers per ADR-004)

---

## Planned

### Dockerfile — reproducible production artifact

Multi-stage build:
1. **Build stage**: `node:22-alpine`, installs deps, compiles TypeScript
2. **Runtime stage**: minimal image, copies `dist/` only — no devDependencies, no source

Makes the production deployment auditable and environment-independent.

---

## Relationship to Quality Roadmap

These items are infrastructure/DX concerns, not quality gates. They do not belong in
`docs/quality-roadmap.md`. Cross-reference: the quality roadmap's coverage, lint, and
audit gates apply regardless of which dev path is used.

# Contributing

This is the working agreement for everyone contributing to this project — human developers
and AI assistants alike. It is not aspirational; it describes how we actually work.

## Non-Negotiables

### Test-Driven Development

We practise outside-in TDD. No exceptions.

- Write a failing test before any production code. This is the first step, always.
- Run the test suite after every change.
- Never write more production code than the minimum needed to make a failing test pass.
- Never refactor on red. Only refactor when all tests are green.

### Commit Discipline

- Small, frequent commits. Each commit represents one coherent change.
- Format: conventional commits — `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
  followed by an imperative description. Enforced by commitlint.
  Example: `feat: add GET /products endpoint`
- Only commit on green.
- Never commit commented-out code.

### Design Principles

- **YAGNI**: do not add anything not required by a currently failing test.
- **Four Rules of Simple Design** (in priority order): passes tests → reveals intent →
  no duplication → fewest elements.
- Prefer duplication over the wrong abstraction.
- Make it work, make it right, make it fast — in that order, and only when needed.

### Code Craft

- Names matter. If you cannot name something clearly, the design is probably wrong.
- No comments explaining what the code does. Code should be self-documenting.
- Comments only for *why*, and only when truly non-obvious.
- No clever code. Optimise for the next person reading it.

### Scope Discipline

- Do only what was asked. Nothing more.
- If you see something worth improving that is out of scope, flag it — do not do it silently.
- Prefer many small steps over one large one.

## Process

### Before Writing Any Code

Every feature starts with a spec. Specs live in `docs/specs/`. Read existing specs first to
maintain consistency of format. If no spec exists for the feature you are about to build,
draft one and get it reviewed before any implementation begins.

### Implementing a Feature

Follow the outside-in TDD cycle:

1. Read the spec in `docs/specs/`
2. Write one failing acceptance test (HTTP layer)
3. Work inward, one layer at a time:
   - Controller → unit test with mocked use case
   - Use case → unit test with mocked repository
   - Domain → pure unit test, no mocks needed
4. Each layer: failing test → minimum production code → green → refactor.
   For use case tests specifically: once green, replace repository mocks with
   real in-memory implementations and assert on state. See [ADR-003](docs/adr/ADR-003.md).
5. Acceptance test goes GREEN → commit
6. Repeat per scenario

### Branching and Integration

All work — whether by a human developer or an AI agent — happens on a branch, never
directly on `main`.

- Branch from `main`, name it for the work: `feat/get-products`, `chore/add-knip`, etc.
- Commit with discipline on the branch: small, frequent, on green, conventional format.
- Integrate into `main` via **squash merge only**. One branch = one commit on `main`.
  This keeps the history linear and readable.
- Delete the branch after merging.

AI agents doing exploratory or parallel work follow the same rules: work in an isolated
branch, commit there, integrate via squash when the work is accepted.

**Experiment discipline:** any change whose outcome is uncertain must be tried in an
isolated worktree first — never applied directly to the working tree. The agent commits
its result to the worktree branch. If the experiment succeeds, squash merge the branch.
Do not redo the work manually.

Multiple agents can run in parallel, each in their own worktree branch — this is safe
and encouraged. However, **main must not move while any worktree experiment is in
flight**. Do not commit directly to main until all running experiments have been merged
or abandoned. Violating this causes merge conflicts on squash merge, even though the
worktree isolation itself is sound.

Never resume a worktree agent after main has moved. If a fix is needed post-review,
start a fresh agent from the current main. Once a worktree is squash merged and
deleted, it is gone — never resume it.

### Code Review

Reviews enforce this working agreement. Reviewers should check:

- Does a spec exist?
- Does every piece of production code have a test that went RED first?
- Are commits small and on green?
- Are architectural boundaries respected?

## Architecture

This project uses Clean Architecture layering inside a Hexagonal (Ports and Adapters)
boundary. Full rationale in [`docs/adr/ADR-001.md`](docs/adr/ADR-001.md).

```
src/
├── domain/         # Pure business logic. No framework dependencies.
│                   # Repository interfaces (driven ports) live here.
├── application/    # Use cases. Orchestrate domain via repository interfaces.
└── infrastructure/ # Adapters — HTTP controllers (driving), persistence (driven).

test/
└── acceptance/     # End-to-end HTTP tests (Supertest)
```

**Ports and Adapters:**
- *Driven ports* — repository interfaces in `domain` (e.g. `IProductRepository`).
  The application calls out through these; infrastructure provides the implementations.
- *Driving adapters* — HTTP controllers translate external requests into use case calls.
- *Driving-side port interfaces* — intentionally omitted. See [ADR-002](docs/adr/ADR-002.md).

Boundaries enforced automatically by dependency-cruiser:
- `domain` must not import from `infrastructure` or `application`
- `application` must not import from `infrastructure/http`

Full inventory of implemented slices in [`docs/architecture.md`](docs/architecture.md).

## Local Setup

### Prerequisites

Node 22 via [asdf](https://asdf-vm.com/):

```sh
asdf install  # reads .tool-versions
```

### Install and run

```sh
npm install
npm run start:dev
```

### Tests

```sh
npm run test:unit        # unit tests only — use this during TDD loops
npm run test:acceptance  # acceptance tests only
npm run test:integration # integration tests (requires Docker — see below)
npm test                 # full suite with coverage
```

#### Integration tests — Docker setup

Integration tests use [Testcontainers](https://testcontainers.com/) to spin up a real PostgreSQL instance. Docker must be running and Testcontainers must be able to find it.

**Docker Desktop** — no extra configuration needed.

**Colima** — create `~/.testcontainers.properties` with the socket path:

```
docker.host=unix:///Users/<your-username>/.colima/docker.sock
```

Substitute your actual username. Testcontainers reads this file automatically.

### Quality gates (enforced automatically at pre-commit / pre-push / CI)

```sh
npm run lint       # ESLint
npm run typecheck  # TypeScript strict
npm run arch:check # Hexagonal boundary enforcement
npm run secretlint # Credential scan
npm run audit      # npm audit (high severity, prod deps only)
```

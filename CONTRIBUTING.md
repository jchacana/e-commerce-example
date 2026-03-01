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
4. Each layer: failing test → minimum production code → green → refactor
5. Acceptance test goes GREEN → commit
6. Repeat per scenario

### Code Review

Reviews enforce this working agreement. Reviewers should check:

- Does a spec exist?
- Does every piece of production code have a test that went RED first?
- Are commits small and on green?
- Are architectural boundaries respected?

## Architecture

Hexagonal architecture. Full inventory of implemented slices in
[`docs/architecture.md`](docs/architecture.md).

```
src/
├── domain/         # Pure business logic. No framework dependencies.
├── application/    # Use cases. One file per action.
└── infrastructure/ # NestJS, HTTP controllers, persistence.

test/
└── acceptance/     # End-to-end HTTP tests (Supertest)
```

Boundaries enforced automatically by dependency-cruiser:
- `domain` must not import from `infrastructure` or `application`
- `application` must not import from `infrastructure/http`

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
npm test                 # full suite with coverage
```

### Quality gates (enforced automatically at pre-commit / pre-push / CI)

```sh
npm run lint       # ESLint
npm run typecheck  # TypeScript strict
npm run arch:check # Hexagonal boundary enforcement
npm run secretlint # Credential scan
npm run audit      # npm audit (high severity, prod deps only)
```

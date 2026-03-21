# ecommerce-api — AI Assistant Context

> Team working agreement (TDD, commits, design principles, process, local setup): [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Non-Negotiables

These apply to every AI assistant working in this codebase, every session.

### TDD
- Write a failing test before any production code. No exceptions.
- Run the suite after every change and report the result.
- Write the minimum code to make the failing test pass. No more.
- Never refactor on red.

### Scope
- Do only what was asked. Flag out-of-scope improvements, never act on them silently.
- Prefer many small steps over one large one.

### Design
- YAGNI: nothing not required by a currently failing test.
- Four Rules of Simple Design: passes tests → reveals intent → no duplication → fewest elements.
- Prefer duplication over the wrong abstraction.

### Experiments
- Any change with uncertain outcome runs in a worktree first — never modify the working tree directly.
- The agent validates as if it were going to push: run the full suite with coverage, typecheck, lint, and audit — not just `npm test`.
- The agent commits its result to the worktree branch. If accepted, squash merge. Do not redo the work manually.
- Multiple agents can run in parallel in separate worktrees — safe and encouraged.
- **Main must not move while any worktree experiment is in flight.** Do not commit to main until all running experiments are merged or abandoned.
- Never resume a worktree agent after main has moved. If a fix is needed post-review, start a fresh agent from the current main.
- Once a worktree is squash merged and deleted, it is gone — never resume it.

## Architecture

Architecture decisions are recorded in [`docs/adr/`](docs/adr/).
See [ADR-001](docs/adr/ADR-001.md) (architecture style), [ADR-002](docs/adr/ADR-002.md) (driving-side ports), [ADR-003](docs/adr/ADR-003.md) (testing strategy), and [ADR-004](docs/adr/ADR-004.md) (two-tier DB test strategy).

Outside-in layered architecture following hexagonal principles:

```
src/
├── domain/          # Pure business logic. Zero framework dependencies.
│   ├── product/     # Product entity, IProductRepository interface + token
│   └── order/       # Order + OrderItem entities, IOrderRepository interface + token
├── application/     # Use cases. One file per action.
│   ├── product/     # CreateProductUseCase, ...
│   └── order/       # PlaceOrderUseCase, ...
└── infrastructure/  # Framework code. NestJS, persistence.
    ├── http/        # Controllers + DTOs (co-located per aggregate)
    ├── persistence/
    │   └── in-memory/   # InMemory* repositories for dev and tests
    └── *.module.ts  # NestJS module wiring per aggregate

test/
└── acceptance/      # End-to-end HTTP tests (Supertest + NestJS TestingModule)
```

## Layer Rules

### Domain (`src/domain/`)
- Pure TypeScript. No NestJS or any framework imports.
- Entities are immutable: use `readonly` on all fields.
- Factory methods (e.g., `Product.create(...)`) enforce invariants and throw on violation.
- Repository **interfaces** and injection **tokens** live here; implementations belong in `infrastructure/persistence/`.
- Tests: pure unit tests — no mocks needed (no collaborators).

### Application (`src/application/`)
- One file per use case, named `<verb>-<noun>.use-case.ts`.
- Use cases receive repository interfaces via constructor injection.
- No HTTP, no response shaping, no framework logic.
- Tests: two phases. During RED→GREEN, mock repository collaborators (London school) to drive the design. On GREEN, refactor to inject real in-memory repositories and assert on state (Classic school). See [ADR-003](docs/adr/ADR-003.md).

### Infrastructure — HTTP (`src/infrastructure/http/`)
- One controller per domain aggregate.
- Controllers translate HTTP ↔ use case: map DTO → Command, call use case, return result.
- No business logic in controllers.
- Tests: unit tests. **Mock all use case collaborators** (London school). Verify delegation.

### Infrastructure — Persistence (`src/infrastructure/persistence/`)
- `in-memory/` implementations: used in acceptance tests and local dev (no DB needed).
- Future `typeorm/`, `postgres/`: swap by changing the module binding only.

## DI Token Convention

Tokens and interfaces live together in the domain:

```typescript
// src/domain/product/product.repository.ts
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
export interface IProductRepository { save(p: Product): Promise<Product>; ... }
```

Modules bind token → implementation:

```typescript
{ provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository }
```

## Naming Conventions

| What                  | Convention          | Example                       |
|-----------------------|---------------------|-------------------------------|
| Entity                | PascalCase class    | `Product`, `Order`            |
| Repository interface  | `I<Name>Repository` | `IProductRepository`          |
| Repository token      | SCREAMING_SNAKE     | `PRODUCT_REPOSITORY`          |
| Use case              | `<Verb><Noun>UseCase` | `CreateProductUseCase`      |
| Command               | `<Verb><Noun>Command` | `CreateProductCommand`      |
| Controller            | `<Name>Controller`  | `ProductController`           |
| DTO                   | `<Verb><Noun>Dto`   | `CreateProductDto`            |
| Module                | `<Name>Module`      | `ProductModule`               |
| Spec file             | co-located, `.spec.ts` | `product.controller.spec.ts` |

## Commit Messages

This project enforces conventional commits via commitlint. Always use the format:

```
<type>: <description>
```

Common types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`. Description in imperative mood, present tense.

**Co-authorship**: Every commit generated by an AI assistant must include a co-author trailer:

```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Process

**Implementing a new feature or aggregate slice**: invoke the `crafter` skill before
writing any code. Do not begin implementation without it.

**Writing a spec**: invoke the `po` skill. Do not write a spec manually.

> **Scope of specs**: specs are required for business features — any endpoint that encodes domain rules, invariants, or user-facing behaviour. Pure infrastructure endpoints (health checks, metrics, readiness probes) are exempt — they have no business rules and no user stories to capture.

**Recording an architectural decision**: invoke the `architect` skill. Do not write an ADR manually.

**Running a worktree experiment**: invoke the `experiment` skill. Do not apply exploratory changes directly to main.

## Agent Rules

### Launching sub-agents (worktree experiments, parallel tasks)
- Never hardcode the main tree path in an agent prompt — agents must work in their cwd.
- Always write: "Work in your current directory. Do not use absolute paths."
- Always tell agents to commit before finishing: "Commit your work to this branch when done. Do not push."

### Applying changes to docs or CLAUDE.md
- Always show a draft and wait for explicit confirmation before applying any change to `CLAUDE.md` or files under `docs/`.
- Do not push to remote unless explicitly asked.

## In Progress

> Update this section when parking mid-cycle. Clear it when the cycle completes and you commit.
> Format: feature name, current cycle position, next concrete step.

_Nothing in progress — all slices GREEN._

## Current State

Full inventory of implemented slices → [`docs/architecture.md`](docs/architecture.md)

| Aggregate | Endpoints | Status |
|-----------|-----------|--------|
| Products  | `POST /products`, `GET /products`, `GET /products/:id` | all GREEN ✓ |
| Orders    | `POST /orders` | all GREEN ✓ |

> **Discipline:** update `docs/architecture.md` (and this table) as part of the commit that moves a slice from RED to GREEN.


# ecommerce-api

A NestJS REST API built with outside-in TDD and hexagonal architecture. Use it as a scaffold for new projects or as a reference implementation.

## Stack

| Concern | Tool |
|---------|------|
| Runtime | Node 22 (via [asdf](https://asdf-vm.com/)) |
| Framework | NestJS 11 |
| Language | TypeScript (strict) |
| Testing | Jest 30 + Supertest |
| Validation | class-validator + class-transformer |
| ID generation | uuid |

## Getting started

### Option A — Dev container (recommended)

Requires Docker. No other prerequisites.

```bash
npm install -g @devcontainers/cli
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . npm test
```

### Option B — Local

Requires [asdf](https://asdf-vm.com/) with the `nodejs` plugin and [direnv](https://direnv.net/) hooked into your shell.

```bash
asdf install
direnv allow   # adds node_modules/.bin to PATH, loads .env
cp .env.example .env
npm install
npm test
```

### Use as a scaffold

```bash
npx degit jchacana/e-commerce-example my-project
cd my-project
npm install
```

> After scaffolding, update `name` in `package.json` to match your project.

## API

Swagger UI: `http://localhost:3000/api/docs`

Start the server:

```bash
npm run start:dev
```

### Implemented endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/products` | Create a product |
| GET | `/products` | List all products |
| GET | `/products/:id` | Get a product |
| POST | `/orders` | Place an order |
| GET | `/health` | Health check |

## Architecture

Outside-in layered architecture following hexagonal principles:

```
src/
├── domain/          # Pure business logic. Zero framework dependencies.
├── application/     # Use cases. One file per action.
└── infrastructure/  # NestJS, HTTP controllers, in-memory persistence.

test/
├── acceptance/      # Full HTTP round-trips (Supertest + NestJS TestingModule)
└── integration/     # Repository tests against real DB via Testcontainers
```

**Layer rules:**
- `domain` — pure TypeScript. No imports from application or infrastructure.
- `application` — orchestrates domain via repository interfaces. No HTTP knowledge.
- `infrastructure` — adapts. Controllers translate HTTP ↔ Commands and delegate to use cases.

Architectural decisions: [`docs/adr/`](docs/adr/)

## Testing strategy

Outside-in TDD, London school. The cycle:

```
ACCEPTANCE TEST (RED)
  → controller unit test (RED) → implement → GREEN
  → use case unit test (RED)  → implement → GREEN
  → domain unit test (RED)    → implement → GREEN
ACCEPTANCE TEST (GREEN) ✓
```

```bash
npm run test:unit        # fast inner loop
npm run test:acceptance  # full HTTP round-trips
npm run test:integration # real DB via Testcontainers (requires Docker)
npm test                 # full suite with coverage
```

## Quality gates

Pre-commit: Prettier → ESLint → typecheck → arch check → unit tests → audit
Pre-push: knip → full suite with coverage
CI: lint → format check → arch check → knip → typecheck → test with coverage → audit → mutation (domain only)

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | HTTP listen port |
| `DATABASE_URL` | — | Postgres connection string (not required for in-memory dev/test) |
| `DATABASE_URL_TEST` | — | Postgres test DB (not required for in-memory dev/test) |

Copy `.env.example` to `.env` and adjust. The `.envrc` file loads it automatically when `direnv allow` has been run.

## Adding your first aggregate

This scaffold enforces outside-in TDD. Every new slice follows the same cycle:

```
ACCEPTANCE TEST (RED)
  → controller unit test (RED) → implement → GREEN
  → use case unit test (RED)  → implement → GREEN
  → domain unit test (RED)    → implement → GREEN
ACCEPTANCE TEST (GREEN) ✓
```

Before writing any code:
1. Write a spec in `docs/specs/` — see existing specs for the format
2. Follow the cycle layer by layer, committing on each GREEN

Full working agreement (TDD rules, commit discipline, branching, architecture boundaries): [`CONTRIBUTING.md`](CONTRIBUTING.md)

**If you're using Claude Code:** `CLAUDE.md` is pre-configured. Invoke the `crafter` skill before starting any slice — it guides the full cycle.

Architecture inventory: [`docs/architecture.md`](docs/architecture.md)

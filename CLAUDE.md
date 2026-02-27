# ecommerce-api — Project Context

## Architecture

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

## Outside-In TDD Cycle (London School)

**Always start at `test/acceptance/`. A new feature begins with a RED acceptance test.**

```
ACCEPTANCE (RED)
  → unit test controller (RED)    → implement controller (GREEN)
  → unit test use case (RED)      → implement use case (GREEN)
  → unit test domain (RED)        → implement domain (GREEN)
  → refactor (GREEN stays GREEN)
  → ACCEPTANCE (GREEN) ✓
```

Never write production code without a failing test driving it.
Never refactor on red.

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
- Tests: unit tests. **Mock all repository collaborators** (London school). Verify interactions.

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

## Test Patterns

### Acceptance test (Supertest)
```typescript
it('creates a product and returns 201', async () => {
  await request(app.getHttpServer())
    .post('/products')
    .send({ name: 'Widget', price: 9.99 })
    .expect(201)
    .expect(({ body }) => {
      expect(body.id).toBeDefined();
      expect(body.name).toBe('Widget');
    });
});
```

### Unit test — controller (London school)
```typescript
it('delegates to CreateProductUseCase with a command', async () => {
  const product = Product.create('1', 'Widget', 9.99);
  mockCreateProduct.execute.mockResolvedValue(product);

  const result = await controller.create({ name: 'Widget', price: 9.99 });

  expect(mockCreateProduct.execute).toHaveBeenCalledWith(
    new CreateProductCommand('Widget', 9.99),
  );
  expect(result).toBe(product);
});
```

### Unit test — use case (London school)
```typescript
it('saves a new product via the repository', async () => {
  mockRepository.save.mockResolvedValue(savedProduct);

  const result = await useCase.execute(new CreateProductCommand('Widget', 9.99));

  expect(mockRepository.save).toHaveBeenCalledTimes(1);
  const [saved] = mockRepository.save.mock.calls[0];
  expect(saved.name).toBe('Widget');
  expect(saved.price).toBe(9.99);
  expect(result).toBe(savedProduct);
});
```

## Current State

### Products — example slice (all tests GREEN)
- `src/domain/product/product.ts` — `Product` entity with `Product.create()`
- `src/application/product/create-product.use-case.ts` — `CreateProductUseCase`
- `src/infrastructure/http/product/product.controller.ts` — `POST /products`
- `src/infrastructure/product.module.ts` — NestJS wiring

### Orders — your first TDD cycle (acceptance test RED)
- `test/acceptance/orders.acceptance.spec.ts` — **RED**: `POST /orders` → 404
- `src/domain/order/order.ts` — `Order` + `OrderItem` entities (domain tests GREEN)
- `src/domain/order/order.repository.ts` — `IOrderRepository` interface
- Use case, controller, module: **not yet written — start here**

## Quality Infrastructure

### Pre-commit gates (in order)
1. `npx lint-staged` — ESLint on staged `.ts` files, `--max-warnings=0`
2. `npm run typecheck` — `tsc --noEmit`, full project
3. `npm run test:unit` — unit tests only (acceptance excluded)
4. `npm run audit` — blocks on high/critical CVEs

### CI (`.github/workflows/ci.yml`)
Runs on push and PR to `main`: lint → typecheck → test --coverage → audit.
Uses `node-version-file: .tool-versions` and `npm ci`.

### Coverage
- Thresholds: 80% lines / statements / branches / functions
- Denominator: all `src/**/*.ts` except `src/main.ts`
- `--coverage` is NOT in the base `test` script — keeps watch mode fast
- Run `npm run test:cov` to check locally on demand

### Backlog
Planned quality tools (ts-arch, Stryker, Secretlint, knip, Renovate, and others) are tracked in `docs/quality-roadmap.md`.

## Commands

```bash
npm test                   # full suite
npm run test:acceptance    # acceptance layer only (outside-in entry point)
npm run test:unit          # unit tests only
npm run test:watch         # TDD watch mode
npm run test:cov           # full suite + coverage report
npm run typecheck          # tsc --noEmit — must pass before every commit
npm run lint               # ESLint across src/ and test/
npm run audit              # npm audit --audit-level=high --omit=dev
npm run start:dev          # local dev server (uses in-memory repos)
```

## Environment Setup

```bash
cp .env.example .env       # first time only
direnv allow               # activate .envrc (adds node_modules/.bin to PATH)
npm install
npm test
```

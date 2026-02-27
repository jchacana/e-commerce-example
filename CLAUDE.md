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

> **Discipline:** update this section as part of the commit that moves a slice from RED to GREEN.


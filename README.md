# ecommerce-api

A NestJS e-commerce REST API built with a strict outside-in TDD discipline and a clean, hexagonal architecture. The codebase is a **living scaffold**: the Products slice is fully implemented as a reference, and the Orders slice is left as the first TDD cycle for contributors to drive through.

## Stack

| Concern | Tool |
|---------|------|
| Runtime | Node 22 (via [asdf](https://asdf-vm.com/)) |
| Framework | [NestJS](https://nestjs.com/) 10 |
| Language | TypeScript 5 |
| Testing | Jest 29 + Supertest |
| Validation | class-validator + class-transformer |
| ID generation | uuid v9 |
| Env isolation | [direnv](https://direnv.net/) |

---

## Getting started

### Prerequisites

- [asdf](https://asdf-vm.com/) with the `nodejs` plugin
- [direnv](https://direnv.net/) hooked into your shell

### First-time setup

```bash
# Install the correct Node version
asdf install

# Activate direnv (adds node_modules/.bin to PATH and loads .env)
direnv allow

# Copy environment template
cp .env.example .env

# Install dependencies
npm install
```

### Run the dev server

```bash
npm run start:dev
```

The API starts on `http://localhost:3000` (or the `PORT` from `.env`).

---

## API

### Products

#### `POST /products`

Creates a new product.

**Request**
```bash
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "price": 9.99}' | jq
```

**Response — 201 Created**
```json
{
  "id": "b3d7e21a-4c8f-4b1e-9f23-1a2b3c4d5e6f",
  "name": "Widget",
  "price": 9.99
}
```

**Validation errors — 400 Bad Request**
```bash
# Missing name
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"price": 9.99}'

# Non-positive price
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "price": 0}'
```

---

## Project structure

```
src/
├── domain/                      # Pure business logic. Zero framework dependencies.
│   ├── product/
│   │   ├── product.ts           # Product entity with factory + invariants
│   │   ├── product.spec.ts      # Pure unit tests
│   │   └── product.repository.ts  # IProductRepository interface + injection token
│   └── order/
│       ├── order.ts             # Order + OrderItem entities
│       ├── order.spec.ts
│       └── order.repository.ts
│
├── application/                 # Use cases. One file per action.
│   └── product/
│       ├── create-product.command.ts
│       ├── create-product.use-case.ts
│       └── create-product.use-case.spec.ts
│
└── infrastructure/              # NestJS wiring, HTTP, persistence.
    ├── http/
    │   └── product/
    │       ├── product.controller.ts
    │       ├── product.controller.spec.ts
    │       └── dto/create-product.dto.ts
    ├── persistence/
    │   └── in-memory/           # InMemory repositories (dev + tests)
    │       └── in-memory-product.repository.ts
    └── product.module.ts        # Binds token → implementation

test/
├── setup.ts                     # Global: imports reflect-metadata for decorators
└── acceptance/
    ├── products.acceptance.spec.ts   # GREEN — reference slice
    └── orders.acceptance.spec.ts     # RED  — drives your first TDD cycle
```

### Layer rules

**Domain** owns the invariants. `Product.create()` and `Order.place()` throw on invalid input. No NestJS, no uuid, no nothing — just TypeScript classes. Repository *interfaces* and DI *tokens* are defined here so the domain dictates the contract; infrastructure fulfills it.

**Application** orchestrates. Each use case receives its dependencies via constructor injection (interfaces, not concrete types) and delegates to the domain. No HTTP knowledge, no response shaping.

**Infrastructure** adapts. Controllers translate HTTP ↔ Commands and immediately delegate to use cases. In-memory repositories implement domain interfaces for local dev and test runs without a database. Swapping in a Postgres/TypeORM implementation means changing one line in the module — nothing else.

---

## Testing strategy

This project uses **outside-in TDD, London school**.

### The cycle

```
ACCEPTANCE TEST (RED)
  ↓ drives
UNIT TEST — controller (RED) → implement → GREEN
  ↓ drives
UNIT TEST — use case (RED) → implement → GREEN
  ↓ drives
UNIT TEST — domain entity (RED) → implement → GREEN
  ↓
ACCEPTANCE TEST (GREEN) ✓
```

Start at the outside. Write the failing acceptance test first. Let it pull the implementation layer by layer inward.

### Test layers

#### Acceptance tests (`test/acceptance/`)

Full HTTP round-trips using NestJS `TestingModule` + Supertest. Spin up the real application with in-memory repositories — no mocking, no stubbing, no database. These are the tests that tell you a feature actually works end-to-end.

```typescript
it('creates a product and returns 201 with the persisted resource', async () => {
  await request(app.getHttpServer())
    .post('/products')
    .send({ name: 'Widget', price: 9.99 })
    .expect(201)
    .expect(({ body }) => {
      expect(body.id).toBeDefined();
      expect(body.name).toBe('Widget');
      expect(body.price).toBe(9.99);
    });
});
```

#### Unit tests — infrastructure (`*.controller.spec.ts`)

The controller is tested in isolation. Its only collaborator (the use case) is replaced with a Jest mock. The test verifies that the controller builds the right Command and delegates to the use case — nothing more.

```typescript
it('delegates to CreateProductUseCase with a command built from the DTO', async () => {
  mockCreateProduct.execute.mockResolvedValue(product);

  const result = await controller.create({ name: 'Widget', price: 9.99 });

  expect(mockCreateProduct.execute).toHaveBeenCalledWith(
    new CreateProductCommand('Widget', 9.99),
  );
  expect(result).toBe(product);
});
```

#### Unit tests — application (`*.use-case.spec.ts`)

The use case is tested in isolation. The repository interface is replaced with a Jest mock. Tests verify *interactions*: was `save` called? With what? This is the London school characteristic — test behaviour through message-passing, not state.

```typescript
it('creates a product and persists it via the repository', async () => {
  mockRepository.save.mockResolvedValue(persistedProduct);

  await useCase.execute(new CreateProductCommand('Widget', 9.99));

  expect(mockRepository.save).toHaveBeenCalledTimes(1);
  const [saved] = mockRepository.save.mock.calls[0];
  expect(saved.name).toBe('Widget');
  expect(saved.price).toBe(9.99);
});
```

#### Unit tests — domain (`*.spec.ts` in `domain/`)

No mocks. Domain objects have no collaborators. Tests assert invariants directly: valid construction succeeds, invalid construction throws a descriptive error.

```typescript
it('rejects a non-positive price', () => {
  expect(() => Product.create('1', 'Widget', 0)).toThrow('Product price must be positive');
});
```

### Why London school?

Mocking collaborators at each layer boundary forces the design to emerge from the outside in. If a collaborator is hard to mock, it's a signal the interface is wrong. Dependencies flow inward (infrastructure → application → domain) and are expressed as interfaces owned by the domain. Concrete implementations are injected at the composition root (the NestJS module).

---

## Running tests

```bash
# Full suite
npm test

# Watch mode — use during a TDD cycle
npm run test:watch

# Acceptance layer only — check outside-in progress
npm run test:acceptance

# Unit tests only — fast inner loop
npm run test:unit
```

### Current test status

| Suite | Status | Notes |
|-------|--------|-------|
| `src/domain/product/product.spec.ts` | GREEN | Entity invariants |
| `src/domain/order/order.spec.ts` | GREEN | Entity invariants |
| `src/application/product/create-product.use-case.spec.ts` | GREEN | Use case, mocked repo |
| `src/infrastructure/http/product/product.controller.spec.ts` | GREEN | Controller, mocked use case |
| `test/acceptance/products.acceptance.spec.ts` | GREEN | Full HTTP slice |
| `test/acceptance/orders.acceptance.spec.ts` | **RED** | Drives the Orders TDD cycle |

---

## Your first TDD cycle — Orders

The orders acceptance test is deliberately RED. It pulls a full vertical slice that doesn't exist yet. Follow the outside-in cycle:

1. Run `npm run test:acceptance` — confirm RED on `POST /orders`
2. Write a failing unit test for `OrderController`
3. Implement `OrderController` — GREEN
4. Write a failing unit test for `PlaceOrderUseCase`
5. Implement `PlaceOrderUseCase` — GREEN
6. Add `PlaceOrderCommand`, `InMemoryOrderRepository`, `OrderModule`
7. Import `OrderModule` in `AppModule`
8. Run `npm run test:acceptance` — GREEN ✓

The domain is already there: `Order`, `OrderItem`, and `IOrderRepository` in `src/domain/order/`.

---

## Dependency injection

Repository interfaces are defined in the domain layer and exposed with a Symbol token:

```typescript
// src/domain/product/product.repository.ts
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}
```

The module binds the token to a concrete implementation:

```typescript
// src/infrastructure/product.module.ts
{
  provide: PRODUCT_REPOSITORY,
  useClass: InMemoryProductRepository,   // swap this for TypeormProductRepository in production
}
```

Use cases declare the dependency using the token:

```typescript
constructor(
  @Inject(PRODUCT_REPOSITORY)
  private readonly repository: IProductRepository,
) {}
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | HTTP listen port |
| `DATABASE_URL` | — | Postgres connection string (future use) |
| `DATABASE_URL_TEST` | — | Postgres test DB (future use) |

Copy `.env.example` to `.env` and adjust. The `.envrc` file loads it automatically when `direnv allow` has been run.

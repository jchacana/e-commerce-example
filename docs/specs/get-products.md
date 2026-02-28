# Feature: Get Products

**Summary**: A client retrieves one or all products from the catalogue.

---

## User Stories

**US1 — Client retrieves all products**
> As a client, I want to list all available products
> so that I can browse the catalogue.

Acceptance scenarios:
- Given no products exist → returns an empty list
- Given one or more products exist → returns all of them

**US2 — Client retrieves a single product**
> As a client, I want to fetch a product by its ID
> so that I can view its details.

Acceptance scenarios:
- Given a product with the requested ID exists → returns it
- Given no product with the requested ID exists → rejected

---

## Functional Requirements

| ID     | Requirement |
|--------|-------------|
| FR-001 | `GET /products` MUST return a list of all persisted products |
| FR-002 | `GET /products` MUST return an empty list when no products exist |
| FR-003 | `GET /products/:id` MUST return the product with the given ID |
| FR-004 | `GET /products/:id` MUST be rejected when no product with that ID exists |

---

## Success Criteria

| ID     | Criterion |
|--------|-----------|
| SC-001 | `GET /products` returns 200 with all products |
| SC-002 | `GET /products` returns 200 with an empty array when none exist |
| SC-003 | `GET /products/:id` returns 200 with the matching product |
| SC-004 | `GET /products/:id` returns a client error when the product does not exist |

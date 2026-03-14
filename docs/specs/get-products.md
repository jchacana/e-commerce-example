# Feature: Get Products

**Summary**: A client retrieves one or all products from the catalogue.

---

## User Stories

**US1 — Client retrieves all products**
> As a client, I want to list all available products
> so that I can browse the catalogue.

Acceptance scenarios:
- Given no products have been created
- When the client requests all products
- Then an empty list is returned

---

- Given one or more products exist
- When the client requests all products
- Then all products are returned

---

**US2 — Client retrieves a single product**
> As a client, I want to fetch a product by its ID
> so that I can view its details.

Acceptance scenarios:
- Given a product with the requested ID exists
- When the client requests it by ID
- Then the product is returned

---

- Given no product with the requested ID exists
- When the client requests it by ID
- Then the request is rejected

---

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-001 | All products are returned when a list is requested |
| AC-002 | An empty list is returned when no products exist |
| AC-003 | The requested product is returned when it exists |
| AC-004 | The request is rejected when no product with that ID exists |

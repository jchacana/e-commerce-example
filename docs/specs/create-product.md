# Feature: Create Product

**Summary**: A catalogue manager adds a new product to the system so it becomes available for browsing and ordering.

---

## User Stories

**US1 — Catalogue manager creates a product**
> As a catalogue manager, I want to add a new product with a name and a price
> so that customers can browse and order it.

Acceptance scenarios:
- Given a valid name and a positive price
- When the product is submitted
- Then the product is recorded and returned with a system-generated identifier, the name, and the price

---

**US2 — System rejects incomplete or invalid products**
> As the system, I want to reject products that are missing required information or have invalid values
> so that the catalogue only contains well-formed entries.

Acceptance scenarios:
- Given a request with no name
- When it is submitted
- Then the request is rejected

---

- Given a request with a price of zero or less
- When it is submitted
- Then the request is rejected

---

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-001 | A product with a name and a positive price is recorded and returned with a system-generated identifier |
| AC-002 | A product without a name is rejected |
| AC-003 | A product with a zero or negative price is rejected |

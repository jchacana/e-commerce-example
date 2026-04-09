# Feature: Get Order

**Summary**: A customer retrieves an order by its identifier so they can review what was submitted.

---

## User Stories

**US1 — Customer retrieves their order**
> As a customer, I want to fetch an order by its ID
> so that I can review the details of what I submitted.

Acceptance scenarios:
- Given an order with the requested ID exists
- When the customer requests it by ID
- Then the order is returned with its identifier, customer, and items

---

- Given no order with the requested ID exists
- When the customer requests it by ID
- Then the request is rejected

---

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-012 | The requested order is returned with its identifier, customer, and items when it exists |
| AC-013 | The request is rejected when no order with that ID exists |

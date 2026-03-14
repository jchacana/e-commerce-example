# Feature: Place Order

**Summary**: A customer submits an order containing one or more items. The system persists it and returns the recorded order.

---

## User Stories

**US1 — Customer places a valid order**
> As a customer, I want to submit an order with one or more items
> so that my purchase is recorded for fulfillment.

Acceptance scenarios:
- Given a customer and a list of items, each with a product reference and a positive quantity
- When they submit the order
- Then the order is recorded and returned with a system-generated identifier, the customer, and the submitted items

---

**US2 — System rejects malformed orders**
> As the system, I want to reject incomplete or invalid order requests
> so that only well-formed orders are stored.

Acceptance scenarios:
- Given a request with no customer
- When it is submitted
- Then the request is rejected

---

- Given a request with an empty list of items
- When it is submitted
- Then the request is rejected

---

- Given a request containing an item with a zero or negative quantity
- When it is submitted
- Then the request is rejected

---

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-001 | A valid order is recorded and returned with a system-generated identifier, the customer, and the submitted items |
| AC-002 | An order without a customer is rejected |
| AC-003 | An order with no items is rejected |
| AC-004 | An order containing an item with a zero or negative quantity is rejected |

# Feature: Place Order

**Summary**: A customer submits an order containing one or more items.
The system persists it and returns the recorded order.

---

## User Stories

**US1 — Customer places a valid order**
> As a customer, I want to submit an order with one or more items
> so that my purchase is recorded for fulfillment.

Acceptance scenarios:
- Given a customer ID and a list of items (each with a product ID and positive quantity)
- When they submit the order
- Then the order is persisted and returned with a generated unique ID, the customer ID, and the submitted items

**US2 — System rejects malformed orders**
> As the system, I want to reject incomplete or invalid order requests
> so that only well-formed orders are stored.

Acceptance scenarios:
- Given a request with no customer ID → rejected
- Given a request with an empty items list → rejected
- Given an item with a quantity of zero or less → rejected

---

## Functional Requirements

| ID     | Requirement |
|--------|-------------|
| FR-001 | An order MUST have a non-empty customer identifier |
| FR-002 | An order MUST contain at least one item |
| FR-003 | Each item MUST reference a product and carry a positive quantity |
| FR-004 | A successfully placed order MUST be assigned a unique identifier by the system |
| FR-005 | The placed order MUST be persisted so it can be retrieved later |
| FR-006 | A request missing the customer identifier MUST be rejected |
| FR-007 | A request with an empty items list MUST be rejected |

---

## Success Criteria

| ID     | Criterion |
|--------|-----------|
| SC-001 | A valid order request returns the persisted order: generated ID, customer ID, and submitted items |
| SC-002 | A request without a customer ID is rejected with a client error response |
| SC-003 | A request with no items is rejected with a client error response |

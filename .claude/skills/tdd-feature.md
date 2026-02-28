---
name: tdd-feature
description: Outside-in TDD cycle for this project — load when implementing a new feature or aggregate slice
---

Load `test-patterns` alongside this skill. Follow this cycle in order. Never skip a step or a layer.

```
SPEC (AGREED)
  → HTTP contract: method, path, request body, response body, status codes
  → acceptance scenarios: happy path + all error/edge cases
  → domain rules: invariants, validations, constraints
  → wait for explicit user confirmation before proceeding

ACCEPTANCE (RED)
  → unit test controller (RED)    → implement controller (GREEN)
  → unit test use case (RED)      → implement use case (GREEN)
  → unit test domain (RED)        → implement domain (GREEN)
  → refactor (GREEN stays GREEN)
  → ACCEPTANCE (GREEN) ✓
  → update ## Current State in CLAUDE.md
  → commit
```

Rules:
- Do not write any test or production code until the spec is confirmed.
- Never write production code without a failing test driving it.
- Never refactor on red.
- Show test output at every step (failure and green).
- Ask before moving to the next layer.
- Updating Current State and committing are part of the cycle — not optional.

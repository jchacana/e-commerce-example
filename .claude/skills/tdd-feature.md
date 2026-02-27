---
name: tdd-feature
description: Outside-in TDD cycle for this project — load when implementing a new feature or aggregate slice
---

Always start at `test/acceptance/`. Follow this cycle in order. Never skip a layer.

```
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
- Never write production code without a failing test driving it.
- Never refactor on red.
- Show test output at every step (failure and green).
- Ask before moving to the next layer.
- Updating Current State and committing are part of the cycle — not optional.

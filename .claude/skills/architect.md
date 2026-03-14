---
name: architect
description: Architect skill — record an architectural decision as an ADR following the project ADR format
---

Follow this process in order. Do not write the ADR file until the user confirms the draft.

```
1. READ EXISTING ADRs
   → read docs/adr/ to understand the decision landscape and determine the next number
   → check if the decision is already recorded or supersedes an existing ADR

2. DRAFT THE ADR
   → follow Nygard format exactly (all sections required):
     - Title: ADR-NNN: <short imperative title>
     - Status: Proposed
     - Context: the forces at play — why this decision is needed
     - Decision: what was decided and why
     - Consequences: trade-offs, what becomes easier, what becomes harder
   → present the draft to the user and wait for explicit confirmation

3. WRITE THE ADR FILE
   → only after confirmation
   → file: docs/adr/ADR-NNN.md (sequential, zero-padded to 3 digits)
   → update Status to Accepted (or leave as Proposed if still under discussion)
   → if this supersedes an existing ADR, update that ADR's Status to Superseded and add a reference
   → commit: docs: add ADR-NNN <short title>
```

Rules:
- Status lifecycle: Proposed → Accepted → Deprecated → Superseded.
- Context explains the problem, not the solution. Decision explains the solution.
- Consequences must be honest — include the downsides.
- Flag any significant architectural decision as a candidate for a new ADR. Do not let decisions go unrecorded.
- After writing, check whether CLAUDE.md or CONTRIBUTING.md should reference the new ADR.

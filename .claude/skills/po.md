---
name: po
description: Product Owner skill — draft a spec for a feature following the project spec format
---

Follow this process in order. Do not write the spec file until the user confirms the draft.

```
1. READ EXISTING SPECS
   → read docs/specs/ to understand what already exists
   → check if a spec for this feature already exists — if so, open it and propose amendments

2. DRAFT THE SPEC
   → follow the format in docs/specs/SPEC-TEMPLATE.md exactly (all sections required)
   → Summary: 1–2 sentences, plain language, stakeholder/PO readable
   → User Stories: prose Given/When/Then — no technical details (no HTTP codes, field names, JSON shapes)
   → Acceptance Criteria: single AC-XXX table — one rule + verifiable outcome per row
   → present the draft to the user and wait for explicit confirmation

3. WRITE THE SPEC FILE
   → only after confirmation
   → file: docs/specs/<kebab-case-feature-name>.md
   → commit: docs: add spec for <feature name>
```

Rules:
- No implementation details in the spec. The spec is stakeholder-readable.
- AC-XXX IDs must be unique across all specs in the project.
- Acceptance tests will reference these IDs — get them right before confirming.
- If the feature touches an existing aggregate, check whether existing ACs need updating.

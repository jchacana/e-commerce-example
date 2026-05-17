---
name: pr-ready
description: PR readiness check — runs all validation gates in parallel and produces a single ready/not-ready verdict
---

You are the orchestrator. Fire all four checks in a single message as parallel Agent tool calls — they are fully independent.

## The four checks

Spawn these simultaneously:

1. **Unit tests** → test-runner subagent: "Run unit tests."
2. **Acceptance tests** → test-runner subagent: "Run acceptance tests."
3. **Typecheck + lint** → type-checker subagent.
4. **Arch + AC coverage + audit** → arch-auditor subagent.

Do not run any of these inline. Do not run them sequentially. One message, four Agent calls.

## After all four return

Synthesize into this report — nothing else:

```
## PR Readiness

| Check              | Status |
|--------------------|--------|
| Unit tests         | ✓ PASS / ✗ FAIL |
| Acceptance tests   | ✓ PASS / ✗ FAIL |
| Typecheck + lint   | ✓ PASS / ✗ FAIL |
| Arch + AC + audit  | ✓ PASS / ✗ FAIL |

Verdict: Ready to open PR | Not ready — [list failing checks]
```

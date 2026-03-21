---
name: experiment
description: Worktree experiment pattern — load when a change has uncertain outcome and must be isolated before touching main
---

Use this skill whenever a change's outcome is uncertain. Never apply exploratory changes directly to main.

## 1. Confirm this is an experiment

Before proceeding, ask: is the outcome of this change certain?

- **Certain** → apply directly to the working tree. Do not use this skill.
- **Uncertain** (new dependency, architectural change, speculative refactor, infrastructure wiring) → continue below.

## 2. Launch the agent in a worktree

Use the `Agent` tool with `isolation: "worktree"`. Write the prompt following these rules:

- Tell the agent: **"Work in your current directory. Do not use absolute paths to the main tree."**
- Tell the agent to validate as if it were going to push: run the full suite with coverage, typecheck, lint, and audit — not just `npm test`.
- Tell the agent: **"Commit your work to this branch when done. Do not push."**
- If the experiment involves dependencies: tell the agent to run `npm run test:cov` (not just `npm test`) — coverage uses different instrumentation that can break independently.

Multiple agents can run in parallel in separate worktrees — safe and encouraged.

## 3. Main must not move while the experiment is in flight

Do not commit to main until all running experiments are merged or abandoned. Violating this causes merge conflicts on squash merge.

## 4. Review the result

When the agent finishes, inspect its diff:

- Read the changes. Verify validation passed (full suite + coverage + typecheck + lint + audit).
- Decide: **accept** or **abandon**.

If abandoned: note why. Do not carry the idea forward silently.

## 5. Accept — squash merge

```bash
git merge --squash <branch>
# stage and commit with a single descriptive message
git branch -d <branch>
npm install   # lock file was updated by the merge; node_modules is not
```

Always run `npm install` after every squash merge or rebase.

## 6. Never resume a stale worktree

If main has moved after the agent finished (for any reason), do **not** resume the worktree agent. Start a fresh agent from the current main. Once a worktree is squash merged and deleted, it is gone — never resume it.

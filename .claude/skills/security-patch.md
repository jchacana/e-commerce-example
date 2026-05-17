---
name: security-patch
description: Dependency vulnerability remediation — run npm audit, attempt automated and manual fixes in a worktree, validate, and report
---

## When to use

Run this skill when you want to assess and remediate dependency vulnerabilities.
Never patch dependencies directly on main — all patching runs in a worktree.

## 1. Assess inline

Run in the main session (read-only, no changes to main):

```bash
npm audit --json 2>/dev/null | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  const vulns = Object.values(d.vulnerabilities || {});
  if (!vulns.length) { console.log('No vulnerabilities found.'); process.exit(0); }
  vulns.forEach(v => console.log(v.severity.toUpperCase(), v.name, '-', v.title));
  console.log('\nTotal:', vulns.length);
"
```

If no vulnerabilities: done. Do not launch an agent.

If vulnerabilities exist: note the list (name, severity, description) and continue.

## 2. Launch the patching agent in a worktree

Use the `Agent` tool with `isolation: "worktree"`. Pass the full audit output and this protocol:

---

**Agent prompt template:**

> Work in your current directory. Do not use absolute paths to the main tree.
>
> You are a dependency security agent. Your job is to fix the following npm vulnerabilities:
>
> [paste audit list here — name, severity, advisory summary]
>
> ### Protocol
>
> For each vulnerability, in order of severity (critical → high → moderate → low):
>
> **Step 1 — Try npm audit fix (non-breaking only)**
> ```bash
> npm audit fix --dry-run 2>&1 | grep -E "added|removed|changed|fixed|still vulnerable"
> ```
> If it resolves the issue with no semver major bump: apply it (`npm audit fix`).
>
> **Step 2 — If unresolved, research a manual upgrade**
> - Run `npm info <package> versions --json` to see all published versions.
> - Read the package's CHANGELOG or GitHub releases for the version that patches the CVE.
> - Identify the minimum version that fixes the issue and is compatible with current peer deps.
> - Edit `package.json` to target that version, then `npm install`.
> - Re-run `npm audit` to confirm the vulnerability is gone.
>
> **Step 3 — If the direct dep is not the vulnerable package (transitive)**
> - Check which direct dep pulls in the vulnerable transitive dep.
> - Try upgrading the direct dep first (Step 2 above).
> - If the direct dep hasn't released a fix yet, add an `overrides` entry in `package.json` to
>   force the patched version, and note the upstream issue/PR URL in the commit body.
>
> **Step 4 — If no fix is available**
> - Note it explicitly: package name, CVE, reason no fix exists yet.
> - Do not leave a broken or half-patched state. Revert any failed attempt cleanly.
>
> ### Validation (run after all patches are applied)
>
> Run the full gate — do not skip any step:
> ```bash
> npm run lint 2>&1 | grep -E "error|warning"
> npm run typecheck 2>&1 | grep -E "error|Found"
> npm run test:cov 2>&1 | grep -E "FAIL|Tests:|Test Suites:|Coverage|threshold"
> npm audit 2>&1 | grep -E "vulnerabilit|severity|found"
> ```
>
> All must pass. If any gate fails after a patch, revert that patch and document the failure.
>
> ### Commit discipline
>
> - One commit per package patched.
> - Format: `fix(deps): upgrade <package> to <version> (CVE-XXXX-XXXX)`
> - If using `overrides`: `fix(deps): override <transitive> to <version> via <direct> — <upstream-url>`
> - Add co-author trailer to every commit: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
> - Commit on green only. Do not push.
>
> ### Final report
>
> When done, output a summary:
> - **Fixed**: package, old version → new version, CVE resolved
> - **Overridden**: package, reason, upstream issue link
> - **Unresolved**: package, CVE, reason no fix was possible

---

## 3. Review the result

When the agent finishes, read its summary and inspect the diff.

Verify:
- All validation gates passed
- Each commit is scoped to one package
- Overrides are documented with upstream links
- Unresolved items are clearly listed with reasons

## 4. Accept — squash merge

```bash
git merge --squash <branch>
# write a single commit: "fix(deps): remediate npm audit vulnerabilities"
git branch -D <branch>   # squash merges don't register as merged; -D is always correct here
npm install   # lock file updated by merge; node_modules is not
```

## 5. If main has moved while the agent was running

Do not resume the worktree. Abandon it, start fresh from current main.

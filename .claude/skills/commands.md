---
name: commands
description: Available npm commands and environment setup for this project
disable-model-invocation: true
---

## Commands

```bash
npx jest path/to/file.spec.ts --no-coverage   # single file — use during red/green loop
npm test                   # full suite
npm run test:acceptance    # acceptance layer only (outside-in entry point)
npm run test:unit          # unit tests only
npm run test:watch         # TDD watch mode
npm run test:cov           # full suite + coverage report
npm run typecheck          # tsc --noEmit — must pass before every commit
npm run lint               # ESLint across src/ and test/
npm run audit              # npm audit --audit-level=high --omit=dev
npm run start:dev          # local dev server (uses in-memory repos)
```

## Environment Setup (first time)

```bash
cp .env.example .env
direnv allow
npm install
npm test
```

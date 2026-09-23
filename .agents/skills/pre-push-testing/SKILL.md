---
name: pre-push-testing
description: Execute pre-push validation suite for Python Quest including all 7 automated test suites (133 tests), ESLint checks, and Next.js production build before pushing code changes to GitHub. Activate before executing git push.
---

# Pre-Push Testing & Code Quality Assurance Skill 🧪

This skill ensures that all code changes in Python Quest pass automated testing, static analysis, and production build checks before pushing to GitHub.

---

## Pre-Push Checklist & Execution Steps

Before executing `git push origin main` or creating a pull request, the agent **MUST** complete the following 3 validation steps in sequence:

### Step 1: Execute Automated Test Suite (133 Tests)
Run the unified test runner from the workspace root:
```bash
node tests/run-all.mjs
```
*Alternative:*
```bash
npm test
```

**Pass Criteria:**
- **Suites Executed:** 7 / 7
- **Passed Tests:** 133 / 133
- **Failed Tests:** 0

*(Verify tests cover: curriculum schema, component helpers, /api/username route, Supabase schema, progression logic, dark/light theme tokens, sequential chapter gating, Python execution UI, 1-credit hint system, and auth state mutual exclusivity as documented in [`TESTING.md`](file:///c:/Users/shara/OneDrive/Documents/MVP-PythonQuest/TESTING.md)).*

---

### Step 2: Code Linting & Static Analysis
Run ESLint in `apps/web`:
```bash
npm --prefix apps/web run lint
```

**Pass Criteria:**
- **Exit Code:** 0
- **Errors:** 0
- **Warnings:** 0

---

### Step 3: Production Next.js Build Verification
Verify Next.js compilation and standalone output bundle:
```bash
npm --prefix apps/web run build
```

**Pass Criteria:**
- **Exit Code:** 0
- Compilation succeeds cleanly without missing imports, TypeScript errors, or monorepo path resolution issues.

---

## Gate Rule Enforcement 🛑

> [!CAUTION]
> **If ANY of the 3 steps above fail:**
> 1. Do **NOT** execute `git push`.
> 2. Diagnose the exact error from the command output.
> 3. Apply necessary code fixes.
> 4. Re-run all 3 steps to verify full resolution before proceeding with push.

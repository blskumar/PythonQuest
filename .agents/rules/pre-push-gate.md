---
trigger: always_on
---

# Mandatory Pre-Push Quality Gate

Before running `git push` or pushing code changes to GitHub, you **MUST** run the `pre-push-testing` validation steps:

1. **Automated Test Suite**: Run `node tests/run-all.mjs` (must have 0 failures across all 133 tests).
2. **Linting**: Run `npm --prefix apps/web run lint` (must have 0 errors and 0 warnings).
3. **Production Build**: Run `npm --prefix apps/web run build` (must compile cleanly).

If any step fails, stop and resolve the underlying issue before pushing.

# MVP Python Quest — Bug Fixes & Codebase Hardening Report

This document records the audit findings, bugs, runtime exceptions, and edge cases resolved across the MVP Python Quest monorepo (`apps/web`, `content/python`, and `supabase`).

---

## 1. Client-Side Hydration & Browser Environment Safeguards

### `apps/web/app/theme-toggle.tsx`
- **Issue**: Unhandled timer execution on component unmount and unprotected `localStorage` operations.
- **Fix**:
  - Attached a cleanup handler `return () => window.clearTimeout(timer)` to cancel the deferred theme synchronization if the toggle unmounts before next tick.
  - Wrapped `window.localStorage.setItem("python-quest-theme", nextTheme)` in a `try...catch` block to guard against `SecurityError` or `QuotaExceededError` in restricted environments (e.g. private/incognito browsing or disabled third-party cookies).
  - Added `mounted` state check and explicit `aria-pressed` attribute for accessibility.

---

## 2. Authentication, Session & Error Flow Hardening

### `apps/web/app/login/page.tsx`
- **Issue**:
  - ESLint error: `Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)`.
  - Next.js deopt warning: `useSearchParams()` used without a `<Suspense>` boundary.
  - Missing timer cleanup on `resetCooldown`.
  - Missing `submitting` status during Google OAuth redirect.
- **Fix**:
  - Replaced the synchronous `useEffect` `setState` with lazy `useState(() => ...)` initialization reading URL parameters on mount.
  - Wrapped `LoginForm` in a React `<Suspense fallback={...}>` boundary to maintain static pre-rendering of the route.
  - Added `cooldownTimerRef` with `useEffect` unmount cleanup for the 60-second reset cooldown timer.
  - Supported incoming `error` and `error_description` query parameters from Supabase Auth.
  - Bound `submitting` state during Google OAuth authentication to prevent concurrent redirect attempts.

### `apps/web/app/auth/callback/route.ts`
- **Issue**:
  - Potential Open Redirect: URL `next` parameter checked only against `//`, leaving open vectors like `/\example.com`.
  - Overwriting Existing User Profiles: Callback unconditionally ran `upsert(profileRow)` with metadata defaults (`username: null`, `age: null`), which wiped out existing user profiles during password reset or subsequent OAuth logins.
  - Email Token Hash Flow Missing: Supabase OTP emails sending `token_hash` and `type` were rejected as "missing_verification_code".
  - Provider Error Suppression: Errors returned by OAuth providers (e.g., `error=access_denied`) were ignored, always returning a generic missing code error.
- **Fix**:
  - Hardened open redirect sanitizer: `requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.startsWith("/\\")`.
  - Checked for an existing profile (`existingProfile`) before inserting defaults, preserving existing user profile rows, streak, XP, and usernames.
  - Added support for both PKCE code exchange (`exchangeCodeForSession`) and OTP token verification (`verifyOtp({ token_hash, type })`).
  - Extracted and forwarded `error` and `error_description` params to `/login` with friendly user messages.

### `apps/web/app/register/page.tsx`
- **Issue**:
  - Race condition and memory leak in the debounced username availability check: asynchronous `fetch` requests could resolve out of order when typing rapidly or after unmounting.
  - Auto-confirm UX dead-end: In environments where Supabase email confirmation is disabled, `signUp` returns an active session (`data.session`), but the UI still instructed the user to check their email.
- **Fix**:
  - Added `AbortController` and cancellation flags to abort in-flight username check HTTP requests when input changes or component unmounts.
  - Added session detection: if `data?.session` exists upon signup, immediately navigate the user to `/dashboard`.

### `apps/web/app/reset-password/page.tsx`
- **Issue**:
  - Inconsistent password validation rules compared to registration (only checked `length >= 8` without complexity).
  - Missing submission lock allowed rapid duplicate clicks.
  - Unauthenticated visits to `/reset-password` caused unhandled Supabase auth errors.
- **Fix**:
  - Enforced the standard password regex: `/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/` (at least 8 chars, letter, number, symbol).
  - Checked for an active session with `supabase.auth.getUser()` on mount; displayed a helpful recovery link if accessed without an active session.
  - Added `submitting` state and disabled form inputs/buttons during update requests.

---

## 3. Dynamic Routing & `notFound()` Handling

### `apps/web/app/lesson/[chapter]/page.tsx` & `apps/web/app/quiz/[chapter]/page.tsx`
- **Issue**:
  - Soft 404 Anti-pattern: Returned 200 OK with custom "Chapter not found" / "Quiz not found" HTML instead of invoking standard Next.js 404 mechanism.
  - Routing Crash on Static Route Re-exports: `apps/web/app/quiz/variables/page.tsx` re-exported `ChapterQuizPage`, where `params.chapter` is `undefined`, causing invalid chapter lookups.
  - Array Index Bounds: Question access `questions[currentIndex]` was susceptible to undefined runtime crashes.
- **Fix**:
  - Imported and invoked `notFound()` from `next/navigation` whenever a chapter slug cannot be resolved.
  - Added fallback slug resolution using `usePathname()` so static routes re-exporting the page resolve their slug cleanly.
  - Added bounds safety `Math.min(currentIndex, questions.length - 1)` for quiz questions.
  - Created a dedicated, branded 404 page in `apps/web/app/not-found.tsx`.

---

## 4. API Route Validation & Fault Tolerance

### `apps/web/app/api/username/route.ts`
- **Issue**:
  - Risk of stale caching of username availability responses by Next.js or CDN.
  - Unhandled exceptions during client initialization could produce unhandled 500 errors.
- **Fix**:
  - Added `export const dynamic = "force-dynamic";`.
  - Migrated to `NextRequest` and `request.nextUrl`.
  - Wrapped handler in `try...catch` returning `{ error: "internal_error" }` with 500 status.
  - Set `Cache-Control: no-store, max-age=0`.

### `apps/web/app/api/progress/route.ts` & `apps/web/app/api/quiz/submit/route.ts`
- **Issue**: Unhandled JSON parsing errors when request bodies are malformed or empty caused internal server error 500 instead of 400 Bad Request.
- **Fix**: Wrapped `await request.json()` in guarded `try...catch` blocks returning clean 400 Bad Request responses with informative error messages.

---

## 5. Python Exercise Runtime & Hint Synchronization

### `apps/web/app/lesson/python-exercise.tsx` & `apps/web/app/lesson/decisions/page.tsx`
- **Issue**:
  - Hardcoded hints in `PythonExercise`: Non-variables lessons (Decisions, Loops, Lists, Functions) charged 10 credits to show hint messages about `quest_xp = 50`.
  - Stale exercise state: Changing `initialCode` or `activityKey` props did not reset the editor code or output text.
  - SSR failure risk: `loadPyodide()` accessed `window` directly without verifying runtime context.
- **Fix**:
  - Added `hints?: string[]` and `hintsList?: string[]` support to `PythonExercise`.
  - Added `typeof window === "undefined"` check in `loadPyodide()`.
  - Added synchronization `useEffect` resetting `code`, `output`, and `saveError` when `initialCode` or `activityKey` changes.

---

## 6. Dashboard Session Protection & Accessibility

### `apps/web/app/dashboard/page.tsx`
- **Issue**:
  - Unauthenticated visitors were left stranded with zeroed statistics and no redirect to sign in.
  - Locked chapter links in the curriculum roadmap were clickable and had no disabled attributes.
  - Loose `(b: any)` typing in badge data processing.
- **Fix**:
  - Imported `useRouter` and invoked `router.replace("/login")` when no user session is detected.
  - Added `pointer-events-none`, `aria-disabled={isLocked}`, and `tabIndex={isLocked ? -1 : undefined}` to locked curriculum items.
  - Cleaned up badge query type assertions without `any`.

---

## 7. Supabase Environment Resilience

### `apps/web/lib/supabase/client.ts` & `apps/web/lib/supabase/server.ts`
- **Issue**: Used non-null assertion `process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!` which crashes if the project uses standard `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Fix**: Added fallback chain: `process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""` in both browser and server Supabase client constructors.

---

## Summary of Files Modified / Created
- `apps/web/app/theme-toggle.tsx`
- `apps/web/app/login/page.tsx`
- `apps/web/app/auth/callback/route.ts`
- `apps/web/app/register/page.tsx`
- `apps/web/app/reset-password/page.tsx`
- `apps/web/app/lesson/[chapter]/page.tsx`
- `apps/web/app/quiz/[chapter]/page.tsx`
- `apps/web/app/lesson/python-exercise.tsx`
- `apps/web/app/dashboard/page.tsx`
- `apps/web/app/api/username/route.ts`
- `apps/web/app/api/progress/route.ts`
- `apps/web/app/api/quiz/submit/route.ts`
- `apps/web/lib/supabase/client.ts`
- `apps/web/lib/supabase/server.ts`
- `apps/web/app/not-found.tsx` *(new)*
- `BUG_FIXES.md` *(new)*

 "use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "../brand-logo";
import { ThemeToggle } from "../theme-toggle";

const callbackErrorMessages: Record<string, string> = {
  missing_verification_code: "That verification link is missing its code. Request a new one and try again.",
  verification_failed: "We couldn't verify that sign-in. The link may have expired — try signing in again.",
  profile_setup_failed: "You're verified, but we couldn't finish setting up your profile. Please try signing in again.",
  access_denied: "Sign in was cancelled or access was denied. Please try again.",
  otp_expired: "The verification link has expired. Please request a new one.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="body-muted">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(() => {
    if (!errorCode) return null;
    if (errorDescription) return decodeURIComponent(errorDescription);
    return callbackErrorMessages[errorCode] ?? "Something went wrong finishing sign-in. Please try again.";
  });
  const [submitting, setSubmitting] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "reset">("sign-in");
  const cooldownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current !== null) {
        window.clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    router.push("/dashboard");
  }

  async function signInWithGoogle() {
    setStatus(null);
    setSubmitting(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setSubmitting(false);
    if (error) setStatus(error.message);
  }

  async function sendResetEmail() {
    if (!email.trim()) {
      setStatus("Enter your email address first.");
      return;
    }
    if (resetCooldown) {
      setStatus("Please wait before requesting another reset email.");
      return;
    }
    setStatus(null);
    setResetCooldown(true);
    setSubmitting(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setSubmitting(false);
    cooldownTimerRef.current = window.setTimeout(() => setResetCooldown(false), 60_000);
    if (error?.message.toLowerCase().includes("rate limit")) {
      setStatus("Supabase is temporarily limiting reset emails. Wait a few minutes, then try again.");
      return;
    }
    setStatus(error ? error.message : "Check your email for a secure password reset link.");
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside"><div><BrandLogo /><p className="eyebrow mt-16">PYTHON QUEST</p><h2>Small steps.<br />Real fluency.</h2><p>Learn the fundamentals, practice with intention, and build a portfolio of things you can explain.</p></div></aside>
      <section className="auth-panel"><div className="auth-panel-inner"><header className="flex items-center justify-between gap-4"><BrandLogo /><ThemeToggle /></header>
        <div className="mt-12"><p className="eyebrow">WELCOME BACK</p><h1 className="mt-2">Return to your quest</h1><p className="body-muted mt-2">Your next Python challenge is waiting.</p>
          {mode === "sign-in" ? <form onSubmit={signIn} className="auth-form">
            <label><span className="field-label">Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="quest-input mt-2" /></label>
            <label><span className="field-label">Password</span><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" autoComplete="current-password" className="quest-input mt-2" /></label>
            <button disabled={submitting} className="quest-button w-full px-6 py-4 font-black disabled:opacity-60">
              {submitting ? "Signing in..." : "Sign in"}
            </button>
            <button type="button" className="auth-link text-sm font-bold" onClick={() => { setMode("reset"); setStatus(null); }}>Forgot password?</button>
          </form> : <div className="auth-form">
            <label><span className="field-label">Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="quest-input mt-2" /></label>
            <button type="button" onClick={() => void sendResetEmail()} disabled={submitting} className="quest-button w-full px-6 py-4 font-black disabled:opacity-60">
              {submitting ? "Sending reset link..." : resetCooldown ? "Reset email sent" : "Send reset link"}
            </button>
            <button type="button" className="auth-link text-sm font-bold" onClick={() => { setMode("sign-in"); setStatus(null); }}>Back to sign in</button>
          </div>}
          {mode === "sign-in" && <button type="button" onClick={signInWithGoogle} className="secondary-button mt-4 w-full px-4 py-3 text-sm font-bold">Continue with Google</button>}
          {status && <p className="auth-status mt-4" role="alert">{status}</p>}
          <p className="auth-muted mt-6 text-center text-sm">New here? <Link className="auth-link" href="/register">Create an account</Link></p>
        </div></div></section>
    </main>
  );
}

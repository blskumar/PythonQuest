"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BrandLogo } from "../brand-logo";
import { ThemeToggle } from "../theme-toggle";
import { createClient } from "@/lib/supabase/client";

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await createClient().auth.getUser();
      setHasSession(Boolean(user));
      if (!user) {
        setStatus("Your password reset link is invalid or expired. Please request a new one from the sign-in page.");
      }
    }
    void checkSession();
  }, []);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    if (!passwordPattern.test(password)) {
      setStatus("Use at least 8 characters, including a letter, number, and symbol.");
      return;
    }
    if (password !== confirmation) {
      setStatus("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setSaved(true);
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <div>
          <BrandLogo />
          <p className="eyebrow mt-16">ACCOUNT SECURITY</p>
          <h2>Keep your progress moving.</h2>
          <p>Choose a strong password and get back to your learning path.</p>
        </div>
      </aside>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <header className="flex items-center justify-between gap-4">
            <BrandLogo />
            <ThemeToggle />
          </header>
          <section className="mt-12">
            <p className="eyebrow">ACCOUNT SECURITY</p>
            <h1 className="mt-2 text-3xl font-black text-slate-50">Choose a new password</h1>
            {saved ? (
              <div className="mt-6 space-y-5">
                <p className="text-slate-300">Your password has been updated. You can now continue your Python Quest.</p>
                <Link href="/login" className="quest-button inline-block px-6 py-3 font-bold">Return to sign in</Link>
              </div>
            ) : hasSession === false ? (
              <div className="mt-6 space-y-5">
                <p className="text-rose-300">{status}</p>
                <Link href="/login" className="quest-button inline-block px-6 py-3 font-bold">Return to sign in</Link>
              </div>
            ) : (
              <form onSubmit={updatePassword} className="mt-8 space-y-4">
                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  className="quest-input"
                  disabled={submitting}
                />
                <input
                  required
                  minLength={8}
                  type="password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="quest-input"
                  disabled={submitting}
                />
                <button disabled={submitting} className="quest-button w-full px-6 py-4 font-black disabled:opacity-60">
                  {submitting ? "Updating password..." : "Update password"}
                </button>
                {status && <p className="registration-status rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-sm" role="alert">{status}</p>}
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
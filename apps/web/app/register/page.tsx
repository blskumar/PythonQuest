"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "../theme-toggle";
import { BrandLogo } from "../brand-logo";

const learnerTypes = ["Junior", "Student", "Professional"];
const goals = ["I'm not sure yet", "Build games", "Automate things", "School & learning", "Career skills", "Problem solving", "Just explore"];
const usernamePattern = /^[A-Za-z0-9]{1,16}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Form = { username: string; learnerName: string; age: string; email: string; password: string; learnerType: string; grade: string; schoolName: string; learningGoal: string };
const emptyForm: Form = { username: "", learnerName: "", age: "", email: "", password: "", learnerType: "", grade: "", schoolName: "", learningGoal: "" };

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(emptyForm);
  const [usernameState, setUsernameState] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isStudent = form.learnerType === "Student";
  const update = (key: keyof Form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const username = form.username.trim();
    let cancelled = false;
    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      if (!username) {
        setUsernameState("idle");
        return;
      }
      if (!usernamePattern.test(username)) {
        setUsernameState("error");
        return;
      }

      setUsernameState("checking");
      try {
        const response = await fetch(`/api/username?value=${encodeURIComponent(username)}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!cancelled) {
          setUsernameState(response.ok && result.available ? "available" : result.error ? "error" : "taken");
        }
      } catch (err: unknown) {
        if (!cancelled && (err as { name?: string })?.name !== "AbortError") {
          setUsernameState("error");
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [form.username]);

  function validate() {
    const next: Record<string, string> = {};
    if (!usernamePattern.test(form.username.trim())) next.username = "Use 1–16 letters or numbers only.";
    else if (usernameState !== "available") next.username = usernameState === "taken" ? "That username is already taken." : "Confirm that this username is available.";
    if (!form.learnerName.trim()) next.learnerName = "Enter your learner name.";
    if (!Number.isInteger(Number(form.age)) || Number(form.age) < 1) next.age = "Enter a valid age.";
    if (!emailPattern.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!passwordPattern.test(form.password)) next.password = "Use at least 8 characters, including a letter, number, and symbol.";
    if (!form.learnerType) next.learnerType = "Choose your learner type.";
    if (isStudent && !form.grade.trim()) next.grade = "Enter your grade or class.";
    if (isStudent && !form.schoolName.trim()) next.schoolName = "Enter your school name.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus(null);
    if (!validate()) return;
    setSubmitting(true);
    const { data, error } = await createClient().auth.signUp({
      email: form.email.trim(), password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, data: {
        username: form.username.trim(), learner_name: form.learnerName.trim(), age: Number(form.age), learner_type: form.learnerType,
        grade: isStudent ? form.grade.trim() : null, school_name: isStudent ? form.schoolName.trim() : null, learning_goal: form.learningGoal || null,
      } },
    });
    setSubmitting(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    if (data?.session) {
      router.push("/dashboard");
      return;
    }
    setStatus("Check your email to verify your account. We’ll finish setting up your profile when you return.");
  }

  const usernameHint = usernameState === "checking" ? "Checking availability…" : usernameState === "available" ? "Username is available." : usernameState === "taken" ? "That username is already taken." : usernameState === "error" && form.username ? "Use 1–16 letters or numbers only." : "Your public learner identity.";
  return <main className="auth-layout"><aside className="auth-aside"><div><BrandLogo /><p className="eyebrow mt-16">START WITH CONTEXT</p><h2>Build a path that fits how you learn.</h2><p>Your learner profile helps us shape examples, difficulty, and challenges around your goals.</p></div></aside><section className="auth-panel"><div className="auth-panel-inner max-w-2xl"><header className="flex items-center justify-between gap-4"><BrandLogo /><ThemeToggle /></header>
    <div className="mt-10"><p className="eyebrow">LEARNER REGISTRATION</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Create your Python Quest account</h1><p className="body-muted mt-3">Build a learner profile, then verify your email to begin from Level 1.</p>
      <form noValidate onSubmit={submit} className="mt-8 space-y-5">
        <Input label="Username" value={form.username} onChange={(v) => update("username", v)} error={errors.username} hint={usernameHint} state={usernameState} autoComplete="username" />
        <Input label="Learner name" value={form.learnerName} onChange={(v) => update("learnerName", v)} error={errors.learnerName} autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2"><Input label="Age" type="number" value={form.age} onChange={(v) => update("age", v)} error={errors.age} min="1" /><Input label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} error={errors.email} autoComplete="email" /></div>
        <Input label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} error={errors.password} hint="8+ characters with a letter, number, and symbol." autoComplete="new-password" />
        <Select label="Learner level" value={form.learnerType} onChange={(v) => update("learnerType", v)} error={errors.learnerType} options={learnerTypes} placeholder="Select your learner level" />
        {isStudent && <div className="grid gap-5 sm:grid-cols-2"><Input label="Grade / class" value={form.grade} onChange={(v) => update("grade", v)} error={errors.grade} /><Input label="School name" value={form.schoolName} onChange={(v) => update("schoolName", v)} error={errors.schoolName} /></div>}
        <Select label="Learning goal (optional)" value={form.learningGoal} onChange={(v) => update("learningGoal", v)} options={goals} placeholder="Choose a goal, if you have one" />
        {status && <p className="registration-status rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm" role="status">{status}</p>}
        <button disabled={submitting} className="quest-button w-full px-6 py-4 font-extrabold disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Creating your account…" : "Create account →"}</button>
      </form><p className="auth-muted mt-6 text-center text-sm">Already have an account? <Link className="auth-link" href="/login">Log in</Link></p>
    </div></div></section></main>;
}

function Input({ label, value, onChange, error, hint, state, type = "text", autoComplete, min }: { label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; state?: string; type?: string; autoComplete?: string; min?: string }) {
  const hintClass = state === "available" ? "text-emerald-300" : state === "taken" || error ? "text-rose-300" : "text-slate-400";
  return <label className="block"><span className="field-label">{label}</span><input aria-invalid={Boolean(error)} className="quest-input" type={type} value={value} min={min} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />{(error || hint) && <span className={`username-hint mt-1.5 block text-xs ${hintClass}`}>{error || hint}</span>}</label>;
}

function Select({ label, value, onChange, error, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; error?: string; options: string[]; placeholder: string }) {
  return <label className="block"><span className="field-label">{label}</span><select aria-invalid={Boolean(error)} className="quest-input" value={value} onChange={(e) => onChange(e.target.value)}><option value="">{placeholder}</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select>{error && <span className="mt-1.5 block text-xs text-rose-300">{error}</span>}</label>;
}

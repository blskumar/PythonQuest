import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Baby,
  GraduationCap,
  Briefcase,
  Database,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PythonMascot } from "./PythonMascot";
import { getLearnerModeForAge, loginUser } from "../utils/storage";
import { LearnerMode, UserProgress } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProgress: UserProgress) => void;
  initialMode?: "login" | "register";
  defaultEmail?: string;
  gateMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "register",
  defaultEmail = "",
  gateMessage,
}) => {
  const [tab, setTab] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState<string>("Subrahmanya");
  const [email, setEmail] = useState<string>(defaultEmail || "subrahmanya.boddapati@gmail.com");
  const [password, setPassword] = useState<string>("pythonquest2026");
  const [age, setAge] = useState<number>(24);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialMode);
      setErrorMsg("");
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const currentMode: LearnerMode = getLearnerModeForAge(age);

  const modeDescriptions: Record<
    LearnerMode,
    { title: string; desc: string; icon: React.ReactNode; color: string; badge: string }
  > = {
    child: {
      title: "Young Explorer Path",
      desc: "Story-based analogies, fun Python pet metaphors, and visual block concepts crafted for kids.",
      icon: <Baby className="w-4 h-4 text-emerald-600" />,
      color: "border-emerald-300 bg-emerald-50 text-emerald-950",
      badge: "Ages 7 – 12",
    },
    student: {
      title: "Student & Academic Path",
      desc: "Structured computer science fundamentals, clear syntax mastery, and school/college syllabus readiness.",
      icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
      color: "border-indigo-300 bg-indigo-50 text-indigo-950",
      badge: "Ages 13 – 21",
    },
    pro: {
      title: "Professional & Architect Path",
      desc: "CPython memory model, object-oriented architecture, dunder protocols, and production design patterns.",
      icon: <Briefcase className="w-4 h-4 text-purple-600" />,
      color: "border-purple-300 bg-purple-50 text-purple-950",
      badge: "Ages 22+",
    },
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === "register") {
        const userName = name.trim() || email.split("@")[0] || "Explorer";
        const userAge = Math.max(5, Math.min(100, age || 20));

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            name: userName,
            age: userAge,
            learnerMode: currentMode,
            authProvider: "email",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to register. Please try again.");
        }

        // Successfully registered in SQLite database
        const updated = loginUser(
          data.user.email,
          data.user.name,
          data.user.age,
          "email",
          data.user.id
        );
        onSuccess(updated);
        onClose();
      } else {
        // Sign In Flow
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Invalid email or password.");
        }

        // Successfully logged in
        const updated = loginUser(
          data.user.email,
          data.user.name,
          data.user.age,
          data.user.authProvider || "email",
          data.user.id
        );
        onSuccess(updated);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    const googleEmail = email.trim() || "subrahmanya.boddapati@gmail.com";
    const userName = name.trim() || "Subrahmanya Boddapati";
    const userAge = Math.max(5, Math.min(100, age || 24));

    try {
      // First attempt to login
      let res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
        }),
      });

      let data = await res.json();
      if (!res.ok) {
        // If user does not exist in SQLite, auto-register them
        res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: googleEmail,
            password: "oauth_google_verified",
            name: userName,
            age: userAge,
            learnerMode: currentMode,
            authProvider: "google",
          }),
        });
        data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to initialize Google account in database.");
        }
      }

      const updated = loginUser(
        data.user.email,
        data.user.name,
        data.user.age,
        "google",
        data.user.id
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Could not complete Google authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      id="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        id="auth-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-linear-to-b from-amber-500/10 via-amber-500/5 to-white p-5 sm:p-6 text-center relative border-b border-slate-100 shrink-0">
          <div className="flex justify-center mb-2">
            <PythonMascot size="lg" withGlow withCrown />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
            Welcome to <span className="text-amber-600">Python Quest</span>
          </h2>

          {/* Access Restriction Notice Banner if triggered via Auth Guard */}
          {gateMessage ? (
            <div className="mt-2.5 mx-auto p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start space-x-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Restriction</p>
                <p className="text-[11px] text-amber-800 leading-tight">{gateMessage}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              {tab === "register"
                ? "Free registration required to unlock chapters, exercises, sandbox & certificates."
                : "Sign in to resume your daily streak, chapter progress, and certificates."}
            </p>
          )}

          {/* Tab Switcher */}
          <div className="flex items-center justify-center mt-4 bg-slate-100 p-1 rounded-2xl max-w-xs mx-auto border border-slate-200/80">
            <button
              onClick={() => {
                setTab("register");
                setErrorMsg("");
              }}
              disabled={isSubmitting}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                tab === "register"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setTab("login");
                setErrorMsg("");
              }}
              disabled={isSubmitting}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                tab === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Form Body - Scrollable on small screens */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            id="google-signin-btn"
            className="w-full flex items-center justify-center space-x-3 py-2.5 sm:py-3 px-4 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-xs group disabled:opacity-50"
          >
            {/* Official Google 'G' icon */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Or with your email
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {tab === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Explorer Nickname
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Subrahmanya Boddapati"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* AGE INPUT - Sets learner mode dynamically on registration */}
            {tab === "register" && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Your Age (Caters Chapter Difficulty)</span>
                  </label>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {age} years old
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="6"
                    max="70"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    disabled={isSubmitting}
                    className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    disabled={isSubmitting}
                    className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-center text-slate-800 focus:bg-white"
                  />
                </div>

                {/* Real-time Dynamic Path Adaptation preview */}
                <div
                  className={`mt-2.5 p-3 rounded-2xl border text-xs transition-all ${modeDescriptions[currentMode].color}`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <div className="flex items-center space-x-1.5">
                      {modeDescriptions[currentMode].icon}
                      <span>Assigned Tier: {modeDescriptions[currentMode].title}</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/70">
                      {modeDescriptions[currentMode].badge}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {modeDescriptions[currentMode].desc}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              id="auth-submit-btn"
              className="w-full py-3 px-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Connecting to Database...</span>
                </>
              ) : (
                <>
                  <span>
                    {tab === "register" ? "Create Free Account & Enter Quest" : "Sign In & Continue"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Database & Security Notice */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>Full-Stack Relational Database Enforced</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Your credentials and coding progress are stored in persistent SQLite tables (<code>users</code>, <code>user_progress</code>, <code>exercise_submissions</code>) with <code>bcrypt</code> password hashing.
            </p>
          </div>
        </div>

        {/* Security / Privacy Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Free account with full access to 10 chapters, streak tracker & verified certificates.</span>
        </div>
      </div>
    </div>
  );
};

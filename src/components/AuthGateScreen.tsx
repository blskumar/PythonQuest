import React from "react";
import {
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Trophy,
  Flame,
  Terminal,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { PythonMascot } from "./PythonMascot";

interface AuthGateScreenProps {
  tab: string;
  onOpenAuth: (mode?: "login" | "register", gateMessage?: string) => void;
  onBackToHome: () => void;
}

export const AuthGateScreen: React.FC<AuthGateScreenProps> = ({
  tab,
  onOpenAuth,
  onBackToHome,
}) => {
  const tabDetails: Record<
    string,
    { title: string; subtitle: string; icon: React.ReactNode; color: string }
  > = {
    curriculum: {
      title: "Interactive Python Chapters & Exercises",
      subtitle:
        "Access all 10 chapters from basic syntax to advanced OOP inheritance and dunder protocols.",
      icon: <BookOpen className="w-6 h-6 text-amber-500" />,
      color: "from-amber-500/20 to-orange-500/10",
    },
    dashboard: {
      title: "Learning Stats & Daily Streak Tracker",
      subtitle:
        "Track your active daily streak, exercise scores, credit milestones, and activity heatmap.",
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      color: "from-orange-500/20 to-rose-500/10",
    },
    certificates: {
      title: "Verified Course Certificates",
      subtitle:
        "Claim official Level Certificates (Foundation, Medium OOP, Advanced) with verification codes.",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      color: "from-yellow-500/20 to-amber-500/10",
    },
    "daily-challenge": {
      title: "Daily Coding Challenge Arena",
      subtitle:
        "Solve fresh daily algorithmic puzzles, earn +50 bonus credits, and maintain your streak.",
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      color: "from-indigo-500/20 to-purple-500/10",
    },
    leaderboard: {
      title: "Global Quest Leaderboard",
      subtitle:
        "Compare your credit score, coding streak, and rank against learners from around the world.",
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      color: "from-amber-500/20 to-emerald-500/10",
    },
    scratchpad: {
      title: "Python Sandbox & Scratchpad",
      subtitle:
        "Freely write and execute Python code with live console output in a WebAssembly sandbox.",
      icon: <Terminal className="w-6 h-6 text-purple-500" />,
      color: "from-purple-500/20 to-indigo-500/10",
    },
  };

  const current = tabDetails[tab] || {
    title: "Python Quest Feature",
    subtitle: "Sign in to unlock interactive coding and track your learning progress.",
    icon: <Lock className="w-6 h-6 text-amber-500" />,
    color: "from-amber-500/20 to-orange-500/10",
  };

  const gateNotice = `Registration required: Please create a free account or sign in to access ${current.title}.`;

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-16 px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
        {/* Atmospheric Header */}
        <div className={`p-8 text-center bg-linear-to-b ${current.color} border-b border-slate-100 relative`}>
          <div className="flex justify-center mb-3">
            <PythonMascot size="lg" withGlow withCrown />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-xs font-bold mb-3 shadow-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Account Required</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        {/* Benefits Breakdown */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              What Free Registration Unlocks:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>10 interactive chapters from syntax to OOP</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Daily streak protection & activity history</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verified level milestone certificates</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Persistent relational database storage</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onOpenAuth("register", gateNotice)}
              id="gate-register-btn"
              className="flex-1 py-3.5 px-5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth("login", gateNotice)}
              id="gate-login-btn"
              className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all hover:scale-[1.02] active:scale-98 text-center"
            >
              <span>Sign In</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center space-x-1 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Return to Python Quest Overview</span>
            </button>
          </div>
        </div>

        {/* Database Security Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Accounts and user details are securely stored in the application database tables.</span>
        </div>
      </div>
    </div>
  );
};

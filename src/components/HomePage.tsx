import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Trophy,
  Flame,
  CheckCircle2,
  Terminal,
  Zap,
  BookOpen,
  Baby,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  ShieldCheck,
  ChevronRight,
  Play,
  Bot,
  Filter,
} from "lucide-react";
import { PythonMascot } from "./PythonMascot";
import { PythonQuestLogo } from "./PythonQuestLogo";
import { LearnerMode, UserProgress, Chapter } from "../types";
import { getLearnerModeForAge } from "../utils/storage";

interface HomePageProps {
  onOpenAuth: (mode?: "login" | "register", gateMessage?: string) => void;
  onStartLearning: () => void;
  progress: UserProgress;
  onSelectAgeMode: (mode: LearnerMode) => void;
  chapters?: Chapter[];
  onSelectChapter?: (id: string, view?: "lesson" | "exercise") => void;
  onNavigateTab?: (tab: "curriculum" | "dashboard" | "certificates" | "scratchpad" | "daily-challenge" | "leaderboard") => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAuth,
  onStartLearning,
  progress,
  onSelectAgeMode,
  chapters = [],
  onSelectChapter,
  onNavigateTab,
}) => {
  const [previewAge, setPreviewAge] = useState<number>(progress.user?.age || 20);
  const [curriculumFilter, setCurriculumFilter] = useState<"all" | "foundation" | "medium" | "advanced">("all");
  const previewMode = getLearnerModeForAge(previewAge);

  const isLoggedIn = progress.user?.isAuthenticated;

  const filteredChapters = chapters.filter((ch) => {
    if (curriculumFilter === "all") return true;
    return ch.level === curriculumFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      {/* ========================================================
          HERO SECTION WITH PYTHON QUEST SERPENT MASCOT
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-10 md:p-12 border border-slate-800 shadow-2xl">
        {/* Ambient atmospheric glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          <div className="space-y-4 sm:space-y-5 text-center lg:text-left max-w-2xl w-full">
            <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-amber-300 backdrop-blur-xs max-w-full">
              <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">Interactive Python Adventure for All Ages</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white font-sans">
              Welcome to <span className="bg-linear-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent">Python Quest</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              From zero to advanced Object-Oriented Programming (OOP) mastery.
              Whether you are a young explorer taking your very first coding steps,
              an ambitious student preparing for CS exams, or a seasoned professional
              architecting enterprise systems — Python Quest adapts seamlessly to your age.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2">
              <button
                onClick={onStartLearning}
                id="hero-start-quest-btn"
                className="w-full sm:w-auto px-6 py-3.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>{isLoggedIn ? "Continue Your Quest" : "Start Learning (15 Chapters)"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartLearning}
                id="hero-browse-curriculum-btn"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Explore Full Syllabus</span>
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => onOpenAuth("login")}
                  id="hero-signin-btn"
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors text-center inline-flex items-center justify-center space-x-1"
                >
                  <span>Sign In / Sync</span>
                  <span>→</span>
                </button>
              )}
            </div>

            {/* Quick trust metrics - wrapped to prevent horizontal overflow on mobile */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 pt-3 text-xs text-slate-400 border-t border-slate-800">
              <div className="flex items-center space-x-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>WebAssembly Pyodide Engine</span>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Level Certificates</span>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-300" />
                <span>Daily Streak Tracker</span>
              </div>
            </div>
          </div>

          {/* Official Python Quest Master Logo & Mascot Emblem */}
          <div className="relative shrink-0 flex flex-col items-center w-full sm:w-auto">
            <div className="p-4 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/90 backdrop-blur-md shadow-2xl flex flex-col items-center text-center relative group max-w-xs sm:max-w-sm w-full">
              <PythonQuestLogo size="hero" variant="badge" withGlow />
              
              <div className="mt-2 space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Official Explorer Emblem
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  Explore • Learn • Create • Evolve
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          WHAT IS PYTHON & WHAT THIS APP IS ABOUT
         ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            About Python Quest
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Learn Python with Us?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Python is the world's most versatile, expressive, and in-demand programming language.
            Powering everything from Artificial Intelligence and Deep Learning to web servers,
            scientific computing, and game logic — mastering Python opens doors for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Interactive In-Browser Execution
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No tricky Python installations or command-line setups required. Write, run, and debug
              real Python code instantly using our Pyodide WebAssembly sandboxed runner.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Deep OOP & Chapter Progression
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Progress smoothly from variables and loops to classes, inheritance, polymorphism,
              encapsulation, and advanced dunder methods (`__init__`, `__str__`, `__repr__`).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Credit Rewards & Level Awards
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every completed exercise and daily puzzle adds verified credits to your profile.
              Reach 300, 600, and 900 credits to claim Foundation, Medium, and Advanced certificates.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          WHO WE ARE CATERING TO (AGE-BASED AUDIENCES)
         ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
            Personalized By Age
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Who Are We Catering To?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            One size does not fit all. When you enter your age during registration, Python Quest
            automatically calibrates its pedagogy, code metaphors, and hints to match your level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Young Explorers */}
          <div className="p-7 rounded-3xl bg-linear-to-b from-emerald-50/70 to-white border-2 border-emerald-200 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Baby className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  Ages 7 – 12
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Young Explorers & Kids
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Gentle, colorful, and fun introductory coding.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fun Python Pet and adventure analogies</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Bite-sized, zero-frustration code challenges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Playful confetti celebrations and badges</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectAgeMode("child");
                onStartLearning();
              }}
              className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5"
            >
              <span>Explore Kids Mode</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Students & Scholars */}
          <div className="p-7 rounded-3xl bg-linear-to-b from-indigo-50/70 to-white border-2 border-indigo-200 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  Ages 13 – 21
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Students & Academic Scholars
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  High school, college, and university CS syllabus.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Algorithmic thinking and data structures</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Strict test-driven assertions with real scores</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Formal level certificates for portfolios</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectAgeMode("student");
                onStartLearning();
              }}
              className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5"
            >
              <span>Explore Student Mode</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Seasoned Professionals */}
          <div className="p-7 rounded-3xl bg-linear-to-b from-purple-50/70 to-white border-2 border-purple-200 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Ages 22+
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Professionals & Engineers
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Architectural depth, internals, and clean code.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>CPython memory model and reference counting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Dunder protocols (`__enter__`, `__iter__`, `__call__`)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>PEP 8 standards and enterprise OOP architecture</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectAgeMode("pro");
                onStartLearning();
              }}
              className="mt-6 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5"
            >
              <span>Explore Pro Mode</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          GRAB ATTENTION: SNEAK PEEK OF APP POST-LOGIN
         ======================================================== */}
      <section className="space-y-8 bg-slate-950 text-white p-7 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-2 relative z-10">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
            Inside The App
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sneak Peek: What You Get Post-Login
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            A comprehensive look at the powerful, interactive features waiting for you inside your Python Quest workspace.
          </p>
        </div>

        {/* Post-login Feature Snippet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Snippet 1: Interactive Code Workspace */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-slate-400 font-bold ml-1">
                  1. Real-Time Python IDE & Test Runner
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                Pyodide v0.26
              </span>
            </div>

            <div className="p-4 font-mono text-xs text-slate-200 bg-slate-900/90 space-y-1">
              <p className="text-slate-500"># Chapter 5: OOP Inheritance & Polymorphism</p>
              <p><span className="text-purple-400">class</span> <span className="text-yellow-300">Hero</span>:</p>
              <p className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-400">__init__</span>(<span className="text-orange-300">self</span>, name, level):</p>
              <p className="pl-8"><span className="text-orange-300">self</span>.name = name</p>
              <p className="pl-8"><span className="text-orange-300">self</span>.level = level</p>
              <p className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-400">power_up</span>(<span className="text-orange-300">self</span>):</p>
              <p className="pl-8"><span className="text-purple-400">return</span> <span className="text-emerald-300">{'f"{self.name} reached level {self.level + 1}!"'}</span></p>
            </div>

            {/* Simulated Test Case Pass Box */}
            <div className="p-3.5 bg-black/70 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Test Case #1: Hero('Pythonic', 1).power_up()</span>
              </div>
              <span className="text-emerald-400 font-bold">PASSED (100 pts)</span>
            </div>
          </div>

          {/* Snippet 2: Daily Challenge & Streak Engine */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span className="font-mono text-slate-300 font-bold">
                  2. Daily Challenge Arena & Streak Tracker
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                +50 Extra Credits
              </span>
            </div>

            <div className="p-5 space-y-3 bg-linear-to-br from-slate-900 to-slate-950 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                    Today's Puzzle: Palindrome Pal
                  </span>
                  <span className="text-[11px] text-slate-400">Strings & Logic</span>
                </div>
                <p className="text-xs text-slate-300">
                  Write a function that validates if an alphanumeric phrase reads the same backward, ignoring casing.
                </p>
              </div>

              {/* 7-Day Flame Track Simulation */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center">
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white">4-Day Learning Streak Active!</div>
                    <div className="text-[10px] text-slate-400">Secured for today</div>
                  </div>
                </div>
                <span className="text-amber-400 font-mono font-bold">+100 XP / Day</span>
              </div>
            </div>
          </div>

          {/* Snippet 3: Official Claimable Certificates */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-mono text-slate-300 font-bold">
                  3. Official Milestone Award Certificates
                </span>
              </div>
              <span className="text-[10px] text-yellow-300 font-bold bg-yellow-950/80 px-2 py-0.5 rounded-full border border-yellow-800">
                Verified Credentials
              </span>
            </div>

            <div className="p-5 bg-linear-to-br from-amber-950/20 via-slate-900 to-slate-950 flex-1 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300">Python Foundation & OOP Certificate</div>
                  <div className="text-sm font-black text-white">Award of Excellence</div>
                  <div className="text-xs text-slate-400">Issued to Alex • Score: 98% • Tier: Scholar</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                  ★
                </div>
              </div>

              <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Milestones: 300 / 600 / 900 Credits</span>
                <span className="text-emerald-400 font-bold">Ready to Print / Export</span>
              </div>
            </div>
          </div>

          {/* Snippet 4: Gemini AI Code Coach */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-mono text-slate-300 font-bold">
                  4. Gemini AI Code Reviewer & Assistant
                </span>
              </div>
              <span className="text-[10px] text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800">
                AI Coach
              </span>
            </div>

            <div className="p-5 bg-linear-to-br from-purple-950/20 to-slate-950 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Personalized Feedback (Matched to your Age Mode):</span>
                </div>
                <div className="p-3 bg-purple-900/30 border border-purple-800/60 rounded-xl text-xs text-purple-100 italic">
                  "Terrific OOP encapsulation! In Python, prefer properties or `@property` decorators
                  over manual getter methods to write clean, idiomatic code."
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Encourages best practices without spoiling answers</span>
                <span className="text-purple-400 font-bold">On-Demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner inside Snippets */}
        <div className="pt-4 text-center relative z-10">
          <button
            onClick={onStartLearning}
            className="px-8 py-4 bg-linear-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center space-x-2.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open All 15 Chapters & Code Exercises</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================
          FULL 15-CHAPTER CURRICULUM SYLLABUS DIRECTORY
         ======================================================== */}
      <section id="full-curriculum-syllabus" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Full Course Syllabus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              All 15 Python Chapters & Coding Exercises
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              From zero fundamentals to advanced Object-Oriented Programming and modern asyncio concurrency. Click any chapter to read its interactive guide or start writing code.
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setCurriculumFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                curriculumFilter === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All (15)
            </button>
            <button
              onClick={() => setCurriculumFilter("foundation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                curriculumFilter === "foundation"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Foundation (Ch 1-4)
            </button>
            <button
              onClick={() => setCurriculumFilter("medium")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                curriculumFilter === "medium"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OOP Mastery (Ch 5-10)
            </button>
            <button
              onClick={() => setCurriculumFilter("advanced")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                curriculumFilter === "advanced"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Advanced (Ch 11-15)
            </button>
          </div>
        </div>

        {/* 15 Chapter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChapters.map((ch) => {
            const isCompleted = progress.completedChapters.includes(ch.id);

            return (
              <div
                key={ch.id}
                className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                  isCompleted
                    ? "border-emerald-200 ring-1 ring-emerald-300/40"
                    : "border-slate-200 hover:border-amber-300"
                }`}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                      Chapter {ch.chapterNumber}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {isCompleted && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Passed</span>
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          ch.level === "foundation"
                            ? "bg-amber-100 text-amber-800"
                            : ch.level === "medium"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {ch.level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {ch.shortDesc}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Code2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate font-semibold">{ch.exercise.title}</span>
                    </div>
                    <span className="text-amber-700 font-bold shrink-0 ml-1">
                      +{ch.exercise.creditReward} pts
                    </span>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectChapter) {
                        onSelectChapter(ch.id, "lesson");
                      } else {
                        onStartLearning();
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Lesson</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectChapter) {
                        onSelectChapter(ch.id, "exercise");
                      } else {
                        onStartLearning();
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code Exercise</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE AGE PATH EXPLORER WIDGET
         ======================================================== */}
      <section className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-10 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Interactive Preview
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            See How Python Quest Adapts to Your Age
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Slide the age bar below to test how our curriculum and quizzes calibrate.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Learner Age:</span>
            <span className="text-base font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full font-mono">
              {previewAge} Years Old
            </span>
          </div>

          <input
            type="range"
            min="6"
            max="60"
            value={previewAge}
            onChange={(e) => setPreviewAge(Number(e.target.value))}
            className="w-full accent-amber-500 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
          />

          <div className="p-4 rounded-xl border bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Track
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  previewMode === "child"
                    ? "bg-emerald-100 text-emerald-800"
                    : previewMode === "student"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {previewMode === "child"
                  ? "Young Explorer (Ages 7-12)"
                  : previewMode === "student"
                  ? "Student Scholar (Ages 13-21)"
                  : "Industry Pro (Ages 22+)"}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {previewMode === "child" &&
                "Your exercises will focus on fun Python Pet metaphors, storytelling variables, and visual block concepts that spark creative joy."}
              {previewMode === "student" &&
                "Your exercises will focus on computer science algorithms, mathematical logic, exam prep syntax, and formal test cases."}
              {previewMode === "pro" &&
                "Your exercises will challenge you with clean OOP design, dunder protocols, encapsulation, and production design patterns."}
            </p>
          </div>

          <button
            onClick={() => {
              onSelectAgeMode(previewMode);
              onStartLearning();
            }}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <span>
              Start Learning as {previewAge} Year Old
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

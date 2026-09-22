import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Zap,
  Flame,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Lightbulb,
  Bot,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Calendar,
  Layers,
  Award,
  ArrowRight,
} from "lucide-react";
import { DailyPuzzle, LearnerMode, UserProgress } from "../types";
import { DAILY_PUZZLES, getDailyPuzzle, getRandomPuzzle } from "../data/dailyPuzzles";
import { evaluateTestCase, runPythonCode } from "../utils/pythonRunner";
import { recordDailyChallengeCompletion, getStreakStatus } from "../utils/storage";

interface DailyChallengeProps {
  progress: UserProgress;
  onProgressUpdated: (updated: UserProgress) => void;
  onGoToCurriculum: () => void;
  learnerMode: LearnerMode;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  progress,
  onProgressUpdated,
  onGoToCurriculum,
  learnerMode,
}) => {
  const todayDateStr = new Date().toISOString().split("T")[0];
  const todayPuzzle = getDailyPuzzle(todayDateStr);

  const [currentPuzzle, setCurrentPuzzle] = useState<DailyPuzzle>(todayPuzzle);
  const [code, setCode] = useState<string>(todayPuzzle.starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Test Results
  const [testResults, setTestResults] = useState<
    Array<{
      description: string;
      testCode: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
    }>
  >([]);
  const [hasVerified, setHasVerified] = useState<boolean>(false);

  // Hints progressive disclosure
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // AI Review
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Completion Celebration Banner/Modal
  const [completionBanner, setCompletionBanner] = useState<{
    creditsAdded: number;
    newStreak: number;
    streakIncreased: boolean;
    alreadyCompleted: boolean;
  } | null>(null);

  // Check if current puzzle is already completed
  const isCurrentCompleted = (progress.completedDailyChallenges || []).some(
    (c) => c.puzzleId === currentPuzzle.id
  );

  const isTodayOfficial = currentPuzzle.id === todayPuzzle.id;

  const streakInfo = getStreakStatus(progress);

  // Switch puzzle helper
  const handleSelectPuzzle = (puzzle: DailyPuzzle) => {
    setCurrentPuzzle(puzzle);
    setCode(puzzle.starterCode);
    setConsoleOutput("");
    setTestResults([]);
    setHasVerified(false);
    setRevealedHints(0);
    setAiFeedback(null);
    setCompletionBanner(null);
  };

  const handleRandomize = () => {
    const random = getRandomPuzzle(currentPuzzle.id);
    handleSelectPuzzle(random);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleRunOnly = async () => {
    setIsRunning(true);
    setConsoleOutput("");
    try {
      const res = await runPythonCode(code);
      const out = res.stdout || res.stderr || "(Code executed with no stdout output)";
      setConsoleOutput(out);
    } catch (err: any) {
      setConsoleOutput(`Error: ${err?.message || err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleVerifySolution = async () => {
    setIsVerifying(true);
    setHasVerified(true);
    const results = [];
    let allPassed = true;

    try {
      for (const tc of currentPuzzle.testCases) {
        const evalRes = await evaluateTestCase(code, tc.testCode, tc.expectedOutput);
        results.push({
          description: tc.description,
          testCode: tc.testCode,
          expectedOutput: tc.expectedOutput ?? "",
          actualOutput: evalRes.actual,
          passed: evalRes.passed,
        });

        if (!evalRes.passed) {
          allPassed = false;
        }
      }

      setTestResults(results);

      if (allPassed) {
        // Record completion and award bonus credits!
        const outcome = recordDailyChallengeCompletion(
          currentPuzzle.id,
          currentPuzzle.bonusCredits
        );
        onProgressUpdated(outcome.progress);

        setCompletionBanner({
          creditsAdded: outcome.creditsAdded,
          newStreak: outcome.newStreak,
          streakIncreased: outcome.streakIncreased,
          alreadyCompleted: outcome.alreadyCompletedToday,
        });

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#f59e0b", "#10b981", "#8b5cf6", "#ec4899"],
          });
        } catch (e) {}
      }
    } catch (e: any) {
      setConsoleOutput(`Verification error: ${e?.message || e}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAskAi = async () => {
    setIsLoadingAi(true);
    try {
      const resp = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          exerciseTitle: `Daily Challenge: ${currentPuzzle.title}`,
          promptContext: currentPuzzle.description,
          learnerMode,
        }),
      });
      const data = await resp.json();
      setAiFeedback(
        (data.summary || data.feedback || "") +
          (data.improvements?.length
            ? "\n\n💡 Next Steps:\n• " + data.improvements.join("\n• ")
            : "")
      );
    } catch (err: any) {
      setAiFeedback(
        "AI hints temporarily unavailable. Hint: Double-check edge cases, string conversions, and return statements."
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Formatted date string for header
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const allPassed =
    hasVerified && testResults.length > 0 && testResults.every((t) => t.passed);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* ========================================================
          DAILY CHALLENGE TOP HEADER BANNER
         ======================================================== */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -bottom-16 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/25 text-white backdrop-blur-xs border border-white/20">
                <Calendar className="w-3.5 h-3.5 text-amber-200" />
                <span>{todayFormatted}</span>
              </span>

              {isTodayOfficial && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-white text-orange-700 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Today's Official Puzzle</span>
                </span>
              )}

              {isCurrentCompleted && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-900/60 text-emerald-200 border border-emerald-400/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Completed</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <span>{currentPuzzle.title}</span>
            </h1>

            <p className="text-sm text-amber-50 max-w-xl">
              Tackle this bite-sized Python puzzle to level up your problem-solving,
              earn <strong className="text-white font-bold">+{currentPuzzle.bonusCredits} extra credits</strong>,
              and keep your daily learning streak ablaze!
            </p>
          </div>

          {/* Quick Metrics / Reward Pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2.5 shadow-xs">
              <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-100">
                  Challenge Reward
                </div>
                <div className="text-lg font-black text-white font-mono">
                  +{currentPuzzle.bonusCredits} Credits
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-semibold text-white/90">
              <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>
                {streakInfo.isCompletedToday
                  ? `Streak secured: ${streakInfo.currentStreak}d`
                  : `Current Streak: ${streakInfo.currentStreak}d`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PUZZLE ARCHIVE & RANDOMIZER CONTROLS
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter / Archive Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Select Puzzle:</span>
          </span>
          <select
            value={currentPuzzle.id}
            onChange={(e) => {
              const selected = DAILY_PUZZLES.find((p) => p.id === e.target.value);
              if (selected) handleSelectPuzzle(selected);
            }}
            className="text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-amber-500 max-w-xs truncate"
          >
            {DAILY_PUZZLES.map((p) => {
              const completed = (progress.completedDailyChallenges || []).some(
                (c) => c.puzzleId === p.id
              );
              const isToday = p.id === todayPuzzle.id;
              return (
                <option key={p.id} value={p.id}>
                  {completed ? "✓ " : ""}{p.title} ({p.difficulty}) {isToday ? "• Today" : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {!isTodayOfficial && (
            <button
              onClick={() => handleSelectPuzzle(todayPuzzle)}
              className="text-xs font-bold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Back to Today's Official</span>
            </button>
          )}

          <button
            onClick={handleRandomize}
            className="text-xs font-bold px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-xs flex items-center space-x-1.5 active:scale-95"
            title="Randomize another puzzle from the pool"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Another Puzzle</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          COMPLETION CELEBRATION TOAST
         ======================================================== */}
      {completionBanner && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-md flex items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-950">
                🎉 Puzzle Solved Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                {completionBanner.alreadyCompleted ? (
                  <span>
                    You had already completed this challenge today! Great practice.
                  </span>
                ) : (
                  <span>
                    Awarded{" "}
                    <strong className="font-extrabold text-emerald-950">
                      +{completionBanner.creditsAdded} Bonus Credits
                    </strong>
                    ! Your daily streak is now{" "}
                    <strong className="font-extrabold text-orange-600">
                      {completionBanner.newStreak} days
                    </strong>{" "}
                    🔥.
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCompletionBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================
          PROBLEM STATEMENT & HINTS CONTAINER
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Meta badges */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Category: {currentPuzzle.category}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              currentPuzzle.difficulty === "Easy"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : currentPuzzle.difficulty === "Medium"
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-purple-100 text-purple-800 border border-purple-300"
            }`}
          >
            {currentPuzzle.difficulty}
          </span>
        </div>

        {/* Problem Description */}
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {currentPuzzle.description}
        </div>

        {/* Pythonic Tip */}
        {currentPuzzle.authorTip && (
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Python Pro Tip: </span>
              <span>{currentPuzzle.authorTip}</span>
            </div>
          </div>
        )}

        {/* Progressive Hints Section */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Hints ({revealedHints} of {currentPuzzle.hints.length} revealed)
              </span>
            </span>

            {revealedHints < currentPuzzle.hints.length && (
              <button
                onClick={() => setRevealedHints((h) => Math.min(currentPuzzle.hints.length, h + 1))}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Reveal Hint {revealedHints + 1}
              </button>
            )}
          </div>

          {revealedHints > 0 && (
            <div className="space-y-1.5 pt-1">
              {currentPuzzle.hints.slice(0, revealedHints).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 animate-in fade-in"
                >
                  <strong className="text-amber-800">Hint {idx + 1}: </strong>
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          CODE EDITOR & EXECUTION CONSOLE
         ======================================================== */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-slate-300 font-bold">
              daily_challenge.py
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCode(currentPuzzle.starterCode)}
              className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-md"
              title="Reset code to original starter template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleAskAi}
              disabled={isLoadingAi || !code.trim()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-semibold rounded-lg transition-all border border-purple-700"
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>{isLoadingAi ? "Analyzing..." : "AI Coach"}</span>
            </button>

            <button
              onClick={handleRunOnly}
              disabled={isRunning || isVerifying}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all border border-slate-700"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? "Running..." : "Test Run"}</span>
            </button>

            <button
              onClick={handleVerifySolution}
              disabled={isRunning || isVerifying}
              id="verify-daily-challenge-btn"
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isVerifying ? "Verifying..." : "Verify & Claim +Credits"}</span>
            </button>
          </div>
        </div>

        {/* Textarea with Line Numbers */}
        <div className="relative flex">
          <div className="select-none py-4 px-3 bg-slate-950/60 text-slate-600 font-mono text-xs text-right border-r border-slate-800 w-12 shrink-0">
            {Array.from({ length: Math.max(14, code.split("\n").length) }).map(
              (_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              )
            )}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={Math.max(14, code.split("\n").length)}
            className="w-full py-4 px-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-hidden selection:bg-amber-500/30 overflow-x-auto whitespace-pre"
            placeholder="# Write your Python challenge solution here..."
          />
        </div>

        {/* Standard Output (if test run or verification output) */}
        {consoleOutput && (
          <div className="p-4 bg-black/95 border-t border-slate-800 font-mono text-xs text-emerald-400">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
              <span>Standard Output:</span>
              <button
                onClick={() => setConsoleOutput("")}
                className="text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
          </div>
        )}
      </div>

      {/* ========================================================
          TEST CASE RESULTS
         ======================================================== */}
      {hasVerified && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">
                Automated Test Verification
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  allPassed
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"
                }`}
              >
                {testResults.filter((t) => t.passed).length} of {testResults.length} Passed
              </span>
            </div>

            {allPassed && (
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All assertions satisfied!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {testResults.map((tr, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  tr.passed
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                    : "bg-rose-50/50 border-rose-200 text-rose-950"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {tr.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900">{tr.description}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 pl-6">
                    Call: <code className="bg-white/80 px-1 py-0.5 rounded text-slate-800">{tr.testCode}</code>
                  </div>
                </div>

                <div className="sm:text-right font-mono text-[11px] pl-6 sm:pl-0 shrink-0 space-y-0.5">
                  <div>
                    <span className="text-slate-500">Expected: </span>
                    <span className="font-bold">{tr.expectedOutput}</span>
                  </div>
                  {!tr.passed && (
                    <div className="text-rose-600 font-bold">
                      <span>Got: </span>
                      <span>{tr.actualOutput || "(None)"}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          AI COACH FEEDBACK BANNER
         ======================================================== */}
      {aiFeedback && (
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-950 space-y-2 animate-in fade-in">
          <div className="font-bold text-purple-900 uppercase tracking-wider text-xs flex items-center space-x-1.5">
            <Bot className="w-4 h-4 text-purple-600" />
            <span>AI Coach Feedback ({learnerMode} mode):</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed">{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};

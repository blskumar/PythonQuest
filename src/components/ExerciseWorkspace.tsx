import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  Terminal,
  Trophy,
  Award,
  Bot,
  Lightbulb,
  BookOpen,
  Flame,
} from "lucide-react";
import { Chapter, Exercise, ExerciseSubmission, LearnerMode, UserProgress } from "../types";
import { runPythonCode, evaluateTestCase } from "../utils/pythonRunner";

interface ExerciseWorkspaceProps {
  chapter: Chapter;
  learnerMode: LearnerMode;
  onExerciseComplete: (submission: ExerciseSubmission) => void;
  onBackToLesson: () => void;
  onNextChapter?: () => void;
  prevSubmission?: ExerciseSubmission;
  progress?: UserProgress;
}

export const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({
  chapter,
  learnerMode,
  onExerciseComplete,
  onBackToLesson,
  onNextChapter,
  prevSubmission,
  progress,
}) => {
  const { exercise } = chapter;

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState<string>(
    prevSubmission?.code || exercise.starterCode
  );
  const [outputConsole, setOutputConsole] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setCode((prev) => prev + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    setCode(newCode);
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + snippet.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Test results state
  const [testResults, setTestResults] = useState<
    Array<{
      description: string;
      passed: boolean;
      actual?: string;
      expected?: string;
      error?: string;
    }>
  >([]);

  const [scoreResult, setScoreResult] = useState<{
    score: number;
    passed: boolean;
    earnedCredits: number;
  } | null>(
    prevSubmission
      ? {
          score: prevSubmission.score,
          passed: prevSubmission.passed,
          earnedCredits: prevSubmission.earnedCredits,
        }
      : null
  );

  // AI Assistance state
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [hintIndex, setHintIndex] = useState<number>(0);

  const [aiReview, setAiReview] = useState<any | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 4 spaces
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);

      // Reposition cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleReset = () => {
    if (confirm("Reset editor to starter code?")) {
      setCode(exercise.starterCode);
      setOutputConsole("");
      setTestResults([]);
      setScoreResult(null);
      setAiHint(null);
      setAiReview(null);
    }
  };

  // Run user code without grading (just stdout)
  const handleRunCodeOnly = async () => {
    setIsRunning(true);
    try {
      const res = await runPythonCode(code);
      const out = res.stdout || res.stderr || "(Code executed cleanly with no output)";
      setOutputConsole(out);
    } catch (err: any) {
      setOutputConsole(`Error: ${err?.message || "Execution failed"}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Run test assertions & compute grade/credits
  const handleSubmitTests = async () => {
    setIsEvaluating(true);
    const results: Array<{
      description: string;
      passed: boolean;
      actual?: string;
      expected?: string;
      error?: string;
    }> = [];

    try {
      for (const t of exercise.testCases) {
        const testOutcome = await evaluateTestCase(code, t.testCode, t.expectedOutput);
        results.push({
          description: t.description,
          passed: testOutcome.passed,
          actual: testOutcome.actual,
          expected: testOutcome.expected,
          error: testOutcome.error,
        });
      }

      setTestResults(results);

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;
      const rawScore = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 100;
      const allPassed = passedCount === totalCount;

      // Credit calculation
      const baseReward = exercise.creditReward;
      const earnedCredits = allPassed ? baseReward : Math.round(baseReward * (rawScore / 100));

      const submission: ExerciseSubmission = {
        chapterId: chapter.id,
        code,
        score: rawScore,
        passed: allPassed,
        earnedCredits,
        completedAt: new Date().toISOString(),
        testResults: results,
      };

      setScoreResult({
        score: rawScore,
        passed: allPassed,
        earnedCredits,
      });

      if (allPassed) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#f59e0b", "#10b981", "#3b82f6"],
          });
        } catch (e) {}
      }

      onExerciseComplete(submission);
    } catch (e: any) {
      setOutputConsole(`Evaluation failed: ${e?.message || e}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Get AI Hint from server
  const handleRequestAiHint = async () => {
    // If static hints are available, first cycle through them, or call AI
    if (hintIndex < exercise.hints.length) {
      setAiHint(exercise.hints[hintIndex]);
      setHintIndex((prev) => prev + 1);
      return;
    }

    setIsLoadingHint(true);
    try {
      const resp = await fetch("/api/ai-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          exerciseTitle: exercise.title,
          promptContext: exercise.instructions,
          learnerMode,
          hintLevel: "gentle",
        }),
      });
      const data = await resp.json();
      setAiHint(data.hint || "Review your return value and function logic!");
    } catch (err) {
      setAiHint(
        exercise.hints[0] ||
          "Hint: Break the problem into small steps and verify variable types!"
      );
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Get AI Code Review from server
  const handleRequestAiReview = async () => {
    setIsLoadingReview(true);
    try {
      const resp = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          exerciseTitle: exercise.title,
          promptContext: exercise.instructions,
          learnerMode,
        }),
      });
      const data = await resp.json();
      setAiReview(data);
    } catch (err: any) {
      setAiReview({
        summary: "Your code is working towards the solution!",
        scoreOutOf100: scoreResult?.score || 80,
        strengths: ["Clean syntax structure", "Good logic flow"],
        improvements: ["Ensure edge cases like empty inputs are handled"],
      });
    } finally {
      setIsLoadingReview(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Bar with Lesson Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={onBackToLesson}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Return to Chapter Lesson</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {progress && (
            <div
              className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200"
              title="Consecutive daily learning streak"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{progress.currentStreak}d Streak</span>
            </div>
          )}
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Chapter {chapter.chapterNumber} Exercise
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            +{exercise.creditReward} Credits
          </span>
        </div>
      </div>

      {/* Main Grid: Problem Specification on Left, Code Editor & Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem & Hints (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Instructions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {exercise.title}
              </h2>
            </div>

            {/* Target Concepts Tags */}
            <div className="flex flex-wrap gap-1.5 my-3">
              {exercise.targetConcepts.map((c, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans mt-3">
              {exercise.instructions}
            </div>

            {/* AI Hint Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleRequestAiHint}
                  disabled={isLoadingHint}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-100 rounded-lg transition-all border border-amber-200"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {isLoadingHint ? "Thinking..." : "Need a Hint?"}
                  </span>
                </button>

                <button
                  onClick={handleRequestAiReview}
                  disabled={isLoadingReview || !code.trim()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-800 bg-indigo-100/70 hover:bg-indigo-100 rounded-lg transition-all border border-indigo-200"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {isLoadingReview ? "Analyzing..." : "AI Code Review"}
                  </span>
                </button>
              </div>

              {/* Display AI Hint */}
              {aiHint && (
                <div className="mt-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed animate-in fade-in">
                  <div className="font-bold text-amber-800 uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Learning Hint:</span>
                  </div>
                  {aiHint}
                </div>
              )}

              {/* Display AI Review */}
              {aiReview && (
                <div className="mt-3 p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2 animate-in fade-in">
                  <div className="font-bold text-indigo-800 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Gemini AI Tutor Feedback:</span>
                  </div>
                  <p className="font-medium text-slate-800">{aiReview.summary}</p>

                  {aiReview.strengths && aiReview.strengths.length > 0 && (
                    <div>
                      <span className="font-bold text-emerald-800 text-[11px]">Strengths:</span>
                      <ul className="list-disc list-inside text-slate-700 pl-1 space-y-0.5">
                        {aiReview.strengths.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiReview.improvements && aiReview.improvements.length > 0 && (
                    <div>
                      <span className="font-bold text-amber-800 text-[11px]">
                        Pythonic Tips:
                      </span>
                      <ul className="list-disc list-inside text-slate-700 pl-1 space-y-0.5">
                        {aiReview.improvements.map((tip: string, idx: number) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Score & Rewards Summary Card (Appears after submission) */}
          {scoreResult && (
            <div
              className={`rounded-2xl p-6 border transition-all ${
                scoreResult.passed
                  ? "bg-linear-to-b from-emerald-50 to-white border-emerald-300 shadow-md"
                  : "bg-linear-to-b from-amber-50 to-white border-amber-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy
                    className={`w-6 h-6 ${
                      scoreResult.passed ? "text-emerald-600" : "text-amber-600"
                    }`}
                  />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Exercise Score: {scoreResult.score}/100
                  </h3>
                </div>

                <div className="flex items-center space-x-1 bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>+{scoreResult.earnedCredits} Credits Awarded!</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2">
                {scoreResult.passed
                  ? "All test cases passed successfully! The credits have been credited to your Level Milestone balance."
                  : "Some test assertions did not match. Review the results below, make adjustments, and test again to maximize your score!"}
              </p>

              {onNextChapter && scoreResult.passed && (
                <button
                  onClick={onNextChapter}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Advance to Next Chapter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Test Assertions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Editor Container */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-lg w-full max-w-full">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-1 sm:ml-2 font-mono text-slate-300 font-bold truncate">
                  solution.py
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  (Python 3.12)
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-md transition-colors text-xs"
                  title="Reset to starter code template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={handleRunCodeOnly}
                  disabled={isRunning || isEvaluating}
                  id="run-code-btn"
                  className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all border border-slate-700 shadow-xs text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-200" />
                  <span>{isRunning ? "Running..." : "Run"}</span>
                </button>

                <button
                  onClick={handleSubmitTests}
                  disabled={isRunning || isEvaluating}
                  id="submit-exercise-btn"
                  className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>
                    {isEvaluating ? "Verifying..." : "Verify & Grade"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Python Quick-Key Helper Bar (Touch Optimized for Google Pixel 7a / Mobile / iOS) */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1.5 px-3 bg-slate-950/90 border-b border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-500 shrink-0">Quick Keys:</span>
              {[
                { label: "Tab", insert: "    " },
                { label: "( )", insert: "()" },
                { label: ":", insert: ":" },
                { label: '" "', insert: '""' },
                { label: "=", insert: " = " },
                { label: "def", insert: "def " },
                { label: "self.", insert: "self." },
                { label: "print()", insert: "print()" },
                { label: "return", insert: "return " },
              ].map((key, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertSnippet(key.insert)}
                  className="shrink-0 px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-300 font-mono text-xs rounded-md border border-slate-700/80 transition-colors"
                >
                  {key.label}
                </button>
              ))}
            </div>

            {/* Code Input Area with line numbers simulation */}
            <div className="relative flex">
              {/* Line Numbers column */}
              <div className="select-none py-4 px-2 sm:px-3 bg-slate-950/60 text-slate-600 font-mono text-xs text-right border-r border-slate-800 w-10 sm:w-12 shrink-0">
                {Array.from({ length: Math.max(12, code.split("\n").length) }).map(
                  (_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  )
                )}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={Math.max(12, code.split("\n").length)}
                className="w-full py-4 px-3 sm:px-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-hidden selection:bg-amber-500/30 overflow-x-auto whitespace-pre"
                placeholder="# Type your Python code here..."
              />
            </div>

            {/* Console Output Tray */}
            {outputConsole && (
              <div className="p-4 bg-black/95 border-t border-slate-800 font-mono text-xs text-emerald-400">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
                  <span>Terminal Standard Output:</span>
                  <button
                    onClick={() => setOutputConsole("")}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {outputConsole}
                </pre>
              </div>
            )}
          </div>

          {/* Automated Test Cases Results */}
          {testResults.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Automated Test Assertions:</span>
                <span className="font-mono text-slate-700">
                  {testResults.filter((r) => r.passed).length}/{testResults.length} Passed
                </span>
              </h3>

              <div className="space-y-2">
                {testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex flex-col space-y-1 ${
                      t.passed
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                        : "bg-rose-50/60 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center space-x-2">
                        {t.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{t.description}</span>
                      </div>
                      <span className="font-bold uppercase tracking-wider text-[10px]">
                        {t.passed ? "Passed" : "Failed"}
                      </span>
                    </div>

                    {!t.passed && (
                      <div className="mt-2 pt-2 border-t border-rose-200/60 font-mono text-[11px] space-y-0.5">
                        {t.expected && (
                          <div className="text-slate-600">
                            Expected: <span className="text-emerald-700">{t.expected}</span>
                          </div>
                        )}
                        <div className="text-slate-600">
                          Actual: <span className="text-rose-700">{t.actual || "None"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

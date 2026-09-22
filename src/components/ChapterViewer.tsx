import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  Play,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Baby,
  Briefcase,
  Sparkles,
  Terminal,
  CheckCircle2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import { Chapter, LearnerMode } from "../types";
import { runPythonCode } from "../utils/pythonRunner";

interface ChapterViewerProps {
  chapter: Chapter;
  learnerMode: LearnerMode;
  onGoToExercise: () => void;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  isCompleted: boolean;
  chapters?: Chapter[];
  onSelectChapter?: (id: string) => void;
  completedChapterIds?: string[];
}

export const ChapterViewer: React.FC<ChapterViewerProps> = ({
  chapter,
  learnerMode,
  onGoToExercise,
  onPrevChapter,
  onNextChapter,
  isCompleted,
  chapters = [],
  onSelectChapter,
  completedChapterIds = [],
}) => {
  const [selectedPerspective, setSelectedPerspective] = useState<LearnerMode>(learnerMode);
  const [runningExampleIdx, setRunningExampleIdx] = useState<number | null>(null);
  const [exampleOutputs, setExampleOutputs] = useState<Record<number, string>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showChapterDrawer, setShowChapterDrawer] = useState<boolean>(false);

  // Sync if learnerMode changes from navbar
  React.useEffect(() => {
    setSelectedPerspective(learnerMode);
  }, [learnerMode]);

  const handleRunExample = async (code: string, idx: number) => {
    setRunningExampleIdx(idx);
    try {
      const result = await runPythonCode(code);
      const out = result.stdout || result.stderr || "Code ran with no output.";
      setExampleOutputs((prev) => ({ ...prev, [idx]: out }));
    } catch (err: any) {
      setExampleOutputs((prev) => ({
        ...prev,
        [idx]: `Error: ${err?.message || "Execution failed"}`,
      }));
    } finally {
      setRunningExampleIdx(null);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Chapter Quick Switcher & Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            {onPrevChapter && (
              <button
                onClick={onPrevChapter}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
                title="Previous Chapter"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            {chapters.length > 0 && onSelectChapter && (
              <button
                onClick={() => setShowChapterDrawer(!showChapterDrawer)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chapter {chapter.chapterNumber} of {chapters.length}</span>
                {showChapterDrawer ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                chapter.level === "foundation"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : chapter.level === "medium"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-purple-100 text-purple-800 border border-purple-200"
              }`}
            >
              Level: {chapter.level}
            </span>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              {chapter.estimatedMinutes} min read
            </span>

            {onNextChapter && (
              <button
                onClick={onNextChapter}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
                title="Next Chapter"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Quick-Jump Chapter Number Pills */}
        {chapters.length > 0 && onSelectChapter && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
            {chapters.map((ch) => {
              const isCurrent = ch.id === chapter.id;
              const isChDone = completedChapterIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChapter(ch.id)}
                  className={`shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : isChDone
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                  title={`${ch.chapterNumber}. ${ch.title}`}
                >
                  {isChDone && !isCurrent && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  )}
                  <span>Ch {ch.chapterNumber}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Collapsible Full Chapter Drawer Dropdown */}
        {showChapterDrawer && chapters.length > 0 && onSelectChapter && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in duration-150">
            {chapters.map((ch) => {
              const isCurrent = ch.id === chapter.id;
              const isChDone = completedChapterIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    onSelectChapter(ch.id);
                    setShowChapterDrawer(false);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                    isCurrent
                      ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/40"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-500">Chapter {ch.chapterNumber}</span>
                    <div className="flex items-center space-x-1">
                      {isChDone && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-full">
                          Done
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                        ch.level === "foundation"
                          ? "bg-amber-100 text-amber-800"
                          : ch.level === "medium"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {ch.level}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 line-clamp-1 mt-1">
                    {ch.title}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Chapter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              Chapter {chapter.chapterNumber} of 15
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {chapter.title}
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {chapter.shortDesc}
            </p>
          </div>

          <button
            onClick={onGoToExercise}
            id="jump-to-exercise-btn"
            className="shrink-0 flex items-center space-x-2 px-5 py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Code2 className="w-4 h-4" />
            <span>Practice Exercise</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Chapter Overview */}
        <div className="mt-6 text-sm text-slate-700 leading-relaxed font-sans">
          {chapter.content.overview}
        </div>

        {/* Perspective Switcher Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Explanation Perspective:
            </span>
            <div className="flex items-center flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
              <button
                onClick={() => setSelectedPerspective("child")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedPerspective === "child"
                    ? "bg-white text-emerald-800 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Baby className="w-3.5 h-3.5 text-emerald-600" />
                <span>Junior Story</span>
              </button>

              <button
                onClick={() => setSelectedPerspective("student")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedPerspective === "student"
                    ? "bg-white text-blue-800 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Student</span>
              </button>

              <button
                onClick={() => setSelectedPerspective("pro")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedPerspective === "pro"
                    ? "bg-white text-purple-800 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Pro CPython</span>
              </button>
            </div>
          </div>

          {/* Perspective Content Box */}
          <div
            className={`p-5 rounded-xl border text-sm leading-relaxed ${
              selectedPerspective === "child"
                ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                : selectedPerspective === "student"
                ? "bg-blue-50/50 border-blue-200 text-blue-950"
                : "bg-purple-50/50 border-purple-200 text-purple-950"
            }`}
          >
            <div className="font-bold text-xs uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {selectedPerspective === "child"
                  ? "Playful Analogy for Young Explorers"
                  : selectedPerspective === "student"
                  ? "Computer Science Conceptual Blueprint"
                  : "CPython Internals, Memory Model & Architecture"}
              </span>
            </div>
            <p className="mt-1">
              {selectedPerspective === "child"
                ? chapter.content.childAnalogy
                : selectedPerspective === "student"
                ? chapter.content.studentConcept
                : chapter.content.proDeepDive}
            </p>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-amber-600" />
            <span>Interactive Code Demonstration</span>
          </h3>

          {chapter.content.codeExamples.map((example, idx) => {
            const isRunning = runningExampleIdx === idx;
            const output = exampleOutputs[idx];
            const isCopied = copiedIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-300 bg-slate-900 text-slate-100 overflow-hidden shadow-sm"
              >
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-slate-400 font-semibold">
                      {example.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyCode(example.code, idx)}
                      className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-md transition-colors"
                      title="Copy code"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRunExample(example.code, idx)}
                      disabled={isRunning}
                      className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-all shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>{isRunning ? "Running..." : "Run Example"}</span>
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <pre className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{example.code}</code>
                </pre>

                {/* Explanation text */}
                <div className="px-4 py-2.5 bg-slate-800/60 border-t border-slate-800 text-xs text-slate-300">
                  <strong className="text-amber-400">Note:</strong> {example.explanation}
                </div>

                {/* Terminal Output */}
                {output !== undefined && (
                  <div className="p-4 bg-black/90 border-t border-slate-800 font-mono text-xs text-emerald-400">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                      Console Output:
                    </div>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Exercise */}
        <div className="mt-10 p-6 bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">
              Ready to test your practical skills?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Complete the exercise for Chapter {chapter.chapterNumber} to earn up to +
              {chapter.exercise.creditReward} credits towards your next Level Certificate.
            </p>
          </div>

          <button
            onClick={onGoToExercise}
            className="shrink-0 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center space-x-2"
          >
            <span>Start Chapter Exercise</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

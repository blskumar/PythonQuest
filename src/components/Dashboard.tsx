import React from "react";
import {
  Trophy,
  Award,
  ShieldCheck,
  Crown,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Star,
  BookOpen,
  Code2,
  Calendar,
  Zap,
} from "lucide-react";
import { AwardMilestone, Chapter, ClaimedCertificate, UserProgress } from "../types";
import { MILESTONES } from "../data/courseData";
import { StreakWidget } from "./StreakWidget";
import { getDailyPuzzle } from "../data/dailyPuzzles";
import { PythonMascot } from "./PythonMascot";
import { PythonQuestLogo } from "./PythonQuestLogo";
import { getAugmentedLeaderboard } from "../data/leaderboardData";
import { getStreakStatus } from "../utils/storage";

interface DashboardProps {
  progress: UserProgress;
  chapters: Chapter[];
  onSelectChapter: (chapterId: string) => void;
  onOpenCertificateModal: (milestone: AwardMilestone, claimed?: ClaimedCertificate) => void;
  onGoToCurriculum: () => void;
  onGoToScratchpad: () => void;
  onGoToDailyChallenge: () => void;
  onGoToLeaderboard?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  chapters,
  onSelectChapter,
  onOpenCertificateModal,
  onGoToCurriculum,
  onGoToScratchpad,
  onGoToDailyChallenge,
  onGoToLeaderboard,
}) => {
  const completedCount = progress.completedChapters.length;
  const totalChapters = chapters.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalChapters) * 100));

  const todayPuzzle = getDailyPuzzle();
  const isTodayPuzzleCompleted = (progress.completedDailyChallenges || []).some(
    (c) => c.puzzleId === todayPuzzle.id
  );

  // Compute average score
  const submissions = Object.values(progress.exerciseSubmissions);
  const avgScore =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length
        )
      : 0;

  // Leaderboard ranking
  const { userRank, totalLearners, gapToNext, aheadOfUser } = getAugmentedLeaderboard(progress);

  // Daily Learning Streak status
  const streakInfo = getStreakStatus(progress);

  const milestoneIcons = {
    foundation: Trophy,
    medium: ShieldCheck,
    advanced: Crown,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome & Stats Header */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <PythonQuestLogo size="lg" variant="icon" withGlow className="hidden sm:inline-flex mt-1" />
            <div>
              <div className="flex flex-wrap items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Python Quest Dashboard</span>
                </div>
                {progress.user?.age && (
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px]">
                    Age: {progress.user.age} • {progress.learnerMode.toUpperCase()} TIER
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Hello, <span className="text-amber-400">{progress.learnerName}</span>!
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
                Solve chapter exercises, build practical Python code, earn credits, and unlock
                accredited certificates across Foundation, Medium OOP, and Advanced milestones.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-medium text-slate-300">Total Credits</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
                {progress.totalCredits}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-medium text-slate-300">Completed</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {completedCount}/{totalChapters}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-medium text-slate-300">Avg Score</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                {avgScore}%
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-medium text-slate-300">Daily Streak</div>
              <div className="text-2xl font-extrabold text-orange-400 mt-1 flex items-center justify-center space-x-1">
                <Flame
                  className={`w-5 h-5 ${
                    streakInfo.isCompletedToday
                      ? "fill-orange-400 text-orange-400 animate-pulse"
                      : streakInfo.currentStreak > 0
                      ? "fill-orange-400 text-orange-400"
                      : "text-slate-400"
                  }`}
                />
                <span>{streakInfo.currentStreak}d</span>
              </div>
              <div className="text-[10px] mt-0.5 text-slate-300 font-medium">
                {streakInfo.isCompletedToday ? "Saved Today" : "0/1 Today"}
              </div>
            </div>

            <button
              onClick={onGoToLeaderboard}
              className="bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md border border-amber-400/40 rounded-2xl p-3.5 text-center transition-all hover:scale-105 cursor-pointer col-span-2 sm:col-span-1"
              title="Click to view Global Leaderboard"
            >
              <div className="text-xs font-medium text-amber-300 flex items-center justify-center space-x-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Global Rank</span>
              </div>
              <div className="text-2xl font-extrabold text-amber-300 mt-1 font-mono">
                #{userRank}
              </div>
            </button>
          </div>
        </div>

        {/* Course-wide Completion Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Overall Course Curriculum Progress</span>
            <span className="text-amber-400">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          DAILY LEARNING STREAK & ENGAGEMENT TRACKER
         ======================================================== */}
      <StreakWidget
        progress={progress}
        onGoToCurriculum={onGoToCurriculum}
        onGoToScratchpad={onGoToScratchpad}
        onGoToDailyChallenge={onGoToDailyChallenge}
      />

      {/* ========================================================
          TODAY'S DAILY PYTHON CHALLENGE SPOTLIGHT
         ======================================================== */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/25 text-white backdrop-blur-xs border border-white/20">
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
              <span>Today's Daily Challenge</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 border border-white/30 text-white">
              <span>{todayPuzzle.category}</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-orange-800">
              <span>{todayPuzzle.difficulty}</span>
            </span>

            {isTodayPuzzleCompleted && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-900/60 text-emerald-200 border border-emerald-400/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Solved Today (+{todayPuzzle.bonusCredits} cr)</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {todayPuzzle.title}
          </h3>

          <p className="text-xs sm:text-sm text-amber-50 max-w-xl line-clamp-2">
            {todayPuzzle.description.split("\n")[0]}
          </p>
        </div>

        <div className="relative z-10 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
          <div className="flex items-center space-x-1.5 bg-black/20 border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-black text-yellow-200 font-mono">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>+{todayPuzzle.bonusCredits} Extra Credits</span>
          </div>

          <button
            onClick={onGoToDailyChallenge}
            id="dashboard-open-daily-challenge-btn"
            className="flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-amber-50 text-orange-900 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <span>{isTodayPuzzleCompleted ? "Review Solution" : "Solve Puzzle Now"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          GLOBAL LEADERBOARD SPOTLIGHT CARD
         ======================================================== */}
      {onGoToLeaderboard && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Global Python Hall of Fame
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Rank #{userRank}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                You're Ranked #{userRank} Worldwide ({progress.totalCredits.toLocaleString()} Credits)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {aheadOfUser ? (
                  <>
                    You are only{" "}
                    <strong className="text-amber-600">+{gapToNext} credits</strong> away from
                    overtaking <strong className="text-slate-800">{aheadOfUser.name}</strong> (
                    #{userRank - 1}) on the global leaderboard!
                  </>
                ) : (
                  <>Congratulations! You hold the #1 rank on the global leaderboard!</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onGoToLeaderboard}
              id="dashboard-open-leaderboard-btn"
              className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <span>View Global Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          LEVEL MILESTONES & AWARDS (Foundation, Medium, Advanced)
         ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Level Milestones & Award Certificates</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Accumulate credits to unlock and claim each official level certificate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MILESTONES.map((milestone) => {
            const Icon = milestoneIcons[milestone.level];
            const isUnlocked = progress.totalCredits >= milestone.requiredCredits;
            const claimed = progress.claimedCertificates.find(
              (c) => c.milestoneId === milestone.id
            );
            const isClaimed = !!claimed;

            const creditsNeeded = Math.max(0, milestone.requiredCredits - progress.totalCredits);
            const levelProgress = Math.min(
              100,
              Math.round((progress.totalCredits / milestone.requiredCredits) * 100)
            );

            return (
              <div
                key={milestone.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isClaimed
                    ? "bg-linear-to-b from-amber-50/70 to-white border-amber-300 shadow-md"
                    : isUnlocked
                    ? "bg-linear-to-b from-emerald-50/60 to-white border-emerald-300 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200/90 shadow-xs opacity-90"
                }`}
              >
                {/* Status Ribbon Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                      milestone.level === "foundation"
                        ? "bg-amber-100 text-amber-800"
                        : milestone.level === "medium"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    {isClaimed ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Claimed</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ready to Claim!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{creditsNeeded} credits left</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Milestone Details */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {milestone.level.toUpperCase()} LEVEL
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Required Credits Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                      <span>Requirement: {milestone.requiredCredits} credits</span>
                      <span className="font-mono font-bold text-slate-800">
                        {progress.totalCredits}/{milestone.requiredCredits}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isUnlocked ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${levelProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Certified Skills bullets */}
                  <div className="mt-4 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Certified Topics:
                    </div>
                    <ul className="text-xs text-slate-600 space-y-0.5">
                      {milestone.skillsCertified.slice(0, 3).map((skill, i) => (
                        <li key={i} className="flex items-center space-x-1.5 truncate">
                          <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                          <span className="truncate">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isClaimed ? (
                    <button
                      onClick={() => onOpenCertificateModal(milestone, claimed)}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>View & Print Certificate</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onOpenCertificateModal(milestone)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Claim Official Award</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed flex items-center justify-center space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Earn {creditsNeeded} more credits</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          CHAPTER ROADMAP GRID (Foundation, Medium OOP, Advanced)
         ======================================================== */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Curriculum Roadmap & Chapter Mastery</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            15 interactive chapters ordered systematically from Foundations through OOP to Advanced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch) => {
            const isCompleted = progress.completedChapters.includes(ch.id);
            const sub = progress.exerciseSubmissions[ch.id];

            return (
              <div
                key={ch.id}
                onClick={() => onSelectChapter(ch.id)}
                className={`group p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  isCompleted
                    ? "bg-white border-emerald-200/90 hover:border-emerald-300"
                    : "bg-white border-slate-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ch.level === "foundation"
                        ? "bg-amber-100 text-amber-800"
                        : ch.level === "medium"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    Ch {ch.chapterNumber} • {ch.level}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{sub ? `${sub.score}%` : "Passed"}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{ch.exercise.creditReward} cr</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {ch.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {ch.shortDesc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{ch.estimatedMinutes} min read</span>
                  <span className="font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                    <span>{isCompleted ? "Review" : "Start"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

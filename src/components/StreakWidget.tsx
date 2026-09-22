import React from "react";
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  Terminal,
  Code2,
  Calendar,
  Zap,
} from "lucide-react";
import { UserProgress } from "../types";
import { getStreakStatus } from "../utils/storage";

interface StreakWidgetProps {
  progress: UserProgress;
  onGoToCurriculum: () => void;
  onGoToScratchpad: () => void;
  onGoToDailyChallenge?: () => void;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({
  progress,
  onGoToCurriculum,
  onGoToScratchpad,
  onGoToDailyChallenge,
}) => {
  const streakInfo = getStreakStatus(progress);

  const streakGoalMet =
    streakInfo.exercisesCompletedToday > 0 || streakInfo.challengesCompletedToday > 0;

  return (
    <div
      id="dashboard-daily-streak-card"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 relative overflow-hidden transition-all hover:shadow-md"
    >
      {/* Decorative gradient glow background */}
      <div
        className={`absolute -right-16 -top-16 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-30 ${
          streakInfo.isCompletedToday
            ? "bg-amber-400"
            : streakInfo.currentStreak > 0
            ? "bg-orange-400"
            : "bg-slate-200"
        }`}
      />

      {/* Top Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-100 relative z-10">
        <div className="flex items-start sm:items-center space-x-4">
          {/* Animated Flame Icon Container */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all shrink-0 ${
              streakInfo.isCompletedToday
                ? "bg-linear-to-tr from-amber-500 via-orange-500 to-yellow-400 text-white shadow-orange-500/25 ring-4 ring-orange-100"
                : streakInfo.currentStreak > 0
                ? "bg-orange-100 text-orange-600 border border-orange-200"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}
          >
            <Flame
              className={`w-9 h-9 ${
                streakInfo.isCompletedToday
                  ? "fill-white text-white drop-shadow-xs"
                  : streakInfo.currentStreak > 0
                  ? "fill-orange-500 text-orange-500"
                  : "text-slate-400"
              }`}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Daily Learning Streak
              </span>

              {streakInfo.isCompletedToday ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Goal Completed for Today</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pending Today's Exercise/Challenge</span>
                </span>
              )}

              {streakInfo.longestStreak > 0 && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>Record: {streakInfo.longestStreak}d</span>
                </span>
              )}
            </div>

            {/* Big Streak Counter */}
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-4xl font-black tracking-tight text-slate-900 font-sans">
                {streakInfo.currentStreak}
              </span>
              <span className="text-lg font-bold text-slate-700">
                {streakInfo.currentStreak === 1 ? "Day Streak" : "Days Streak"}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Increments when you complete at least <strong>one exercise or challenge</strong> per
              day. Keep learning continuously to safeguard your flame!
            </p>
          </div>
        </div>

        {/* Today's Quota Breakdown Card */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-center w-full sm:w-auto sm:min-w-[240px]">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Today's Activity</span>
            <span
              className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-md ${
                streakGoalMet
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {streakGoalMet ? "Quota Met (+1 streak)" : "0 / 1 Needed"}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Chapter Exercises:</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {streakInfo.exercisesCompletedToday} solved
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span>Daily Challenges:</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {streakInfo.challengesCompletedToday} solved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Activity Track */}
      <div className="py-5 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Past 7 Days Streak History</span>
          </div>
          <span className="text-slate-500 text-[11px] font-medium">
            {streakInfo.isCompletedToday
              ? "Streak active and saved for today"
              : "Complete an activity before midnight to maintain streak"}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {streakInfo.recent7Days.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all text-center ${
                day.isToday
                  ? day.isCompleted
                    ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30"
                    : "bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-xs"
                  : day.isCompleted
                  ? "bg-emerald-50/60 border-emerald-200"
                  : "bg-slate-50/60 border-slate-200/80"
              }`}
            >
              <span
                className={`text-[11px] font-bold ${
                  day.isToday ? "text-amber-800" : "text-slate-500"
                }`}
              >
                {day.dayLabel}
              </span>

              {/* Day indicator Icon */}
              <div className="my-2">
                {day.isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-400 flex items-center justify-center text-xs font-semibold">
                    {day.dayNum}
                  </div>
                )}
              </div>

              {/* Status footer pill */}
              <span
                className={`text-[10px] font-extrabold uppercase tracking-tight ${
                  day.isToday
                    ? day.isCompleted
                      ? "text-amber-700"
                      : "text-amber-600 animate-pulse"
                    : day.isCompleted
                    ? "text-emerald-700"
                    : "text-slate-400"
                }`}
              >
                {day.isToday
                  ? day.isCompleted
                    ? "Done"
                    : "Pending"
                  : day.isCompleted
                  ? "Done"
                  : "Missed"}
              </span>

              {/* Task counter detail */}
              {(day.exercisesCount > 0 || day.challengesCount > 0) && (
                <span className="text-[9px] text-slate-400 mt-1 font-mono">
                  {day.exercisesCount + day.challengesCount} task
                  {day.exercisesCount + day.challengesCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer Callouts */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="text-xs text-slate-500 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {streakInfo.isCompletedToday
              ? "Great job! Keep the momentum tomorrow to extend your streak to Day " +
                (streakInfo.currentStreak + 1) +
                "."
              : "Keep your habit strong! Complete either action below to increment today's streak:"}
          </span>
        </div>

        <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto shrink-0 gap-y-2">
          {onGoToDailyChallenge && (
            <button
              onClick={onGoToDailyChallenge}
              id="streak-action-daily-challenge"
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-black text-amber-950 bg-linear-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 rounded-xl transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Daily Challenge (+50 cr)</span>
            </button>
          )}

          <button
            onClick={onGoToCurriculum}
            id="streak-action-exercise"
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Chapter Exercise (+150 cr)</span>
          </button>

          <button
            onClick={onGoToScratchpad}
            id="streak-action-sandbox"
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-600" />
            <span>Sandbox Practice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

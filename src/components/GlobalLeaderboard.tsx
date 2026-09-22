import React, { useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Flame,
  Award,
  Search,
  ArrowUpRight,
  CheckCircle2,
  Baby,
  GraduationCap,
  Briefcase,
  Zap,
  BookOpen,
  TrendingUp,
  Globe,
  Star,
  Users,
} from "lucide-react";
import { LearnerMode, UserProgress } from "../types";
import { getAugmentedLeaderboard, RankedLeaderboardEntry } from "../data/leaderboardData";
import { PythonMascot } from "./PythonMascot";

interface GlobalLeaderboardProps {
  progress: UserProgress;
  onGoToCurriculum: () => void;
  onGoToDailyChallenge: () => void;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  progress,
  onGoToCurriculum,
  onGoToDailyChallenge,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<"all" | LearnerMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState<"all-time" | "month" | "week">("all-time");

  // Calculate full ranked leaderboard with current user injected
  const { entries, userEntry, userRank, totalLearners, gapToNext, aheadOfUser } = useMemo(
    () => getAugmentedLeaderboard(progress),
    [progress]
  );

  // Filter based on selectedTrack and search query
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesTrack = selectedTrack === "all" || item.mode === selectedTrack;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badgeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.countryName && item.countryName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTrack && matchesSearch;
    });
  }, [entries, selectedTrack, searchQuery]);

  // Track user's rank within the filtered subset
  const filteredUserRank = useMemo(() => {
    const idx = filteredEntries.findIndex((e) => e.isCurrentUser);
    return idx !== -1 ? idx + 1 : null;
  }, [filteredEntries]);

  // Top 3 podium items (from unfiltered or filtered, depending on view)
  const topThree = useMemo(() => {
    const first = filteredEntries[0] || null;
    const second = filteredEntries[1] || null;
    const third = filteredEntries[2] || null;
    return { first, second, third };
  }, [filteredEntries]);

  // Track icons & metadata
  const trackDetails: Record<
    LearnerMode,
    { label: string; icon: typeof Baby; badge: string; color: string }
  > = {
    child: {
      label: "Junior Explorer",
      icon: Baby,
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      color: "text-emerald-600",
    },
    student: {
      label: "Student Scholar",
      icon: GraduationCap,
      badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
      color: "text-indigo-600",
    },
    pro: {
      label: "Pro & Architect",
      icon: Briefcase,
      badge: "bg-purple-100 text-purple-800 border-purple-300",
      color: "text-purple-600",
    },
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-400/30">
          <Crown className="w-4 h-4 fill-slate-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-slate-200 to-slate-400 flex items-center justify-center text-slate-900 font-black text-sm shadow-md">
          <Medal className="w-4 h-4 fill-slate-700 text-slate-700" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20">
          <Medal className="w-4 h-4 fill-amber-100 text-amber-100" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-extrabold text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-200">
      {/* ========================================================
          HERO BANNER & GLOBAL STATS
         ======================================================== */}
      <div className="bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <PythonMascot size="lg" withGlow withCrown className="hidden sm:inline-flex mt-1" />
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Globe className="w-4 h-4" />
                <span>Python Quest Hall of Fame</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Global Learner Leaderboard
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
                See how your earned credits, daily streaks, and accredited certificates stack up against
                fellow coders across Junior Explorers, Students, and Software Architects worldwide.
              </p>
            </div>
          </div>

          {/* User Standing Quick Stat Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 w-full lg:w-auto shrink-0 shadow-lg text-left sm:text-right">
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Your Current Standing
            </div>
            <div className="flex items-baseline sm:justify-end space-x-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                #{userRank}
              </span>
              <span className="text-xs text-slate-300">of {totalLearners} learners</span>
            </div>

            <div className="mt-2 text-xs text-slate-300 flex items-center sm:justify-end space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                <strong>{progress.totalCredits.toLocaleString()}</strong> Total Credits Earned
              </span>
            </div>

            {gapToNext !== null && aheadOfUser && (
              <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] text-amber-200">
                <span>
                  Only <strong>+{gapToNext} cr</strong> to pass{" "}
                  <strong className="text-white">{aheadOfUser.name}</strong> (#{userRank - 1})!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          USER HIGHLIGHTED STICKY STANDING CARD
         ======================================================== */}
      <div className="bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
            #{userRank}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-base">
                {progress.learnerName} (You)
              </span>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active Player
              </span>
              {progress.user?.age && (
                <span className="text-xs text-slate-500">Age {progress.user.age}</span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
              <span className="font-semibold text-amber-700 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{progress.totalCredits} credits</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-orange-600 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{progress.currentStreak}d streak</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">
                {progress.claimedCertificates.length} certificates claimed
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <button
            onClick={onGoToDailyChallenge}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Daily Challenge (+50 cr)</span>
          </button>
          <button
            onClick={onGoToCurriculum}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Code Chapters (+150 cr)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TOP 3 PODIUM SHOWCASE
         ======================================================== */}
      {topThree.first && (
        <div className="pt-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Current Top Performers</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Global Championship Podium
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end max-w-4xl mx-auto">
            {/* 2nd Place Podium */}
            {topThree.second && (
              <div
                className={`order-2 md:order-1 bg-white rounded-2xl p-5 border-2 ${
                  topThree.second.isCurrentUser
                    ? "border-amber-500 ring-4 ring-amber-400/20"
                    : "border-slate-200"
                } shadow-md text-center flex flex-col items-center relative transition-transform hover:-translate-y-1`}
              >
                <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-slate-800 font-black shadow-md">
                  <Medal className="w-4 h-4 fill-slate-600 text-slate-600" />
                </div>
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-800 font-extrabold text-xl mt-3 shadow-inner">
                  {topThree.second.name.charAt(0)}
                </div>
                <div className="font-extrabold text-slate-900 text-base mt-2 flex items-center space-x-1.5">
                  <span>{topThree.second.name}</span>
                  {topThree.second.isCurrentUser && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {topThree.second.countryName} • {trackDetails[topThree.second.mode].label}
                </div>
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full">
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {topThree.second.totalCredits.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">cr</span>
                  </div>
                  <div className="text-[11px] text-orange-600 font-semibold flex items-center justify-center space-x-1">
                    <Flame className="w-3 h-3 fill-orange-500" />
                    <span>{topThree.second.streak} days streak</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-lg py-1 mt-3 text-[11px] font-bold text-slate-600">
                  2nd Place
                </div>
              </div>
            )}

            {/* 1st Place Podium (Crown) */}
            {topThree.first && (
              <div
                className={`order-1 md:order-2 bg-linear-to-b from-amber-500/10 via-white to-amber-500/5 rounded-2xl p-6 border-2 ${
                  topThree.first.isCurrentUser
                    ? "border-amber-500 ring-4 ring-amber-400/20"
                    : "border-amber-400"
                } shadow-xl text-center flex flex-col items-center relative transform md:-translate-y-4`}
              >
                <div className="absolute -top-6 w-12 h-12 rounded-full bg-linear-to-tr from-amber-400 to-yellow-300 border-2 border-white flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-400/40 animate-bounce">
                  <Crown className="w-6 h-6 fill-slate-950" />
                </div>
                <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-amber-950 font-black text-2xl mt-4 shadow-md">
                  {topThree.first.name.charAt(0)}
                </div>
                <div className="font-black text-slate-900 text-lg mt-2 flex items-center space-x-1.5">
                  <span>{topThree.first.name}</span>
                  {topThree.first.isCurrentUser && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-xs text-amber-800 font-medium mt-0.5">
                  {topThree.first.countryName} • {topThree.first.badgeTitle}
                </div>
                <div className="mt-3 bg-amber-500/15 border border-amber-400/40 rounded-xl px-4 py-2 w-full">
                  <div className="text-2xl font-black text-amber-950 font-mono">
                    {topThree.first.totalCredits.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-amber-800">cr</span>
                  </div>
                  <div className="text-xs text-orange-600 font-bold flex items-center justify-center space-x-1">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span>{topThree.first.streak} days streak • {topThree.first.certificatesCount} certs</span>
                  </div>
                </div>
                <div className="w-full bg-amber-500 text-slate-950 rounded-lg py-1.5 mt-3 text-xs font-black uppercase tracking-wider">
                  🏆 Champion
                </div>
              </div>
            )}

            {/* 3rd Place Podium */}
            {topThree.third && (
              <div
                className={`order-3 bg-white rounded-2xl p-5 border-2 ${
                  topThree.third.isCurrentUser
                    ? "border-amber-500 ring-4 ring-amber-400/20"
                    : "border-slate-200"
                } shadow-md text-center flex flex-col items-center relative transition-transform hover:-translate-y-1`}
              >
                <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-700 border-2 border-white flex items-center justify-center text-white font-black shadow-md">
                  <Medal className="w-4 h-4 fill-amber-200 text-amber-200" />
                </div>
                <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-amber-300 flex items-center justify-center text-amber-900 font-extrabold text-xl mt-3 shadow-inner">
                  {topThree.third.name.charAt(0)}
                </div>
                <div className="font-extrabold text-slate-900 text-base mt-2 flex items-center space-x-1.5">
                  <span>{topThree.third.name}</span>
                  {topThree.third.isCurrentUser && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {topThree.third.countryName} • {trackDetails[topThree.third.mode].label}
                </div>
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full">
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {topThree.third.totalCredits.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">cr</span>
                  </div>
                  <div className="text-[11px] text-orange-600 font-semibold flex items-center justify-center space-x-1">
                    <Flame className="w-3 h-3 fill-orange-500" />
                    <span>{topThree.third.streak} days streak</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-lg py-1 mt-3 text-[11px] font-bold text-slate-600">
                  3rd Place
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          FILTER & SEARCH BAR
         ======================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Track Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full md:w-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedTrack("all")}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedTrack === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Tracks ({entries.length})
          </button>
          <button
            onClick={() => setSelectedTrack("child")}
            className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedTrack === "child"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Young Explorers</span>
          </button>
          <button
            onClick={() => setSelectedTrack("student")}
            className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedTrack === "student"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Students</span>
          </button>
          <button
            onClick={() => setSelectedTrack("pro")}
            className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedTrack === "pro"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professionals</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, country..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ========================================================
          FULL LEADERBOARD TABLE
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 text-center w-16">Rank</th>
                <th className="py-3.5 px-4">Learner</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Track & Age</th>
                <th className="py-3.5 px-4 hidden md:table-cell text-center">Streak</th>
                <th className="py-3.5 px-4 hidden lg:table-cell text-center">Completed</th>
                <th className="py-3.5 px-4 hidden sm:table-cell text-center">Certs</th>
                <th className="py-3.5 px-4 text-right">Total Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEntries.map((learner) => {
                const isUser = learner.isCurrentUser;
                const track = trackDetails[learner.mode];
                const TrackIcon = track.icon;

                return (
                  <tr
                    key={learner.id}
                    id={isUser ? "user-leaderboard-row" : undefined}
                    className={`transition-colors ${
                      isUser
                        ? "bg-amber-50/80 hover:bg-amber-100/70 border-l-4 border-l-amber-500 font-semibold"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {getRankBadge(learner.rank)}
                      </div>
                    </td>

                    {/* Learner Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            isUser
                              ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {learner.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {learner.name}
                            </span>
                            {isUser && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                            <span>{learner.badgeTitle}</span>
                            {learner.countryName && (
                              <>
                                <span>•</span>
                                <span>{learner.countryName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Track & Age */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${track.badge}`}
                      >
                        <TrackIcon className="w-3 h-3" />
                        <span>{track.label}</span>
                        {learner.age && <span className="opacity-75">({learner.age})</span>}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-center font-bold text-orange-600">
                      <span className="inline-flex items-center space-x-1 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg text-xs">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                        <span>{learner.streak}d</span>
                      </span>
                    </td>

                    {/* Completed Chapters */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-center text-slate-700">
                      <span className="font-mono">{learner.completedChaptersCount}/8</span>
                    </td>

                    {/* Certificates Count */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-center">
                      {learner.certificatesCount > 0 ? (
                        <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                          <Award className="w-3 h-3 text-emerald-600" />
                          <span>{learner.certificatesCount}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Total Credits */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-black text-sm text-slate-900">
                        {learner.totalCredits.toLocaleString()}{" "}
                        <span className="text-[10px] text-amber-600 uppercase font-sans">cr</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No learners found matching your filter</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try clearing your search query or selecting "All Tracks".
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <strong>{filteredEntries.length}</strong> of <strong>{totalLearners}</strong> learners on the global leaderboard.
          </div>
          <div className="flex items-center space-x-2 text-amber-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Scores update automatically as exercises are solved!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

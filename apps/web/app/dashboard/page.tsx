"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "../brand-logo";
import { ThemeToggle } from "../theme-toggle";
import { LogoutButton } from "../logout-button";
import { getAllChapters, ALL_BADGES, ChapterMeta, BadgeInfo } from "@/lib/curriculum";

interface LearnerStats {
  xp: number;
  level: number;
  streak: number;
  credits: number;
  learnerLevel: string;
  displayName: string;
  completedActivities: string[];
}

interface ChapterProgress {
  chapter: ChapterMeta;
  challengeCompleted: boolean;
  quizCompleted: boolean;
  status: "completed" | "current" | "locked";
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerStats>({
    xp: 0,
    level: 1,
    streak: 0,
    credits: 100,
    learnerLevel: "Junior",
    displayName: "Explorer",
    completedActivities: [],
  });
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const allChapters = getAllChapters();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        // Fetch profile, activities, and badges in parallel
        const [
          { data: profileData },
          { data: activityData },
          { data: badgeData },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("display_name, xp, level, streak, credits, learner_level")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("activity_progress")
            .select("activity_key, completed")
            .eq("user_id", user.id),
          supabase
            .from("student_badges")
            .select("badge_id, badges(id, name)")
            .eq("user_id", user.id),
        ]);

        const completedActivities = (activityData ?? [])
          .filter((a) => a.completed)
          .map((a) => a.activity_key);

        const badgeNames = (badgeData ?? [])
          .map((b) => {
            const row = b as { badges?: { name?: string } | { name?: string }[] | null };
            const badge = Array.isArray(row?.badges) ? row.badges[0] : row?.badges;
            return badge?.name;
          })
          .filter((name): name is string => Boolean(name));

        setProfile({
          displayName: profileData?.display_name || "Explorer",
          xp: profileData?.xp ?? 0,
          level: profileData?.level ?? 1,
          streak: profileData?.streak ?? 0,
          credits: profileData?.credits ?? 100,
          learnerLevel: profileData?.learner_level ?? "Junior",
          completedActivities,
        });

        setEarnedBadges(badgeNames);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboardData();
  }, [router]);

  const completedSet = useMemo(
    () => new Set(profile.completedActivities),
    [profile.completedActivities]
  );

  // Compute chapter status for all 10 chapters
  const chapterProgressList = useMemo<ChapterProgress[]>(() => {
    const list: ChapterProgress[] = [];
    let isPrevComplete = true;

    for (const chapter of allChapters) {
      const challengeDone = completedSet.has(chapter.challenge.activityKey);
      const quizDone =
        completedSet.has(chapter.quizActivityKey) ||
        (chapter.order === 1 &&
          (completedSet.has("variables-quiz") || completedSet.has("variables-quiz-v2")));

      const isFullyCompleted = challengeDone && quizDone;
      let status: "completed" | "current" | "locked" = "locked";

      if (isFullyCompleted) {
        status = "completed";
      } else if (isPrevComplete) {
        status = "current";
      } else {
        status = "locked";
      }

      isPrevComplete = isFullyCompleted;
      list.push({
        chapter,
        challengeCompleted: challengeDone,
        quizCompleted: quizDone,
        status,
      });
    }

    return list;
  }, [allChapters, completedSet]);

  const completedCount = chapterProgressList.filter((p) => p.status === "completed").length;
  const curriculumPercentage = Math.round((completedCount / allChapters.length) * 100);

  // Find current active quest
  const currentQuest =
    chapterProgressList.find((p) => p.status === "current") ||
    chapterProgressList[0];

  const currentQuestHref = currentQuest.challengeCompleted && !currentQuest.quizCompleted
    ? `/quiz/${currentQuest.chapter.slug}`
    : `/lesson/${currentQuest.chapter.slug}`;

  const currentQuestActionText = currentQuest.status === "completed"
    ? "Review curriculum"
    : currentQuest.challengeCompleted
    ? `Take Quest ${currentQuest.chapter.order} Checkpoint`
    : `Continue Quest ${currentQuest.chapter.order}: ${currentQuest.chapter.title}`;

  // Level progress calculations (250 XP per level)
  const currentLevelBase = (profile.level - 1) * 250;
  const xpInCurrentLevel = Math.max(0, profile.xp - currentLevelBase);
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / 250) * 100));

  return (
    <main className="dashboard-page">
      <header className="app-header">
        <div className="page-frame app-header-inner">
          <BrandLogo href="/dashboard" />
          <div className="app-header-actions">
            <span className="dashboard-pill dashboard-pill-streak" title="Active Daily Streak">
              🔥 {profile.streak}
            </span>
            <span className="dashboard-pill dashboard-pill-xp" title="Total Experience Points">
              ⭐ {profile.xp} XP
            </span>
            <span className="dashboard-pill dashboard-pill-credits" title="Available Hint Credits">
              ◈ {profile.credits}
            </span>
            <ThemeToggle />
            <LogoutButton compact />
          </div>
        </div>
      </header>

      <div className="page-frame dashboard-main">
        {/* Hero Banner */}
        <section className="dashboard-hero">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="eyebrow">
                LEVEL {profile.level} · {profile.learnerLevel.toUpperCase()} LEARNER
              </span>
            </div>
            <h1 className="mt-1 font-black">
              Welcome back, {profile.displayName.toUpperCase()}!
            </h1>
            <p className="mt-2 text-sm sm:text-base">
              {completedCount === 0
                ? "Embark on your journey into Python. Master concepts, solve challenges, and conquer quests."
                : `You've completed ${completedCount} of 10 quests. Keep your momentum going!`}
            </p>

            {/* Level progress indicator */}
            <div className="mt-4 pt-2 max-w-md">
              <div className="flex justify-between text-xs font-bold body-muted mb-1.5">
                <span>Level {profile.level}</span>
                <span>{xpInCurrentLevel} / 250 XP to Level {profile.level + 1}</span>
              </div>
              <div className="progress-track h-2.5">
                <div
                  className="progress-fill transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end gap-3">
            <Link
              href={currentQuestHref}
              className="quest-button inline-block px-7 py-3.5 text-center font-extrabold shadow-md hover:scale-[1.02] transition-transform"
            >
              {currentQuestActionText} →
            </Link>
            <span className="text-xs body-muted font-bold">
              {curriculumPercentage}% Curriculum Complete
            </span>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="dashboard-grid mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Stat
            title="Total XP"
            value={String(profile.xp)}
            note={`${250 - xpInCurrentLevel} XP until Level ${profile.level + 1}`}
            tone="xp"
          />
          <Stat
            title="Active Streak"
            value={`${profile.streak} Days 🔥`}
            note="Complete a quest today to build streak"
            tone="streak"
          />
          <Stat
            title="Hint Credits"
            value={String(profile.credits)}
            note="Use 1 credit to reveal checkpoint hints"
            tone="credits"
          />
          <Stat
            title="Quests Completed"
            value={`${completedCount} / ${allChapters.length}`}
            note={`${curriculumPercentage}% of Python Quest finished`}
            tone="xp"
          />
        </div>

        {/* 10 Chapters Learning Path */}
        <section className="path-section mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-border pb-4">
            <div>
              <p className="eyebrow">CURRICULUM ROADMAP</p>
              <h2 className="mt-1 text-2xl font-black">Your Learning Path</h2>
            </div>
            <span className="body-muted text-sm font-bold">
              {loading ? "Loading progress..." : `${completedCount} of 10 quests mastered`}
            </span>
          </div>

          <div className="path-list mt-6 space-y-3">
            {chapterProgressList.map(({ chapter, challengeCompleted, quizCompleted, status }) => {
              const isLocked = status === "locked";
              const href = isLocked ? "#" : `/lesson/${chapter.slug}`;

              let badgeBadgeStyle = "bg-slate-100 text-slate-600";
              let badgeStatusText = "Locked";

              if (status === "completed") {
                badgeBadgeStyle = "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300";
                badgeStatusText = "✓ Mastered";
              } else if (status === "current") {
                if (challengeCompleted && !quizCompleted) {
                  badgeBadgeStyle = "bg-amber-100 text-amber-800 font-bold border border-amber-300";
                  badgeStatusText = "Checkpoint Ready";
                } else {
                  badgeBadgeStyle = "bg-indigo-100 text-indigo-800 font-bold border border-indigo-300";
                  badgeStatusText = "In Progress";
                }
              }

              return (
                <Link
                  key={chapter.order}
                  href={href}
                  aria-disabled={isLocked}
                  tabIndex={isLocked ? -1 : undefined}
                  className={`path-item flex items-center justify-between gap-4 p-4 rounded-xl border border-surface-border transition-all ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed pointer-events-none bg-surface-subtle"
                      : "hover:border-accent hover:shadow-sm bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="path-number flex-shrink-0 text-base font-black">
                      {String(chapter.order).padStart(2, "0")}
                    </div>
                    <div className="path-copy min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg tracking-tight truncate">
                          {chapter.title}
                        </h3>
                        <span className="text-sm" title={chapter.badge.name}>
                          {chapter.badge.icon}
                        </span>
                      </div>
                      <p className="body-muted text-sm line-clamp-1 mt-0.5">
                        {chapter.overview}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:flex flex-col items-end text-xs body-muted">
                      <span>{chapter.concepts.length} concepts</span>
                      <span>⭐ 50 XP</span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase ${badgeBadgeStyle}`}>
                      {badgeStatusText}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Badges & Achievements Showcase */}
        <section className="mt-12 surface p-6 rounded-2xl border border-surface-border">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow">ACHIEVEMENTS & TROPHIES</p>
              <h2 className="mt-1 text-2xl font-black">Badges Showcase</h2>
            </div>
            <span className="body-muted text-sm font-bold">
              {earnedBadges.length} Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ALL_BADGES.map((badge) => {
              const isEarned =
                earnedBadges.includes(badge.name) ||
                (badge.id === "python-explorer" && completedCount >= 1) ||
                (badge.id === "variable-explorer" && completedSet.has("variables-challenge"));

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isEarned
                      ? "border-amber-300 bg-amber-50/40 shadow-sm"
                      : "border-surface-border bg-surface-subtle opacity-50 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-1.5">{badge.icon}</div>
                  <h4 className="font-extrabold text-xs tracking-tight line-clamp-1">
                    {badge.name}
                  </h4>
                  <p className="text-[10px] body-muted line-clamp-2 mt-1">
                    {badge.description}
                  </p>
                  <span className={`inline-block mt-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    isEarned ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-600"
                  }`}>
                    {isEarned ? "Unlocked" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  title,
  value,
  note,
  tone,
}: {
  title: string;
  value: string;
  note: string;
  tone: "xp" | "streak" | "credits";
}) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <p className="stat-label">{title}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-note line-clamp-1">{note}</p>
    </div>
  );
}

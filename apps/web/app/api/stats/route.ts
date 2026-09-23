import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllChapters } from "@/lib/curriculum";
import { getStudentBadges } from "@/lib/badges";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        stats: {
          xp: 0,
          level: 1,
          nextLevelXp: 250,
          levelProgressPercentage: 0,
          streak: 0,
          credits: 100,
          completedChaptersCount: 0,
          totalChapters: 10,
          curriculumPercentage: 0,
          badgesCount: 0,
        },
        badges: [],
        recentAchievements: [],
      });
    }

    const [
      { data: profile },
      { data: activities },
      badges,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, username, xp, level, streak, credits, learner_level")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("activity_progress")
        .select("activity_key, completed, xp_earned, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false }),
      getStudentBadges(supabase, user.id),
    ]);

    const xp = profile?.xp ?? 0;
    const level = profile?.level ?? 1;
    const streak = profile?.streak ?? 0;
    const credits = profile?.credits ?? 100;
    const nextLevelThreshold = level * 250;
    const currentLevelBase = (level - 1) * 250;
    const xpInLevel = Math.max(0, xp - currentLevelBase);
    const levelProgressPercentage = Math.min(100, Math.round((xpInLevel / 250) * 100));

    const completedSet = new Set(
      activities?.filter((a) => a.completed).map((a) => a.activity_key) ?? []
    );

    const chapters = getAllChapters();
    const completedChaptersCount = chapters.filter((ch) => {
      const challengeDone = completedSet.has(ch.challenge.activityKey);
      const quizDone =
        completedSet.has(ch.quizActivityKey) ||
        (ch.order === 1 && (completedSet.has("variables-quiz") || completedSet.has("variables-quiz-v2")));
      return challengeDone && quizDone;
    }).length;

    const curriculumPercentage = Math.round((completedChaptersCount / chapters.length) * 100);

    const recentAchievements = (activities ?? [])
      .filter((a) => a.completed)
      .slice(0, 5)
      .map((a) => ({
        activityKey: a.activity_key,
        xpEarned: a.xp_earned,
        completedAt: a.completed_at,
      }));

    return NextResponse.json({
      authenticated: true,
      profile: {
        displayName: profile?.display_name || "Explorer",
        username: profile?.username || null,
        learnerLevel: profile?.learner_level || "Junior",
      },
      stats: {
        xp,
        level,
        nextLevelXp: nextLevelThreshold,
        xpInLevel,
        levelProgressPercentage,
        streak,
        credits,
        completedChaptersCount,
        totalChapters: chapters.length,
        curriculumPercentage,
        badgesCount: badges.length,
      },
      badges,
      recentAchievements,
    });
  } catch (error) {
    console.error("api/stats GET error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

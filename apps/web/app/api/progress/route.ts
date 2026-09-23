import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllChapters } from "@/lib/curriculum";
import { awardBadge, getStudentBadges } from "@/lib/badges";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, message: "Not signed in" }, { status: 401 });
    }

    const [
      { data: profile },
      { data: activities },
      studentBadges,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, display_name, username, xp, level, streak, credits, learner_level, created_at")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("activity_progress")
        .select("activity_key, completed, hints_used, credits_spent, xp_earned, completed_at")
        .eq("user_id", user.id),
      getStudentBadges(supabase, user.id),
    ]);

    const completedActivities = activities?.filter((a) => a.completed) ?? [];
    const completedKeys = new Set(completedActivities.map((a) => a.activity_key));

    const chapters = getAllChapters();
    let completedChaptersCount = 0;

    const chapterStatus = chapters.map((ch) => {
      const challengeDone = completedKeys.has(ch.challenge.activityKey);
      const quizDone =
        completedKeys.has(ch.quizActivityKey) ||
        (ch.order === 1 && (completedKeys.has("variables-quiz") || completedKeys.has("variables-quiz-v2")));

      const isCompleted = challengeDone && quizDone;
      if (isCompleted) completedChaptersCount++;

      return {
        order: ch.order,
        slug: ch.slug,
        title: ch.title,
        challengeDone,
        quizDone,
        completed: isCompleted,
      };
    });

    return NextResponse.json({
      authenticated: true,
      profile: {
        displayName: profile?.display_name || "Explorer",
        username: profile?.username || null,
        xp: profile?.xp ?? 0,
        level: profile?.level ?? 1,
        streak: profile?.streak ?? 0,
        credits: profile?.credits ?? 100,
        learnerLevel: profile?.learner_level ?? "Junior",
      },
      stats: {
        completedChaptersCount,
        totalChapters: chapters.length,
        completionPercentage: Math.round((completedChaptersCount / chapters.length) * 100),
        completedActivitiesCount: completedActivities.length,
        badgesCount: studentBadges.length,
      },
      chapterStatus,
      badges: studentBadges,
    });
  } catch (error) {
    console.error("api/progress GET error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    const { activityKey, baseXp = 50 } = body ?? {};

    if (!activityKey || typeof activityKey !== "string") {
      return NextResponse.json({ error: "Valid activityKey is required" }, { status: 400 });
    }

    // Call complete_activity RPC function in Supabase
    const { data: rpcData, error: rpcError } = await supabase.rpc("complete_activity", {
      activity: activityKey,
      base_xp: Math.min(Math.max(baseXp, 0), 100),
    });

    if (rpcError) {
      console.error("complete_activity rpc error:", rpcError);
      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    // Check if a badge should be awarded
    const chapters = getAllChapters();
    const chapter = chapters.find(
      (c) => c.challenge.activityKey === activityKey || c.quizActivityKey === activityKey
    );

    const newlyAwardedBadges = [];

    if (chapter) {
      // Award chapter badge
      const awardResult = await awardBadge(supabase, user.id, chapter.badge.id);
      if (awardResult.awarded && awardResult.badge) {
        newlyAwardedBadges.push(awardResult.badge);
      }
    }

    // Always check for "Python Explorer" on first challenge
    if (activityKey === "variables-challenge" || activityKey === "chapter-1-challenge") {
      const expBadge = await awardBadge(supabase, user.id, "python-explorer");
      if (expBadge.awarded && expBadge.badge) {
        newlyAwardedBadges.push(expBadge.badge);
      }
    }

    // Update streak if needed
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("streak, xp, level, credits")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      xp: rpcData?.xp ?? currentProfile?.xp ?? 0,
      level: rpcData?.level ?? currentProfile?.level ?? 1,
      awardedXp: rpcData?.awarded ?? 0,
      alreadyCompleted: rpcData?.already_completed ?? false,
      newBadges: newlyAwardedBadges,
    });
  } catch (error) {
    console.error("api/progress POST error:", error);
    return NextResponse.json({ error: "Failed to record progress" }, { status: 500 });
  }
}

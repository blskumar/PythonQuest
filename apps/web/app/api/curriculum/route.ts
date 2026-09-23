import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllChapters } from "@/lib/curriculum";

export async function GET() {
  const chapters = getAllChapters();

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Unauthenticated / guest state: first chapter unlocked, rest locked
      const guestChapters = chapters.map((ch, idx) => ({
        order: ch.order,
        title: ch.title,
        slug: ch.slug,
        overview: ch.overview,
        conceptCount: ch.concepts.length,
        requiredXp: ch.requiredXp,
        badge: ch.badge,
        challengeTitle: ch.challenge.title,
        status: idx === 0 ? "current" : "locked",
      }));
      return NextResponse.json({ chapters: guestChapters, total: chapters.length });
    }

    // Fetch user progress
    const [{ data: profile }, { data: activities }] = await Promise.all([
      supabase.from("profiles").select("xp, level").eq("user_id", user.id).maybeSingle(),
      supabase.from("activity_progress").select("activity_key, completed").eq("user_id", user.id),
    ]);

    const completedSet = new Set(
      activities?.filter((a) => a.completed).map((a) => a.activity_key) ?? []
    );
    const userXp = profile?.xp ?? 0;

    let previousCompleted = true; // Chapter 1 starts unlocked
    const enrichedChapters = chapters.map((ch, idx) => {
      const challengeDone = completedSet.has(ch.challenge.activityKey);
      const quizDone =
        completedSet.has(ch.quizActivityKey) ||
        (ch.order === 1 && (completedSet.has("variables-quiz") || completedSet.has("variables-quiz-v2")));

      const isCompleted = challengeDone && quizDone;
      let status: "completed" | "current" | "unlocked" | "locked" = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (previousCompleted) {
        status = "current";
      } else {
        status = "locked";
      }

      previousCompleted = isCompleted;

      return {
        order: ch.order,
        title: ch.title,
        slug: ch.slug,
        overview: ch.overview,
        conceptCount: ch.concepts.length,
        requiredXp: ch.requiredXp,
        badge: ch.badge,
        challengeTitle: ch.challenge.title,
        challengeDone,
        quizDone,
        status,
      };
    });

    return NextResponse.json({
      chapters: enrichedChapters,
      total: chapters.length,
      userXp,
    });
  } catch (error) {
    console.error("api/curriculum GET error:", error);
    return NextResponse.json({ error: "Failed to load curriculum" }, { status: 500 });
  }
}

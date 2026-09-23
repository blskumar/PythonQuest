import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getChapterBySlug, getQuizForChapter } from "@/lib/curriculum";
import { awardBadge } from "@/lib/badges";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    const { chapterSlug, userAnswers, hintsUsed = 0 } = body ?? {};

    if (!chapterSlug || !Array.isArray(userAnswers)) {
      return NextResponse.json(
        { error: "chapterSlug and userAnswers array are required" },
        { status: 400 }
      );
    }

    const chapter = getChapterBySlug(chapterSlug);
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check learner level for adaptive quiz (if Chapter 1)
    let learnerLevel = "Junior";
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("learner_level, streak")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.learner_level) learnerLevel = profile.learner_level;
    }

    const quizData = getQuizForChapter(chapter.slug, learnerLevel);
    if (!quizData) {
      return NextResponse.json({ error: "Quiz questions not found" }, { status: 404 });
    }

    const questions = quizData.questions;
    let correctCount = 0;
    const questionResults = questions.map((q, idx) => {
      const submitted = userAnswers[idx];
      const isCorrect = submitted === q.answer;
      if (isCorrect) correctCount++;
      return {
        questionIndex: idx,
        prompt: q.prompt,
        submittedAnswer: submitted,
        correctAnswer: q.answer,
        isCorrect,
        hint: q.hint,
      };
    });

    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = correctCount >= Math.ceil(totalQuestions * 0.6); // 60% threshold

    let awardedXp = 0;
    let newLevel = 1;
    let totalXp = 0;
    const unlockedBadges = [];

    if (user && passed) {
      // Base XP is 50, minus 5 XP per hint, minimum 10 XP
      const baseXp = Math.max(10, 50 - Math.min(hintsUsed, 3) * 5);

      // Save activity completion in Supabase
      const { data: rpcData, error: rpcError } = await supabase.rpc("complete_activity", {
        activity: chapter.quizActivityKey,
        base_xp: baseXp,
      });

      if (!rpcError && rpcData) {
        awardedXp = rpcData.awarded ?? 0;
        totalXp = rpcData.xp ?? 0;
        newLevel = rpcData.level ?? 1;
      }

      // Record lesson progress if lesson_progress table exists
      try {
        await supabase.from("activity_progress").upsert({
          user_id: user.id,
          activity_key: chapter.quizActivityKey,
          completed: true,
          completed_at: new Date().toISOString(),
          xp_earned: awardedXp,
          hints_used: hintsUsed,
        }, { onConflict: "user_id,activity_key" });
      } catch (err) {
        console.warn("Could not upsert activity_progress:", err);
      }

      // Award chapter badge
      const chapterBadgeAward = await awardBadge(supabase, user.id, chapter.badge.id);
      if (chapterBadgeAward.awarded && chapterBadgeAward.badge) {
        unlockedBadges.push(chapterBadgeAward.badge);
      }

      // Check Perfectionist badge (100% score, 0 hints used)
      if (scorePercentage === 100 && hintsUsed === 0) {
        const perfBadge = await awardBadge(supabase, user.id, "perfectionist");
        if (perfBadge.awarded && perfBadge.badge) {
          unlockedBadges.push(perfBadge.badge);
        }
      }

      // Check streak: update streak on completion
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("streak, updated_at")
          .eq("user_id", user.id)
          .maybeSingle();

        const currentStreak = profile?.streak ?? 0;
        const newStreak = currentStreak === 0 ? 1 : currentStreak;

        // If streak >= 3, award Streak Master badge
        if (newStreak >= 3) {
          const streakBadge = await awardBadge(supabase, user.id, "streak-master");
          if (streakBadge.awarded && streakBadge.badge) {
            unlockedBadges.push(streakBadge.badge);
          }
        }
      } catch (err) {
        console.warn("Streak update check error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      passed,
      correctCount,
      totalQuestions,
      scorePercentage,
      awardedXp,
      totalXp,
      newLevel,
      unlockedBadges,
      questionResults,
      nextChapterSlug: chapter.nextSlug,
    });
  } catch (error) {
    console.error("api/quiz/submit error:", error);
    return NextResponse.json({ error: "Failed to evaluate quiz" }, { status: 500 });
  }
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "../../theme-toggle";
import { getChapterBySlug, getQuizForChapter, QuizQuestion, BadgeInfo } from "@/lib/curriculum";

export default function ChapterQuizPage() {
  const params = useParams();
  const pathname = usePathname();
  const pathSlug = pathname?.split("/").filter(Boolean).pop();
  const paramSlug = Array.isArray(params?.chapter) ? params.chapter[0] : params?.chapter;
  const rawSlug = paramSlug || pathSlug;
  const router = useRouter();

  const chapter = rawSlug ? getChapterBySlug(rawSlug) : null;
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [credits, setCredits] = useState(100);
  const [showHint, setShowHint] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeInfo[]>([]);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    if (!chapter) return;

    async function initQuiz() {
      const supabase = createClient();
      const [{ data: profile }, { data: challenge }, { data: quizProgress }] = await Promise.all([
        supabase.from("profiles").select("credits, learner_level, xp").maybeSingle(),
        supabase
          .from("activity_progress")
          .select("completed")
          .eq("activity_key", chapter!.challenge.activityKey)
          .maybeSingle(),
        supabase
          .from("activity_progress")
          .select("completed, hints_used, xp_earned")
          .eq("activity_key", chapter!.quizActivityKey)
          .maybeSingle(),
      ]);

      const isChallengeDone = Boolean(challenge?.completed);
      setChallengeCompleted(isChallengeDone);
      setCredits(profile?.credits ?? 100);

      // Load adaptive questions
      const quizData = getQuizForChapter(chapter!.slug, profile?.learner_level);
      if (quizData && quizData.questions.length > 0) {
        setQuestions(quizData.questions);
      }

      if (quizProgress?.completed) {
        setIsQuizCompleted(true);
        setEarnedXp(quizProgress.xp_earned ?? 50);
        setHintsUsed(quizProgress.hints_used ?? 0);
      }
    }

    void initQuiz();
  }, [chapter]);

  if (!chapter) {
    notFound();
  }

  if (questions.length === 0) {
    return (
      <main className="quiz-page">
        <div className="page-frame text-center py-16">
          <p className="body-muted">Loading quest checkpoint...</p>
        </div>
      </main>
    );
  }

  const safeIndex = Math.min(currentIndex, questions.length - 1);
  const currentQuestion = questions[safeIndex];
  const isLastQuestion = safeIndex === questions.length - 1;
  const isCurrentCorrect = selectedAnswer === currentQuestion?.answer;

  async function handleSelectAnswer(option: string) {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  }

  async function handleConfirmAnswer() {
    if (!selectedAnswer || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentQuestion.answer;
    const nextAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(nextAnswers);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setResultMessage("Correct! Excellent job.");
    } else {
      setResultMessage(`Not quite. The correct answer was: "${currentQuestion.answer}"`);
    }

    // If it's the final question, submit complete quiz
    if (isLastQuestion) {
      await submitFullQuiz(nextAnswers, isCorrect ? correctCount + 1 : correctCount);
    }
  }

  async function handleNextQuestion() {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setResultMessage(null);
    setCurrentIndex((prev) => prev + 1);
  }

  async function submitFullQuiz(allAnswers: string[], finalCorrect: number) {
    setSubmittingQuiz(true);
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterSlug: chapter!.slug,
          userAnswers: allAnswers,
          hintsUsed,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsQuizCompleted(true);
        setEarnedXp(data.awardedXp);
        if (data.unlockedBadges) {
          setUnlockedBadges(data.unlockedBadges);
        }
      } else {
        // Fallback to client RPC if needed
        const supabase = createClient();
        const { data: rpcData } = await supabase.rpc("complete_activity", {
          activity: chapter!.quizActivityKey,
          base_xp: Math.max(10, 50 - hintsUsed * 5),
        });
        setIsQuizCompleted(true);
        setEarnedXp(rpcData?.awarded ?? 50);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setIsQuizCompleted(true);
      setEarnedXp(Math.max(10, 50 - hintsUsed * 5));
    } finally {
      setSubmittingQuiz(false);
    }
  }

  async function handleRequestHint() {
    if (hintsUsed >= 3 || credits < 1 || showHint) return;
    try {
      const supabase = createClient();
      const { data } = await supabase.rpc("use_activity_hint", {
        activity: chapter!.quizActivityKey,
      });
      if (data) {
        setCredits(data.credits);
        setHintsUsed(data.hints_used);
      } else {
        setCredits((c) => Math.max(0, c - 1));
        setHintsUsed((h) => h + 1);
      }
      setShowHint(true);
    } catch {
      setCredits((c) => Math.max(0, c - 1));
      setHintsUsed((h) => h + 1);
      setShowHint(true);
    }
  }

  return (
    <main className="quiz-page">
      <div className="page-frame">
        <header className="quiz-header">
          <Link href={`/lesson/${chapter.slug}`} className="link-primary flex items-center gap-1.5 font-bold">
            ← Back to lesson
          </Link>
          <div className="flex items-center gap-3">
            <span className="dashboard-pill dashboard-pill-credits">◈ {credits} credits</span>
            <ThemeToggle />
          </div>
        </header>

        {challengeCompleted === false && !isQuizCompleted && (
          <div className="surface max-w-2xl mx-auto mt-6 p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm flex items-center justify-between gap-4">
            <div>
              <strong>Challenge incomplete:</strong> You haven&apos;t completed this chapter&apos;s code challenge yet.
            </div>
            <Link href={`/lesson/${chapter.slug}`} className="quest-button px-3 py-1.5 text-xs font-bold whitespace-nowrap">
              Open Challenge
            </Link>
          </div>
        )}

        <section className="surface quiz-card mt-8">
          {!isQuizCompleted ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="eyebrow">{chapter.title.toUpperCase()} · CHECKPOINT</p>
                <span className="body-muted text-xs font-bold">
                  Question {currentIndex + 1} of {questions.length} · {correctCount} correct
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                {currentQuestion.prompt}
              </h1>

              <div className="mt-8 space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  let optionClass = "quiz-answer";
                  if (isSelected) optionClass += " quiz-answer-selected";
                  if (isAnswerSubmitted) {
                    if (option === currentQuestion.answer) {
                      optionClass += " border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                    } else if (isSelected && !isCurrentCorrect) {
                      optionClass += " border-rose-400 bg-rose-50 text-rose-950 line-through";
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => void handleSelectAnswer(option)}
                      className={optionClass}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="progress-track mt-6">
                <div
                  className="progress-fill transition-all duration-300"
                  style={{
                    width: `${((currentIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Quiz controls and hints */}
              <div className="quiz-meta mt-5">
                <span>
                  {credits} credits · Potential reward: {Math.max(10, 50 - hintsUsed * 5)} XP
                </span>
                <button
                  type="button"
                  className="link-primary text-xs font-bold"
                  onClick={() => void handleRequestHint()}
                  disabled={hintsUsed >= 3 || credits < 1 || showHint || isAnswerSubmitted}
                >
                  {showHint ? "Hint revealed" : "Use hint (-1 credit)"}
                </button>
              </div>

              {showHint && (
                <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3 text-sm font-medium text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60">
                  💡 <strong>Hint:</strong> {currentQuestion.hint}
                </div>
              )}

              {resultMessage && (
                <div
                  className={`mt-5 rounded-xl p-4 font-bold ${
                    isCurrentCorrect
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                  role="status"
                >
                  {resultMessage}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-4">
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    disabled={!selectedAnswer}
                    onClick={() => void handleConfirmAnswer()}
                    className="quest-button w-full sm:w-auto px-6 py-3 font-extrabold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                ) : !isLastQuestion ? (
                  <button
                    type="button"
                    onClick={() => void handleNextQuestion()}
                    className="quest-button px-6 py-3 font-extrabold"
                  >
                    Next Question →
                  </button>
                ) : (
                  <div className="text-sm font-bold body-muted">
                    {submittingQuiz ? "Finalizing score..." : "Checkpoint Completed!"}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Celebration & Results Card */
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <p className="eyebrow">QUEST CHECKPOINT COMPLETE</p>
              <h2 className="text-3xl font-black mt-2">
                Great job completing {chapter.title}!
              </h2>
              <p className="body-muted mt-2">
                You scored {correctCount} out of {questions.length} correct.
              </p>

              <div className="my-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="surface p-4 rounded-xl border border-surface-border">
                  <div className="text-2xl font-black text-amber-500">⭐ +{earnedXp ?? 50}</div>
                  <div className="text-xs body-muted font-bold mt-1">XP Earned</div>
                </div>
                <div className="surface p-4 rounded-xl border border-surface-border">
                  <div className="text-2xl font-black text-emerald-500">
                    {Math.round((correctCount / questions.length) * 100)}%
                  </div>
                  <div className="text-xs body-muted font-bold mt-1">Accuracy</div>
                </div>
              </div>

              {/* Unlocked Badges */}
              {(unlockedBadges.length > 0 || chapter.badge) && (
                <div className="my-6 p-4 rounded-2xl bg-surface-subtle border border-surface-border max-w-md mx-auto text-left">
                  <p className="eyebrow text-center mb-3">BADGE UNLOCKED</p>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{chapter.badge.icon}</span>
                    <div>
                      <h4 className="font-black text-lg">{chapter.badge.name}</h4>
                      <p className="text-xs body-muted">{chapter.badge.description}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {chapter.nextSlug ? (
                  <Link
                    href={`/lesson/${chapter.nextSlug}`}
                    className="quest-button inline-flex items-center gap-2 px-8 py-3.5 text-base font-extrabold shadow-md"
                  >
                    Continue to Next Chapter →
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="quest-button inline-flex items-center gap-2 px-8 py-3.5 text-base font-extrabold shadow-md"
                  >
                    Finish Curriculum & View Dashboard
                  </Link>
                )}
                <Link href="/dashboard" className="secondary-button px-5 py-3 font-bold text-sm">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

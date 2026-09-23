"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PythonExercise } from "../python-exercise";
import { ThemeToggle } from "../../theme-toggle";
import { getChapterBySlug } from "@/lib/curriculum";

export default function ChapterLessonPage() {
  const params = useParams();
  const pathname = usePathname();
  const pathSlug = pathname?.split("/").filter(Boolean).pop();
  const paramSlug = Array.isArray(params?.chapter) ? params.chapter[0] : params?.chapter;
  const rawSlug = paramSlug || pathSlug;
  const chapter = rawSlug ? getChapterBySlug(rawSlug) : null;
  const prevChapter = chapter?.prevSlug ? getChapterBySlug(chapter.prevSlug) : null;
  const [complete, setComplete] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [prevChapterTitle, setPrevChapterTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!chapter) return;

    async function checkCompletion() {
      try {
        const supabase = createClient();

        // Check if previous chapter is completed
        if (chapter && chapter.order > 1 && prevChapter) {
          const { data: prevProgress } = await supabase
            .from("activity_progress")
            .select("activity_key, completed")
            .in("activity_key", [
              prevChapter.challenge.activityKey,
              prevChapter.quizActivityKey,
              ...(prevChapter.order === 1 ? ["variables-quiz", "variables-quiz-v2"] : []),
            ]);

          const prevCompletedKeys = new Set(
            prevProgress?.filter((a) => a.completed).map((a) => a.activity_key) ?? []
          );

          const prevChallengeDone = prevCompletedKeys.has(prevChapter.challenge.activityKey);
          const prevQuizDone =
            prevCompletedKeys.has(prevChapter.quizActivityKey) ||
            (prevChapter.order === 1 &&
              (prevCompletedKeys.has("variables-quiz") || prevCompletedKeys.has("variables-quiz-v2")));

          if (!prevChallengeDone || !prevQuizDone) {
            setIsLocked(true);
            setPrevChapterTitle(prevChapter.title);
          }
        }

        const { data } = await supabase
          .from("activity_progress")
          .select("completed")
          .eq("activity_key", chapter!.challenge.activityKey)
          .maybeSingle();

        setComplete(Boolean(data?.completed));
      } catch (err) {
        console.warn("Could not check challenge completion:", err);
      }
    }

    void checkCompletion();
  }, [chapter, prevChapter]);

  if (!chapter) {
    notFound();
  }

  const quizUrl = `/quiz/${chapter.slug}`;

  if (isLocked && prevChapter) {
    return (
      <main className="lesson-page">
        <div className="page-frame">
          <header className="lesson-header">
            <Link href="/dashboard" className="link-primary flex items-center gap-1.5 font-bold">
              ← Dashboard
            </Link>
            <ThemeToggle />
          </header>
          <div className="surface max-w-xl mx-auto mt-16 p-8 rounded-2xl border border-surface-border text-center space-y-4">
            <span className="text-4xl" role="img" aria-label="locked">🔒</span>
            <p className="eyebrow">QUEST LOCKED</p>
            <h1 className="text-2xl font-black">Chapter {chapter.order} is Locked</h1>
            <p className="body-muted text-sm leading-6">
              You haven&apos;t completed <strong>Chapter {chapter.order - 1}: {prevChapterTitle}</strong> yet. Complete both the coding challenge and checkpoint quiz to unlock this quest!
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link href={`/lesson/${chapter.prevSlug}`} className="quest-button px-6 py-3 font-bold text-sm">
                Go to Chapter {chapter.order - 1} →
              </Link>
              <Link href="/dashboard" className="secondary-button px-6 py-3 font-bold text-sm">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="lesson-page">
      <div className="page-frame">
        <header className="lesson-header">
          <Link href="/dashboard" className="link-primary flex items-center gap-1.5 font-bold">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Quest {String(chapter.order).padStart(2, "0")} of 10
            </span>
            <ThemeToggle />
          </div>
        </header>

        <article className="lesson-content">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-4">
            <p className="eyebrow">
              QUEST {String(chapter.order).padStart(2, "0")} · {chapter.title.toUpperCase()}
            </p>
            <div className="flex items-center gap-2">
              <span className="dashboard-pill dashboard-pill-xp">⭐ 50 XP</span>
              <span className="dashboard-pill dashboard-pill-credits">
                {chapter.badge.icon} {chapter.badge.name}
              </span>
            </div>
          </div>

          <h1 className="lesson-title">{chapter.title}</h1>
          <p className="lesson-lede">{chapter.overview}</p>

          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-black tracking-tight">Core Concepts</h2>
            {chapter.concepts.map((concept, index) => (
              <article key={concept.name} className="lesson-topic">
                <div className="flex items-start gap-3">
                  <span className="lesson-topic-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-black">{concept.name}</h3>
                    <p className="mt-2 text-sm leading-6">{concept.explanation}</p>
                  </div>
                </div>

                <div className="code-preview mt-4">
                  <div className="code-preview-bar">
                    <span>example_{String(index + 1).padStart(2, "0")}.py</span>
                    <span className="text-xs text-muted">Python</span>
                  </div>
                  <pre className="p-4 text-sm leading-6 text-emerald-300">
                    <code>{concept.example}</code>
                  </pre>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="lesson-practice rounded-lg">
                    <strong>Try it:</strong> {concept.practice}
                  </div>
                  <div className="lesson-mistake rounded-lg">
                    <strong>Watch for:</strong> {concept.mistake}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <PythonExercise
              activityKey={chapter.challenge.activityKey}
              title={chapter.challenge.title}
              prompt={chapter.challenge.prompt}
              initialCode={chapter.challenge.starterCode}
              solutionPattern={chapter.challenge.solutionPattern}
              hintsList={chapter.challenge.hints}
              onComplete={() => setComplete(true)}
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-surface-border pt-6">
            {chapter.prevSlug ? (
              <Link href={`/lesson/${chapter.prevSlug}`} className="secondary-button px-5 py-3 font-bold text-sm">
                ← Previous Chapter
              </Link>
            ) : (
              <Link href="/dashboard" className="secondary-button px-5 py-3 font-bold text-sm">
                ← Dashboard
              </Link>
            )}

            <div className="flex items-center gap-3">
              <Link
                href={complete ? quizUrl : "#"}
                aria-disabled={!complete}
                className={`quest-button inline-flex items-center gap-2 px-6 py-3 font-extrabold ${
                  complete ? "" : "cursor-not-allowed opacity-50 pointer-events-none"
                }`}
              >
                {complete ? "Take Checkpoint Quiz →" : "Complete Challenge to Unlock Quiz"}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

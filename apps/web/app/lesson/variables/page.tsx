"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PythonExercise } from "../python-exercise";
import { ThemeToggle } from "../../theme-toggle";
import { getChapterBySlug } from "@/lib/curriculum";

export default function VariablesLessonPage() {
  const chapter = getChapterBySlug("variables")!;
  const [challengeComplete, setChallengeComplete] = useState(false);

  useEffect(() => {
    async function loadChallenge() {
      const { data } = await createClient()
        .from("activity_progress")
        .select("completed")
        .eq("activity_key", chapter.challenge.activityKey)
        .maybeSingle();
      setChallengeComplete(Boolean(data?.completed));
    }
    void loadChallenge();
  }, [chapter.challenge.activityKey]);

  return (
    <main className="lesson-page">
      <div className="page-frame">
        <header className="lesson-header">
          <Link href="/dashboard" className="link-primary flex items-center gap-1.5 font-bold">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Quest 01 of 10
            </span>
            <ThemeToggle />
          </div>
        </header>

        <article className="lesson-content">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-4">
            <p className="eyebrow">QUEST 01 · {chapter.title.toUpperCase()}</p>
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
              onComplete={() => setChallengeComplete(true)}
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-surface-border pt-6">
            <Link href="/dashboard" className="secondary-button px-5 py-3 font-bold text-sm">
              ← Dashboard
            </Link>
            <Link
              href={challengeComplete ? "/quiz/variables" : "#"}
              aria-disabled={!challengeComplete}
              className={`quest-button inline-flex items-center gap-2 px-6 py-3 font-extrabold ${
                challengeComplete ? "" : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              {challengeComplete ? "Take Checkpoint Quiz →" : "Complete Challenge to Unlock Quiz"}
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

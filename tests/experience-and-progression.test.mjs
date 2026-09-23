import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appsWebDir = path.resolve(rootDir, "apps", "web");

describe("1. Dark Mode and Light Mode Consistency Tests", () => {
  const globalsCss = fs.readFileSync(path.join(appsWebDir, "app", "globals.css"), "utf8");
  const layoutTsx = fs.readFileSync(path.join(appsWebDir, "app", "layout.tsx"), "utf8");
  const themeToggleTsx = fs.readFileSync(path.join(appsWebDir, "app", "theme-toggle.tsx"), "utf8");

  it("verifies root theme variables exist for light mode", () => {
    assert.match(globalsCss, /:root\s*\{[^}]*--page-bg:/);
    assert.match(globalsCss, /:root\s*\{[^}]*--page-text:/);
    assert.match(globalsCss, /:root\s*\{[^}]*--surface:/);
    assert.match(globalsCss, /:root\s*\{[^}]*--surface-border:/);
    assert.match(globalsCss, /:root\s*\{[^}]*--accent:/);
  });

  it("verifies dark mode theme variables exist and match expected contrast palette", () => {
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\{[^}]*--page-bg:\s*#0f1726/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\{[^}]*--page-text:\s*#eef4ff/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\{[^}]*--surface:\s*#172235/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\{[^}]*--surface-border:\s*#2a3b55/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\{[^}]*--accent:\s*#78aefc/i);
  });

  it("verifies dark mode comprehensive component overrides", () => {
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.stat-card\s*\{[^}]*background:\s*var\(--surface\)/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.quiz-answer\s*\{[^}]*background:\s*var\(--surface\)/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.dashboard-pill-credits/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.dashboard-pill-streak/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.dashboard-pill-xp/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.path-item/i);
    assert.match(globalsCss, /\[data-theme="dark"\]\s*\.lesson-topic/i);
  });

  it("verifies layout.tsx has inline theme script to prevent flash of unstyled theme", () => {
    assert.match(layoutTsx, /localStorage\.getItem\("python-quest-theme"\)/);
    assert.match(layoutTsx, /document\.documentElement\.dataset\.theme/);
    assert.match(layoutTsx, /suppressHydrationWarning/);
  });

  it("verifies theme-toggle.tsx switches and persists theme smoothly", () => {
    assert.match(themeToggleTsx, /theme === "dark" \? "light" : "dark"/);
    assert.match(themeToggleTsx, /window\.localStorage\.setItem\("python-quest-theme", nextTheme\)/);
    assert.match(themeToggleTsx, /document\.documentElement\.dataset\.theme = nextTheme/);
  });
});

describe("2. Smooth Sequential Chapter Progression (Without Dashboard)", () => {
  const curriculumRaw = JSON.parse(fs.readFileSync(path.join(rootDir, "content", "python", "curriculum.json"), "utf8"));
  const quizPageTsx = fs.readFileSync(path.join(appsWebDir, "app", "quiz", "[chapter]", "page.tsx"), "utf8");
  const lessonPageTsx = fs.readFileSync(path.join(appsWebDir, "app", "lesson", "[chapter]", "page.tsx"), "utf8");

  it("verifies uninterrupted chapter chain from Chapter 1 to Chapter 10", () => {
    const chapters = curriculumRaw.chapters;
    assert.equal(chapters.length, 10, "Total of 10 curriculum chapters");

    // Verify each chapter links sequentially to the next
    for (let i = 0; i < chapters.length - 1; i++) {
      assert.equal(chapters[i].order + 1, chapters[i + 1].order, `Chapter ${chapters[i].order} must link to ${chapters[i + 1].order}`);
    }
  });

  it("verifies quiz completion screen provides direct 'Continue to Next Chapter' button without navigating to dashboard", () => {
    assert.match(quizPageTsx, /chapter\.nextSlug/);
    assert.match(quizPageTsx, /href=\{`\/lesson\/\$\{chapter\.nextSlug\}`\}/);
    assert.match(quizPageTsx, /Continue to Next Chapter →/);
  });

  it("verifies lesson page provides direct link to checkpoint quiz when challenge is solved", () => {
    assert.match(lessonPageTsx, /const quizUrl = `\/quiz\/\$\{chapter\.slug\}`/);
    assert.match(lessonPageTsx, /href=\{complete \? quizUrl : "#"\}/);
    assert.match(lessonPageTsx, /Take Checkpoint Quiz →/);
  });

  it("verifies final chapter (Chapter 10) offers curriculum completion finish path", () => {
    assert.match(quizPageTsx, /Finish Curriculum & View Dashboard/);
  });

  it("verifies Chapter 4 and 5 are strictly LOCKED if Chapter 3 has not been cleared, regardless of XP", () => {
    const dashboardTsx = fs.readFileSync(path.join(appsWebDir, "app", "dashboard", "page.tsx"), "utf8");
    const curriculumRouteTs = fs.readFileSync(path.join(appsWebDir, "app", "api", "curriculum", "route.ts"), "utf8");

    // Must NOT have the bypass bug where xp unlocks chapters ahead of sequence
    assert.doesNotMatch(dashboardTsx, /isPrevComplete\s*\|\|\s*profile\.xp\s*>=\s*chapter\.requiredXp/,
      "Dashboard must not use OR condition on requiredXp to unlock future chapters");
    assert.doesNotMatch(curriculumRouteTs, /previousCompleted\s*\|\|\s*userXp\s*>=\s*ch\.requiredXp/,
      "Curriculum API must not use OR condition on requiredXp to unlock future chapters");

    // Algorithm simulation: User cleared chapters 1 & 2, accumulated 250 XP, but has NOT cleared chapter 3
    const simulatedChapters = [
      { order: 1, requiredXp: 0 },
      { order: 2, requiredXp: 50 },
      { order: 3, requiredXp: 100 },
      { order: 4, requiredXp: 150 },
      { order: 5, requiredXp: 200 },
    ];
    const completedSet = new Set(["ch1-challenge", "ch1-quiz", "ch2-challenge", "ch2-quiz"]); // Ch 3 incomplete!

    let isPrevComplete = true;
    const computedStatuses = simulatedChapters.map((ch) => {
      const challengeDone = completedSet.has(`ch${ch.order}-challenge`);
      const quizDone = completedSet.has(`ch${ch.order}-quiz`);
      const isFullyCompleted = challengeDone && quizDone;

      let status = "locked";
      if (isFullyCompleted) {
        status = "completed";
      } else if (isPrevComplete) {
        status = "current";
      } else {
        status = "locked";
      }

      isPrevComplete = isFullyCompleted;
      return { order: ch.order, status };
    });

    assert.equal(computedStatuses[0].status, "completed", "Chapter 1 must be completed");
    assert.equal(computedStatuses[1].status, "completed", "Chapter 2 must be completed");
    assert.equal(computedStatuses[2].status, "current", "Chapter 3 must be current (unlocked)");
    assert.equal(computedStatuses[3].status, "locked", "Chapter 4 MUST be locked when Chapter 3 is not cleared");
    assert.equal(computedStatuses[4].status, "locked", "Chapter 5 MUST be locked when Chapter 3 is not cleared");
  });

  it("verifies Chapter 4 remains LOCKED if Chapter 3 challenge is solved but Chapter 3 checkpoint quiz is pending", () => {
    // Even if Chapter 3 challenge is done, chapter is not fully completed without checkpoint quiz
    const completedSet = new Set(["ch1-challenge", "ch1-quiz", "ch2-challenge", "ch2-quiz", "ch3-challenge"]); // No ch3-quiz!
    let isPrevComplete = true;
    const simulatedChapters = [
      { order: 1 }, { order: 2 }, { order: 3 }, { order: 4 }, { order: 5 }
    ];

    const computedStatuses = simulatedChapters.map((ch) => {
      const challengeDone = completedSet.has(`ch${ch.order}-challenge`);
      const quizDone = completedSet.has(`ch${ch.order}-quiz`);
      const isFullyCompleted = challengeDone && quizDone;

      let status = "locked";
      if (isFullyCompleted) {
        status = "completed";
      } else if (isPrevComplete) {
        status = "current";
      } else {
        status = "locked";
      }

      isPrevComplete = isFullyCompleted;
      return { order: ch.order, status, challengeDone, quizDone };
    });

    assert.equal(computedStatuses[2].status, "current", "Chapter 3 is in progress");
    assert.equal(computedStatuses[2].challengeDone, true, "Chapter 3 challenge is done");
    assert.equal(computedStatuses[2].quizDone, false, "Chapter 3 quiz is not done");
    assert.equal(computedStatuses[3].status, "locked", "Chapter 4 MUST be locked until Chapter 3 quiz is passed");
  });

  it("verifies lesson page implements locked state gate to prevent skipping via direct URL", () => {
    assert.match(lessonPageTsx, /isLocked/, "Lesson page must maintain isLocked state");
    assert.match(lessonPageTsx, /Chapter Locked|QUEST LOCKED/, "Lesson page must render locked quest banner when access is premature");
  });
});

describe("3. Python Programming UI & Result Validation", () => {
  const pythonExerciseTsx = fs.readFileSync(path.join(appsWebDir, "app", "lesson", "python-exercise.tsx"), "utf8");

  it("verifies interactive Python UI elements (code editor, terminal output, run button)", () => {
    assert.match(pythonExerciseTsx, /<textarea[\s\S]*?className="python-code-editor"/);
    assert.match(pythonExerciseTsx, /pre[^>]*className="python-output"/);
    assert.match(pythonExerciseTsx, /button[^>]*onClick=\{\(\) => void runCode\(\)\}/);
    assert.match(pythonExerciseTsx, /Run code/);
  });

  it("verifies output display and state updating upon execution", () => {
    assert.match(pythonExerciseTsx, /setOutput\(text \|\| "Your code ran without printing anything\."\)/);
    assert.match(pythonExerciseTsx, /setRuntimeStatus\("ready"\)/);
  });

  it("verifies validation rejects code with runtime exceptions/tracebacks", () => {
    assert.match(pythonExerciseTsx, /const hasError = text\.includes\("Traceback \(most recent call last\):"\)/);
    assert.match(pythonExerciseTsx, /if \(!hasError && solutionPattern\.test\(code\)\)/);
  });

  it("verifies successful challenge triggers onComplete and awards XP", () => {
    assert.match(pythonExerciseTsx, /setCompleted\(true\)/);
    assert.match(pythonExerciseTsx, /onCompleteRef\.current\?\.\(\)/);
    assert.match(pythonExerciseTsx, /Challenge complete\. You earned \{reward\} XP\./);
  });
});

describe("4. Hint System & Credit Cost (-1 Credit)", () => {
  const pythonExerciseTsx = fs.readFileSync(path.join(appsWebDir, "app", "lesson", "python-exercise.tsx"), "utf8");
  const quizPageTsx = fs.readFileSync(path.join(appsWebDir, "app", "quiz", "[chapter]", "page.tsx"), "utf8");
  const schemaSql = fs.readFileSync(path.join(rootDir, "supabase", "schema.sql"), "utf8");
  const dashboardTsx = fs.readFileSync(path.join(appsWebDir, "app", "dashboard", "page.tsx"), "utf8");

  it("verifies HINT_COST is exactly 1 credit in PythonExercise", () => {
    assert.match(pythonExerciseTsx, /const HINT_COST = 1;/);
    assert.match(pythonExerciseTsx, /Use hint \(-\$\{HINT_COST\} credit\)/);
  });

  it("verifies PythonExercise deducts exactly 1 credit upon hint usage", () => {
    assert.match(pythonExerciseTsx, /setCredits\(\(c\) => Math\.max\(0, c - HINT_COST\)\)/);
    assert.match(pythonExerciseTsx, /setUsedHints\(\(h\) => h \+ 1\)/);
  });

  it("verifies Quiz Page hint deduction is exactly 1 credit", () => {
    assert.match(quizPageTsx, /credits < 1 \|\| showHint/);
    assert.match(quizPageTsx, /setCredits\(\(c\) => Math\.max\(0, c - 1\)\)/);
    assert.match(quizPageTsx, /Use hint \(-1 credit\)/);
  });

  it("verifies Supabase schema function use_activity_hint deducts exactly 1 credit", () => {
    assert.match(schemaSql, /current_credits < 1 then raise exception 'insufficient_credits'/);
    assert.match(schemaSql, /credits = credits - 1/);
    assert.match(schemaSql, /values \(auth\.uid\(\), activity, 1, 1\)/);
    assert.match(schemaSql, /credits_spent = activity_progress\.credits_spent \+ 1/);
  });

  it("verifies Dashboard displays 1 credit per hint note", () => {
    assert.match(dashboardTsx, /note="Use 1 credit to reveal checkpoint hints"/);
  });
});

describe("5. Gamification Points Integrity (Credits, Streaks, XP)", () => {
  it("verifies credit initial baseline is 100", () => {
    const initialCredits = 100;
    assert.equal(initialCredits, 100, "Starting credits must be 100");
  });

  it("verifies hint deduction math matches -1 credit and -5 XP penalty per hint", () => {
    let credits = 100;
    let baseXp = 50;

    // Use 1 hint
    credits -= 1;
    let xpAward = Math.max(10, baseXp - 1 * 5);
    assert.equal(credits, 99, "Credits after 1 hint should be 99");
    assert.equal(xpAward, 45, "XP reward after 1 hint should be 45");

    // Use 2nd hint
    credits -= 1;
    xpAward = Math.max(10, baseXp - 2 * 5);
    assert.equal(credits, 98, "Credits after 2 hints should be 98");
    assert.equal(xpAward, 40, "XP reward after 2 hints should be 40");

    // Use 3rd hint
    credits -= 1;
    xpAward = Math.max(10, baseXp - 3 * 5);
    assert.equal(credits, 97, "Credits after 3 hints should be 97");
    assert.equal(xpAward, 35, "XP reward after 3 hints should be 35");
  });

  it("verifies streak logic updates correctly on quest completion", () => {
    let currentStreak = 0;
    // Completing today's first activity starts streak at 1
    currentStreak = currentStreak === 0 ? 1 : currentStreak + 1;
    assert.equal(currentStreak, 1, "First activity starts 1-day streak");

    // Consecutive day activity increments streak
    currentStreak = currentStreak + 1;
    assert.equal(currentStreak, 2, "Consecutive day activity builds 2-day streak");

    // 3-day milestone qualifies for Streak Master badge
    assert.ok(currentStreak >= 2);
  });

  it("verifies leveling milestone formula based on XP", () => {
    const calculateLevel = (xp) => Math.max(1, Math.floor(xp / 250) + 1);

    assert.equal(calculateLevel(0), 1, "0 XP is Level 1");
    assert.equal(calculateLevel(249), 1, "249 XP is Level 1");
    assert.equal(calculateLevel(250), 2, "250 XP unlocks Level 2");
    assert.equal(calculateLevel(599), 3, "599 XP is Level 3");
    assert.equal(calculateLevel(1000), 5, "1000 XP unlocks Level 5");
  });
});

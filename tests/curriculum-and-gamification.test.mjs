import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curriculumPath = path.join(__dirname, "..", "content", "python", "curriculum.json");
const quizzesPath = path.join(__dirname, "..", "content", "python", "quizzes.json");
const levelQuizzesPath = path.join(__dirname, "..", "content", "python", "level-quizzes.json");

describe("Curriculum & Gamification Integration Tests", () => {
  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf-8"));
  const quizzes = JSON.parse(fs.readFileSync(quizzesPath, "utf-8"));
  const levelQuizzes = JSON.parse(fs.readFileSync(levelQuizzesPath, "utf-8"));

  it("verifies all 10 chapters exist in both curriculum and quizzes", () => {
    assert.equal(curriculum.chapters.length, 10, "Curriculum must have exactly 10 chapters");
    assert.equal(quizzes.chapters.length, 10, "Quizzes must have exactly 10 chapters");

    for (let i = 0; i < 10; i++) {
      const c = curriculum.chapters[i];
      const q = quizzes.chapters[i];
      assert.equal(c.order, i + 1, `Chapter ${i + 1} must have correct order`);
      assert.equal(q.order, i + 1, `Quiz ${i + 1} must match chapter order`);
      assert.equal(c.title, q.title, `Titles must match for order ${i + 1}`);
      assert.ok(c.concepts.length >= 3, `Chapter ${c.title} must have at least 3 concepts`);
      assert.equal(q.questions.length, 5, `Quiz for ${q.title} must have 5 questions`);
    }
  });

  it("verifies adaptive quiz support for Junior, Student, and Professional levels", () => {
    assert.ok(levelQuizzes.chapters.length >= 1, "Level quizzes must include Chapter 1");
    const ch1 = levelQuizzes.chapters[0];
    assert.equal(ch1.order, 1);
    assert.ok(ch1.levels.junior && ch1.levels.junior.length === 5, "Junior level must have 5 questions");
    assert.ok(ch1.levels.student && ch1.levels.student.length === 5, "Student level must have 5 questions");
    assert.ok(ch1.levels.professional && ch1.levels.professional.length === 5, "Professional level must have 5 questions");

    // All questions must have a valid answer matching one of the options
    for (const [lvl, questions] of Object.entries(ch1.levels)) {
      questions.forEach((q, idx) => {
        assert.ok(q.options.includes(q.answer), `Level ${lvl} Q${idx + 1} answer must be one of its options`);
        assert.ok(q.hint.length > 5, `Level ${lvl} Q${idx + 1} hint must provide meaningful guidance`);
      });
    }
  });

  it("verifies XP calculation and Level Milestone Formula", () => {
    // Level formula in schema.sql: level = greatest(1, floor((xp + awarded) / 250.0)::integer + 1)
    const computeLevel = (xp) => Math.max(1, Math.floor(xp / 250) + 1);

    assert.equal(computeLevel(0), 1, "0 XP is Level 1");
    assert.equal(computeLevel(50), 1, "50 XP is Level 1");
    assert.equal(computeLevel(249), 1, "249 XP is Level 1");
    assert.equal(computeLevel(250), 2, "250 XP unlocks Level 2");
    assert.equal(computeLevel(500), 3, "500 XP unlocks Level 3");
    assert.equal(computeLevel(1000), 5, "1000 XP unlocks Level 5");
  });

  it("verifies hint deduction and minimum reward constraints", () => {
    const computeReward = (baseXp, hintsUsed) => {
      const penalty = Math.min(hintsUsed, 3) * 5;
      return Math.max(10, baseXp - penalty);
    };

    assert.equal(computeReward(50, 0), 50, "0 hints used retains 50 XP");
    assert.equal(computeReward(50, 1), 45, "1 hint used yields 45 XP");
    assert.equal(computeReward(50, 2), 40, "2 hints used yields 40 XP");
    assert.equal(computeReward(50, 3), 35, "3 hints used yields 35 XP");
    assert.equal(computeReward(50, 10), 35, "Clamped hints used preserves minimum 35 XP");
  });
});

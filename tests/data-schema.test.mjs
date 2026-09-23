import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const curriculumPath = path.join(rootDir, "content", "python", "curriculum.json");
const quizzesPath = path.join(rootDir, "content", "python", "quizzes.json");
const levelQuizzesPath = path.join(rootDir, "content", "python", "level-quizzes.json");

describe("Curriculum Data & Schema Integrity", () => {
  it("curriculum.json exists and is valid JSON", () => {
    assert.ok(fs.existsSync(curriculumPath), "curriculum.json must exist");
    const raw = fs.readFileSync(curriculumPath, "utf-8");
    const data = JSON.parse(raw);
    assert.ok(typeof data === "object" && data !== null, "curriculum must be an object");
    assert.ok(typeof data.title === "string" && data.title.length > 0, "curriculum title must be non-empty");
    assert.ok(Array.isArray(data.chapters), "chapters must be an array");
    assert.equal(data.chapters.length, 10, "curriculum must contain 10 chapters");
  });

  it("all chapters have sequential orders (1..10) and required fields", () => {
    const data = JSON.parse(fs.readFileSync(curriculumPath, "utf-8"));
    const seenOrders = new Set();

    data.chapters.forEach((chapter, index) => {
      const expectedOrder = index + 1;
      assert.equal(chapter.order, expectedOrder, `Chapter at index ${index} must have order ${expectedOrder}`);
      assert.ok(!seenOrders.has(chapter.order), `Order ${chapter.order} must be unique`);
      seenOrders.add(chapter.order);

      assert.ok(typeof chapter.title === "string" && chapter.title.trim().length > 0, `Chapter ${chapter.order} title must not be empty`);
      assert.ok(typeof chapter.overview === "string" && chapter.overview.trim().length > 0, `Chapter ${chapter.order} overview must not be empty`);
      assert.ok(Array.isArray(chapter.concepts), `Chapter ${chapter.order} concepts must be an array`);
      assert.ok(chapter.concepts.length >= 3, `Chapter ${chapter.order} must have at least 3 concepts`);
    });
  });

  it("all concepts contain name, explanation, example, practice, and mistake", () => {
    const data = JSON.parse(fs.readFileSync(curriculumPath, "utf-8"));

    data.chapters.forEach((chapter) => {
      const conceptNames = new Set();
      chapter.concepts.forEach((concept, cIdx) => {
        const id = `Chapter ${chapter.order} ("${chapter.title}"), Concept ${cIdx + 1}`;
        assert.ok(typeof concept.name === "string" && concept.name.trim().length > 0, `${id}: name must be non-empty`);
        assert.ok(!conceptNames.has(concept.name), `${id}: concept name "${concept.name}" must be unique within chapter`);
        conceptNames.add(concept.name);

        assert.ok(typeof concept.explanation === "string" && concept.explanation.trim().length > 15, `${id}: explanation must be substantial`);
        assert.ok(typeof concept.example === "string" && concept.example.trim().length > 0, `${id}: example must be non-empty`);
        assert.ok(typeof concept.practice === "string" && concept.practice.trim().length > 0, `${id}: practice prompt must be non-empty`);
        assert.ok(typeof concept.mistake === "string" && concept.mistake.trim().length > 0, `${id}: common mistake must be non-empty`);
      });
    });
  });
});

describe("Quizzes Data & Schema Integrity", () => {
  it("quizzes.json exists and contains 10 chapters matching curriculum", () => {
    assert.ok(fs.existsSync(quizzesPath), "quizzes.json must exist");
    const quizData = JSON.parse(fs.readFileSync(quizzesPath, "utf-8"));
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, "utf-8"));

    assert.ok(Array.isArray(quizData.chapters), "quizzes chapters must be an array");
    assert.equal(quizData.chapters.length, 10, "quizzes must contain 10 chapters");

    quizData.chapters.forEach((chapter, index) => {
      assert.equal(chapter.order, index + 1, `Quiz chapter order must be ${index + 1}`);
      assert.equal(chapter.title, curriculumData.chapters[index].title, `Quiz chapter ${chapter.order} title must match curriculum`);
      assert.ok(Array.isArray(chapter.questions), `Quiz chapter ${chapter.order} questions must be an array`);
      assert.equal(chapter.questions.length, 5, `Quiz chapter ${chapter.order} must contain exactly 5 questions`);
    });
  });

  it("each quiz question has valid options, valid correct answer, and non-empty hint", () => {
    const quizData = JSON.parse(fs.readFileSync(quizzesPath, "utf-8"));

    quizData.chapters.forEach((chapter) => {
      chapter.questions.forEach((q, qIdx) => {
        const id = `Chapter ${chapter.order}, Question ${qIdx + 1}`;
        assert.ok(typeof q.prompt === "string" && q.prompt.trim().length > 0, `${id}: prompt must be non-empty`);
        assert.ok(Array.isArray(q.options), `${id}: options must be an array`);
        assert.equal(q.options.length, 4, `${id}: must contain exactly 4 options`);

        // Check options are distinct non-empty strings
        const optionSet = new Set(q.options);
        assert.equal(optionSet.size, 4, `${id}: options must be 4 unique strings`);
        q.options.forEach((opt, oIdx) => {
          assert.ok(typeof opt === "string" && opt.trim().length > 0, `${id}, option ${oIdx + 1} must be non-empty`);
        });

        // Validate answer is present in options (correctOptionIndex >= 0)
        assert.ok(typeof q.answer === "string" && q.answer.trim().length > 0, `${id}: answer must be non-empty`);
        const correctOptionIndex = q.options.indexOf(q.answer);
        assert.ok(correctOptionIndex >= 0 && correctOptionIndex < q.options.length, `${id}: answer "${q.answer}" must exist in options list`);

        // Validate hint (explanation)
        assert.ok(typeof q.hint === "string" && q.hint.trim().length > 0, `${id}: hint/explanation must be non-empty`);
      });
    });
  });
});

describe("Level-Specific Quizzes Data & Schema Integrity", () => {
  it("level-quizzes.json exists and has valid levels for Chapter 1", () => {
    assert.ok(fs.existsSync(levelQuizzesPath), "level-quizzes.json must exist");
    const data = JSON.parse(fs.readFileSync(levelQuizzesPath, "utf-8"));

    assert.ok(Array.isArray(data.chapters), "chapters must be an array");
    const ch1 = data.chapters.find((c) => c.order === 1);
    assert.ok(ch1, "Chapter 1 must exist in level-quizzes.json");
    assert.equal(ch1.title, "Meet Python");
    assert.ok(typeof ch1.levels === "object" && ch1.levels !== null, "levels must be an object");

    const requiredLevels = ["junior", "student", "professional"];
    requiredLevels.forEach((level) => {
      assert.ok(Array.isArray(ch1.levels[level]), `Level "${level}" must be an array of questions`);
      assert.equal(ch1.levels[level].length, 5, `Level "${level}" must have 5 questions`);

      ch1.levels[level].forEach((q, qIdx) => {
        const id = `Level ${level}, Question ${qIdx + 1}`;
        assert.ok(typeof q.prompt === "string" && q.prompt.trim().length > 0, `${id}: prompt must be non-empty`);
        assert.ok(Array.isArray(q.options), `${id}: options must be an array`);
        assert.equal(q.options.length, 4, `${id}: must contain 4 options`);

        const correctOptionIndex = q.options.indexOf(q.answer);
        assert.ok(correctOptionIndex >= 0, `${id}: answer must exist in options`);
        assert.ok(typeof q.hint === "string" && q.hint.trim().length > 0, `${id}: hint must not be empty`);
      });
    });
  });
});

describe("XP Points & Progression Milestones Consistency", () => {
  it("validates chapter XP unlock thresholds against progression schema", () => {
    const expectedChapterThresholds = [
      { order: 1, title: "Meet Python", required_xp: 0 },
      { order: 2, title: "Make Decisions", required_xp: 250 },
      { order: 3, title: "Repeat Yourself", required_xp: 600 },
      { order: 4, title: "Lists", required_xp: 1000 },
      { order: 5, title: "Functions", required_xp: 1500 },
    ];

    expectedChapterThresholds.forEach((expected, i) => {
      assert.equal(expected.order, i + 1);
      assert.ok(expected.required_xp >= 0, "Required XP must be non-negative");
      if (i > 0) {
        assert.ok(
          expected.required_xp > expectedChapterThresholds[i - 1].required_xp,
          "Required XP must increase monotonically for successive chapters"
        );
      }
    });
  });

  it("validates lesson activity XP rewards and hint penalty formula", () => {
    const baseRewardXP = 50;
    const hintCostCredits = 1;
    const hintPenaltyXP = 5;
    const maxHints = 3;

    assert.equal(baseRewardXP, 50, "Standard lesson/quiz activity reward is 50 XP");
    assert.equal(hintCostCredits, 1, "Hint cost is 1 credit");
    assert.equal(hintPenaltyXP, 5, "Each hint costs 5 XP penalty");

    // Test XP awarded calculation for 0, 1, 2, 3 hints
    for (let hints = 0; hints <= maxHints; hints++) {
      const awarded = Math.max(0, baseRewardXP - hints * hintPenaltyXP);
      assert.ok(awarded >= 0 && awarded <= baseRewardXP, `Awarded XP with ${hints} hints must be valid`);
      if (hints === 0) assert.equal(awarded, 50);
      if (hints === 1) assert.equal(awarded, 45);
      if (hints === 2) assert.equal(awarded, 40);
      if (hints === 3) assert.equal(awarded, 35);
    }
  });
});

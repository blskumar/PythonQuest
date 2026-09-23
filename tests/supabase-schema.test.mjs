import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const schemaPath = path.join(rootDir, "supabase", "schema.sql");

describe("Supabase Database Schema & Model Validation", () => {
  it("schema.sql exists and contains valid SQL", () => {
    assert.ok(fs.existsSync(schemaPath), "supabase/schema.sql must exist");
    const sql = fs.readFileSync(schemaPath, "utf-8");
    assert.ok(sql.length > 500, "schema.sql must have content");
  });

  describe("Table Definitions in schema.sql", () => {
    const sql = fs.readFileSync(schemaPath, "utf-8");

    const requiredTables = [
      "public.profiles",
      "public.chapters",
      "public.lessons",
      "public.quiz_questions",
      "public.lesson_progress",
      "public.badges",
      "public.student_badges",
      "public.activity_progress",
    ];

    requiredTables.forEach((table) => {
      it(`defines table ${table}`, () => {
        const regex = new RegExp(`create table if not exists ${table.replace(".", "\\.")}\\s*\\(`, "i");
        assert.ok(regex.test(sql), `schema.sql must define ${table}`);
      });
    });

    it("verifies public.profiles schema structure and default constraints", () => {
      assert.match(sql, /id uuid primary key/i, "profiles must have uuid primary key");
      assert.match(sql, /user_id uuid not null unique references auth\.users/i, "profiles must reference auth.users");
      assert.match(sql, /display_name text not null/i, "display_name must be non-null");
      assert.match(sql, /learner_level text not null default 'Junior'/i, "learner_level default must be 'Junior'");
      assert.match(sql, /credits integer not null default 100/i, "credits default must be 100");
      assert.match(sql, /xp integer not null default 0/i, "xp default must be 0");
      assert.match(sql, /level integer not null default 1/i, "level default must be 1");
      assert.match(sql, /streak integer not null default 0/i, "streak default must be 0");
    });

    it("verifies username uniqueness index", () => {
      assert.match(
        sql,
        /create unique index if not exists profiles_username_unique\s+on public\.profiles\s*\(lower\(username\)\)/i,
        "profiles must have case-insensitive unique index on lower(username)"
      );
    });

    it("verifies activity_progress table and unique constraint", () => {
      assert.match(sql, /activity_key text not null/i, "activity_progress must have activity_key");
      assert.match(sql, /hints_used integer not null default 0/i, "hints_used default must be 0");
      assert.match(sql, /credits_spent integer not null default 0/i, "credits_spent default must be 0");
      assert.match(sql, /xp_earned integer not null default 0/i, "xp_earned default must be 0");
      assert.match(sql, /completed boolean not null default false/i, "completed default must be false");
      assert.match(sql, /unique\s*\(\s*user_id,\s*activity_key\s*\)/i, "must enforce unique(user_id, activity_key)");
    });
  });

  describe("Database Seed Data", () => {
    const sql = fs.readFileSync(schemaPath, "utf-8");

    it("seeds the initial 5 core chapters with correct order and required_xp", () => {
      const expectedChapters = [
        { title: "Meet Python", order: 1, xp: 0 },
        { title: "Make Decisions", order: 2, xp: 250 },
        { title: "Repeat Yourself", order: 3, xp: 600 },
        { title: "Lists", order: 4, xp: 1000 },
        { title: "Functions", order: 5, xp: 1500 },
      ];

      expectedChapters.forEach((ch) => {
        const pattern = new RegExp(`\\('${ch.title}',\\s*'(?:[^']|'')*',\\s*${ch.order},\\s*${ch.xp}\\)`, "i");
        assert.ok(pattern.test(sql), `Seed data must include chapter '${ch.title}' with order ${ch.order} and ${ch.xp} XP`);
      });
      assert.match(sql, /on conflict\s*\(order_number\)\s*do nothing/i, "chapter seed must handle conflict on order_number");
    });

    it("seeds the 5 core badges with appropriate icons", () => {
      const expectedBadges = [
        { name: "Python Explorer", icon: "🐍" },
        { name: "Variable Explorer", icon: "📦" },
        { name: "Decision Maker", icon: "🧭" },
        { name: "Loop Hero", icon: "🔁" },
        { name: "Function Builder", icon: "🧩" },
      ];

      expectedBadges.forEach((b) => {
        const pattern = new RegExp(`\\('${b.name}',[^,]+,\\s*'${b.icon}'\\)`);
        assert.ok(pattern.test(sql), `Seed data must include badge '${b.name}' with icon '${b.icon}'`);
      });
      assert.match(sql, /on conflict\s*\(name\)\s*do nothing/i, "badge seed must handle conflict on name");
    });
  });

  describe("Security Definer RPC Functions & Permissions", () => {
    const sql = fs.readFileSync(schemaPath, "utf-8");

    it("defines is_username_available function with security definer", () => {
      assert.match(sql, /create or replace function public\.is_username_available\(candidate text\)/i);
      assert.match(sql, /returns boolean/i);
      assert.match(sql, /security definer/i);
      assert.match(sql, /set search_path = public/i);
      assert.match(sql, /grant execute on function public\.is_username_available\(text\) to anon, authenticated/i);
    });

    it("defines use_activity_hint with credit check and security definer", () => {
      assert.match(sql, /create or replace function public\.use_activity_hint\(activity text\)/i);
      assert.match(sql, /returns jsonb/i);
      assert.match(sql, /current_credits < 1 then raise exception 'insufficient_credits'/i);
      assert.match(sql, /credits = credits - 1/i);
      assert.match(sql, /grant execute on function public\.use_activity_hint\(text\) to authenticated/i);
    });

    it("defines complete_activity with leveling formula and clamped base_xp", () => {
      assert.match(sql, /create or replace function public\.complete_activity\(activity text, base_xp integer\)/i);
      assert.match(sql, /base_xp := least\(greatest\(base_xp, 0\), 100\)/i, "must clamp base_xp between 0 and 100");
      assert.match(sql, /awarded := greatest\(0, base_xp - activity_row\.hints_used \* 5\)/i, "must apply 5 XP penalty per hint");
      assert.match(sql, /level = greatest\(1, floor\(\(profile\.xp \+ awarded\) \/ 250\.0\)::integer \+ 1\)/i, "must compute level with 250 XP per level");
      assert.match(sql, /grant execute on function public\.complete_activity\(text, integer\) to authenticated/i);
    });

    it("restricts client direct update permissions on public.profiles to prevent XP/credit tampering", () => {
      assert.match(sql, /revoke update on public\.profiles from authenticated/i);
      assert.match(sql, /grant update \([\s\S]*?\) on public\.profiles to authenticated/i);

      // Verify that xp, level, credits, and streak are excluded from direct update grant
      const grantMatch = sql.match(/grant update \(([\s\S]*?)\) on public\.profiles to authenticated/i);
      assert.ok(grantMatch, "Grant update statement must exist");
      const allowedColumns = grantMatch[1].split(",").map((c) => c.trim().toLowerCase());

      assert.ok(!allowedColumns.includes("xp"), "xp must NOT be directly updatable by authenticated users");
      assert.ok(!allowedColumns.includes("level"), "level must NOT be directly updatable by authenticated users");
      assert.ok(!allowedColumns.includes("credits"), "credits must NOT be directly updatable by authenticated users");
      assert.ok(!allowedColumns.includes("streak"), "streak must NOT be directly updatable by authenticated users");
      assert.ok(allowedColumns.includes("display_name"), "display_name must be updatable");
      assert.ok(allowedColumns.includes("learning_goal"), "learning_goal must be updatable");
    });
  });

  describe("Mock Model Business Logic Validation", () => {
    // Test the business logic formulas implemented in SQL
    function calculateLevel(xp) {
      return Math.max(1, Math.floor(xp / 250) + 1);
    }

    function calculateAwardedXP(baseXp, hintsUsed) {
      const clampedBase = Math.min(Math.max(baseXp, 0), 100);
      return Math.max(0, clampedBase - hintsUsed * 5);
    }

    it("calculates level milestones correctly based on XP threshold of 250", () => {
      assert.equal(calculateLevel(0), 1);
      assert.equal(calculateLevel(100), 1);
      assert.equal(calculateLevel(249), 1);
      assert.equal(calculateLevel(250), 2);
      assert.equal(calculateLevel(499), 2);
      assert.equal(calculateLevel(500), 3);
      assert.equal(calculateLevel(750), 4);
      assert.equal(calculateLevel(1000), 5);
      assert.equal(calculateLevel(1500), 7);
    });

    it("calculates awarded XP with penalties and clamping correctly", () => {
      assert.equal(calculateAwardedXP(50, 0), 50);
      assert.equal(calculateAwardedXP(50, 1), 45);
      assert.equal(calculateAwardedXP(50, 2), 40);
      assert.equal(calculateAwardedXP(50, 3), 35);
      assert.equal(calculateAwardedXP(50, 10), 0); // never below 0
      assert.equal(calculateAwardedXP(200, 0), 100); // clamped to max 100
      assert.equal(calculateAwardedXP(-20, 0), 0); // clamped to min 0
    });
  });
});

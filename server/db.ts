import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  age: number;
  learner_mode: "child" | "student" | "pro";
  auth_provider: string;
  created_at: string;
  last_login_at: string;
}

export interface DBProgress {
  user_id: string;
  current_chapter: number;
  learner_mode: string;
  learner_name: string;
  total_credits: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  streak_history: string;
  completed_exercises: string;
  completed_daily_challenges: string;
  updated_at: string;
}

let dbInstance: any = null;
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "pythonquest.sqlite");

/**
 * Initializes SQLite database tables using sql.js WebAssembly
 * and persists to data/pythonquest.sqlite
 */
export async function getDatabase() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const buffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(buffer);
    } catch (err) {
      console.warn("Could not read existing SQLite database, creating new one:", err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Create relational schema tables
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      learner_mode TEXT NOT NULL,
      auth_provider TEXT NOT NULL DEFAULT 'email',
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      user_id TEXT PRIMARY KEY,
      current_chapter INTEGER DEFAULT 1,
      learner_mode TEXT DEFAULT 'child',
      learner_name TEXT NOT NULL,
      total_credits INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 1,
      longest_streak INTEGER DEFAULT 1,
      last_active_date TEXT,
      streak_history TEXT,
      completed_exercises TEXT,
      completed_daily_challenges TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exercise_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      chapter_number INTEGER NOT NULL,
      exercise_id TEXT NOT NULL,
      code TEXT NOT NULL,
      passed INTEGER NOT NULL,
      credits_earned INTEGER DEFAULT 0,
      submitted_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      milestone_id TEXT NOT NULL,
      milestone_title TEXT NOT NULL,
      learner_name TEXT NOT NULL,
      learner_mode TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      verification_code TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  persistDatabase();
  return dbInstance;
}

export function persistDatabase() {
  if (!dbInstance) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error("Failed to persist SQLite database to disk:", err);
  }
}

/**
 * Helper to execute a query and return array of objects
 */
export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  if (!dbInstance) throw new Error("Database not initialized");
  const stmt = dbInstance.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

/**
 * Helper to execute a query and return a single object or null
 */
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const rows = queryAll<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Register a new user in the database
 */
export async function registerUserInDB(data: {
  email: string;
  password: string;
  name: string;
  age: number;
  learner_mode?: "child" | "student" | "pro";
  auth_provider?: string;
}) {
  await getDatabase();

  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = queryOne<DBUser>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
  if (existing) {
    throw new Error("A user with this email address already exists. Please log in instead.");
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(data.password, salt);

  // Compute learner mode from age if not specified
  let mode: "child" | "student" | "pro" = data.learner_mode || "student";
  if (!data.learner_mode) {
    if (data.age <= 12) mode = "child";
    else if (data.age <= 21) mode = "student";
    else mode = "pro";
  }

  const now = new Date().toISOString();

  // Insert User
  dbInstance.run(
    `INSERT INTO users (id, email, password_hash, name, age, learner_mode, auth_provider, created_at, last_login_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      normalizedEmail,
      passwordHash,
      data.name.trim(),
      data.age,
      mode,
      data.auth_provider || "email",
      now,
      now,
    ]
  );

  // Initialize Progress
  dbInstance.run(
    `INSERT INTO user_progress (user_id, current_chapter, learner_mode, learner_name, total_credits, current_streak, longest_streak, last_active_date, streak_history, completed_exercises, completed_daily_challenges, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      1,
      mode,
      data.name.trim(),
      0,
      1,
      1,
      now.split("T")[0],
      JSON.stringify([now.split("T")[0]]),
      JSON.stringify([]),
      JSON.stringify([]),
      now,
    ]
  );

  persistDatabase();

  const user = queryOne<DBUser>("SELECT id, email, name, age, learner_mode, auth_provider, created_at, last_login_at FROM users WHERE id = ?", [userId]);
  const progress = queryOne<DBProgress>("SELECT * FROM user_progress WHERE user_id = ?", [userId]);

  return { user, progress };
}

/**
 * Log in an existing user
 */
export async function loginUserInDB(email: string, password?: string) {
  await getDatabase();

  const normalizedEmail = email.trim().toLowerCase();
  const user = queryOne<DBUser>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
  if (!user) {
    throw new Error("No account found with this email address. Please register for free first.");
  }

  // If password provided and user has a password hash, verify
  if (password && user.password_hash) {
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Incorrect password. Please try again.");
    }
  }

  const now = new Date().toISOString();
  dbInstance.run("UPDATE users SET last_login_at = ? WHERE id = ?", [now, user.id]);
  persistDatabase();

  let progress = queryOne<DBProgress>("SELECT * FROM user_progress WHERE user_id = ?", [user.id]);
  if (!progress) {
    // If progress missing, create default
    dbInstance.run(
      `INSERT INTO user_progress (user_id, current_chapter, learner_mode, learner_name, total_credits, current_streak, longest_streak, last_active_date, streak_history, completed_exercises, completed_daily_challenges, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        1,
        user.learner_mode,
        user.name,
        0,
        1,
        1,
        now.split("T")[0],
        JSON.stringify([now.split("T")[0]]),
        JSON.stringify([]),
        JSON.stringify([]),
        now,
      ]
    );
    persistDatabase();
    progress = queryOne<DBProgress>("SELECT * FROM user_progress WHERE user_id = ?", [user.id]);
  }

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, progress };
}

/**
 * Synchronize user progress to database
 */
export async function syncUserProgressInDB(userId: string, progressData: any) {
  await getDatabase();

  const now = new Date().toISOString();
  const existing = queryOne("SELECT user_id FROM user_progress WHERE user_id = ?", [userId]);

  const streakHistoryStr = typeof progressData.streakHistory === "string" 
    ? progressData.streakHistory 
    : JSON.stringify(progressData.streakHistory || []);
  const completedExercisesStr = typeof progressData.completedExercises === "string"
    ? progressData.completedExercises
    : JSON.stringify(progressData.completedExercises || []);
  const completedDailyStr = typeof progressData.completedDailyChallenges === "string"
    ? progressData.completedDailyChallenges
    : JSON.stringify(progressData.completedDailyChallenges || []);

  if (existing) {
    dbInstance.run(
      `UPDATE user_progress SET
        current_chapter = ?,
        learner_mode = ?,
        learner_name = ?,
        total_credits = ?,
        current_streak = ?,
        longest_streak = ?,
        last_active_date = ?,
        streak_history = ?,
        completed_exercises = ?,
        completed_daily_challenges = ?,
        updated_at = ?
       WHERE user_id = ?`,
      [
        progressData.currentChapter || 1,
        progressData.learnerMode || "child",
        progressData.learnerName || "Learner",
        progressData.totalCredits || 0,
        progressData.currentStreak || 1,
        progressData.longestStreak || 1,
        progressData.lastActiveDate || now.split("T")[0],
        streakHistoryStr,
        completedExercisesStr,
        completedDailyStr,
        now,
        userId,
      ]
    );
  } else {
    dbInstance.run(
      `INSERT INTO user_progress (user_id, current_chapter, learner_mode, learner_name, total_credits, current_streak, longest_streak, last_active_date, streak_history, completed_exercises, completed_daily_challenges, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        progressData.currentChapter || 1,
        progressData.learnerMode || "child",
        progressData.learnerName || "Learner",
        progressData.totalCredits || 0,
        progressData.currentStreak || 1,
        progressData.longestStreak || 1,
        progressData.lastActiveDate || now.split("T")[0],
        streakHistoryStr,
        completedExercisesStr,
        completedDailyStr,
        now,
      ]
    );
  }

  // Update learner_mode or name on users table as well
  if (progressData.learnerMode || progressData.learnerName) {
    dbInstance.run(
      `UPDATE users SET learner_mode = COALESCE(?, learner_mode), name = COALESCE(?, name) WHERE id = ?`,
      [progressData.learnerMode || null, progressData.learnerName || null, userId]
    );
  }

  persistDatabase();
  return queryOne<DBProgress>("SELECT * FROM user_progress WHERE user_id = ?", [userId]);
}

/**
 * Record exercise submission
 */
export async function recordExerciseInDB(submission: {
  userId: string;
  chapterNumber: number;
  exerciseId: string;
  code: string;
  passed: boolean;
  creditsEarned: number;
}) {
  await getDatabase();
  const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  dbInstance.run(
    `INSERT INTO exercise_submissions (id, user_id, chapter_number, exercise_id, code, passed, credits_earned, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      subId,
      submission.userId,
      submission.chapterNumber,
      submission.exerciseId,
      submission.code,
      submission.passed ? 1 : 0,
      submission.creditsEarned,
      now,
    ]
  );
  persistDatabase();
}

/**
 * Get Database Schema Overview and Statistics
 */
export async function getDBSchemaInfo() {
  await getDatabase();

  const tables = queryAll<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  );

  const schemaInfo: Record<string, { columns: any[]; rowCount: number }> = {};

  for (const table of tables) {
    const columns = queryAll(`PRAGMA table_info(${table.name})`);
    const countResult = queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM ${table.name}`);
    schemaInfo[table.name] = {
      columns,
      rowCount: countResult ? countResult.count : 0,
    };
  }

  return {
    database: "SQLite (sql.js / WebAssembly)",
    filePath: DB_FILE,
    tables: schemaInfo,
  };
}

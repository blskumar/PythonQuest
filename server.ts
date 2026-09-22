import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getDatabase,
  registerUserInDB,
  loginUserInDB,
  syncUserProgressInDB,
  recordExerciseInDB,
  getDBSchemaInfo,
  queryOne,
} from "./server/db";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite database and tables
  try {
    await getDatabase();
    console.log("SQLite database and schema tables initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize SQLite database:", err);
  }

  app.use(express.json({ limit: "5mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGemini: !!process.env.GEMINI_API_KEY,
      database: "SQLite (sql.js / WebAssembly tables)",
      timestamp: new Date().toISOString(),
    });
  });

  // DB Schema & Statistics Endpoint (for user/developer inspection)
  app.get("/api/db/schema", async (_req, res) => {
    try {
      const info = await getDBSchemaInfo();
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to inspect schema", message: err?.message });
    }
  });

  // User Registration Endpoint - Inserts into users & user_progress tables
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, age, learnerMode, authProvider } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "A valid email address is required." });
      }
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required." });
      }
      if (!password || password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters." });
      }

      const parsedAge = parseInt(age, 10) || 20;
      const result = await registerUserInDB({
        email,
        password,
        name,
        age: parsedAge,
        learner_mode: learnerMode,
        auth_provider: authProvider || "email",
      });

      if (!result.user) {
        throw new Error("User registration failed");
      }

      res.status(201).json({
        success: true,
        message: "User account created successfully in SQLite database",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          age: result.user.age,
          learnerMode: result.user.learner_mode,
          authProvider: result.user.auth_provider,
          createdAt: result.user.created_at,
          isAuthenticated: true,
        },
        progress: result.progress,
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      res.status(400).json({
        error: err.message || "Failed to register user",
      });
    }
  });

  // User Login Endpoint - Verifies password against users table
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required." });
      }

      const result = await loginUserInDB(email, password);

      res.json({
        success: true,
        message: "User authenticated successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          age: result.user.age,
          learnerMode: result.user.learner_mode,
          authProvider: result.user.auth_provider,
          createdAt: result.user.created_at,
          isAuthenticated: true,
        },
        progress: result.progress,
      });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(401).json({
        error: err.message || "Invalid credentials",
      });
    }
  });

  // Get Current Authenticated User by ID
  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId parameter required" });
      }
      await getDatabase();
      const user = queryOne("SELECT id, email, name, age, learner_mode, auth_provider, created_at FROM users WHERE id = ?", [userId]);
      if (!user) {
        return res.status(404).json({ error: "User not found in database" });
      }
      const progress = queryOne("SELECT * FROM user_progress WHERE user_id = ?", [userId]);
      res.json({
        user: {
          ...user,
          learnerMode: user.learner_mode,
          authProvider: user.auth_provider,
          isAuthenticated: true,
        },
        progress,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch user", message: err.message });
    }
  });

  // Sync Progress to Database Endpoint
  app.post("/api/user/sync-progress", async (req, res) => {
    try {
      const { userId, progress } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId is required to sync progress" });
      }
      const updated = await syncUserProgressInDB(userId, progress);
      res.json({ success: true, progress: updated });
    } catch (err: any) {
      console.error("Sync progress error:", err);
      res.status(500).json({ error: "Failed to sync progress", message: err.message });
    }
  });

  // Log Exercise Submission Endpoint
  app.post("/api/user/submit-exercise", async (req, res) => {
    try {
      const { userId, chapterNumber, exerciseId, code, passed, creditsEarned } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      await recordExerciseInDB({
        userId,
        chapterNumber: chapterNumber || 1,
        exerciseId: exerciseId || "unknown",
        code: code || "",
        passed: !!passed,
        creditsEarned: creditsEarned || 0,
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to record exercise", message: err.message });
    }
  });

  // AI Code Review endpoint
  app.post("/api/ai-review", async (req, res) => {
    try {
      const { code, exerciseTitle, promptContext, learnerMode } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          feedback:
            "Good effort! Gemini AI review is inactive because no GEMINI_API_KEY is configured in the environment. Your automated unit tests are still fully verified by the built-in Python engine.",
          isPassLikely: true,
          suggestions: [
            "Check PEP 8 variable naming conventions.",
            "Verify all edge cases and boundary inputs.",
          ],
        });
      }

      const audienceTone =
        learnerMode === "child"
          ? "The user is a young child / junior student learning to code. Use enthusiastic, friendly, encouraging, and clear language. Give creative analogies (like robots, magical recipes, or pet toys)."
          : learnerMode === "pro"
          ? "The user is an experienced or seasoned professional. Focus on Pythonic idioms, time/space complexity, memory footprint, PEP 8/PEP 484 type clarity, and clean design patterns."
          : "The user is a high school or university student. Balance pedagogical clarity, computer science terminology, and practical advice.";

      const prompt = `You are a world-class Python mentor evaluating a learner's code submission.
${audienceTone}

Exercise Title: ${exerciseTitle || "Python Practice"}
Context / Requirements: ${promptContext || "General Python task"}

User's Python Code:
\`\`\`python
${code || "# No code provided"}
\`\`\`

Provide your feedback as JSON with the following structure:
{
  "summary": "1-2 sentence overall encouraging evaluation",
  "scoreOutOf100": number between 0 and 100,
  "strengths": ["list of positive aspects of the code"],
  "improvements": ["list of actionable tips or alternative pythonic tricks"],
  "childFriendlyTip": "a fun or memorable takeaway (if applicable, else empty string)"
}
Return only valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const responseText = response.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (err: any) {
      console.error("AI review error:", err);
      res.status(500).json({
        error: "Failed to generate AI review",
        message: err?.message || "Internal error",
      });
    }
  });

  // AI Hint endpoint
  app.post("/api/ai-hint", async (req, res) => {
    try {
      const { code, exerciseTitle, promptContext, learnerMode, hintLevel } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          hint: "Hint: Review the function signature, check your loop termination condition, and ensure your return value matches the expected type!",
        });
      }

      const audienceTone =
        learnerMode === "child"
          ? "Explain gently like a friendly coding companion to a kid without giving away the full answer."
          : learnerMode === "pro"
          ? "Give a concise architectural hint or point out subtle Python quirks (e.g. mutable default arguments, late binding, dunder behaviors)."
          : "Provide a helpful conceptual hint that guides the student toward the solution.";

      const prompt = `You are a Python teaching assistant. A learner is stuck on an exercise.
${audienceTone}

Exercise Title: ${exerciseTitle || "Python Challenge"}
Problem Description: ${promptContext || "General task"}
Hint Level requested: ${hintLevel || "gentle"} (gentle = conceptual nudge, medium = pseudocode guide, direct = targeted syntax clue without giving entire solution)

Learner's current work:
\`\`\`python
${code || ""}
\`\`\`

Give a warm, clear hint (under 80 words) that sparks understanding. Return plain text only.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({
        hint: response.text?.trim() || "Try breaking the problem down into smaller steps!",
      });
    } catch (err: any) {
      console.error("AI hint error:", err);
      res.status(500).json({
        error: "Failed to generate hint",
        message: err?.message || "Internal error",
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Python Academy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

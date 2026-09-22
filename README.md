# Python Quest — Full-Stack Python Learning Adventure

**Python Quest** is an interactive, gamified full-stack web application designed to teach Python from first principles to Object-Oriented Programming (OOP) mastery. It features age-tailored tracks for **Young Explorers (Kids)**, **Academic Scholars (Students)**, and **Software Architects (Professionals)**, complete with live in-browser Python execution, automated unit test runners, server-side AI tutoring via Gemini, credit scoring, certificate generation, and daily streak tracking.

---

## 1. What is "Full Stack"? (Frontend vs. Backend)

In modern software development, a **Full-Stack Application** comprises two primary layers working together:

### The Frontend (Client-Side)
- **What it is:** The visual and interactive layer that runs directly inside the user's web browser (or mobile screen).
- **Responsibilities:**
  - Rendering buttons, editors, forms, typography, animations, and layouts.
  - Handling user input (clicks, typing in the code editor, swipe gestures).
  - Executing client-side logic, such as in-browser Python compilation with WebAssembly (Pyodide).
  - Managing responsive layouts across mobile (e.g., Google Pixel 7a, iPhone) and desktop viewports.
- **In this app:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Pyodide WebAssembly engine.

### The Backend (Server-Side)
- **What it is:** The underlying engine running on a secure cloud server, invisible to the user's browser.
- **Responsibilities:**
  - Handling API requests securely without exposing private secrets or API keys to the browser.
  - Serving server-side AI integrations (e.g., calling the Gemini API to analyze Python code submissions).
  - Serving static assets, routing, and providing health-check endpoints.
- **In this app:** Node.js with Express 4 running TypeScript via `tsx` / `esbuild`, interacting with Google's `@google/genai` SDK.

---

## 2. Technology Stack Breakdown

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** (`react`, `react-dom`) | Modern component-based UI with concurrent rendering and hooks. |
| **Language** | **TypeScript 5/7** | Strict static type safety across both frontend and backend codebases. |
| **Build Tool & Bundler** | **Vite 8** | Ultra-fast module bundling, asset compilation, and development server. |
| **CSS & Design System** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Utility-first styling with custom typography, dark palettes, and zero CSS runtime overhead. |
| **Icons & Visuals** | **Lucide React** (`lucide-react`) | Comprehensive SVG icon library for UI controls and navigation. |
| **In-Browser Python Engine** | **Pyodide 0.26.4 (WebAssembly)** | Full Python 3 runtime running securely inside browser sandboxes without remote execution delay. |
| **Backend Framework** | **Express.js 4** (`express`) | Lightweight Node.js server handling `/api/*` endpoints and Vite SSR middleware. |
| **Database Engine** | **SQLite via `sql.js` (WebAssembly)** | Relational database engine persisting user accounts, progress, submissions, and certificates to disk (`data/pythonquest.sqlite`). |
| **Authentication & Security** | **Bcrypt.js (`bcryptjs`)** | Secure one-way salt & hash password protection for user registrations. |
| **Access Control (Auth Guard)** | **`AuthGateScreen` & State Interceptor** | Enforces registration/sign-in requirements across Chapters, Dashboard, Streak, Leaderboard, and Sandbox. |
| **AI Mentorship & Reviews** | **Google Gen AI SDK** (`@google/genai`) | Server-side Gemini integration (`gemini-3.8-flash`) providing context-aware code feedback and adaptive hints. |
| **State & Persistence** | **SQLite Database + Local Cache Sync** | Bidirectional synchronization between server database and client state with offline-safe fallbacks. |
| **Animations & FX** | **Canvas Confetti** & **Motion** | Celebratory milestone bursts and fluid visual transitions. |
| **Device Adaptation** | **Custom `useDevice` Engine** | Real-time device detection tailored for Google Pixel 7a (Android), iOS, and Web Desktop. |

---

## 3. Key Components & Architecture

### Core Navigation & Layout
- `src/components/Navbar.tsx`: Header containing brand logo, responsive track selector dropdown, credit counter pill, daily streak badge, device indicator badge, and authentication controls with lock indicators on restricted tabs.
- `src/components/MobileBottomNav.tsx`: Native-style bottom navigation bar with 48px touch targets tailored for Android and iOS touch screens with locked state badges.
- `src/utils/useDevice.ts`: Device-detection hook detecting Android OS (specifically Google Pixel 7a screen characteristics: 412×915 viewport), iOS Safari, and desktop platforms.
- `src/components/AuthGateScreen.tsx`: Central access control screen that blocks unauthenticated access to restricted modules, explaining the restriction and providing immediate sign-in or free registration CTAs.

### Learning & Practice Modules
- `src/components/HomePage.tsx`: Visual hub featuring course highlights, audience tracks, interactive age explorer widget, and a comprehensive 15-chapter curriculum directory with level filtering (Foundation, OOP Mastery, Advanced Systems) and direct lesson and code exercise launchers.
- `src/components/ChapterViewer.tsx`: Interactive lesson reader covering all 15 chapters with dynamic age-mode perspective toggling (Young Explorers/Kids, CS Students, Industry Pros), chapter selection drawer, and navigation pills.
- `src/components/ExerciseWorkspace.tsx`: Live code editor with in-browser Pyodide Python 3 execution, automated test suite, mobile quick-keys helper bar, terminal output, and server-side Gemini AI feedback.
- `src/components/Scratchpad.tsx`: Open-ended Python sandbox with sample code snippets, real-time stdout console, and Pyodide execution.
- `src/components/DailyChallenge.tsx`: Daily puzzle mode that awards bonus credits and increments the user's daily learning streak.

### Progress & Gamification
- `src/components/Dashboard.tsx`: Comprehensive stats hub showing total credits, completion percentage, Daily Learning Streak tracker, and milestone progression.
- `src/components/CertificatesGallery.tsx`: Showcase of earned verifiable certificates with print/download functionality.
- `src/components/CertificateModal.tsx`: Visual certificate viewer displaying the learner's name, completion date, and credential ID.
- `src/components/GlobalLeaderboard.tsx`: Ranks learners across tracks with search and filter capabilities.
- `src/components/AuthModal.tsx`: User sign-in and profile creation modal with age verification, track recommendation, password hashing, and real-time database synchronization.

### Branding
- `src/components/PythonQuestLogo.tsx`: Custom vector brand mark combining the Explorer Mascot, typography, and gold compass emblem.
- `src/components/PythonMascot.tsx`: Interactive mascot providing encouraging visual reactions.

---

## 4. Database Schema (SQLite / WASM)

Persistent storage is managed by `server/db.ts` utilizing `sql.js` (SQLite compiled to WebAssembly) and written to the persistent file `data/pythonquest.sqlite`:

### Table `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique user identifier (UUID). |
| `name` | TEXT | NOT NULL | Learner display name. |
| `email` | TEXT | UNIQUE, NOT NULL | User email address. |
| `password_hash` | TEXT | NOT NULL | Salted & hashed password via `bcryptjs`. |
| `age` | INTEGER | NOT NULL | Learner age (determines automatic track). |
| `learner_mode` | TEXT | NOT NULL | `child`, `student`, or `pro`. |
| `created_at` | TEXT | NOT NULL | ISO 8601 registration timestamp. |

### Table `user_progress`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | TEXT | PRIMARY KEY, FOREIGN KEY | References `users(id)`. |
| `learner_name` | TEXT | NOT NULL | Current learner profile name. |
| `learner_mode` | TEXT | NOT NULL | Active curriculum mode. |
| `total_credits` | INTEGER | DEFAULT 0 | Accumulated XP credits. |
| `daily_streak` | INTEGER | DEFAULT 1 | Consecutive active learning days. |
| `last_active_date` | TEXT | - | Last day active (YYYY-MM-DD). |
| `completed_chapters`| TEXT | DEFAULT '[]' | JSON array of completed chapter IDs. |
| `claimed_certificates`| TEXT | DEFAULT '[]'| JSON array of claimed milestone objects. |
| `completed_daily_challenges`| TEXT| DEFAULT '[]'| JSON array of completed daily puzzle objects. |
| `updated_at` | TEXT | NOT NULL | Timestamp of last sync. |

### Table `exercise_submissions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Submission record ID. |
| `user_id` | TEXT | FOREIGN KEY | References `users(id)`. |
| `chapter_id` | TEXT | NOT NULL | Associated chapter identifier. |
| `code` | TEXT | NOT NULL | User's submitted Python code. |
| `passed` | INTEGER | NOT NULL | `1` for pass, `0` for fail. |
| `credits_earned` | INTEGER | DEFAULT 0 | Credits awarded. |
| `submitted_at` | TEXT | NOT NULL | Submission timestamp. |

### Table `certificates`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Certificate record ID. |
| `user_id` | TEXT | FOREIGN KEY | References `users(id)`. |
| `milestone_id` | TEXT | NOT NULL | Milestone level ID. |
| `certificate_id` | TEXT | UNIQUE, NOT NULL | Verifiable serial certificate number. |
| `claimed_at` | TEXT | NOT NULL | Claim timestamp. |

---

## 5. API Endpoints (Backend)

The Express backend (`server.ts`) exposes the following endpoints:

### Authentication & User Management
- `POST /api/auth/register`: Validates user inputs, checks for duplicate email, hashes passwords via `bcryptjs`, writes the user record and initializes progress in the SQLite database, and returns the authenticated user object with initialized progress.
- `POST /api/auth/login`: Authenticates user credentials using bcrypt password comparison against SQLite, fetches stored progress, and returns the session object.
- `POST /api/user/sync-progress`: Synchronizes client-side XP, chapters, streak, certificates, and daily challenges to the persistent SQLite database.
- `POST /api/user/submit-exercise`: Records an exercise attempt and code submission history into `exercise_submissions`.

### AI & Mentorship
- `GET /api/health`: Verifies backend service health and Gemini API key readiness.
- `POST /api/ai-review`: Takes a learner's Python code, the exercise context, and active audience track (`child`, `student`, `pro`) to generate structured mentorship feedback via Gemini.
- `POST /api/ai-hint`: Generates audience-appropriate conceptual nudges and hints without revealing complete answers.

---

## 6. Access Control & Authorization Guard

To ensure a seamless, high-integrity onboarding flow, the application enforces the following access model:
1. **Public Access:**
   - **Overview / Home Page (`HomePage.tsx`)**: Completely accessible without sign-in, allowing anyone to explore the course overview, syllabus structure, age tracks, and feature explanations.
2. **Restricted Access (Requires Free Account Sign-In):**
   - **Chapters & Lessons**: Locked until registered.
   - **Interactive Python Exercises**: Locked until registered.
   - **Daily Learning Streak & Stats Dashboard**: Locked until registered.
   - **Daily Challenges (+50 credits)**: Locked until registered.
   - **Global Ranks & Leaderboard**: Locked until registered.
   - **Level Milestone Certificates**: Locked until registered.
   - **Interactive Python Sandbox**: Locked until registered.
3. **Protection Mechanisms:**
   - Visual lock icons and badges on all restricted navigation tabs and hero CTAs.
   - Any attempt to click on "Continue your quest" or any locked tab opens the `AuthModal` with an explanatory message.
   - `AuthGateScreen` acts as an in-page fail-safe if an unauthenticated user enters a direct route.

---

## 7. Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Compile TypeScript and bundle for production
npm run build

# Start production server
npm start

# Run TypeScript typecheck
npm run lint
```

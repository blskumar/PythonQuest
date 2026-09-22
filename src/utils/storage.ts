import {
  UserProgress,
  UserAccount,
  ClaimedCertificate,
  ExerciseSubmission,
  LearnerMode,
  DailyActivityLog,
  DailyLearningStreak,
} from "../types";

const STORAGE_KEY = "python_academy_user_progress_v1";

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DEFAULT_STREAK: DailyLearningStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: "",
  hasCompletedToday: false,
  tasksCompletedToday: 0,
  exercisesCompletedToday: 0,
  challengesCompletedToday: 0,
  streakDates: [],
};

const DEFAULT_PROGRESS: UserProgress = {
  learnerName: "Alex",
  learnerMode: "student",
  totalCredits: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  dailyLearningStreak: DEFAULT_STREAK,
  activityHistory: {},
  completedChapters: [],
  exerciseSubmissions: {},
  claimedCertificates: [],
  unlockedBadges: ["badge-welcome"],
  completedDailyChallenges: [],
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);

    const progress: UserProgress = {
      ...DEFAULT_PROGRESS,
      ...parsed,
      activityHistory: parsed.activityHistory || {},
      completedDailyChallenges: parsed.completedDailyChallenges || [],
    };

    // Verify streak validity on load (if more than 1 day has passed without activity)
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    let activeStreak = progress.currentStreak;
    if (
      progress.lastActiveDate &&
      progress.lastActiveDate !== today &&
      progress.lastActiveDate !== yesterday
    ) {
      // Streak broken
      activeStreak = 0;
      progress.currentStreak = 0;
    }

    const todayLog = progress.activityHistory[today];
    const exercisesCompletedToday = todayLog?.exercisesCount || 0;
    const challengesCompletedToday = todayLog?.dailyChallengesCount || 0;
    const tasksCompletedToday =
      exercisesCompletedToday +
      challengesCompletedToday +
      (todayLog?.scratchpadCount || 0);
    const hasCompletedToday =
      exercisesCompletedToday > 0 ||
      challengesCompletedToday > 0 ||
      (todayLog?.scratchpadCount || 0) > 0;

    // Collect historical completed streak dates
    const streakDates = Object.entries(progress.activityHistory)
      .filter(
        ([_, log]) =>
          log.exercisesCount > 0 ||
          (log.dailyChallengesCount || 0) > 0 ||
          (log.scratchpadCount || 0) > 0
      )
      .map(([d]) => d)
      .sort();

    progress.dailyLearningStreak = {
      currentStreak: activeStreak,
      longestStreak: Math.max(progress.longestStreak || 0, activeStreak),
      lastCompletedDate: progress.lastActiveDate || "",
      hasCompletedToday,
      tasksCompletedToday,
      exercisesCompletedToday,
      challengesCompletedToday,
      streakDates,
    };

    return progress;
  } catch (e) {
    console.error("Failed to load progress from localStorage:", e);
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    // If user is registered in the SQLite database, sync asynchronously
    if (progress.user?.id) {
      fetch("/api/user/sync-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: progress.user.id,
          progress: {
            currentChapter: progress.completedChapters.length + 1,
            learnerMode: progress.learnerMode,
            learnerName: progress.learnerName,
            totalCredits: progress.totalCredits,
            currentStreak: progress.currentStreak,
            longestStreak: progress.longestStreak,
            lastActiveDate: progress.lastActiveDate,
            streakHistory: progress.dailyLearningStreak?.streakDates || [],
            completedExercises: Object.keys(progress.exerciseSubmissions || {}),
            completedDailyChallenges: (progress.completedDailyChallenges || []).map((c) => c.puzzleId),
          },
        }),
      }).catch((err) => {
        console.warn("Background SQLite sync notice:", err);
      });
    }
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function updateLearnerMode(mode: LearnerMode): UserProgress {
  const current = loadUserProgress();
  const updated = { ...current, learnerMode: mode };
  saveUserProgress(updated);
  return updated;
}

export function updateLearnerName(name: string): UserProgress {
  const current = loadUserProgress();
  const updated = { ...current, learnerName: name.trim() || "Explorer" };
  saveUserProgress(updated);
  return updated;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
  tasksCompletedToday: number;
  exercisesCompletedToday: number;
  challengesCompletedToday: number;
  lastActiveDate: string;
  statusMessage: string;
  dailyLearningStreak: DailyLearningStreak;
  recent7Days: Array<{
    date: string;
    dayLabel: string;
    dayNum: string;
    isToday: boolean;
    isCompleted: boolean;
    exercisesCount: number;
    challengesCount: number;
    scratchpadCount: number;
  }>;
}

export function getStreakStatus(progress: UserProgress): StreakInfo {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const todayLog = progress.activityHistory[today];
  const exercisesCompletedToday = todayLog?.exercisesCount || 0;
  const challengesCompletedToday = todayLog?.dailyChallengesCount || 0;
  const scratchpadCountToday = todayLog?.scratchpadCount || 0;

  const isCompletedToday = Boolean(
    todayLog &&
      (exercisesCompletedToday > 0 ||
        scratchpadCountToday > 0 ||
        challengesCompletedToday > 0)
  );

  const tasksCompletedToday =
    exercisesCompletedToday + scratchpadCountToday + challengesCompletedToday;

  let activeStreak = progress.dailyLearningStreak?.currentStreak ?? progress.currentStreak;
  if (
    progress.lastActiveDate &&
    progress.lastActiveDate !== today &&
    progress.lastActiveDate !== yesterday
  ) {
    activeStreak = 0;
  }

  let statusMessage = "";
  if (isCompletedToday) {
    statusMessage = "Daily streak secured! You finished today's coding quota.";
  } else if (activeStreak > 0 && progress.lastActiveDate === yesterday) {
    statusMessage = "Streak at risk! Complete at least 1 exercise or challenge today to increment your streak.";
  } else {
    statusMessage = "Start your streak! Solve any chapter exercise or challenge today to begin Day 1.";
  }

  // Generate 7-day trailing window
  const recent7Days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const log = progress.activityHistory[dateStr];
    const completed = Boolean(
      log &&
        (log.exercisesCount > 0 ||
          log.scratchpadCount > 0 ||
          (log.dailyChallengesCount || 0) > 0)
    );

    recent7Days.push({
      date: dateStr,
      dayLabel: dayNames[d.getDay()],
      dayNum: String(d.getDate()),
      isToday: dateStr === today,
      isCompleted: completed,
      exercisesCount: log?.exercisesCount || 0,
      challengesCount: log?.dailyChallengesCount || 0,
      scratchpadCount: log?.scratchpadCount || 0,
    });
  }

  const longestStreak = Math.max(
    progress.longestStreak || 0,
    progress.dailyLearningStreak?.longestStreak || 0,
    activeStreak
  );

  const dailyLearningStreak: DailyLearningStreak = {
    currentStreak: activeStreak,
    longestStreak,
    lastCompletedDate: progress.lastActiveDate || "",
    hasCompletedToday: isCompletedToday,
    tasksCompletedToday,
    exercisesCompletedToday,
    challengesCompletedToday,
    streakDates: progress.dailyLearningStreak?.streakDates || [],
  };

  return {
    currentStreak: activeStreak,
    longestStreak,
    isCompletedToday,
    tasksCompletedToday,
    exercisesCompletedToday,
    challengesCompletedToday,
    lastActiveDate: progress.lastActiveDate,
    statusMessage,
    dailyLearningStreak,
    recent7Days,
  };
}

/**
 * Common internal function to advance daily streak upon exercise, challenge, or scratchpad completion.
 * Increments when a user completes at least one exercise or challenge per day.
 */
function applyDailyActivity(
  current: UserProgress,
  taskType: "exercise" | "scratchpad" | "challenge"
): { updated: UserProgress; streakIncreased: boolean; newStreak: number } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const prevLog = current.activityHistory[today] || {
    date: today,
    exercisesCount: 0,
    scratchpadCount: 0,
    dailyChallengesCount: 0,
  };

  const wasCompletedBeforeToday =
    prevLog.exercisesCount > 0 ||
    prevLog.scratchpadCount > 0 ||
    (prevLog.dailyChallengesCount || 0) > 0;

  const newLog: DailyActivityLog = {
    date: today,
    exercisesCount:
      taskType === "exercise" ? prevLog.exercisesCount + 1 : prevLog.exercisesCount,
    scratchpadCount:
      taskType === "scratchpad" ? prevLog.scratchpadCount + 1 : prevLog.scratchpadCount,
    dailyChallengesCount:
      taskType === "challenge"
        ? (prevLog.dailyChallengesCount || 0) + 1
        : prevLog.dailyChallengesCount || 0,
  };

  let newStreak = current.dailyLearningStreak?.currentStreak ?? current.currentStreak;
  let streakIncreased = false;

  // Check if this action activates today's streak:
  if (!wasCompletedBeforeToday) {
    // First activity of today!
    if (current.lastActiveDate === yesterday) {
      // User was active yesterday: increment streak!
      newStreak = (current.dailyLearningStreak?.currentStreak ?? current.currentStreak) + 1;
      streakIncreased = true;
    } else {
      // User either broke streak or this is day 1: start at 1
      newStreak = 1;
      streakIncreased = true;
    }
  }

  const updatedLongest = Math.max(
    current.longestStreak || 0,
    current.dailyLearningStreak?.longestStreak || 0,
    newStreak
  );

  const prevDates = current.dailyLearningStreak?.streakDates || [];
  const streakDates = Array.from(new Set([...prevDates, today])).sort();

  const dailyLearningStreak: DailyLearningStreak = {
    currentStreak: newStreak,
    longestStreak: updatedLongest,
    lastCompletedDate: today,
    hasCompletedToday: true,
    tasksCompletedToday:
      newLog.exercisesCount +
      (newLog.dailyChallengesCount || 0) +
      newLog.scratchpadCount,
    exercisesCompletedToday: newLog.exercisesCount,
    challengesCompletedToday: newLog.dailyChallengesCount || 0,
    streakDates,
  };

  const updated: UserProgress = {
    ...current,
    currentStreak: newStreak,
    longestStreak: updatedLongest,
    lastActiveDate: today,
    dailyLearningStreak,
    activityHistory: {
      ...current.activityHistory,
      [today]: newLog,
    },
  };

  return { updated, streakIncreased, newStreak };
}

export function recordExerciseCompletion(
  chapterId: string,
  submission: ExerciseSubmission
): {
  progress: UserProgress;
  creditsAdded: number;
  isFirstCompletion: boolean;
  streakIncreased: boolean;
  newStreak: number;
} {
  const current = loadUserProgress();
  const isFirstCompletion = !current.completedChapters.includes(chapterId);

  // If already completed with a higher or equal score, don't award duplicate base credits
  const prevSubmission = current.exerciseSubmissions[chapterId];
  let creditsToAdd = 0;

  if (isFirstCompletion) {
    creditsToAdd = submission.earnedCredits;
  } else if (prevSubmission && submission.score > prevSubmission.score) {
    const scoreDiffRatio = (submission.score - prevSubmission.score) / 100;
    creditsToAdd = Math.round(submission.earnedCredits * scoreDiffRatio);
  }

  const updatedCompleted = isFirstCompletion
    ? [...current.completedChapters, chapterId]
    : current.completedChapters;

  // Apply daily streak
  const { updated: withStreak, streakIncreased, newStreak } = applyDailyActivity(
    current,
    "exercise"
  );

  const updated: UserProgress = {
    ...withStreak,
    totalCredits: withStreak.totalCredits + creditsToAdd,
    completedChapters: updatedCompleted,
    exerciseSubmissions: {
      ...withStreak.exerciseSubmissions,
      [chapterId]: submission,
    },
  };

  saveUserProgress(updated);
  return {
    progress: updated,
    creditsAdded: creditsToAdd,
    isFirstCompletion,
    streakIncreased,
    newStreak,
  };
}

export function recordScratchpadTaskCompletion(): {
  progress: UserProgress;
  creditsAdded: number;
  streakIncreased: boolean;
  newStreak: number;
} {
  const current = loadUserProgress();
  const today = getTodayDateString();
  const prevLog = current.activityHistory[today];
  const isFirstScratchpadToday = !prevLog || prevLog.scratchpadCount === 0;

  // Give +15 credits bonus for first scratchpad practice of the day
  const creditsToAdd = isFirstScratchpadToday ? 15 : 0;

  const { updated: withStreak, streakIncreased, newStreak } = applyDailyActivity(
    current,
    "scratchpad"
  );

  const updated: UserProgress = {
    ...withStreak,
    totalCredits: withStreak.totalCredits + creditsToAdd,
  };

  saveUserProgress(updated);
  return {
    progress: updated,
    creditsAdded: creditsToAdd,
    streakIncreased,
    newStreak,
  };
}

export function recordDailyChallengeCompletion(
  puzzleId: string,
  bonusCredits: number
): {
  progress: UserProgress;
  creditsAdded: number;
  streakIncreased: boolean;
  newStreak: number;
  alreadyCompletedToday: boolean;
} {
  const current = loadUserProgress();
  const today = getTodayDateString();

  // Check if this puzzle was already completed by user today
  const existingCompletion = (current.completedDailyChallenges || []).find(
    (c) => c.puzzleId === puzzleId && c.date === today
  );

  const alreadyCompletedToday = Boolean(existingCompletion);
  const creditsToAdd = alreadyCompletedToday ? 0 : bonusCredits;

  const { updated: withStreak, streakIncreased, newStreak } = applyDailyActivity(
    current,
    "challenge"
  );

  const completedList = [...(withStreak.completedDailyChallenges || [])];
  if (!existingCompletion) {
    completedList.push({
      puzzleId,
      date: today,
      bonusCreditsEarned: creditsToAdd,
      completedAt: new Date().toISOString(),
    });
  }

  const updated: UserProgress = {
    ...withStreak,
    totalCredits: withStreak.totalCredits + creditsToAdd,
    completedDailyChallenges: completedList,
  };

  saveUserProgress(updated);
  return {
    progress: updated,
    creditsAdded: creditsToAdd,
    streakIncreased,
    newStreak,
    alreadyCompletedToday,
  };
}

export function claimCertificate(cert: ClaimedCertificate): UserProgress {
  const current = loadUserProgress();
  if (current.claimedCertificates.some((c) => c.milestoneId === cert.milestoneId)) {
    return current;
  }

  const updated: UserProgress = {
    ...current,
    claimedCertificates: [...current.claimedCertificates, cert],
  };

  saveUserProgress(updated);
  return updated;
}

export function resetProgress(): UserProgress {
  saveUserProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
}

/**
 * Automatically maps a user's age to the appropriate learning tier
 */
export function getLearnerModeForAge(age: number): LearnerMode {
  if (age < 13) return "child";
  if (age <= 21) return "student";
  return "pro";
}

/**
 * Authenticates or registers a user and syncs their profile + age-tailored mode
 */
export function loginUser(
  email: string,
  name: string,
  age: number,
  authProvider: "google" | "email" | "guest" = "email",
  id?: string
): UserProgress {
  const current = loadUserProgress();
  const mode = getLearnerModeForAge(age);
  const updatedUser: UserAccount = {
    id: id || current.user?.id || `usr_${Date.now()}`,
    email,
    name,
    age,
    authProvider,
    isAuthenticated: true,
    createdAt: current.user?.createdAt || new Date().toISOString(),
  };

  const updated: UserProgress = {
    ...current,
    learnerName: name,
    learnerMode: mode,
    user: updatedUser,
  };
  saveUserProgress(updated);
  return updated;
}

/**
 * Signs out the current user while preserving progress
 */
export function logoutUser(): UserProgress {
  const current = loadUserProgress();
  const updated: UserProgress = {
    ...current,
    user: undefined,
  };
  saveUserProgress(updated);
  return updated;
}


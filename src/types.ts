export type LearnerMode = "child" | "student" | "pro";

export type LevelTier = "foundation" | "medium" | "advanced";

export interface TestCase {
  id?: string;
  description: string;
  testCode: string; // code to run or assertion snippet
  expectedOutput?: string;
  isSecret?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: TestCase[];
  creditReward: number; // e.g., 100
  targetConcepts: string[];
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  level: LevelTier;
  title: string;
  shortDesc: string;
  estimatedMinutes: number;
  tags: string[];
  content: {
    overview: string;
    childAnalogy: string; // Fun metaphor / story for young learners
    studentConcept: string; // Structured CS concepts & syntax
    proDeepDive: string; // CPython internals, memory, PEP, best practices
    codeExamples: Array<{
      title: string;
      code: string;
      explanation: string;
    }>;
  };
  exercise: Exercise;
}

export interface ExerciseSubmission {
  chapterId: string;
  code: string;
  score: number; // 0 to 100
  passed: boolean;
  earnedCredits: number;
  completedAt: string;
  testResults: Array<{
    description: string;
    passed: boolean;
    actual?: string;
    expected?: string;
    error?: string;
  }>;
}

export interface AwardMilestone {
  id: string;
  level: LevelTier;
  requiredCredits: number;
  title: string;
  badgeName: string;
  badgeIcon: string;
  certificateTitle: string;
  description: string;
  skillsCertified: string[];
}

export interface ClaimedCertificate {
  id: string;
  milestoneId: string;
  recipientName: string;
  certificateTitle: string;
  level: LevelTier;
  claimedAt: string;
  verificationCode: string;
  totalCredits: number;
  skills: string[];
}

export interface DailyActivityLog {
  date: string; // "YYYY-MM-DD"
  exercisesCount: number;
  scratchpadCount: number;
  dailyChallengesCount?: number;
}

export interface DailyPuzzle {
  id: string;
  title: string;
  category: "Strings" | "OOPS" | "Logic" | "Math" | "Algorithms" | "Pythonic";
  difficulty: "Easy" | "Medium" | "Tricky";
  bonusCredits: number;
  description: string;
  starterCode: string;
  solutionCode?: string;
  hints: string[];
  testCases: TestCase[];
  authorTip?: string;
}

export interface CompletedDailyChallenge {
  puzzleId: string;
  date: string; // "YYYY-MM-DD"
  bonusCreditsEarned: number;
  completedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarSeed?: string;
  mode: LearnerMode;
  age?: number;
  totalCredits: number;
  streak: number;
  completedChaptersCount: number;
  certificatesCount: number;
  countryCode?: string;
  countryName?: string;
  badgeTitle: string;
  isCurrentUser?: boolean;
}

export interface UserAccount {
  id?: string;
  email: string;
  name: string;
  age: number;
  authProvider: "google" | "email" | "guest";
  isAuthenticated: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface DailyLearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string; // "YYYY-MM-DD"
  hasCompletedToday: boolean;
  tasksCompletedToday: number;
  exercisesCompletedToday: number;
  challengesCompletedToday: number;
  streakDates?: string[]; // Array of unique YYYY-MM-DD completion dates
}

export interface UserProgress {
  learnerName: string;
  learnerMode: LearnerMode;
  user?: UserAccount;
  totalCredits: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyLearningStreak?: DailyLearningStreak;
  activityHistory: Record<string, DailyActivityLog>;
  completedChapters: string[]; // chapter IDs
  exerciseSubmissions: Record<string, ExerciseSubmission>;
  claimedCertificates: ClaimedCertificate[];
  unlockedBadges: string[];
  completedDailyChallenges: CompletedDailyChallenge[];
}

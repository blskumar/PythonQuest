import { LeaderboardEntry, LearnerMode, UserProgress } from "../types";

export interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
}

export const PEER_LEARNERS: LeaderboardEntry[] = [
  {
    id: "peer-1",
    name: "Aarav Sharma",
    avatarSeed: "aarav",
    mode: "child",
    age: 11,
    totalCredits: 1420,
    streak: 15,
    completedChaptersCount: 8,
    certificatesCount: 3,
    countryCode: "IN",
    countryName: "India",
    badgeTitle: "Grand Python Master",
  },
  {
    id: "peer-2",
    name: "Elena Rostova",
    avatarSeed: "elena",
    mode: "pro",
    age: 28,
    totalCredits: 1380,
    streak: 21,
    completedChaptersCount: 8,
    certificatesCount: 3,
    countryCode: "DE",
    countryName: "Germany",
    badgeTitle: "Enterprise Architect",
  },
  {
    id: "peer-3",
    name: "David Chen",
    avatarSeed: "david",
    mode: "student",
    age: 19,
    totalCredits: 1250,
    streak: 14,
    completedChaptersCount: 7,
    certificatesCount: 2,
    countryCode: "US",
    countryName: "United States",
    badgeTitle: "Algorithms Scholar",
  },
  {
    id: "peer-4",
    name: "Sophia Martinez",
    avatarSeed: "sophia",
    mode: "child",
    age: 10,
    totalCredits: 1080,
    streak: 11,
    completedChaptersCount: 6,
    certificatesCount: 2,
    countryCode: "ES",
    countryName: "Spain",
    badgeTitle: "Code Adventurer",
  },
  {
    id: "peer-5",
    name: "Liam O'Connor",
    avatarSeed: "liam",
    mode: "pro",
    age: 31,
    totalCredits: 960,
    streak: 9,
    completedChaptersCount: 5,
    certificatesCount: 2,
    countryCode: "IE",
    countryName: "Ireland",
    badgeTitle: "Fullstack Engineer",
  },
  {
    id: "peer-6",
    name: "Ananya Patel",
    avatarSeed: "ananya",
    mode: "student",
    age: 16,
    totalCredits: 890,
    streak: 12,
    completedChaptersCount: 5,
    certificatesCount: 2,
    countryCode: "IN",
    countryName: "India",
    badgeTitle: "AP CS Prodigy",
  },
  {
    id: "peer-7",
    name: "Kenji Takahashi",
    avatarSeed: "kenji",
    mode: "student",
    age: 21,
    totalCredits: 790,
    streak: 8,
    completedChaptersCount: 4,
    certificatesCount: 2,
    countryCode: "JP",
    countryName: "Japan",
    badgeTitle: "Systems Scholar",
  },
  {
    id: "peer-8",
    name: "Chloe Dupont",
    avatarSeed: "chloe",
    mode: "child",
    age: 12,
    totalCredits: 730,
    streak: 7,
    completedChaptersCount: 4,
    certificatesCount: 1,
    countryCode: "FR",
    countryName: "France",
    badgeTitle: "Python Sprite",
  },
  {
    id: "peer-9",
    name: "Marcus Vance",
    avatarSeed: "marcus",
    mode: "pro",
    age: 35,
    totalCredits: 660,
    streak: 6,
    completedChaptersCount: 4,
    certificatesCount: 1,
    countryCode: "GB",
    countryName: "United Kingdom",
    badgeTitle: "Data Analyst",
  },
  {
    id: "peer-10",
    name: "Priya Nair",
    avatarSeed: "priya",
    mode: "student",
    age: 17,
    totalCredits: 540,
    streak: 9,
    completedChaptersCount: 3,
    certificatesCount: 1,
    countryCode: "SG",
    countryName: "Singapore",
    badgeTitle: "Code Apprentice",
  },
  {
    id: "peer-11",
    name: "Mateo Silva",
    avatarSeed: "mateo",
    mode: "child",
    age: 11,
    totalCredits: 460,
    streak: 5,
    completedChaptersCount: 3,
    certificatesCount: 1,
    countryCode: "BR",
    countryName: "Brazil",
    badgeTitle: "Game Creator",
  },
  {
    id: "peer-12",
    name: "Sarah Jenkins",
    avatarSeed: "sarah",
    mode: "pro",
    age: 29,
    totalCredits: 390,
    streak: 4,
    completedChaptersCount: 2,
    certificatesCount: 1,
    countryCode: "CA",
    countryName: "Canada",
    badgeTitle: "DevOps Explorer",
  },
  {
    id: "peer-13",
    name: "Noah Miller",
    avatarSeed: "noah",
    mode: "child",
    age: 9,
    totalCredits: 320,
    streak: 4,
    completedChaptersCount: 2,
    certificatesCount: 1,
    countryCode: "AU",
    countryName: "Australia",
    badgeTitle: "Robo-Snake Coder",
  },
  {
    id: "peer-14",
    name: "Fatima Al-Zahra",
    avatarSeed: "fatima",
    mode: "student",
    age: 20,
    totalCredits: 260,
    streak: 3,
    completedChaptersCount: 2,
    certificatesCount: 0,
    countryCode: "AE",
    countryName: "UAE",
    badgeTitle: "Python Enthusiast",
  },
  {
    id: "peer-15",
    name: "Daniel Park",
    avatarSeed: "daniel",
    mode: "pro",
    age: 26,
    totalCredits: 190,
    streak: 3,
    completedChaptersCount: 1,
    certificatesCount: 0,
    countryCode: "KR",
    countryName: "South Korea",
    badgeTitle: "ML Explorer",
  },
  {
    id: "peer-16",
    name: "Ethan Brown",
    avatarSeed: "ethan",
    mode: "student",
    age: 15,
    totalCredits: 140,
    streak: 2,
    completedChaptersCount: 1,
    certificatesCount: 0,
    countryCode: "US",
    countryName: "United States",
    badgeTitle: "Rising Coder",
  },
  {
    id: "peer-17",
    name: "Zoe Williams",
    avatarSeed: "zoe",
    mode: "child",
    age: 8,
    totalCredits: 90,
    streak: 2,
    completedChaptersCount: 1,
    certificatesCount: 0,
    countryCode: "GB",
    countryName: "United Kingdom",
    badgeTitle: "Puzzle Starter",
  },
];

/**
 * Injects the current user's actual progress into the global leaderboard pool,
 * sorts by credits, and computes relative rankings and overtaking margins.
 */
export function getAugmentedLeaderboard(progress: UserProgress): {
  entries: RankedLeaderboardEntry[];
  userEntry: RankedLeaderboardEntry;
  userRank: number;
  totalLearners: number;
  gapToNext: number | null;
  aheadOfUser: RankedLeaderboardEntry | null;
} {
  const currentUserId = "current-user";

  const userBadge =
    progress.totalCredits >= 1350
      ? "Python Grandmaster"
      : progress.totalCredits >= 750
      ? "Advanced OOP Master"
      : progress.totalCredits >= 300
      ? "Foundation Graduate"
      : progress.totalCredits >= 100
      ? "Rising Challenger"
      : "Novice Explorer";

  const currentUserItem: LeaderboardEntry = {
    id: currentUserId,
    name: progress.learnerName || "You",
    avatarSeed: progress.user?.email || "current-user",
    mode: progress.learnerMode,
    age: progress.user?.age,
    totalCredits: progress.totalCredits,
    streak: progress.currentStreak,
    completedChaptersCount: progress.completedChapters.length,
    certificatesCount: progress.claimedCertificates.length,
    countryCode: "US",
    countryName: "Global",
    badgeTitle: userBadge,
    isCurrentUser: true,
  };

  // Combine and sort
  const combined = [...PEER_LEARNERS.filter((p) => p.id !== currentUserId), currentUserItem];

  combined.sort((a, b) => {
    if (b.totalCredits !== a.totalCredits) {
      return b.totalCredits - a.totalCredits;
    }
    if (b.streak !== a.streak) {
      return b.streak - a.streak;
    }
    return b.completedChaptersCount - a.completedChaptersCount;
  });

  const ranked: RankedLeaderboardEntry[] = combined.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const userIndex = ranked.findIndex((r) => r.isCurrentUser);
  const userEntry = ranked[userIndex] || { ...currentUserItem, rank: ranked.length };
  const userRank = userIndex + 1;

  let gapToNext: number | null = null;
  let aheadOfUser: RankedLeaderboardEntry | null = null;

  if (userIndex > 0) {
    aheadOfUser = ranked[userIndex - 1];
    gapToNext = aheadOfUser.totalCredits - userEntry.totalCredits + 1;
  }

  return {
    entries: ranked,
    userEntry,
    userRank,
    totalLearners: ranked.length,
    gapToNext,
    aheadOfUser,
  };
}

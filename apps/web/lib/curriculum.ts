import curriculumData from "../../../content/python/curriculum.json";
import quizzesData from "../../../content/python/quizzes.json";
import levelQuizzesData from "../../../content/python/level-quizzes.json";

export interface Concept {
  name: string;
  explanation: string;
  example: string;
  practice: string;
  mistake: string;
}

export interface ChapterChallenge {
  title: string;
  prompt: string;
  starterCode: string;
  solutionPattern: RegExp;
  hints: string[];
  activityKey: string;
  baseXp: number;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ChapterMeta {
  order: number;
  title: string;
  slug: string;
  aliases: string[];
  overview: string;
  concepts: Concept[];
  challenge: ChapterChallenge;
  quizActivityKey: string;
  badge: BadgeInfo;
  requiredXp: number;
  nextSlug: string | null;
  prevSlug: string | null;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
}

const CHAPTER_CONFIGS: Array<{
  order: number;
  slug: string;
  aliases: string[];
  activityKey: string;
  quizActivityKey: string;
  challengeTitle: string;
  challengePrompt: string;
  starterCode: string;
  solutionPattern: RegExp;
  hints: string[];
  badge: BadgeInfo;
  requiredXp: number;
}> = [
  {
    order: 1,
    slug: "meet-python",
    aliases: ["variables", "meet-python", "1", "01"],
    activityKey: "variables-challenge",
    quizActivityKey: "variables-quiz-v2",
    challengeTitle: "Store the quest reward",
    challengePrompt: "Create a variable named quest_xp, give it the value 50, and print it to the console.",
    starterCode: `# Store the reward for this quest in a variable\nquest_xp = 0\nprint(quest_xp)`,
    solutionPattern: /\bquest_xp\s*=\s*50\b/,
    hints: [
      "A variable assignment uses the = symbol.",
      "The variable name must be quest_xp.",
      "Replace 0 with the number 50, then run your code.",
    ],
    badge: {
      id: "python-explorer",
      name: "Python Explorer",
      description: "Completed your first Python lesson & challenge",
      icon: "🐍",
    },
    requiredXp: 0,
  },
  {
    order: 2,
    slug: "make-decisions",
    aliases: ["decisions", "make-decisions", "2", "02"],
    activityKey: "decisions-challenge",
    quizActivityKey: "decisions-quiz-v1",
    challengeTitle: "Unlock a chapter",
    challengePrompt: "Create unlocked = True and print it.",
    starterCode: `# Mark the chapter as unlocked\nunlocked = False\nprint(unlocked)`,
    solutionPattern: /\bunlocked\s*=\s*True\b/,
    hints: [
      "Set unlocked to True with a capital T.",
      "Assignment uses a single equals sign.",
      "Run your code to confirm True is printed.",
    ],
    badge: {
      id: "decision-maker",
      name: "Decision Maker",
      description: "Mastered conditional logic and branching",
      icon: "🧭",
    },
    requiredXp: 50,
  },
  {
    order: 3,
    slug: "repeat-yourself",
    aliases: ["loops", "repeat-yourself", "3", "03"],
    activityKey: "loops-challenge",
    quizActivityKey: "loops-quiz-v1",
    challengeTitle: "Repeat a quest",
    challengePrompt: "Create a loop that prints the number 3.",
    starterCode: `# Print a quest count\nfor count in range(1):\n    print(3)`,
    solutionPattern: /print\s*\(\s*3\s*\)/,
    hints: [
      "Use range or a loop counter.",
      "Inside the loop, call print(3).",
      "Check that your output displays 3.",
    ],
    badge: {
      id: "loop-hero",
      name: "Loop Hero",
      description: "Mastered repetition with loops and ranges",
      icon: "🔁",
    },
    requiredXp: 100,
  },
  {
    order: 4,
    slug: "lists",
    aliases: ["lists", "4", "04"],
    activityKey: "lists-challenge",
    quizActivityKey: "lists-quiz-v1",
    challengeTitle: "Collect your tools",
    challengePrompt: "Create a list named tools with at least three items.",
    starterCode: `# Build your toolkit\ntools = ["compass", "map", "torch"]\nprint(tools)`,
    solutionPattern: /\btools\s*=\s*\[[^\]]+,[^\]]+,[^\]]+\]/,
    hints: [
      "Lists use square brackets [...].",
      "Separate each item with a comma.",
      "Add at least 3 items to tools and print it.",
    ],
    badge: {
      id: "list-legend",
      name: "List Legend",
      description: "Mastered Python lists and sequences",
      icon: "🎒",
    },
    requiredXp: 150,
  },
  {
    order: 5,
    slug: "functions",
    aliases: ["functions", "5", "05"],
    activityKey: "functions-challenge",
    quizActivityKey: "functions-quiz-v1",
    challengeTitle: "Build a reusable skill",
    challengePrompt: "Define a function named greet that prints a greeting.",
    starterCode: `# Define your skill\ndef greet():\n    print("Welcome, explorer!")\n\ngreet()`,
    solutionPattern: /def\s+greet\s*\([^)]*\)\s*:/,
    hints: [
      "Define the function using def greet():",
      "Indent the function body.",
      "Call greet() to run your new function.",
    ],
    badge: {
      id: "function-builder",
      name: "Function Builder",
      description: "Created modular, reusable functions",
      icon: "🧩",
    },
    requiredXp: 200,
  },
  {
    order: 6,
    slug: "strings",
    aliases: ["strings", "6", "06"],
    activityKey: "strings-challenge",
    quizActivityKey: "strings-quiz-v1",
    challengeTitle: "Format and slice text",
    challengePrompt: "Clean raw text with .strip() and make it uppercase, then print it.",
    starterCode: `raw = "  python quest  "\nclean = raw.strip().upper()\nprint(clean)`,
    solutionPattern: /raw\s*\.\s*(?:strip\s*\(\s*\)\s*\.\s*upper|upper\s*\(\s*\)\s*\.\s*strip)\s*\(\s*\)|\bclean\s*=\s*["']PYTHON QUEST["']/,
    hints: [
      "Call .strip() on the raw string to remove surrounding spaces.",
      "Call .upper() to convert all characters to uppercase.",
      "Store the cleaned text and print it.",
    ],
    badge: {
      id: "string-wizard",
      name: "String Wizard",
      description: "Mastered string operations and text slicing",
      icon: "🧵",
    },
    requiredXp: 250,
  },
  {
    order: 7,
    slug: "dictionaries",
    aliases: ["dictionaries", "7", "07"],
    activityKey: "dictionaries-challenge",
    quizActivityKey: "dictionaries-quiz-v1",
    challengeTitle: "Model learner stats",
    challengePrompt: "Create a dictionary named player with keys 'name' and 'xp', then print player['xp'].",
    starterCode: `# Model player stats with key-value pairs\nplayer = {\n    "name": "Ada",\n    "xp": 50\n}\nprint(player["xp"])`,
    solutionPattern: /\bplayer\s*=\s*\{[^}]*["']name["'][^}]*["']xp["'][^}]*\}/,
    hints: [
      "Dictionaries use curly brackets { key: value }.",
      "Provide string keys 'name' and 'xp'.",
      "Print player['xp'] to inspect the value.",
    ],
    badge: {
      id: "data-architect",
      name: "Data Architect",
      description: "Mastered dictionaries and structured data",
      icon: "🗃️",
    },
    requiredXp: 300,
  },
  {
    order: 8,
    slug: "problem-solving",
    aliases: ["problem-solving", "8", "08"],
    activityKey: "problem-solving-challenge",
    quizActivityKey: "problem-solving-quiz-v1",
    challengeTitle: "Calculate a total with tracing",
    challengePrompt: "Sum the values in numbers = [10, 20, 30] into a variable total and print total.",
    starterCode: `numbers = [10, 20, 30]\ntotal = 0\nfor n in numbers:\n    total += n\nprint(total)`,
    solutionPattern: /\btotal\s*=\s*(?:sum\(numbers\)|0\s*\n\s*for\s+\w+\s+in\s+numbers:\s*total\s*\+=\s*\w+)/,
    hints: [
      "Start total at 0.",
      "Loop through each item in numbers and add it to total.",
      "Print total after the loop completes.",
    ],
    badge: {
      id: "bug-hunter",
      name: "Bug Hunter",
      description: "Mastered tracebacks, debugging and step-by-step logic",
      icon: "🔍",
    },
    requiredXp: 350,
  },
  {
    order: 9,
    slug: "mini-project",
    aliases: ["mini-project", "9", "09"],
    activityKey: "mini-project-challenge",
    quizActivityKey: "mini-project-quiz-v1",
    challengeTitle: "Number guessing checkpoint",
    challengePrompt: "Compare guess to secret = 7. If guess == secret, print 'Correct!'.",
    starterCode: `secret = 7\nguess = 7\nif guess == secret:\n    print("Correct!")\nelse:\n    print("Try again")`,
    solutionPattern: /if\s+guess\s*==\s*secret\s*:\s*\n\s*print\s*\(\s*["']Correct!?["']\s*\)/,
    hints: [
      "Use double equals == for comparison.",
      "Print 'Correct!' when the guess matches secret.",
      "Indent the code inside the if statement.",
    ],
    badge: {
      id: "mini-builder",
      name: "Mini Builder",
      description: "Built a working number guessing project",
      icon: "🎲",
    },
    requiredXp: 400,
  },
  {
    order: 10,
    slug: "final-project",
    aliases: ["final-project", "10"],
    activityKey: "final-project-challenge",
    quizActivityKey: "final-project-quiz-v1",
    challengeTitle: "Adventure room explorer",
    challengePrompt: "Define explore(room) that returns 'Treasure!' if room == 'cave' else 'Empty room', then call and print it.",
    starterCode: `def explore(room):\n    if room == "cave":\n        return "Treasure!"\n    return "Empty room"\n\nprint(explore("cave"))`,
    solutionPattern: /def\s+explore\s*\(\s*room\s*\)\s*:/,
    hints: [
      "Define explore with a parameter room.",
      "Return 'Treasure!' if room == 'cave'.",
      "Call explore('cave') inside a print statement.",
    ],
    badge: {
      id: "python-quest-legend",
      name: "Python Quest Legend",
      description: "Completed the final capstone text adventure",
      icon: "🏆",
    },
    requiredXp: 450,
  },
];

export const ALL_BADGES: BadgeInfo[] = [
  ...CHAPTER_CONFIGS.map((c) => c.badge),
  {
    id: "variable-explorer",
    name: "Variable Explorer",
    description: "Mastered Python variables and types",
    icon: "📦",
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintained an active quest streak",
    icon: "🔥",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Scored 100% on a quiz checkpoint without using hints",
    icon: "⭐",
  },
];

export function getAllChapters(): ChapterMeta[] {
  return curriculumData.chapters.map((curriculumChapter, index) => {
    const config = CHAPTER_CONFIGS[index] ?? {
      order: curriculumChapter.order,
      slug: `chapter-${curriculumChapter.order}`,
      aliases: [String(curriculumChapter.order)],
      activityKey: `chapter-${curriculumChapter.order}-challenge`,
      quizActivityKey: `chapter-${curriculumChapter.order}-quiz`,
      challengeTitle: `Master ${curriculumChapter.title}`,
      challengePrompt: `Practice concepts from ${curriculumChapter.title}`,
      starterCode: `# Quest ${curriculumChapter.order}\nprint("${curriculumChapter.title}")`,
      solutionPattern: /print\s*\(/,
      hints: ["Read the concepts above for guidance."],
      badge: {
        id: `badge-${curriculumChapter.order}`,
        name: `${curriculumChapter.title} Explorer`,
        description: `Completed ${curriculumChapter.title}`,
        icon: "✨",
      },
      requiredXp: (curriculumChapter.order - 1) * 50,
    };

    const nextConfig = CHAPTER_CONFIGS[index + 1];
    const prevConfig = CHAPTER_CONFIGS[index - 1];

    return {
      order: curriculumChapter.order,
      title: curriculumChapter.title,
      slug: config.slug,
      aliases: config.aliases,
      overview: curriculumChapter.overview,
      concepts: curriculumChapter.concepts,
      challenge: {
        title: config.challengeTitle,
        prompt: config.challengePrompt,
        starterCode: config.starterCode,
        solutionPattern: config.solutionPattern,
        hints: config.hints,
        activityKey: config.activityKey,
        baseXp: 50,
      },
      quizActivityKey: config.quizActivityKey,
      badge: config.badge,
      requiredXp: config.requiredXp,
      nextSlug: nextConfig ? nextConfig.slug : null,
      prevSlug: prevConfig ? prevConfig.slug : null,
    };
  });
}

export function getChapterBySlug(slugOrAlias: string): ChapterMeta | null {
  const normalized = slugOrAlias.toLowerCase().trim();
  const chapters = getAllChapters();
  const found = chapters.find(
    (c) =>
      c.slug.toLowerCase() === normalized ||
      c.aliases.map((a) => a.toLowerCase()).includes(normalized) ||
      String(c.order) === normalized
  );
  return found || null;
}

export function getQuizForChapter(
  slugOrOrder: string | number,
  learnerLevel?: string | null
): { questions: QuizQuestion[]; title: string; order: number } | null {
  const chapter =
    typeof slugOrOrder === "number"
      ? getAllChapters().find((c) => c.order === slugOrOrder)
      : getChapterBySlug(slugOrOrder);

  if (!chapter) return null;

  // Adaptive Quiz Level for Chapter 1
  if (chapter.order === 1 && learnerLevel) {
    const normLevel = learnerLevel.toLowerCase();
    const audience: "junior" | "student" | "professional" =
      normLevel.includes("student")
        ? "student"
        : normLevel.includes("junior")
        ? "junior"
        : "professional";

    const levelQuestions = levelQuizzesData.chapters[0]?.levels?.[audience];
    if (levelQuestions && levelQuestions.length > 0) {
      return {
        questions: levelQuestions,
        title: chapter.title,
        order: chapter.order,
      };
    }
  }

  // Fallback to standard quizzes.json
  const standardChapter = quizzesData.chapters.find((c) => c.order === chapter.order);
  if (standardChapter && standardChapter.questions) {
    return {
      questions: standardChapter.questions,
      title: chapter.title,
      order: chapter.order,
    };
  }

  return null;
}

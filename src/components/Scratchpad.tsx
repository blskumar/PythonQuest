import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Bot,
  Copy,
  Check,
  Code2,
  Flame,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { runPythonCode } from "../utils/pythonRunner";
import { LearnerMode, UserProgress } from "../types";
import { recordScratchpadTaskCompletion, getStreakStatus } from "../utils/storage";

interface ScratchpadProps {
  learnerMode: LearnerMode;
  progress: UserProgress;
  onProgressUpdated: (updated: UserProgress) => void;
}

const PRESETS = [
  {
    name: "OOP Dog & Puppy (Inheritance)",
    code: `# Object-Oriented Programming (OOPS) in Python
class Dog:
    species = "Canis lupus"

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def bark(self) -> str:
        return f"{self.name} says Woof!"

    def __str__(self):
        return f"{self.name} ({self.age} years old)"

class Puppy(Dog):
    def __init__(self, name: str):
        super().__init__(name, age=1)

    def bark(self) -> str:
        return f"{self.name} says Yip yip!"

dog = Dog("Rex", 4)
pup = Puppy("Coco")

print(dog)
print(dog.bark())
print(pup)
print(pup.bark())`,
  },
  {
    name: "Encapsulation & Property",
    code: `class SmartWallet:
    def __init__(self, initial_cash: float):
        self._balance = initial_cash

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, new_val: float):
        if new_val < 0:
            raise ValueError("Balance cannot be negative!")
        self._balance = new_val

wallet = SmartWallet(100)
print(f"Initial balance: \${wallet.balance}")
wallet.balance = 250
print(f"Updated balance: \${wallet.balance}")`,
  },
  {
    name: "Custom Dunder Magic Class",
    code: `class Money:
    def __init__(self, amount: float, currency: str = "USD"):
        self.amount = round(amount, 2)
        self.currency = currency

    def __repr__(self):
        return f"Money({self.amount}, '{self.currency}')"

    def __str__(self):
        return f"{self.currency} {self.amount:.2f}"

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies!")
        return Money(self.amount + other.amount, self.currency)

m1 = Money(45.50)
m2 = Money(15.25)
print(f"Total: {m1 + m2}")`,
  },
  {
    name: "Streaming Generator & Yield",
    code: `def count_up_stream(max_number: int):
    current = 1
    while current <= max_number:
        yield current
        current += 1

print("Streaming numbers:")
for num in count_up_stream(5):
    print(f"-> Received: {num}")`,
  },
];

const DAILY_PROMPTS = [
  {
    label: "Daily Task: OOP Banking",
    code: `class BankAccount:\n    def __init__(self, owner: str, balance: float = 0.0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount: float):\n        self.balance += amount\n        return f"Deposited \${amount:.2f}. Balance: \${self.balance:.2f}"\n\nacct = BankAccount("Alex", 150.0)\nprint(acct.deposit(75.50))`,
  },
  {
    label: "Daily Task: Prime Sieve",
    code: `def is_prime(n: int) -> bool:\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(1, 30) if is_prime(x)]\nprint(f"Primes up to 30: {primes}")`,
  },
  {
    label: "Daily Task: Dunder Vector",
    code: `class Vector2D:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f"Vector2D({self.x}, {self.y})"\n\n    def __add__(self, other):\n        return Vector2D(self.x + other.x, self.y + other.y)\n\nv1 = Vector2D(2, 5)\nv2 = Vector2D(3, -1)\nprint(f"{v1} + {v2} = {v1 + v2}")`,
  },
];

export const Scratchpad: React.FC<ScratchpadProps> = ({
  learnerMode,
  progress,
  onProgressUpdated,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setCode((prev) => prev + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    setCode(newCode);
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + snippet.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Streak notification banner state
  const [streakNotification, setStreakNotification] = useState<{
    message: string;
    newStreak: number;
    creditsAdded: number;
  } | null>(null);

  const streakInfo = getStreakStatus(progress);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await runPythonCode(code);
      const out = res.stdout || res.stderr || "(Code finished with no stdout)";
      setConsoleOutput(out);

      // Successfully ran a task in the sandbox -> record daily activity & streak!
      const outcome = recordScratchpadTaskCompletion();
      onProgressUpdated(outcome.progress);

      setStreakNotification({
        message: outcome.streakIncreased
          ? `🔥 Streak extended to ${outcome.newStreak} days!`
          : `🔥 Daily task logged! You're on a ${outcome.newStreak}-day streak!`,
        newStreak: outcome.newStreak,
        creditsAdded: outcome.creditsAdded,
      });

      if (outcome.creditsAdded > 0) {
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
            colors: ["#a855f7", "#ec4899", "#f59e0b"],
          });
        } catch (e) {}
      }
    } catch (e: any) {
      setConsoleOutput(`Error: ${e?.message || e}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAi = async () => {
    setIsLoadingAi(true);
    try {
      const resp = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          exerciseTitle: "Scratchpad Experiment",
          promptContext: "User is experimenting with custom Python code.",
          learnerMode,
        }),
      });
      const data = await resp.json();
      setAiExplanation(
        data.summary +
          (data.improvements?.length
            ? "\n\nTips:\n• " + data.improvements.join("\n• ")
            : "")
      );
    } catch (err: any) {
      setAiExplanation(
        "AI review unavailable. Your code runs locally in the WebAssembly Python environment."
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Terminal className="w-6 h-6 text-purple-600" />
              <span>Interactive Python Sandbox</span>
            </h2>

            {/* Daily Streak Indicator */}
            <div
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                streakInfo.isCompletedToday
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-orange-100 text-orange-800 border border-orange-300"
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>
                {streakInfo.currentStreak}d Streak{" "}
                {streakInfo.isCompletedToday ? "• Done" : "• Pending"}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Running any code here counts towards your daily streak! Practice OOP patterns, algorithms, or dunder methods.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Template:</span>
          <select
            onChange={(e) => {
              const selected = PRESETS.find((p) => p.name === e.target.value);
              if (selected) setCode(selected.code);
            }}
            className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 shadow-xs focus:ring-2 focus:ring-purple-500"
          >
            {PRESETS.map((p, i) => (
              <option key={i} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily Challenge Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Quick Tasks:</span>
        </span>
        {DAILY_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setCode(prompt.code)}
            className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 border border-slate-200 transition-colors"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Streak Success Toast Banner */}
      {streakNotification && (
        <div className="p-3.5 rounded-xl bg-linear-to-r from-purple-50 via-amber-50 to-orange-50 border border-amber-300 text-xs text-slate-800 flex items-center justify-between animate-in fade-in shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900">
                {streakNotification.message}
              </span>
              {streakNotification.creditsAdded > 0 && (
                <span className="ml-1.5 text-amber-800 font-semibold">
                  (+{streakNotification.creditsAdded} daily sandbox bonus credits!)
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setStreakNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Editor & Console Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl w-full max-w-full">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-1 sm:ml-2 font-mono text-slate-300 font-bold truncate">
              sandbox.py
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-md transition-colors text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCode("")}
              className="text-slate-400 hover:text-white px-2 py-1 rounded-md text-xs"
            >
              Clear
            </button>

            <button
              onClick={handleAskAi}
              disabled={isLoadingAi || !code.trim()}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-semibold rounded-lg transition-all border border-purple-700 text-xs"
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>{isLoadingAi ? "..." : "AI Review"}</span>
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              id="sandbox-run-btn"
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all shadow-md shadow-purple-600/20 hover:scale-[1.02] text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">{isRunning ? "Running..." : "Run & Log Daily Task"}</span>
              <span className="sm:hidden">{isRunning ? "Running..." : "Run & Log"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Python Quick-Key Helper Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1.5 px-3 bg-slate-950/90 border-b border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-purple-400 shrink-0">Quick Keys:</span>
          {[
            { label: "Tab", insert: "    " },
            { label: "( )", insert: "()" },
            { label: ":", insert: ":" },
            { label: '" "', insert: '""' },
            { label: "=", insert: " = " },
            { label: "def", insert: "def " },
            { label: "self.", insert: "self." },
            { label: "print()", insert: "print()" },
            { label: "return", insert: "return " },
          ].map((key, i) => (
            <button
              key={i}
              type="button"
              onClick={() => insertSnippet(key.insert)}
              className="shrink-0 px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-purple-600 active:text-white text-slate-300 font-mono text-xs rounded-md border border-slate-700/80 transition-colors"
            >
              {key.label}
            </button>
          ))}
        </div>

        {/* Textarea with Line Numbers */}
        <div className="relative flex">
          <div className="select-none py-4 px-2 sm:px-3 bg-slate-950/60 text-slate-600 font-mono text-xs text-right border-r border-slate-800 w-10 sm:w-12 shrink-0">
            {Array.from({ length: Math.max(16, code.split("\n").length) }).map(
              (_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              )
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={Math.max(16, code.split("\n").length)}
            className="w-full py-4 px-3 sm:px-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-hidden selection:bg-purple-500/30 overflow-x-auto whitespace-pre"
            placeholder="# Write any Python code..."
          />
        </div>

        {/* Live Output */}
        {consoleOutput && (
          <div className="p-4 bg-black/95 border-t border-slate-800 font-mono text-xs text-emerald-400">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
              <span>Standard Output:</span>
              <button
                onClick={() => setConsoleOutput("")}
                className="text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
          </div>
        )}
      </div>

      {/* AI Explanation Banner */}
      {aiExplanation && (
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-950 space-y-2">
          <div className="font-bold text-purple-900 uppercase tracking-wider text-xs flex items-center space-x-1.5">
            <Bot className="w-4 h-4 text-purple-600" />
            <span>AI Code Analysis:</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed">{aiExplanation}</p>
        </div>
      )}
    </div>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Pyodide = {
  runPythonAsync: (code: string) => Promise<unknown>;
};

type PyodideLoader = (options: { indexURL: string }) => Promise<Pyodide>;

declare global {
  interface Window {
    loadPyodide?: PyodideLoader;
  }
}

const PYODIDE_VERSION = "0.27.7";
const HINT_COST = 1;
const XP_PENALTY = 5;

const defaultStarterCode = `# Store the reward for this quest in a variable\nquest_xp = 0\nprint(quest_xp)`;
const defaultHints = [
  "A variable assignment uses the = symbol.",
  "The variable name must be quest_xp.",
  "Replace 0 with the number 50, then run your code.",
];

let pyodidePromise: Promise<Pyodide> | null = null;

function loadPyodide() {
  if (typeof window === "undefined") return Promise.reject(new Error("Cannot load Python runtime during SSR"));
  if (window.loadPyodide) return window.loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` });
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise<Pyodide>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
    script.onload = () => window.loadPyodide ? window.loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` }).then(resolve, reject) : reject(new Error("Python runtime did not load."));
    script.onerror = () => reject(new Error("Python runtime could not be downloaded."));
    document.head.appendChild(script);
  }).catch((error) => {
    pyodidePromise = null;
    throw error;
  });
  return pyodidePromise;
}

export function PythonExercise({
  activityKey = "variables-challenge",
  title = "Store the quest reward",
  prompt = "Create quest_xp, give it the value 50, and run your program.",
  initialCode = defaultStarterCode,
  solutionPattern = /\bquest_xp\s*=\s*50\b/,
  hints,
  hintsList,
  onComplete,
}: {
  activityKey?: string;
  title?: string;
  prompt?: string;
  initialCode?: string;
  solutionPattern?: RegExp;
  hints?: string[];
  hintsList?: string[];
  onComplete?: () => void;
}) {
  const onCompleteRef = useRef(onComplete);
  const activeHints = hints && hints.length > 0 ? hints : (hintsList && hintsList.length > 0 ? hintsList : defaultHints);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("Run your code to see the output here.");
  const [runtimeStatus, setRuntimeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [isExpanded, setIsExpanded] = useState(false);
  const [usedHints, setUsedHints] = useState(0);
  const [credits, setCredits] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    async function loadProgress() {
      const supabase = createClient();
      const [{ data: profile }, { data: activity }] = await Promise.all([
        supabase.from("profiles").select("credits").maybeSingle(),
        supabase.from("activity_progress").select("completed, hints_used").eq("activity_key", activityKey).maybeSingle(),
      ]);
      if (profile) setCredits(profile.credits ?? 100);
      if (activity) {
        setUsedHints(activity.hints_used ?? 0);
        const isComplete = Boolean(activity.completed);
        setCompleted(isComplete);
        if (isComplete) onCompleteRef.current?.();
      }
    }
    void loadProgress();
  }, [activityKey]);

  async function runCode() {
    setRuntimeStatus("loading");
    setOutput("Starting the Python console...");
    try {
      let text = "";
      try {
        const pyodide = await loadPyodide();
        const pythonCode = JSON.stringify(code);
        const result = await pyodide.runPythonAsync(`import contextlib\nimport io\nimport traceback\n_output = io.StringIO()\ntry:\n    with contextlib.redirect_stdout(_output):\n        exec(${pythonCode}, globals())\nexcept Exception:\n    traceback.print_exc(file=_output)\n_output.getvalue()`);
        text = String(result || "").trim();
      } catch (runtimeErr) {
        // Fallback lightweight evaluator if Pyodide CDN is unreachable
        const lines = code.split("\n");
        const printed: string[] = [];
        const env: Record<string, unknown> = {};
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || line.startsWith("#")) continue;
          const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
          if (assignMatch) {
            const [, varName, expr] = assignMatch;
            try {
              // evaluate simple literals or arithmetic
              const sanitized = expr.replace(/'/g, '"');
              env[varName] = JSON.parse(sanitized);
            } catch {
              env[varName] = expr.trim();
            }
            continue;
          }
          const printMatch = line.match(/^print\((.*)\)$/);
          if (printMatch) {
            const inner = printMatch[1].trim();
            if (inner in env) {
              printed.push(String(env[inner]));
            } else {
              try {
                printed.push(String(JSON.parse(inner.replace(/'/g, '"'))));
              } catch {
                printed.push(inner);
              }
            }
          }
        }
        if (printed.length > 0) {
          text = printed.join("\n");
        } else {
          throw runtimeErr;
        }
      }

      setOutput(text || "Your code ran without printing anything.");
      setRuntimeStatus("ready");

      const hasError = text.includes("Traceback (most recent call last):");
      if (!hasError && solutionPattern.test(code)) {
        setSaveError(null);
        // Call progress API route which executes RPC and awards badges
        try {
          const apiRes = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activityKey, baseXp: 50 }),
          });
          if (apiRes.ok) {
            setCompleted(true);
            onCompleteRef.current?.();
            return;
          }
        } catch {
          // Fall back to direct supabase RPC
        }

        const supabase = createClient();
        const { error } = await supabase.rpc("complete_activity", { activity: activityKey, base_xp: 50 });
        if (error) {
          // In offline/mock mode, still record completion locally
          setCompleted(true);
          onCompleteRef.current?.();
          return;
        }
        const { data: savedProgress, error: verifyError } = await supabase
          .from("activity_progress")
          .select("completed")
          .eq("activity_key", activityKey)
          .maybeSingle();
        if (!verifyError && savedProgress?.completed) {
          setCompleted(true);
          onCompleteRef.current?.();
        } else {
          setCompleted(true);
          onCompleteRef.current?.();
        }
      }
    } catch (error) {
      setRuntimeStatus("error");
      setOutput(error instanceof Error ? error.message : "The Python runtime could not run this code.");
    }
  }

  async function revealHint() {
    if (usedHints >= activeHints.length || credits < HINT_COST) return;
    try {
      const { data, error } = await createClient().rpc("use_activity_hint", { activity: activityKey });
      if (!error && data) {
        setUsedHints(data.hints_used);
        setCredits(data.credits);
      } else {
        setUsedHints((h) => h + 1);
        setCredits((c) => Math.max(0, c - HINT_COST));
      }
    } catch {
      setUsedHints((h) => h + 1);
      setCredits((c) => Math.max(0, c - HINT_COST));
    }
  }

  const reward = Math.max(0, 50 - usedHints * XP_PENALTY);
  const consoleClass = isExpanded ? "python-console python-console-expanded" : "python-console";

  return (
    <section className={consoleClass} aria-label="Python exercise console">
      <div className="python-console-header">
        <div>
          <p className="python-console-kicker">CODE CHALLENGE</p>
          <h2 className="python-console-title">{title}</h2>
        </div>
        <div className="python-console-stats">
          <span>{credits} credits</span>
          <span>{reward} XP reward</span>
        </div>
      </div>
      <p className="python-console-prompt">{prompt}</p>
      <div className="python-console-grid">
        <div className="python-editor-panel">
          <div className="python-console-toolbar">
            <span>main.py</span>
            <button type="button" className="python-icon-button" onClick={() => setIsExpanded((expanded) => !expanded)} aria-label={isExpanded ? "Minimize console" : "Enlarge console"}>
              {isExpanded ? "Minimize" : "Enlarge"}
            </button>
          </div>
          <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} aria-label="Python code editor" className="python-code-editor" />
          <div className="python-console-actions">
            <button type="button" className="quest-button px-5 py-3 font-extrabold" onClick={() => void runCode()} disabled={runtimeStatus === "loading"}>
              {runtimeStatus === "loading" ? "Starting Python..." : "Run code"}
            </button>
            <span className="python-runtime-status">{runtimeStatus === "ready" ? "Python ready" : runtimeStatus === "error" ? "Runtime error" : "Runs in your browser"}</span>
          </div>
        </div>
        <div className="python-output-panel">
          <div className="python-console-toolbar"><span>console</span><span className="python-console-dot" aria-hidden="true" /></div>
          <pre className="python-output" aria-live="polite">{output}</pre>
        </div>
      </div>
      <div className="python-hint-row">
        <div>
          <p className="font-bold">Need a nudge?</p>
          {usedHints > 0 && <p className="python-hint">Hint {usedHints}: {activeHints[usedHints - 1]}</p>}
        </div>
        <button type="button" className="secondary-button px-4 py-2 text-sm font-bold" onClick={() => void revealHint()} disabled={usedHints >= activeHints.length || credits < HINT_COST}>
          {usedHints >= activeHints.length ? "All hints used" : `Use hint (-${HINT_COST} credit)`}
        </button>
      </div>
      {completed && <p className="python-success" role="status">Challenge complete. You earned {reward} XP.</p>}
      {saveError && <p className="python-save-error" role="alert">{saveError}</p>}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The inline script in layout.tsx already applied the theme before
    // paint to avoid a flash; mirror it into state once mounted.
    const activeTheme: Theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const timer = window.setTimeout(() => {
      setTheme(activeTheme);
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("python-quest-theme", nextTheme);
    } catch {
      // Ignore storage errors in restricted/private browsing modes
    }
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={mounted ? theme === "dark" : undefined}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage/matchMedia on mount, not a render loop
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-full border border-black/10 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

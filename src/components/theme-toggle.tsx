"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Alternância de tema claro/escuro.
 * Sem estado React: o ícone visível é controlado pela classe `.dark` do <html>
 * (via CSS `dark:hidden`/`dark:block`), então não há flash nem mismatch de hidratação.
 */
export function ThemeToggle({ label }: { label: string }) {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0a0a0b" : "#fafafa");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="focus-ring inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {/* Sol visível no modo escuro, lua no modo claro (mostra o tema de destino) */}
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}

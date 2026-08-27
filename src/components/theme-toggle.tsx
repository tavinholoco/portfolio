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
      ?.setAttribute("content", next === "dark" ? "#0b0b0c" : "#f0f0f0");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      /* Sem cor nem fundo próprios: vive dentro do header em mix-blend-difference,
         onde qualquer cor explícita inverteria por conta própria. Hierarquia por
         opacidade, como manda a seção 8 do plano. */
      className="focus-ring inline-flex size-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100"
    >
      {/* Sol visível no modo escuro, lua no modo claro (mostra o tema de destino) */}
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}

"use client";

import { Languages } from "lucide-react";

import type { Locale } from "@/i18n";

/** Alterna o idioma navegando para a rota correspondente: / (pt) ou /en/ (en). */
export function LangToggle({
  lang,
  labels,
}: {
  lang: Locale;
  labels: { toEnglish: string; toPortuguese: string };
}) {
  const next: Locale = lang === "pt" ? "en" : "pt";
  const href = next === "en" ? "/en/" : "/";
  const label = lang === "pt" ? labels.toEnglish : labels.toPortuguese;

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Languages className="size-4" aria-hidden />
      {next.toUpperCase()}
    </a>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import type { Locale } from "@/i18n";
import { translatedPath } from "@/lib/lang-path";

/**
 * Alterna o idioma navegando para a rota correspondente, preservando o contexto:
 * na home troca `/` ↔ `/en/`; numa página de projeto troca
 * `/projetos/[slug]/` ↔ `/en/projects/[slug]/`.
 */
export function LangToggle({
  lang,
  labels,
}: {
  lang: Locale;
  labels: { toEnglish: string; toPortuguese: string };
}) {
  const pathname = usePathname();
  const next: Locale = lang === "pt" ? "en" : "pt";
  const href = translatedPath(pathname, lang);
  const label = lang === "pt" ? labels.toEnglish : labels.toPortuguese;

  return (
    <a
      href={href}
      title={label}
      /* O E2E precisa de âncora estável: casar por texto "EN" pegava
         "Clientes" por substring, e na v3.5 a nav passou a vir antes deste
         link no DOM, o que fez o `.first()` do teste mudar de alvo. */
      data-testid="lang-toggle"
      /* Sem cor nem fundo próprios, pelo mesmo motivo do ThemeToggle. */
      className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
    >
      <Languages className="size-4" aria-hidden />
      {next.toUpperCase()}
      {/* Nome acessível com o texto visível ("EN") + a descrição (regra label-content-name-mismatch). */}
      <span className="sr-only">{label}</span>
    </a>
  );
}

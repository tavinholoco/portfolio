import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Section } from "@/components/section";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { navLabelFor, pathFor } from "@/lib/routes";

/**
 * A Home: o manifesto do processo.
 *
 * Esta é a decisão central da v3 (seção 2.3 do plano). Os 5 passos de
 * `Dict.process.steps` deixaram de ser cards numerados numa seção enterrada e
 * viraram o corpo tipográfico da página inicial. A tese do portfólio, "entendo
 * o problema antes de escolher a tecnologia", é a primeira coisa que se lê.
 * Se a Home virar só nome mais bio mais link, a tese morre e a v3 vira um
 * retrocesso em relação à v2. Isso é requisito, não sugestão.
 *
 * Tudo em `variant="blend"`, e por isso nada aqui pode ter cor ou fundo
 * próprios: o que não herda cor inverte por conta própria contra o canvas e
 * aparece de uma cor diferente do resto. Os CTAs são links com borda em
 * `currentColor`, não botões preenchidos, pelo mesmo motivo.
 *
 * Continua em CSS puro, sem JS de animação: é o elemento de LCP da rota.
 */
export function Manifesto({ lang }: { lang: Locale }) {
  const d = dictionaries[lang];

  return (
    <Section id="inicio" variant="blend">
      <div className="animate-fade-in motion-reduce:animate-none">
        <p className="font-mono text-sm opacity-60">&gt;_ {d.hero.role}</p>

        {/* Elemento de LCP da rota: sem delay de animação. */}
        <h1 className="mt-4 text-display font-semibold text-balance">
          {d.hero.name}
        </h1>

        <p className="font-body mt-8 max-w-2xl text-lede opacity-80 text-pretty">
          {d.hero.bio}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={pathFor("projects", lang)}
            className="focus-ring inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70"
          >
            {d.hero.viewProjects}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href={profile.cvUrl}
            download
            className="focus-ring inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <Download className="size-4" aria-hidden />
            {d.hero.downloadCv}
          </a>
        </div>
      </div>

      {/*
        Os 5 passos como lista tipográfica: número, título e descrição, sem
        card, sem borda em volta, sem sombra. O único separador é a linha de
        1px, como manda a seção 8 do plano.
      */}
      <ol className="mt-24 border-t border-current/15 sm:mt-32">
        {d.process.steps.map((step, index) => (
          <li
            key={step.title}
            className="grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
          >
            <span className="font-mono text-xs opacity-40 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
              {step.title}
            </h2>
            <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      {/* Fecha empurrando para a prova: os projetos. */}
      <Link
        href={pathFor("projects", lang)}
        className="focus-ring mt-16 inline-flex items-center gap-3 text-title font-semibold tracking-tight transition-opacity hover:opacity-70"
      >
        {navLabelFor("projects", lang)}
        <ArrowRight className="size-[0.8em]" aria-hidden />
      </Link>
    </Section>
  );
}

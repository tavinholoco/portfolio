"use client";

import { FadeIn, Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";

/**
 * Trajetória em storytelling: timeline vertical por ano (2023 → 2025 → 2026),
 * cada capítulo com "o que aprendi" em destaque.
 */
export function Career({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].career;

  return (
    <Section id="trajetoria">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      <ol className="relative mt-12 space-y-8 border-l border-border pl-8">
        {d.chapters.map((chapter, index) => (
          /* <li> filho direto do <ol> (semântica de lista); o FadeIn anima o conteúdo interno */
          <li key={`${chapter.year}-${chapter.title}`} className="relative">
            <FadeIn delay={index * 0.05}>
              {/* Dot do capítulo na rail */}
              <span
                aria-hidden
                className="absolute -left-8 top-1.5 size-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background"
              />

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm text-primary">
                  {chapter.year}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {chapter.title}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {chapter.org}
                </span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {chapter.period}
                </span>
              </div>

              <div className="mt-3 rounded-2xl border border-border bg-card/60 p-5">
                <p className="font-mono text-[11px] text-primary">
                  {d.learningsTitle}
                </p>
                <ul className="mt-2 space-y-2">
                  {chapter.learnings.map((learning) => (
                    <li
                      key={learning}
                      className="font-body flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-primary/60"
                        aria-hidden
                      />
                      {learning}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>
    </Section>
  );
}

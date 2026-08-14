"use client";

import type { LucideIcon } from "lucide-react";
import { Database, MonitorSmartphone, Sparkles, Wrench } from "lucide-react";

import { FadeIn, Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";

const blockIcons: Record<string, LucideIcon> = {
  dev: MonitorSmartphone,
  data: Database,
  ai: Sparkles,
  tools: Wrench,
};

/**
 * Habilidades em 4 categorias enxutas, sem classificação de nível.
 * O nível é demonstrado pelos projetos (decisão 12 do plano v2).
 */
export function Skills({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].skills;

  return (
    <Section id="habilidades">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {d.blocks.map((block, index) => {
          const Icon = blockIcons[block.id];
          return (
            <FadeIn key={block.id} delay={index * 0.05}>
              <div className="group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {block.title}
                </h3>
                <p className="font-body mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {block.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {block.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}

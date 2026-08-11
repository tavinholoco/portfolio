"use client";

import type { LucideIcon } from "lucide-react";
import { Database, MonitorSmartphone, Server, Sparkles } from "lucide-react";

import { FadeIn, Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const blockIcons: Record<string, LucideIcon> = {
  frontend: MonitorSmartphone,
  backend: Server,
  dados: Database,
  ia: Sparkles,
};

function LevelDots({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex flex-col items-end gap-1" aria-label={label}>
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 rounded-full",
              index < value ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </span>
  );
}

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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <LevelDots value={block.level.value} label={block.level.label} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {block.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
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

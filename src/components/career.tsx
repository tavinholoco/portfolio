"use client";

import type { LucideIcon } from "lucide-react";
import { Briefcase, GraduationCap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn, Section, SectionHeading } from "@/components/section";
import type { CareerItem } from "@/data/career";
import { dictionaries, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

function TimelineColumn({
  title,
  icon: Icon,
  items,
  defaultOpen,
}: {
  title: string;
  icon: LucideIcon;
  items: CareerItem[];
  defaultOpen?: string;
}) {
  return (
    <FadeIn>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <Accordion
        defaultValue={defaultOpen ? [defaultOpen] : []}
        className="mt-6 flex flex-col gap-2"
      >
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </Accordion>
    </FadeIn>
  );
}

function TimelineItem({
  item,
  isLast,
}: {
  item: CareerItem;
  isLast: boolean;
}) {
  return (
    <AccordionItem
      value={item.id}
      className={cn(
        "group relative rounded-xl border border-border bg-card/60 pl-8 transition-colors hover:border-primary/30",
        isLast && "last:before:hidden"
      )}
    >
      {/* Rail da timeline */}
      <span
        aria-hidden
        className="absolute bottom-4 left-3.5 top-4 w-px -translate-x-1/2 bg-border before:absolute before:inset-0 before:bg-primary/40"
      />
      <span
        aria-hidden
        className="absolute left-3.5 top-5 size-2.5 -translate-x-1/2 rounded-full border-2 border-primary bg-background"
      />

      <AccordionTrigger className="gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-muted/40 hover:no-underline">
        <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <span className="flex min-w-0 flex-1 basis-56 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              {item.title}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {item.org}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="font-mono text-xs text-muted-foreground">
              {item.period}
            </span>
            {item.status && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {item.status}
              </span>
            )}
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className="px-4">
        <ul className="space-y-2">
          {item.details.map((detail) => (
            <li
              key={detail}
              className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-primary/60"
                aria-hidden
              />
              {detail}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5 pb-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function Career({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].career;

  return (
    <Section id="trajetoria">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
        <TimelineColumn
          title={d.educationTitle}
          icon={GraduationCap}
          items={d.education}
        />
        <TimelineColumn
          title={d.experienceTitle}
          icon={Briefcase}
          items={d.experience}
          defaultOpen="palmali"
        />
      </div>
    </Section>
  );
}

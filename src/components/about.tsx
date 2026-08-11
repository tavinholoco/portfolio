"use client";

import Image from "next/image";
import {
  Brain,
  Database,
  FileSearch,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
} from "lucide-react";

import { FadeIn, Section, SectionHeading } from "@/components/section";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";

const factIcons = {
  formation: GraduationCap,
  location: MapPin,
  email: Mail,
  languages: Languages,
} as const;

const interestIcons = {
  analysis: FileSearch,
  data: Database,
  ai: Brain,
} as const;

export function About({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].about;

  return (
    <Section id="sobre">
      <div className="grid gap-12 md:grid-cols-[300px_1fr] md:gap-16">
        {/* Coluna esquerda: avatar + fatos rápidos */}
        <FadeIn className="self-start md:sticky md:top-24">
          <div className="relative mx-auto size-40 md:size-44">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-xl"
            />
            <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-secondary">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                sizes="(max-width: 768px) 10rem, 11rem"
                className="object-cover"
              />
            </div>
          </div>

          <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card/60">
            {d.facts.map((fact) => {
              const Icon = factIcons[fact.id];
              return (
                <li
                  key={fact.id}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {fact.label}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {fact.value}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </FadeIn>

        {/* Coluna direita: cabeçalho + resumo + interesses */}
        <div className="min-w-0">
          <SectionHeading
            label={d.label}
            title={d.title}
            description={d.description}
          />

          <FadeIn delay={0.1}>
            {d.summary.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "font-body mt-8 text-xl font-medium leading-relaxed text-foreground text-pretty sm:text-2xl"
                    : "font-body mt-5 text-base leading-relaxed text-muted-foreground text-pretty"
                }
              >
                {paragraph}
              </p>
            ))}
          </FadeIn>

          <FadeIn delay={0.15}>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {d.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card/60 px-4 py-5 text-center"
                >
                  <dd className="font-mono text-2xl font-semibold text-primary sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h3 className="mt-12 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {d.interestsHeading}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {d.interests.map((interest) => {
                const Icon = interestIcons[interest.id];
                return (
                  <div
                    key={interest.id}
                    className="group rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h4 className="mt-4 text-sm font-semibold text-foreground">
                      {interest.title}
                    </h4>
                    <p className="font-body mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {interest.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

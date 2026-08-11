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
import { interests, profile } from "@/data/profile";

const factIcons = {
  formation: GraduationCap,
  location: MapPin,
  email: Mail,
  languages: Languages,
} as const;

const interestIcons = {
  "Análise de Sistemas": FileSearch,
  "Qualidade de Dados": Database,
  "Treinamento de IA": Brain,
} as const;

const facts = [
  {
    icon: factIcons.formation,
    label: "Formação",
    value: "ADS · UNOESTE",
  },
  {
    icon: factIcons.location,
    label: "Localização",
    value: profile.location,
  },
  {
    icon: factIcons.email,
    label: "Email",
    value: profile.email,
  },
  {
    icon: factIcons.languages,
    label: "Idiomas",
    value: "Inglês avançado (CCAA)",
  },
] as const;

const stats = [
  { value: "144+", label: "testes automatizados" },
  { value: "4+", label: "projetos no GitHub" },
  { value: "3", label: "áreas de interesse em IA" },
] as const;

export function About() {
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
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 768px) 10rem, 11rem"
                  className="object-cover"
                />
              ) : (
                <span className="font-mono text-4xl font-semibold text-primary">
                  PL
                </span>
              )}
            </div>
          </div>

          <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card/60">
            {facts.map((fact) => (
              <li
                key={fact.label}
                className="flex items-center gap-3 px-5 py-3.5"
              >
                <fact.icon className="size-4 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{fact.label}</p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {fact.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* Coluna direita: cabeçalho + resumo + interesses */}
        <div className="min-w-0">
          <SectionHeading
            label="sobre mim"
            title="Sobre mim"
            description="Quem sou por trás do código e o que me move a cada projeto."
          />

          <FadeIn delay={0.1}>
            <p className="mt-8 text-xl font-medium leading-relaxed text-foreground text-pretty sm:text-2xl">
              Formado em Análise e Desenvolvimento de Sistemas pela UNOESTE,
              construo soluções web e mobile, do back-end com Node.js e
              Fastify ao app em React Native.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Minha trajetória começou no suporte e na infraestrutura de TI, o
              que me ensinou a diagnosticar a causa raiz antes de agir. Hoje
              desenvolvo projetos completos, como um portal de notícias com
              geração de conteúdo por IA e um app de estudos com 144 testes
              automatizados, sempre buscando qualidade, boas práticas e
              aprendizado contínuo.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
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
              Interesses ativos
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {interests.map((interest) => {
                const Icon = interestIcons[interest.title];
                return (
                  <div
                    key={interest.title}
                    className="group rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h4 className="mt-4 text-sm font-semibold text-foreground">
                      {interest.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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

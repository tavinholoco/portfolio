"use client";

import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FadeIn, Section } from "@/components/section";
import { profile } from "@/data/profile";

const contactCards = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "WhatsApp",
    value: profile.phone,
    href: profile.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "in/pedro-levi-dias",
    href: profile.linkedin,
    icon: LinkedInIcon,
    external: true,
  },
  {
    label: "GitHub",
    value: "@tavinholoco",
    href: profile.github,
    icon: GitHubIcon,
    external: true,
  },
] as const;

export function Contact() {
  return (
    <Section id="contato">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-card to-background px-6 py-14 text-center sm:px-14 sm:py-20">
          {/* Glow decorativo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />

          <p className="font-mono text-sm text-primary">&gt;_ contato</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {profile.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {profile.cta.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              render={<a href={`mailto:${profile.email}`} />}
              nativeButton={false}
            >
              <Mail data-icon="inline-start" className="size-4" aria-hidden />
              Enviar email
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
            >
              <MessageCircle
                data-icon="inline-start"
                className="size-4"
                aria-hidden
              />
              WhatsApp
              <ArrowUpRight
                data-icon="inline-end"
                className="size-4"
                aria-hidden
              />
            </Button>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                {...(card.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="focus-ring group flex items-center gap-4 rounded-2xl border border-border bg-card/60 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <card.icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">
                    {card.label}
                  </span>
                  <span className="block truncate text-sm font-medium text-foreground">
                    {card.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

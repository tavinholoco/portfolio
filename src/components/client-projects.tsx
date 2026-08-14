import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";

/** Clientes (cases de cliente): demonstram capacidade comercial, não só técnica. */
export function ClientProjectsSection({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].clients;

  return (
    <Section id="clientes">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {d.projects.map((project) => (
          <article
            key={project.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.18),0_16px_48px_-16px_rgba(45,212,191,0.35)]"
          >
            {/* Prévia do site */}
            <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary/40">
              <Image
                src={project.image}
                alt={`${d.previewAlt} ${project.name}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 backdrop-blur dark:border-emerald-400/25 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                {d.live}
              </span>
            </div>

            {/* Caso do cliente */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-foreground">
                {project.name}
              </h3>

              <dl className="mt-4 space-y-2.5">
                <div>
                  <dt className="font-mono text-[11px] text-primary">
                    {d.clientLabel}
                  </dt>
                  <dd className="mt-0.5 text-sm text-muted-foreground">
                    {project.client}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] text-primary">
                    {d.typeLabel}
                  </dt>
                  <dd className="mt-0.5 text-sm text-muted-foreground">
                    {project.type}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] text-primary">
                    {d.techLabel}
                  </dt>
                  <dd className="mt-0.5 text-sm text-muted-foreground">
                    {project.tech.join(" · ")}
                  </dd>
                </div>
              </dl>

              <p className="font-body mt-4 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                {project.outcome}
              </p>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-primary transition-opacity hover:opacity-80"
              >
                {d.visit}
                <ExternalLink
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

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
            </div>

            {/* Caso do cliente */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-foreground">
                {project.name}
              </h3>
              <span className="mt-2 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
                {d.projectKind}
              </span>

              <p className="font-body mt-4 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                {project.description}
              </p>

              <dl className="mt-5 space-y-2.5">
                <div>
                  <dt className="font-mono text-[11px] text-primary">
                    {d.responsibilitiesLabel}
                  </dt>
                  <dd className="mt-0.5 text-sm text-muted-foreground">
                    {project.responsibilities.join(" · ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] text-primary">
                    {d.statusLabel}
                  </dt>
                  <dd className="mt-0.5 text-sm text-muted-foreground">
                    {project.status}
                  </dd>
                </div>
              </dl>

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

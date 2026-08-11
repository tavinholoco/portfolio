import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Section, SectionHeading } from "@/components/section";
import { clientProjects } from "@/data/projects";

/** Projetos entregues para clientes. Cada card mostra a prévia do site e leva direto a ele. */
export function ClientProjectsSection() {
  return (
    <Section id="clientes">
      <SectionHeading
        label="clientes"
        title="Projetos para clientes"
        description="Trabalhos entregues e publicados para clientes. Cada card leva direto ao site do projeto."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {clientProjects.map((project) => (
          <article
            key={project.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_48px_-16px_rgba(45,212,191,0.3)]"
          >
            {/* Prévia do site */}
            <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary/40">
              <Image
                src={project.image}
                alt={`Prévia do site ${project.name}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                No ar
              </span>
            </div>

            {/* Informações do projeto */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-foreground">
                {project.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                {project.description}
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-primary transition-opacity hover:opacity-80"
              >
                Visitar site
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

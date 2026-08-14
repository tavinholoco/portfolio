import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { dictionaries, type Locale } from "@/i18n";
import type { Project } from "@/lib/github";

/**
 * Destaque do projeto principal (Newra News), sempre visível acima do grid
 * (decisão 9 do plano v2). O mockup do portal é em CSS puro (decisão 7),
 * sem screenshot real por enquanto.
 */
export function FeaturedProject({
  project,
  lang,
}: {
  project: Project;
  lang: Locale;
}) {
  const d = dictionaries[lang].projects;
  const host = project.demoUrl
    ? new URL(project.demoUrl).host
    : `${project.repo}.vercel.app`;
  // [Ver projeto] leva à página individual do projeto (Fase 3).
  const projectPage =
    lang === "pt" ? `/projetos/${project.slug}/` : `/en/projects/${project.slug}/`;

  return (
    <article className="group relative mt-10 overflow-hidden rounded-3xl border border-border bg-card/60 p-6 sm:p-8 lg:p-10">
      {/* Brilho decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] text-primary">
            {d.featuredBadge}
          </span>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground uppercase sm:text-4xl lg:text-5xl">
            {project.title}
          </h3>

          <p className="font-body mt-3 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {project.tagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-secondary/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.updatedAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              {d.updatedAt} {project.updatedAt}
              {project.language ? ` · ${project.language}` : ""}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<Link href={projectPage} />}
              nativeButton={false}
            >
              {d.viewProject}
              <ArrowUpRight
                data-icon="inline-end"
                className="size-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                aria-hidden
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <GitHubIcon
                data-icon="inline-start"
                className="size-4"
                aria-hidden
              />
              {d.github}
            </Button>
          </div>
        </div>

        {/* Mockup do portal em CSS puro (sem screenshot real, decisão 7) */}
        <div
          aria-hidden
          className="relative transition-transform duration-500 group-hover:scale-[1.02]"
        >
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-1.5 border-b border-border/70 bg-secondary/40 px-3.5 py-2.5">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 truncate rounded-md border border-border/60 bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {host}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="relative h-24 overflow-hidden rounded-lg border border-border/60 bg-gradient-to-br from-primary/25 via-primary/10 to-sky-500/10">
                <div className="bg-grid-pattern absolute inset-0 opacity-40" />
              </div>
              <div className="h-2.5 w-4/5 rounded-full bg-foreground/15" />
              <div className="h-2.5 w-3/5 rounded-full bg-foreground/10" />
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="space-y-1.5 rounded-lg border border-border/60 bg-secondary/30 p-2"
                  >
                    <div className="h-10 rounded-md bg-foreground/10" />
                    <div className="h-1.5 w-full rounded-full bg-foreground/10" />
                    <div className="h-1.5 w-2/3 rounded-full bg-foreground/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

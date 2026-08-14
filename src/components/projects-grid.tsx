"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import type { ProjectCategory } from "@/data/projects";
import { dictionaries, type Locale } from "@/i18n";
import type { Project } from "@/lib/github";
import { cn } from "@/lib/utils";

type Filter = "todos" | ProjectCategory;

const filters: Filter[] = ["todos", "fullstack", "mobile", "landing"];

export function ProjectsGrid({
  projects,
  lang,
}: {
  projects: Project[];
  lang: Locale;
}) {
  const d = dictionaries[lang].projects;
  const [filter, setFilter] = useState<Filter>("todos");
  const reduceMotion = useReducedMotion();

  // [Ver projeto] leva à página individual do projeto (Fase 3).
  const projectPage = (slug: string) =>
    lang === "pt" ? `/projetos/${slug}/` : `/en/projects/${slug}/`;

  const visible =
    filter === "todos"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <div>
      {/* Filtro por categoria (vale só para o grid; o projeto principal fica acima) */}
      <div
        className="mt-10 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={d.title}
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              filter === f
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {f === "todos" ? d.filterAll : d.categories[f]}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {visible.length} {visible.length === 1 ? d.one : d.many}
        </span>
      </div>

      {/* Grid de cards */}
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => {
            // Oculta o badge de linguagem do GitHub quando a linguagem já
            // aparece no Stack (evita redundância visual, ex.: TypeScript).
            const showLanguage =
              project.language !== null &&
              !project.stack.some(
                (tech) => tech.toLowerCase() === project.language!.toLowerCase()
              );

            return (
            <motion.article
              key={project.slug}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.18),0_16px_48px_-16px_rgba(45,212,191,0.35)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-primary">
                    {d.categories[project.category]}
                  </span>
                  {project.updatedAt && (
                    <span className="text-xs text-muted-foreground">
                      {d.updatedAt} {project.updatedAt}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {project.title}
                </h3>

                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="font-mono text-[11px] text-primary">
                      {d.problemLabel}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {project.problem}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] text-primary">
                      {d.solutionLabel}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {project.solution}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] text-primary">
                      {d.highlightLabel}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {project.highlight}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 font-mono text-[11px] text-muted-foreground/70">
                    {d.stackLabel}:
                  </span>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  {showLanguage ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="size-2 rounded-full bg-primary/70"
                        aria-hidden
                      />
                      {project.language}
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-4">
                    <Link
                      href={projectPage(project.slug)}
                      className="focus-ring inline-flex items-center gap-1 rounded-md text-sm font-medium text-primary transition-opacity hover:opacity-80"
                    >
                      {d.viewProject}
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <GitHubIcon className="size-4" />
                      {d.github}
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-10 text-center">
        <a
          href="https://github.com/tavinholoco"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <GitHubIcon className="size-4" aria-hidden />
          {d.allOnGithub}
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 hover:-translate-y-0.5 hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>
    </div>
  );
}

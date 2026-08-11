"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import { categoryLabels, type ProjectCategory } from "@/data/projects";
import type { Project } from "@/lib/github";
import { cn } from "@/lib/utils";

type Filter = "todos" | ProjectCategory;

const filters: Filter[] = ["todos", "fullstack", "mobile", "landing"];

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const reduceMotion = useReducedMotion();

  const visible =
    filter === "todos"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <div>
      {/* Filtro por categoria */}
      <div
        className="mt-10 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrar projetos por categoria"
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
            {f === "todos" ? "Todos" : categoryLabels[f]}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {visible.length} {visible.length === 1 ? "projeto" : "projetos"}
        </span>
      </div>

      {/* Grid de cards */}
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.article
              key={project.repo}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_48px_-16px_rgba(45,212,191,0.3)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-primary">
                    {categoryLabels[project.category]}
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    {project.inDevelopment && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-400" aria-hidden />
                        Em desenvolvimento
                      </span>
                    )}
                    {project.updatedAt && (
                      <span className="text-xs text-muted-foreground">
                        atualizado {project.updatedAt}
                      </span>
                    )}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  {project.language ? (
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
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <GitHubIcon className="size-4" />
                      Repo
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring inline-flex items-center gap-1 rounded-md text-sm font-medium text-primary transition-opacity hover:opacity-80"
                      >
                        Demo
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
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
          Ver todos os projetos no GitHub
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}

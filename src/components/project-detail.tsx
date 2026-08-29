import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";
import { getFeaturedProjects } from "@/lib/github";
import { projectJsonLd } from "@/lib/json-ld";
import { pathFor } from "@/lib/routes";

/** Rota da página individual de um projeto, no idioma da rota atual. */
function projectRoute(slug: string, lang: Locale): string {
  return `${pathFor("projects", lang)}${slug}/`;
}

/** Link de ação, em borda de `currentColor`. Funciona nas duas variantes. */
const actionClass =
  "focus-ring inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70";

/**
 * Página individual de projeto.
 *
 * A estrutura da v2 sobrevive inteira, porque é ela que carrega o argumento:
 * `problema → solução → destaque → aprendizados`. O que mudou foi a
 * apresentação.
 *
 * O hero vai em `blend` e o corpo em `solid`. A divisão dá ritmo e resolve um
 * problema concreto: o corpo tem blocos densos que ficam mais legíveis sobre
 * fundo opaco, e o hero ganha o canvas atrás do título.
 *
 * A paleta do fundo é a mesma que a linha deste projeto tem na lista, então
 * sair do showcase e entrar no case não muda o humor do site.
 *
 * Continua server component e estática: `generateStaticParams` e
 * `dynamicParams = false` na rota seguem intactos.
 */
export async function ProjectDetailPage({
  slug,
  lang,
}: {
  slug: string;
  lang: Locale;
}) {
  const d = dictionaries[lang];
  const projects = await getFeaturedProjects(d.projects.featured, lang);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const jsonLd = projectJsonLd(slug, lang);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}

      <Section id="projeto" variant="blend">
        <div className="animate-fade-in motion-reduce:animate-none">
          <Link
            href={pathFor("projects", lang)}
            className="focus-ring inline-flex items-center gap-2 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {d.projects.backToProjects}
          </Link>

          <p className="mt-12 font-mono text-sm opacity-70">
            {d.projects.categories[project.category]}
          </p>
          <h1 className="mt-4 text-display font-semibold text-balance break-words hyphens-auto">
            {project.title}
          </h1>
          <p className="font-body mt-8 max-w-2xl text-lede opacity-80 text-pretty">
            {project.tagline}
          </p>

          {/* Stack em texto corrido: chip com fundo inverteria sozinho aqui. */}
          <p className="mt-8 font-mono text-sm opacity-70">
            {project.stack.join("  ·  ")}
          </p>

          {/*
            Dado vivo do repositório, e a única coisa nesta página que não é
            estática: é ele que dá sentido ao ISR de 1h de lib/github.ts. Some
            quando a API falha, porque o merge cai no fallback curado.
          */}
          {(project.updatedAt || project.language) && (
            <p className="mt-3 font-mono text-xs opacity-70">
              {[
                project.updatedAt && `${d.projects.updatedAt} ${project.updatedAt}`,
                project.language,
              ]
                .filter(Boolean)
                .join("  ·  ")}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                {d.projects.demoLabel}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass}
            >
              {d.projects.github}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </Section>

      <Section id="case" variant="plain">
        {/* O argumento do projeto, em três blocos separados só por linha. */}
        <dl className="border-t border-border">
          {[
            { label: d.projects.problemLabel, value: project.problem },
            { label: d.projects.solutionLabel, value: project.solution },
            { label: d.projects.highlightLabel, value: project.highlight },
          ].map((entry) => (
            <div
              key={entry.label}
              className="grid gap-3 border-b border-border py-8 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-8"
            >
              <dt className="font-mono text-xs text-muted-foreground">
                {entry.label}
              </dt>
              <dd className="font-body text-base leading-relaxed text-pretty">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-16">
          <h2 className="text-title font-semibold tracking-tight">
            {d.projects.learningsTitle}
          </h2>
          <ul className="mt-8 border-t border-border">
            {project.learnings.map((learning) => (
              <li
                key={learning}
                className="font-body border-b border-border py-5 text-sm leading-relaxed text-muted-foreground text-pretty"
              >
                {learning}
              </li>
            ))}
          </ul>
        </section>

        <nav
          aria-label={d.projects.title}
          className="mt-16 grid border-t border-border sm:grid-cols-2"
        >
          <Link
            href={projectRoute(prev.slug, lang)}
            className="focus-ring border-b border-border py-8 transition-opacity hover:opacity-70 sm:border-r sm:border-b-0 sm:pr-8"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {d.projects.previous}
            </span>
            <span className="mt-2 flex items-center gap-2 text-lg font-medium tracking-tight">
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              {prev.title}
            </span>
          </Link>
          <Link
            href={projectRoute(next.slug, lang)}
            className="focus-ring py-8 text-right transition-opacity hover:opacity-70 sm:pl-8"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {d.projects.next}
            </span>
            <span className="mt-2 flex items-center justify-end gap-2 text-lg font-medium tracking-tight">
              {next.title}
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </span>
          </Link>
        </nav>

        {/* Fecha empurrando para o contato, sem duplicar email nem WhatsApp. */}
        <div className="mt-20 border-t border-border pt-10">
          <h2 className="text-title font-semibold tracking-tight text-balance">
            {d.contact.title}
          </h2>
          <Link
            href={pathFor("contact", lang)}
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70"
          >
            {d.contact.goToSection}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Section>
    </>
  );
}

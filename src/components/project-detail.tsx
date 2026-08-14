import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dictionaries, type Locale } from "@/i18n";
import { getFeaturedProjects } from "@/lib/github";

/** Rota da página individual de um projeto, no idioma da rota atual. */
function projectRoute(slug: string, lang: Locale): string {
  return lang === "pt" ? `/projetos/${slug}/` : `/en/projects/${slug}/`;
}

/** Página individual de projeto (server component, estática via generateStaticParams). */
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

  const backHref = lang === "pt" ? "/#projetos" : "/en/#projetos";
  const contactHref = lang === "pt" ? "/#contato" : "/en/#contato";

  return (
    <>
      <SiteHeader lang={lang} />
      <main>
        <article className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <Link
            href={backHref}
            className="focus-ring inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {d.projects.backToProjects}
          </Link>

          <p className="font-mono mt-8 text-sm text-primary">
            &gt;_ {d.projects.categories[project.category]}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {project.title}
          </h1>
          <p className="font-body mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            {project.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-secondary/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.demoUrl && (
              <Button
                size="lg"
                render={
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                {d.projects.demoLabel}
                <ArrowUpRight
                  data-icon="inline-end"
                  className="size-4"
                  aria-hidden
                />
              </Button>
            )}
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
              {d.projects.github}
            </Button>
          </div>

          <dl className="mt-10 space-y-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
            <div>
              <dt className="font-mono text-xs text-primary">
                {d.projects.problemLabel}
              </dt>
              <dd className="font-body mt-1 text-base leading-relaxed text-muted-foreground text-pretty">
                {project.problem}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-primary">
                {d.projects.solutionLabel}
              </dt>
              <dd className="font-body mt-1 text-base leading-relaxed text-muted-foreground text-pretty">
                {project.solution}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-primary">
                {d.projects.highlightLabel}
              </dt>
              <dd className="font-body mt-1 text-base leading-relaxed text-muted-foreground text-pretty">
                {project.highlight}
              </dd>
            </div>
          </dl>

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {d.projects.learningsTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {project.learnings.map((learning) => (
                <li
                  key={learning}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  {learning}
                </li>
              ))}
            </ul>
          </section>

          <nav
            aria-label={d.projects.title}
            className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
            <Link
              href={projectRoute(prev.slug, lang)}
              className="focus-ring group rounded-2xl border border-border p-5 transition-colors hover:border-primary/40"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {d.projects.previous}
              </span>
              <span className="mt-1 flex items-center gap-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                <ArrowLeft className="size-4" aria-hidden />
                {prev.title}
              </span>
            </Link>
            <Link
              href={projectRoute(next.slug, lang)}
              className="focus-ring group rounded-2xl border border-border p-5 text-right transition-colors hover:border-primary/40"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {d.projects.next}
              </span>
              <span className="mt-1 flex items-center justify-end gap-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                {next.title}
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          </nav>

          {/* CTA final — leva à seção de contato da home (sem duplicar email/WhatsApp) */}
          <section className="mt-16 rounded-2xl border border-border bg-card/60 p-8 text-center sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {d.contact.title}
            </h2>
            <p className="font-body mt-2 text-sm leading-relaxed text-muted-foreground">
              {d.contact.description}
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                render={<Link href={contactHref} />}
                nativeButton={false}
              >
                {d.contact.goToSection}
                <ArrowDown
                  data-icon="inline-end"
                  className="size-4"
                  aria-hidden
                />
              </Button>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}

import { JsonLd } from "@/components/json-ld";
import { ProjectsSection } from "@/components/projects";
import type { Locale } from "@/i18n";
import { projectListJsonLd } from "@/lib/json-ld";

/** A rota de projetos próprios. A Fase 4 troca a grade pelo showcase. */
export function ProjectsPage({ lang }: { lang: Locale }) {
  return (
    <>
      <JsonLd data={projectListJsonLd(lang)} />
      <ProjectsSection lang={lang} />
    </>
  );
}

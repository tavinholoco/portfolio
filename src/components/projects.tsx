import { FeaturedProject } from "@/components/featured-project";
import { ProjectsGrid } from "@/components/projects-grid";
import { Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";
import { getFeaturedProjects } from "@/lib/github";

/** Server Component: busca os projetos no GitHub (ISR) e renderiza o destaque + grid client. */
export async function ProjectsSection({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].projects;
  const projects = await getFeaturedProjects(d.featured, lang);

  // O projeto principal (Newra News) fica sempre visível acima do grid,
  // mesmo com filtros ativos (decisão 9 do plano v2).
  const featured = projects.find((p) => p.slug === "newra-news");
  const rest = projects.filter((p) => p.slug !== "newra-news");

  return (
    <Section id="projetos">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      {featured && <FeaturedProject project={featured} lang={lang} />}
      <ProjectsGrid projects={rest} lang={lang} />
    </Section>
  );
}

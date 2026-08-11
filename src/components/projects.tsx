import { ProjectsGrid } from "@/components/projects-grid";
import { Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";
import { getFeaturedProjects } from "@/lib/github";

/** Server Component: busca os projetos no GitHub (ISR) e renderiza o grid client. */
export async function ProjectsSection({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].projects;
  const projects = await getFeaturedProjects(d.featured, lang);

  return (
    <Section id="projetos">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      <ProjectsGrid projects={projects} lang={lang} />
    </Section>
  );
}

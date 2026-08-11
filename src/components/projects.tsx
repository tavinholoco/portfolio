import { ProjectsGrid } from "@/components/projects-grid";
import { Section, SectionHeading } from "@/components/section";
import { getFeaturedProjects } from "@/lib/github";

/** Server Component: busca os projetos no GitHub (ISR) e renderiza o grid client. */
export async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  return (
    <Section id="projetos">
      <SectionHeading
        label="projetos"
        title="Projetos em destaque"
        description="Seleção dos meus trabalhos no GitHub, do app mobile ao portal com IA. Metadados sincronizados automaticamente com os repositórios."
      />
      <ProjectsGrid projects={projects} />
    </Section>
  );
}

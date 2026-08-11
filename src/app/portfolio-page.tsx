import { About } from "@/components/about";
import { Career } from "@/components/career";
import { ClientProjectsSection } from "@/components/client-projects";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";
import type { Locale } from "@/i18n";

/** Página única do portfólio, renderizada no idioma recebido (rota / = pt, /en/ = en). */
export function PortfolioPage({ lang }: { lang: Locale }) {
  return (
    <>
      <SiteHeader lang={lang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <ProjectsSection lang={lang} />
        <ClientProjectsSection lang={lang} />
        <Career lang={lang} />
        <Skills lang={lang} />
        <Contact lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}

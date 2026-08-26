import { About } from "@/components/about";
import { Career } from "@/components/career";
import { ClientProjectsSection } from "@/components/client-projects";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { ProcessSection } from "@/components/process";
import { ProjectsSection } from "@/components/projects";
import { Skills } from "@/components/skills";
import type { Locale } from "@/i18n";
import { personJsonLd, projectListJsonLd, webSiteJsonLd } from "@/lib/json-ld";

/**
 * Conteúdo da página única do portfólio, no idioma recebido.
 *
 * Header, <main> e footer vivem no <SiteShell> do layout, não aqui: os dois
 * root layouts precisam da mesma montagem e é o shell que impede pt e en de
 * divergirem.
 */
export function PortfolioPage({ lang }: { lang: Locale }) {
  return (
    <>
      {/* Dados estruturados (Schema.org): Person + WebSite + projetos */}
      <JsonLd
        data={[personJsonLd(lang), webSiteJsonLd(lang), projectListJsonLd(lang)]}
      />
      <Hero lang={lang} />
      <About lang={lang} />
      <ProjectsSection lang={lang} />
      <ClientProjectsSection lang={lang} />
      <ProcessSection lang={lang} />
      <Career lang={lang} />
      <Skills lang={lang} />
      <Contact lang={lang} />
    </>
  );
}

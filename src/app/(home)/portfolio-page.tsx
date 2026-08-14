import { About } from "@/components/about";
import { Career } from "@/components/career";
import { ClientProjectsSection } from "@/components/client-projects";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { ProcessSection } from "@/components/process";
import { ProjectsSection } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";
import type { Locale } from "@/i18n";
import { personJsonLd, projectListJsonLd, webSiteJsonLd } from "@/lib/json-ld";

/** Página única do portfólio, renderizada no idioma recebido (rota / = pt, /en/ = en). */
export function PortfolioPage({ lang }: { lang: Locale }) {
  return (
    <>
      {/* Dados estruturados (Schema.org): Person + WebSite + projetos */}
      <JsonLd
        data={[personJsonLd(lang), webSiteJsonLd(lang), projectListJsonLd(lang)]}
      />
      <SiteHeader lang={lang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <ProjectsSection lang={lang} />
        <ClientProjectsSection lang={lang} />
        <ProcessSection lang={lang} />
        <Career lang={lang} />
        <Skills lang={lang} />
        <Contact lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}

import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { ProcessSection } from "@/components/process";
import type { Locale } from "@/i18n";
import { personJsonLd, webSiteJsonLd } from "@/lib/json-ld";

/**
 * A home: manifesto e os 5 passos do processo.
 *
 * A tese da v2 ("entendo o problema antes de escolher a tecnologia") mora aqui,
 * e não numa seção enterrada, porque é a ideia principal do portfólio. A Fase 4
 * reescreve o corpo em escala tipográfica; a Fase 3 apenas trouxe o conteúdo
 * para a rota certa.
 */
export function HomePage({ lang }: { lang: Locale }) {
  return (
    <>
      <JsonLd data={[personJsonLd(lang), webSiteJsonLd(lang)]} />
      <Hero lang={lang} />
      <ProcessSection lang={lang} />
    </>
  );
}

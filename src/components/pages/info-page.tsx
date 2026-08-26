import { About } from "@/components/about";
import { Career } from "@/components/career";
import { JsonLd } from "@/components/json-ld";
import { Skills } from "@/components/skills";
import type { Locale } from "@/i18n";
import { personJsonLd } from "@/lib/json-ld";

/**
 * A rota Info funde três seções da v2: sobre, trajetória e habilidades.
 *
 * O JSON-LD de Person mora aqui porque é a página que de fato descreve a
 * pessoa. A home mantém o dele por ser a raiz do site.
 */
export function InfoPage({ lang }: { lang: Locale }) {
  return (
    <>
      <JsonLd data={personJsonLd(lang)} />
      <About lang={lang} />
      <Career lang={lang} />
      <Skills lang={lang} />
    </>
  );
}

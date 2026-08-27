import { About } from "@/components/about";
import { Career } from "@/components/career";
import { Identity } from "@/components/identity";
import { JsonLd } from "@/components/json-ld";
import { Process } from "@/components/process";
import { Skills } from "@/components/skills";
import { BackgroundPalette } from "@/components/background/background-palette";
import { paletteForRoute } from "@/components/background/background-config";
import type { Locale } from "@/i18n";
import { personJsonLd } from "@/lib/json-ld";

/**
 * A rota Info funde quatro seções: sobre, processo, trajetória e habilidades.
 *
 * As variantes alternam de propósito. Sobre e Habilidades vão em `blend` e
 * misturam contra o canvas; Identidade e Trajetória vão em `solid` e o cobrem.
 * Não é só estética: Identidade tem foto, que em `difference` apareceria em
 * negativo (E12). O resultado colateral é ritmo, porque uma página inteira
 * misturada cansa.
 *
 * Os 5 passos do processo chegaram na v3.5, vindos da home. Ver <Process>.
 *
 * O JSON-LD de Person mora aqui por ser a página que de fato descreve a pessoa.
 * A home mantém o dela por ser a raiz do site.
 */
export function InfoPage({ lang }: { lang: Locale }) {
  return (
    <>
      <BackgroundPalette preset={paletteForRoute.info} />
      <JsonLd data={personJsonLd(lang)} />
      <About lang={lang} />
      <Identity lang={lang} />
      <Process lang={lang} />
      <Career lang={lang} />
      <Skills lang={lang} />
    </>
  );
}

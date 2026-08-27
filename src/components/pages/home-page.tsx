import { Manifesto } from "@/components/home/manifesto";
import { JsonLd } from "@/components/json-ld";
import { BackgroundPalette } from "@/components/background/background-palette";
import { paletteForRoute } from "@/components/background/background-config";
import type { Locale } from "@/i18n";
import { personJsonLd, webSiteJsonLd } from "@/lib/json-ld";

/**
 * A home: o manifesto do processo.
 *
 * O componente `process.tsx` da v2 foi aposentado, mas `Dict.process.steps`
 * continua vivo e é consumido aqui (E14): o que saiu foi a apresentação em
 * cards, não o conteúdo.
 */
export function HomePage({ lang }: { lang: Locale }) {
  return (
    <>
      <BackgroundPalette preset={paletteForRoute.home} />
      <JsonLd data={[personJsonLd(lang), webSiteJsonLd(lang)]} />
      <Manifesto lang={lang} />
    </>
  );
}

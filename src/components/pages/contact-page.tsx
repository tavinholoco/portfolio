import { Contact } from "@/components/contact";
import { BackgroundPalette } from "@/components/background/background-palette";
import { paletteForRoute } from "@/components/background/background-config";
import type { Locale } from "@/i18n";

/** A rota de contato: os dois caminhos e os cartões. */
export function ContactPage({ lang }: { lang: Locale }) {
  return (
    <>
      <BackgroundPalette preset={paletteForRoute.contact} />
      <Contact lang={lang} />
    </>
  );
}

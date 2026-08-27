import { Contact } from "@/components/contact";
import type { Locale } from "@/i18n";

/** A rota de contato: os dois caminhos e os cartões. */
export function ContactPage({ lang }: { lang: Locale }) {
  return (
    <>
      <Contact lang={lang} />
    </>
  );
}

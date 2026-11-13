import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";

/**
 * Os contatos como aparecem escritos no site, todos derivados de `profile`.
 *
 * Existe porque havia duas verdades: o link do LinkedIn saía de `profile` e o
 * texto do cartão estava digitado nos dois dicionários, com outro endereço
 * (`in/pedro-levi-dias`, que não é o dele). O link levava ao lugar certo e o
 * texto dizia o errado, e nada acusava. Agora o que se lê sai do que se clica.
 */
export const contactDisplay = {
  email: profile.email,
  whatsapp: profile.phoneDisplay,
  /* "https://www.linkedin.com/in/pedrolevidias/" vira "in/pedrolevidias". */
  linkedin: new URL(profile.linkedin).pathname.replace(/^\/|\/$/g, ""),
  /* "https://github.com/tavinholoco" vira "@tavinholoco". */
  github: `@${new URL(profile.github).pathname.replace(/^\/|\/$/g, "")}`,
} as const;

/** De qual página o visitante chamou. Cada uma tem a sua mensagem pronta. */
export type WhatsAppOrigin = "service" | "contact";

/**
 * O link do WhatsApp com a mensagem já escrita (F4.1 do plano V4).
 *
 * É a única medição de contato do site, e não usa script: a mensagem muda
 * conforme a página de origem, então quem chega já diz de onde veio. O beacon
 * de RUM continua desligado (§17.15). O texto mora nos dois dicionários, e a
 * mensagem segue o idioma da página.
 */
export function whatsappLink(lang: Locale, origin: WhatsAppOrigin): string {
  const texto = dictionaries[lang].whatsapp[origin];
  return `${profile.whatsapp}?text=${encodeURIComponent(texto)}`;
}

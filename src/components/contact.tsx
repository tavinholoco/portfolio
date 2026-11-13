import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";

import { actionLinkClass } from "@/components/estilos";
import { Section } from "@/components/section";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { contactDisplay, whatsappLink } from "@/lib/contact";
import { pathFor } from "@/lib/routes";

/** Destino de cada cartão de contato. O id vem do dicionário. */
const cardHrefs = (
  lang: Locale
): Record<string, { href: string; external: boolean }> => ({
  email: { href: `mailto:${profile.email}`, external: false },
  whatsapp: { href: whatsappLink(lang, "contact"), external: true },
  linkedin: { href: profile.linkedin, external: true },
  github: { href: profile.github, external: true },
});

/**
 * Contato: dois caminhos diretos, um para cada público.
 *
 * Recrutador segue por "ver currículo", cliente segue por "falar comigo". A
 * separação existe porque as duas pessoas chegam com perguntas diferentes e
 * um formulário genérico não serve nenhuma das duas.
 *
 * Em `variant="blend"`, e por isso a reescrita foi mais que estética. Saíram o
 * glow, os cards com `rounded-2xl`, os quadradinhos de ícone e as cores
 * explícitas: dentro de uma seção misturada, o que não herda cor inverte por
 * conta própria e cada elemento aparece de um tom diferente. Aqui a hierarquia
 * é só tamanho, opacidade e linhas de 1px.
 *
 * Esta rota também é a casa dos links sociais que saíram do footer (E13): eles
 * já viviam em `contact.cards`, com mais contexto do que teriam numa barra.
 */
export function Contact({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].contact;
  const hrefs = cardHrefs(lang);

  return (
    <Section id="contato" variant="blend">
      {/* A entrada suave não está mais aqui: é do container do <Section>. */}
      <h1 className="mt-4 text-display font-semibold text-balance break-words hyphens-auto">
        {d.title}
      </h1>
      <p className="font-body mt-8 max-w-2xl text-lede opacity-80 text-pretty">
        {d.description}
      </p>

      {/* Os dois caminhos, em escala grande e separados só por uma linha. */}
      {/*
        Duas colunas só a partir de `md`, e não de `sm`.

        Em 640px cada coluna fica com uns 250px úteis, e "contratando" em
        `text-title` pede mais de 300: o item de grid nasce com
        `min-width: auto`, então a trilha não encolhe e a palavra vaza por
        cima da coluna vizinha. O `min-w-0` faz a trilha ser respeitada e o
        `hyphens`/`break-words` dá à palavra onde quebrar; sem os dois juntos
        um deles sozinho não resolve.
      */}
      <div className="mt-20 grid border-t border-current/15 md:grid-cols-2">
        <div className="min-w-0 border-b border-current/15 py-10 md:border-r md:border-b-0 md:pr-12">
          <h2 className="text-title font-semibold tracking-tight break-words hyphens-auto">
            {d.hiringTitle}
          </h2>
          <p className="font-body mt-4 max-w-sm text-sm leading-relaxed opacity-70 text-pretty">
            {d.hiringDescription}
          </p>
          <a
            href={profile.cvUrl}
            download
            className={`${actionLinkClass} mt-8`}
          >
            <Download className="size-4" aria-hidden />
            {d.hiringCta}
          </a>
        </div>

        <div className="min-w-0 py-10 md:pl-12">
          <h2 className="text-title font-semibold tracking-tight break-words hyphens-auto">
            {d.projectTitle}
          </h2>
          <p className="font-body mt-4 max-w-sm text-sm leading-relaxed opacity-70 text-pretty">
            {d.projectDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={whatsappLink(lang, "contact")}
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClass}
            >
              {d.projectCta}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <Link
              href={pathFor("websites", lang)}
              className="focus-ring inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            >
              {d.websitesCta}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* Contato direto, em lista. Sem cartão e sem ícone ilustrativo. */}
      <ul className="mt-20 border-t border-current/15">
        {d.cards.map((card) => {
          const target = hrefs[card.id];
          return (
            <li key={card.id}>
              <a
                href={target.href}
                {...(target.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                /*
                  Empilhado no mobile. Com as três colunas fixas, em 320px o
                  valor ficava com 96px e o email era cortado com reticências,
                  o mesmo defeito que a lista de fatos teve. A seta é
                  decorativa e some junto, para não sobrar sozinha numa linha.
                */
                className="focus-ring grid gap-1 border-b border-current/15 py-5 opacity-70 transition-opacity hover:opacity-100 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4"
              >
                <span className="font-mono text-xs">
                  {card.label}
                </span>
                <span className="text-sm break-words">
                  {contactDisplay[card.id]}
                </span>
                {target.external ? (
                  <ArrowUpRight
                    className="hidden size-4 opacity-50 sm:block"
                    aria-hidden
                  />
                ) : (
                  <span aria-hidden className="hidden sm:block" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

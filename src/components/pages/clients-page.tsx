import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { ShowcaseList } from "@/components/showcase/showcase-list";
import { clientShowcaseItems } from "@/components/showcase/items";
import { dictionaries, type Locale } from "@/i18n";
import { clientListJsonLd } from "@/lib/json-ld";
import { pathFor } from "@/lib/routes";

/**
 * A rota de clientes.
 *
 * Mesmo componente de lista dos projetos (regra 9 da seção 3.1): a diferença
 * entre as duas rotas é de dado, não de comportamento. O que muda é o destino,
 * que aqui é externo, para o site do cliente.
 */
export function ClientsPage({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].clients;

  return (
    <>
      <JsonLd data={clientListJsonLd(lang)} />
      {/*
        O h1 da rota, invisível. Na v3.5 o cabeçalho visível saiu e a página
        abre direto na lista: quem diz onde você está é o dot na nav do header.
        Sem isto a rota ficaria sem h1 nenhum, que aliás era o estado da v3,
        porque o <SectionHeading> renderizava h2.
      */}
      <h1 className="sr-only">{d.title}</h1>
      <ShowcaseList
        id="clientes"
        items={clientShowcaseItems(lang)}
        previewAlt={d.previewAlt}
        rolesLabel={d.responsibilitiesLabel}
      />
      <Section id="clientes-site" variant="plain" wide className="pt-0 sm:pt-0">
        <Link
          href={pathFor("websites", lang)}
          className="focus-ring inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
        >
          {d.websitesCta}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
    </>
  );
}

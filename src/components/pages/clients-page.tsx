import { JsonLd } from "@/components/json-ld";
import { ShowcaseList } from "@/components/showcase/showcase-list";
import { clientShowcaseItems } from "@/components/showcase/items";
import { dictionaries, type Locale } from "@/i18n";
import { clientListJsonLd } from "@/lib/json-ld";

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
        problemLabel={d.projectKind}
        rolesLabel={d.responsibilitiesLabel}
      />
    </>
  );
}

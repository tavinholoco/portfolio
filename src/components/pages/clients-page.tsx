import { JsonLd } from "@/components/json-ld";
import { Section, SectionHeading } from "@/components/section";
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
      <Section id="clientes-intro" variant="blend">
        <SectionHeading
          label={d.label}
          title={d.title}
          description={d.description}
        />
      </Section>
      <ShowcaseList
        id="clientes"
        items={clientShowcaseItems(lang)}
        previewAlt={d.previewAlt}
        problemLabel={d.projectKind}
      />
    </>
  );
}

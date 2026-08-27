import { JsonLd } from "@/components/json-ld";
import { ShowcaseList } from "@/components/showcase/showcase-list";
import { projectShowcaseItems } from "@/components/showcase/items";
import { dictionaries, type Locale } from "@/i18n";
import { projectListJsonLd } from "@/lib/json-ld";

/**
 * A rota de projetos próprios.
 *
 * A lista vai em `solid` porque tem screenshots, que em `difference` apareceriam
 * em negativo. O cabeçalho em `blend` que existia aqui saiu na v3.5: a rota
 * abre direto no showcase, como a referência faz, e sobrou só um h1 invisível.
 */
export function ProjectsPage({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].projects;

  return (
    <>
      <JsonLd data={projectListJsonLd(lang)} />
      {/*
        O h1 da rota, invisível. Na v3.5 o cabeçalho visível saiu e a página
        abre direto na lista: quem diz onde você está é o dot na nav do header.
        Sem isto a rota ficaria sem h1 nenhum, que aliás era o estado da v3,
        porque o <SectionHeading> renderizava h2.
      */}
      <h1 className="sr-only">{d.title}</h1>
      <ShowcaseList
        id="projetos"
        items={projectShowcaseItems(lang)}
        previewAlt={d.title}
        problemLabel={d.problemLabel}
      />
    </>
  );
}

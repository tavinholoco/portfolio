import { JsonLd } from "@/components/json-ld";
import { Section, SectionHeading } from "@/components/section";
import { ShowcaseList } from "@/components/showcase/showcase-list";
import { projectShowcaseItems } from "@/components/showcase/items";
import { dictionaries, type Locale } from "@/i18n";
import { projectListJsonLd } from "@/lib/json-ld";

/**
 * A rota de projetos próprios.
 *
 * O cabeçalho vai em `blend` e a lista em `solid`. Essa divisão não é estética:
 * a lista tem screenshots, que em `difference` apareceriam em negativo, e o
 * cabeçalho é texto puro, que herda cor e mistura corretamente. É também o que
 * deixa a troca de paleta do shader visível ao percorrer a lista, já que sobra
 * canvas à vista fora da faixa da lista.
 */
export function ProjectsPage({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].projects;

  return (
    <>
      <JsonLd data={projectListJsonLd(lang)} />
      <Section id="projetos-intro" variant="blend">
        <SectionHeading
          label={d.label}
          title={d.title}
          description={d.description}
        />
      </Section>
      <ShowcaseList
        id="projetos"
        items={projectShowcaseItems(lang)}
        previewAlt={d.title}
        problemLabel={d.problemLabel}
      />
    </>
  );
}

import { Section } from "@/components/section";
import { SectionIntro } from "@/components/section-intro";
import { dictionaries, type Locale } from "@/i18n";

/**
 * Habilidades em 4 categorias, sem classificação de nível.
 *
 * O nível é demonstrado pelos projetos, não por barrinha de progresso (decisão
 * 12 do plano v2, que sobrevive na v3).
 *
 * Em `variant="blend"`. As tecnologias saíram das caixinhas e viraram texto
 * corrido separado por ponto: chip com borda e fundo é exatamente o tipo de
 * caixa que a seção 8 remove, e dentro de uma seção misturada o fundo do chip
 * inverteria por conta própria.
 */
export function Skills({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].skills;

  return (
    <Section id="habilidades" variant="blend">
      <SectionIntro title={d.title} description={d.description} />

      <ul className="mt-16 border-t border-current/15">
        {d.blocks.map((block) => (
          <li
            key={block.id}
            className="grid gap-3 border-b border-current/15 py-8 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8"
          >
            <div>
              <h3 className="text-lg font-medium tracking-tight">
                {block.title}
              </h3>
              <p className="font-body mt-2 text-sm leading-relaxed opacity-70 text-pretty">
                {block.description}
              </p>
            </div>
            <p className="font-mono text-sm leading-relaxed opacity-70">
              {block.skills.join("  ·  ")}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

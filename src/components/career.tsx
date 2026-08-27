import { Section } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";

/**
 * Trajetória em storytelling: um capítulo por etapa, cada um com o que aprendi.
 *
 * Em `variant="plain"`: fica entre dois blocos misturados e serve de respiro,
 * porque uma página inteira em `difference` cansa. Era `solid` até a V3.5, e
 * o respiro vinha de um retângulo chapado cobrindo o canvas; agora vem só de
 * o texto parar de inverter, e o fundo continua à vista.
 *
 * Da v2 sobreviveu a estrutura; saíram o card com `rounded-2xl` em volta dos
 * aprendizados, as tags em caixinha e o dot colorido. O trilho vertical é uma
 * linha de 1px, que é o único separador que a seção 8 do plano permite.
 */
export function Career({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].career;

  return (
    <Section id="trajetoria" variant="plain">
      <h2 className="text-title font-semibold tracking-tight text-balance">
        {d.title}
      </h2>
      <p className="font-body mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
        {d.description}
      </p>

      <ol className="mt-16 border-l border-border pl-8 sm:pl-12">
        {d.chapters.map((chapter) => (
          <li
            key={`${chapter.year}-${chapter.title}`}
            className="relative pb-14 last:pb-0"
          >
            {/* Marcador do capítulo no trilho: um traço, não um ponto colorido. */}
            <span
              aria-hidden
              className="absolute top-3 -left-8 h-px w-5 bg-border sm:-left-12 sm:w-9"
            />

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-sm text-muted-foreground tabular-nums">
                {chapter.year}
              </span>
              <h3 className="text-lg font-medium tracking-tight">
                {chapter.title}
              </h3>
              <span className="text-sm text-muted-foreground">
                {chapter.org}
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {chapter.period}
              </span>
            </div>

            <p className="mt-6 font-mono text-xs text-muted-foreground">
              {d.learningsTitle}
            </p>
            <ul className="mt-3 space-y-2">
              {chapter.learnings.map((learning) => (
                <li
                  key={learning}
                  className="font-body flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 h-px w-2 shrink-0 bg-border"
                  />
                  {learning}
                </li>
              ))}
            </ul>

            <p className="mt-5 font-mono text-xs text-muted-foreground">
              {chapter.tags.join("  ·  ")}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

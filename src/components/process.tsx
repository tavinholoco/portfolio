import { Section } from "@/components/section";
import { SectionIntro } from "@/components/section-intro";
import { dictionaries, type Locale } from "@/i18n";

/**
 * Os 5 passos do processo: entendo, planejo, desenvolvo, valido, entrego.
 *
 * Estavam na home da v3, como corpo tipográfico da rota inteira. Na v3.5 a home
 * ficou reduzida à tese e a lista mudou de endereço, mas o conteúdo é o mesmo e
 * continua saindo de `Dict.process.steps`, sem duplicação. Aqui ela ganha o
 * cabeçalho que nunca teve: `process.label`, `process.title` e
 * `process.description` existiam nos dicionários e estavam órfãos.
 *
 * O lugar é `/info/`, entre Identidade e Trajetória. Antes ela vinha depois do
 * que a pessoa faz e antes de onde ela passou, que é a ordem em que o argumento
 * se sustenta.
 *
 * Em `variant="blend"`: é texto puro, herda cor e mistura corretamente. Sem
 * card e sem borda em volta, o único separador é a linha de 1px, como manda a
 * seção 8 do plano.
 */
export function Process({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].process;

  return (
    <Section id="processo" variant="blend">
      <SectionIntro title={d.title} description={d.description} />

      <ol className="mt-16 border-t border-current/15">
        {d.steps.map((step, index) => (
          <li
            key={step.title}
            className="grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
          >
            <span className="font-mono text-xs opacity-70 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
              {step.title}
            </h3>
            <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

import { Section } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";

/**
 * Sobre: resumo, métricas e interesses.
 *
 * Em `variant="blend"`, então tudo aqui herda cor. Saíram os cards com borda,
 * os quadradinhos de ícone e os números em cor de destaque: a métrica agora é
 * grande porque é importante, não colorida porque é importante. É a lei da
 * seção 8 do plano, hierarquia por tamanho e opacidade.
 *
 * O avatar e os fatos rápidos não estão aqui: foram para `identity.tsx`, num
 * bloco `solid`, porque foto em `mix-blend-difference` apareceria em negativo
 * (E12).
 */
export function About({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].about;

  return (
    <Section id="sobre" variant="blend">
      <div className="animate-fade-in motion-reduce:animate-none">
        <h1 className="text-title font-semibold tracking-tight text-balance">
          {d.title}
        </h1>

        {d.summary.map((paragraph, index) => (
          <p
            key={paragraph}
            className={
              index === 0
                ? "font-body mt-10 max-w-3xl text-lede leading-relaxed text-pretty"
                : "font-body mt-5 max-w-3xl text-base leading-relaxed opacity-70 text-pretty"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Métricas: grandes porque importam, não coloridas porque importam. */}
      <div className="mt-20">
        {/* h2, e não <p>: é o cabeçalho da lista de métricas, e sem ele a
            hierarquia pula de h1 para h3 (heading-order). O visual não muda. */}
        <h2 className="font-mono text-sm font-normal opacity-70">
          {d.metricsTitle}
        </h2>
        {/*
          `gap-x-6` e não `pr-6` em cada célula: com padding, a última coluna
          desperdiça 24px que ninguém usa, e as outras três ficam mais
          apertadas do que precisam.

          Isso importava porque a célula mais estreita não acontecia na tela
          mais estreita, e sim na mais larga: `--pad` crescia sem teto e o
          conteúdo paga o dobro dele de cada lado. "144+" estourava a célula
          por 1px num 2560x1440, e o CI, que renderiza fonte no Linux, via 2px:
          passava aqui e reprovava lá. A raiz foi corrigida no teto de `--pad`,
          em `globals.css`, e o `gap` fica porque é melhor de qualquer jeito.
        */}
        <dl className="mt-8 grid grid-cols-2 gap-x-6 border-t border-current/15 sm:grid-cols-4">
          {d.metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-b border-current/15 py-8"
            >
              <dd className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">
                {metric.value}
              </dd>
              <dt className="font-body mt-3 text-xs leading-relaxed opacity-70">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Interesses em lista, sem cartão e sem ícone. */}
      <div className="mt-20">
        <h2 className="font-mono text-sm font-normal opacity-70">
          {d.interestsHeading}
        </h2>
        <ul className="mt-8 border-t border-current/15">
          {d.interests.map((interest) => (
            <li
              key={interest.id}
              className="grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
            >
              <h3 className="text-lg font-medium tracking-tight">
                {interest.title}
              </h3>
              <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
                {interest.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

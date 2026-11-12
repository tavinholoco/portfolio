import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { dictionaries, type Locale } from "@/i18n";
import { personJsonLd, webSiteJsonLd } from "@/lib/json-ld";
import { pathFor } from "@/lib/routes";

/**
 * A home: o fundo, e uma linha.
 *
 * **A linha é a D2 do plano V4.** A raiz do domínio não tinha uma palavra
 * visível além do menu, e é a página que mais precisa dizer do que se trata.
 * Entrou o mínimo: uma frase e um link para a página de serviço, no canto de
 * baixo, onde não cobre o desenho das ondas.
 *
 * Três cuidados, todos de quebra calada:
 *
 * - **Não usa o `<Section>`**, porque o container dele entra com fade, e a
 *   frase é maior em área que o link do header: viraria o elemento de LCP e
 *   contaria só depois do fade. Sem animação ela pinta no mesmo quadro do
 *   header, e o LCP continua igual ao FCP, seja qual for o elemento.
 * - É uma `<section>` filha direta do `<main>`, em `difference`, sem wrapper
 *   nenhum por cima (leis 1 e 3). O recuo repete o do `<Section>`: `--pad` em
 *   dobro e a coluna da nav por `--nav-col` (lei 8).
 * - O texto herda a cor e fica em 80% de opacidade, sem opacidade aninhada
 *   (leis 5 e 6).
 *
 * O resto do que valia continua valendo. A identidade (nome, cargo e nav) é fixa
 * no `<SiteHeader>` e aparece em todas as rotas, o copyright é fixo no rodapé,
 * e a home é o lugar onde o campo de ondas fica inteiro à vista, sem texto por
 * cima. Quem quiser ler alguma coisa tem seis portas no canto esquerdo.
 *
 * Isso foi decisão do Pedro depois de ver o site rodando, e revoga a §2.3 do
 * plano, que exigia a tese como corpo da home. Ela sobrevive em `/info/`, na
 * seção de processo.
 *
 * **O `h1` continua existindo, invisível.** Uma rota sem `h1` é falha de
 * acessibilidade e de SEO, e a home é a raiz do site: é a página que mais
 * precisa dizer do que se trata. `hero.heading` faz esse papel sem pintar um
 * pixel. Texto para leitor de tela não pode servir para manipular a busca, então
 * é uma frase verdadeira só, e nunca uma lista de termos.
 */
export function HomePage({ lang }: { lang: Locale }) {
  const d = dictionaries[lang];

  return (
    <>
      <JsonLd data={[personJsonLd(lang), webSiteJsonLd(lang)]} />
      <h1 className="sr-only">{d.hero.heading}</h1>
      <section
        id="home"
        data-variant="blend"
        className="flex min-h-svh items-end mix-blend-difference text-white"
      >
        <div className="w-full [padding-block-end:calc(var(--pad)*2.5)] [padding-inline-end:calc(var(--pad)*2)] [padding-inline-start:calc(var(--pad)*2+var(--nav-col))]">
          <p className="font-body max-w-md text-base leading-relaxed opacity-80 text-pretty">
            {d.hero.pitch}
          </p>
          <Link
            href={pathFor("websites", lang)}
            className="focus-ring mt-3 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          >
            {d.hero.pitchCta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}

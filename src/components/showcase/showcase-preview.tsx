import Image from "next/image";

import { WindowMockup } from "@/components/showcase/window-mockup";
import { cn } from "@/lib/utils";
import type { ShowcaseItem } from "./types";

/**
 * A moldura do preview, que troca conforme a linha ativa.
 *
 * Só a moldura: na v3.5 o problema e as responsabilidades saíram daqui para o
 * <ShowcaseCaption>, abaixo do grid. Enquanto viviam dentro deste wrapper
 * `sticky` eles acompanhavam a rolagem colados no quadro e liam como se
 * estivessem dentro dele.
 *
 * Duas regras da seção 3.1 do plano vivem aqui, e as duas são contraintuitivas:
 *
 * **Regra 1, `sticky` e não `fixed`.** Sticky acompanha a rolagem e sai
 * naturalmente ao fim da seção. Com `fixed` seria preciso gerenciar entrada e
 * saída na mão, calculando limites de scroll.
 *
 * **Regra 2, tudo montado de uma vez.** Todas as imagens ficam empilhadas em
 * `absolute` e só a opacidade muda. Desmontar e remontar o `<Image>` a cada
 * troca causaria um flash de carregamento no primeiro hover de cada item, e o
 * efeito inteiro depende da troca ser instantânea. Alternando só opacity, o
 * navegador mantém tudo no compositor: sem layout, sem paint.
 */
export function ShowcasePreview({
  items,
  activeIndex,
  alt,
}: {
  items: ShowcaseItem[];
  activeIndex: number;
  alt: string;
}) {
  /*
   * A regra 2 aplicada também à busca, e não só à montagem.
   *
   * Montar tudo de uma vez não adianta se o navegador não baixar as imagens:
   * com `loading="lazy"`, que é o padrão do `next/image` sem `priority`, as
   * três inativas ficavam à mercê da heurística do Chrome. Em aba de segundo
   * plano ele simplesmente não busca, e foi assim que apareceram com
   * `currentSrc` vazio depois de 3s numa medição. Quem abre o portfólio em aba
   * de fundo, que é o que um recrutador faz com vários candidatos de uma vez,
   * passava o mouse na lista e via moldura vazia. Mesmo efeito com Memory
   * Saver e Data Saver.
   *
   * São 3 imagens de 16 a 48KB, todas dentro da viewport desde o primeiro
   * paint. Buscar as três é mais barato do que a troca falhar.
   *
   * Não há `sizes` aqui, e a ausência é deliberada: com `images.unoptimized`
   * o Next não gera `srcset`, então `sizes` seria prop morta que ele descarta
   * calado. A largura de exibição, que era o que ela declarava, passou a viver
   * onde agora decide de fato: `LARGURA_MAXIMA` em `capture/previews.spec.ts`,
   * porque o arquivo versionado é o que chega ao navegador. A prévia ocupa
   * cerca de 500px de CSS em 1440 (5 de 12 colunas do container `max-w-7xl`) e
   * cerca de 350px num celular de 390, e os arquivos têm 1000px para cobrir
   * densidade 2.
   *
   * Só a primeira leva `priority`, que é o que gera o `<link rel="preload">`.
   * Dar preload às quatro colocaria três concorrentes na frente do candidato a
   * LCP, que é justamente a primeira. As outras vão em `eager` com
   * `fetchPriority="low"`: buscadas sem disputar banda com ela.
   */
  const carga = (index: number) =>
    index === 0
      ? ({ priority: true, fetchPriority: "high" } as const)
      : ({ loading: "eager", fetchPriority: "low" } as const);

  return (
    <div className="lg:sticky lg:top-[calc(var(--pad)*3)]">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-md border border-current/15">
        {items.map((item, index) => (
          <div
            key={item.slug}
            aria-hidden={index !== activeIndex}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              /* Sob movimento reduzido a troca é instantânea (regra 7). */
              "motion-reduce:transition-none",
              index === activeIndex ? "opacity-100" : "opacity-0"
            )}
          >
            {!item.image ? (
              <WindowMockup host={hostOf(item.href)} />
            ) : item.imageKind === "phone" ? (
              /* Print de celular: contida e centrada numa moldura de aparelho.
                 Preencher o slot 16:10 com uma imagem em retrato cortaria
                 quase tudo, e é por isso que o plano pede frame de celular em
                 vez de janela de browser. */
              <div className="flex h-full items-center justify-center py-4">
                <div className="relative h-full max-h-full overflow-hidden rounded-lg border border-current/25 [aspect-ratio:385/814]">
                  <Image
                    src={item.image}
                    alt={`${alt}: ${item.title}`}
                    fill
                    className="object-cover object-top"
                    {...carga(index)}
                  />
                </div>
              </div>
            ) : (
              <Image
                src={item.image}
                alt={`${alt}: ${item.title}`}
                fill
                className="object-cover object-top"
                /*
                  O primeiro é o que aparece no load e vale como LCP. O
                  `priority` já gera o `<link rel="preload">`, mas **não** põe
                  `fetchpriority` nele, e é isso que o `lcp-discovery-insight`
                  do Lighthouse cobra em `priorityHinted`. Explicitar custa um
                  atributo. As demais vão em `eager`: ver `carga` acima.
                */
                {...carga(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Host legível para a barra de endereço do mockup. Link interno não tem host. */
function hostOf(href: string): string | undefined {
  if (!href.startsWith("http")) return undefined;
  try {
    return new URL(href).host;
  } catch {
    return undefined;
  }
}

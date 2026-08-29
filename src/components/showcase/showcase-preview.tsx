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
                    sizes="200px"
                    className="object-cover object-top"
                    priority={index === 0}
                  />
                </div>
              </div>
            ) : (
              <Image
                src={item.image}
                alt={`${alt}: ${item.title}`}
                fill
                /*
                  Medido, não estimado. A partir de lg o preview ocupa 5 de 12
                  colunas do container max-w-7xl, o que dá cerca de 31vw num
                  viewport de 1440. Abaixo disso ele ocupa a largura do
                  container, que é a viewport menos o padding de
                  calc(var(--pad) * 2) de cada lado, cerca de 90vw num celular.
                  O valor antigo (60vw e 100vw) fazia o Next servir uma variante
                  maior do que a necessária.
                */
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-cover object-top"
                /*
                  O primeiro é o que aparece no load e vale como LCP. O
                  `priority` já gera o `<link rel="preload">`, mas **não** põe
                  `fetchpriority` nele, e é isso que o `lcp-discovery-insight`
                  do Lighthouse cobra em `priorityHinted`. Explicitar custa um
                  atributo.
                */
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
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

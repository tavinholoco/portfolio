import Image from "next/image";

import { WindowMockup } from "@/components/showcase/window-mockup";
import { cn } from "@/lib/utils";
import type { ShowcaseItem } from "./types";

/**
 * O preview que fica no topo da lista e troca conforme a linha ativa.
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
  problemLabel,
}: {
  items: ShowcaseItem[];
  activeIndex: number;
  alt: string;
  problemLabel: string;
}) {
  const active = items[activeIndex];

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
            {item.image ? (
              <Image
                src={item.image}
                alt={`${alt}: ${item.title}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover object-top"
                /* O primeiro é o que aparece no load e vale como LCP. */
                priority={index === 0}
              />
            ) : (
              <WindowMockup title={item.title} host={hostOf(item.href)} />
            )}
          </div>
        ))}
      </div>

      {/*
        O problema logo abaixo do preview, trocando junto. É o que liga o
        componente à tese da v2: a lista deixa de ser catálogo e passa a
        argumentar (seção 3.2).
      */}
      <p className="font-body mt-4 text-sm leading-relaxed opacity-70">
        <span className="font-mono text-xs tracking-wide uppercase opacity-60">
          {problemLabel}{" "}
        </span>
        {active.problem}
      </p>
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

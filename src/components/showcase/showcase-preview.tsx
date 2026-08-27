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
  rolesLabel,
}: {
  items: ShowcaseItem[];
  activeIndex: number;
  alt: string;
  problemLabel: string;
  /** Rótulo do que foi feito. Só as rotas com itens de cliente passam. */
  rolesLabel?: string;
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
            {!item.image ? (
              <WindowMockup title={item.title} host={hostOf(item.href)} />
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
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover object-top"
                /* O primeiro é o que aparece no load e vale como LCP. */
                priority={index === 0}
              />
            )}
          </div>
        ))}
      </div>

      {/*
        O problema logo abaixo do preview, trocando junto. É o que liga o
        componente à tese da v2: a lista deixa de ser catálogo e passa a
        argumentar (seção 3.2).
      */}
      <p
        data-testid="showcase-problem"
        className="font-body mt-4 text-sm leading-relaxed opacity-70"
      >
        <span className="font-mono text-xs tracking-wide uppercase">
          {problemLabel}{" "}
        </span>
        {active.problem}
      </p>

      {/*
        O que foi feito, quando o item traz. É a pergunta que trabalho de
        cliente levanta e a stack não responde: se o envolvimento foi só a tela
        ou foi até o deploy.
      */}
      {rolesLabel && active.responsibilities?.length ? (
        <p className="mt-2 font-mono text-xs opacity-70">
          <span className="tracking-wide uppercase">{rolesLabel} </span>
          {active.responsibilities.join("  ·  ")}
        </p>
      ) : null}
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

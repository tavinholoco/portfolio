"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Section } from "@/components/section";
import { ShowcaseCaption } from "@/components/showcase/showcase-caption";
import { ShowcasePreview } from "@/components/showcase/showcase-preview";
import { ShowcaseRow } from "@/components/showcase/showcase-row";
import type { ShowcaseItem } from "./types";

/** Intenção de hover: abaixo disso o mouse só está de passagem (regra 4). */
const HOVER_INTENT_MS = 80;

/**
 * A lista com preview no topo, servindo Projetos e Clientes.
 *
 * As decisões não óbvias, todas da seção 3.1 do plano:
 *
 * - **Estado único no pai** (regra 3). Um `useState` só. As linhas não guardam
 *   estado próprio, então não há como duas ficarem ativas ao mesmo tempo.
 * - **Debounce de intenção** (regra 4). Sem ele, varrer o mouse pela lista faz
 *   o preview estroboscopar, trocando cinco vezes em meio segundo.
 * - **Não resetar ao sair** (regra 5). Voltar ao índice 0 no `pointerleave` é o
 *   erro mais comum deste padrão: a pessoa tira o mouse para ler o preview e
 *   ele troca justamente aí. O último item visto fica.
 * - **Estado inicial preenchido** (regra 8). O item 01 já aparece no load,
 *   nunca um vazio esperando hover.
 * - **Touch** (regra 6). Sob `(hover: none)` não existe hover, então a linha
 *   mais próxima do centro da viewport vira a ativa, via IntersectionObserver
 *   com uma faixa central de 1px.
 *
 * O diferencial da v3 (seção 3.2): a paleta do shader acompanha o item ativo,
 * então o humor do site inteiro muda conforme a lista é percorrida. Vai pelo
 * singleton do fundo, não por estado do React, porque isso não precisa
 * re-renderizar nada.
 */
export function ShowcaseList({
  id,
  items,
  previewAlt,
  problemLabel,
  rolesLabel,
}: {
  id: string;
  items: ShowcaseItem[];
  previewAlt: string;
  problemLabel: string;
  /** Rótulo do que foi feito. Só a rota de clientes passa. */
  rolesLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const apply = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const activate = useCallback(
    (index: number, immediate: boolean) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (immediate) {
        apply(index);
        return;
      }
      timerRef.current = setTimeout(() => apply(index), HOVER_INTENT_MS);
    },
    [apply]
  );

  /* Só cancela o que estava agendado. Não mexe no ativo (regra 5). */
  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* Regra 6: em touch, quem manda é a proximidade do centro da tela. */
  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) return;

    const rows = listRef.current?.querySelectorAll("li");
    if (!rows?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isInteger(index)) apply(index);
        }
      },
      /* Faixa de 1px no centro exato: só a linha que a cruza intersecta. */
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    rows.forEach((row, index) => {
      (row as HTMLElement).dataset.index = String(index);
      observer.observe(row);
    });
    return () => observer.disconnect();
  }, [apply, items]);

  return (
    <Section id={id} variant="solid" wide>
      {/*
        Lado a lado a partir de lg, empilhado abaixo disso.
        
        O diagrama da seção 3 do plano desenha o preview sobre a lista, mas
        empilhado o `sticky` da regra 1 se volta contra si mesmo: o preview fixa
        no topo e a lista rola por baixo dele, sobrepondo os dois. Verificado em
        captura. Em coluna própria, o `sticky` faz exatamente o que a regra 1
        pede, acompanhar a rolagem e sair ao fim da seção, e a lista inteira
        fica visível junto do preview, que é o ponto do componente.
        
        No empilhado de telas pequenas o preview leva fundo opaco, e aí a lista
        passar por baixo dele deixa de ser defeito e vira painel fixo.
      */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-12">
        <ShowcasePreview
          items={items}
          activeIndex={activeIndex}
          alt={previewAlt}
        />

        <ol ref={listRef} className="border-t border-current/15">
          {items.map((item, index) => (
            <ShowcaseRow
              key={item.slug}
              item={item}
              index={index}
              active={index === activeIndex}
              onActivate={activate}
              onCancel={cancel}
            />
          ))}
        </ol>
      </div>

      {/*
        Fora do grid, e portanto fora do wrapper sticky da moldura. Na v3.5 o
        texto desceu para cá justamente para deixar de ler como conteúdo de
        dentro do quadro.
      */}
      <ShowcaseCaption
        item={items[activeIndex]}
        problemLabel={problemLabel}
        rolesLabel={rolesLabel}
      />
    </Section>
  );
}

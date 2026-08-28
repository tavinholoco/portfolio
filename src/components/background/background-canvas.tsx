"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { DEFAULT_PALETTE } from "./background-config";
import { BackgroundRenderer } from "./renderer";

/**
 * O canvas do fundo.
 *
 * LEI DE CAMADAS (F1): este elemento é `fixed` com `z-index: -1`, e precisa ser
 * irmão do `<main>`, não descendente dele. Contextos de empilhamento filhos com
 * z negativo pintam antes dos fundos e do conteúdo dos descendentes em fluxo,
 * então uma seção em fluxo com `mix-blend-mode: difference` mistura contra um
 * backdrop que inclui este canvas. Se algum ancestral da seção criar contexto de
 * empilhamento, a mistura fica presa lá dentro e o efeito some sem erro nenhum.
 *
 * O `<canvas/>` é renderizado normalmente no SSR e o `ogl` só entra por
 * `await import()` dentro do efeito. Sem `next/dynamic` e sem `ssr: false`, que
 * é inválido em Server Component no Next 16 (E1).
 */
export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BackgroundRenderer | null>(null);
  const [degraded, setDegraded] = useState(false);
  const [pronto, setPronto] = useState(false);

  /*
   * Monta uma vez só: trocar de rota não pode recriar o contexto WebGL, senão
   * o fundo piscaria a cada navegação (E7).
   *
   * **O import do `ogl` espera a primeira ociosidade**, e isso é medido, não
   * gosto: o chunk dele custa cerca de 620ms de avaliação de script na CPU
   * emulada do Lighthouse mobile, e dentro do efeito de montagem esses 620ms
   * caíam exatamente na janela que o TBT e o LCP medem. Adiando, a mediana de
   * `/clientes/` no mobile foi de 83 para 90 e o LCP de 3.6s para 2.9s.
   *
   * O fundo é decorativo: nada na página depende dele para ser lido ou
   * clicado, então ele é justamente o candidato certo a sair do caminho.
   * O custo é aparecer depois, e é o `fade` do canvas que transforma isso em
   * entrada intencional em vez de pipoco.
   *
   * `timeout: 2000` garante que ele entre mesmo numa aba que nunca fica
   * ociosa, e o `setTimeout` cobre o Safari, que só ganhou
   * `requestIdleCallback` recentemente.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let renderer: BackgroundRenderer | null = null;

    const agendar = (fn: () => void) => {
      const ric = (
        window as unknown as {
          requestIdleCallback?: (
            f: () => void,
            o?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback;
      return ric
        ? { id: ric.call(window, fn, { timeout: 2000 }), ocioso: true }
        : { id: window.setTimeout(fn, 200), ocioso: false };
    };

    const agendado = agendar(() => {
      void (async () => {
        try {
          const ogl = await import("ogl");
          if (cancelled) return;

          renderer = new BackgroundRenderer(ogl, {
            onContextLost: () => setDegraded(true),
          });

          if (!renderer.mount(canvas, DEFAULT_PALETTE)) {
            setDegraded(true);
            return;
          }
          rendererRef.current = renderer;
          setPronto(true);
        } catch {
          /* Sem WebGL ou falha ao carregar o ogl: o gradiente CSS assume. */
          setDegraded(true);
        }
      })();
    });

    return () => {
      cancelled = true;
      if (agendado.ocioso) {
        (
          window as unknown as { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(agendado.id);
      } else {
        window.clearTimeout(agendado.id);
      }
      renderer?.destroy();
      rendererRef.current = null;
    };
  }, []);

  /*
   * Ponte de tema. A classe .dark no <html> muda, lemos o --c-bg já resolvido e
   * entregamos ao motor, que interpola em rAF com a curva do CSS (F6). Ler o
   * computed style aqui custa uma vez por troca, não uma vez por frame.
   */
  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      const hex = getComputedStyle(root).getPropertyValue("--c-bg").trim();
      if (hex) rendererRef.current?.setTheme(hex);
    };

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /*
   * Ponteiro. O canvas tem pointer-events none, então o listener vive na
   * window. Só mouse: em touch o "ponteiro" seria a última posição tocada e o
   * campo ficaria travado num canto.
   */
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      rendererRef.current?.setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1
      );
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[-1] inset-[var(--pad)]"
    >
      {/*
        O fade existe por causa do adiamento acima: sem ele o fundo pipoca
        quando o ogl termina de carregar. Sob movimento reduzido a transição
        some e ele aparece de uma vez, que é o comportamento pedido.

        `opacity` aqui é seguro para a F1: este elemento é irmão do `<main>`,
        não ancestral de seção `blend` nenhuma, e o wrapper já era contexto de
        empilhamento por causa do z-index negativo.
      */}
      <canvas
        ref={canvasRef}
        className={cn(
          "h-full w-full transition-opacity duration-700 ease-out motion-reduce:transition-none",
          degraded ? "hidden" : "block",
          pronto ? "opacity-100" : "opacity-0"
        )}
      />
      {degraded ? <div className="background-fallback h-full w-full" /> : null}
    </div>
  );
}

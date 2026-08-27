"use client";

import { useEffect, useRef, useState } from "react";

import { setActiveBackground, type PalettePreset } from "./background-config";
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
export function BackgroundCanvas({
  preset = "graphite",
}: {
  preset?: PalettePreset;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BackgroundRenderer | null>(null);
  const presetRef = useRef(preset);
  const [degraded, setDegraded] = useState(false);

  /* Monta uma vez só: trocar de rota não pode recriar o contexto WebGL, senão
     o fundo piscaria a cada navegação (E7). */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let renderer: BackgroundRenderer | null = null;

    void (async () => {
      try {
        const ogl = await import("ogl");
        if (cancelled) return;

        renderer = new BackgroundRenderer(ogl, {
          onContextLost: () => setDegraded(true),
        });

        if (!renderer.mount(canvas, presetRef.current)) {
          setDegraded(true);
          return;
        }
        rendererRef.current = renderer;
        /* Publica o motor para o scroll e para a lista de projetos alcançarem
           o fundo sem passar pela árvore do React. */
        setActiveBackground(renderer);

        /* Se a rota mudou enquanto o import do ogl estava em voo, o efeito de
           paleta abaixo rodou com o motor ainda nulo. Aplicar aqui fecha a
           corrida, e `immediate` evita um crossfade a partir da paleta errada. */
        renderer.setPalette(presetRef.current, true);
      } catch {
        /* Sem WebGL ou falha ao carregar o ogl: o gradiente CSS assume. */
        setDegraded(true);
      }
    })();

    return () => {
      cancelled = true;
      setActiveBackground(null);
      renderer?.destroy();
      rendererRef.current = null;
    };
  }, []);

  /* Paleta por rota, e a única escrita no presetRef, que a montagem assíncrona
     lê para saber qual rota está no ar quando ela finalmente termina. */
  useEffect(() => {
    presetRef.current = preset;
    rendererRef.current?.setPalette(preset);
  }, [preset]);

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
      <canvas
        ref={canvasRef}
        className={`h-full w-full ${degraded ? "hidden" : "block"}`}
      />
      {degraded ? <div className="background-fallback h-full w-full" /> : null}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

import { getActiveBackground } from "@/components/background/background-config";

/**
 * Rolagem suave com Lenis, e a assinatura própria da v3: o fundo reage ao scroll.
 *
 * ⚠️ CONSTRAINT DURA (F3, seção 6.3 do plano): o Lenis roda no modo padrão, de
 * rolagem nativa da janela. **Não configure `wrapper` nem `content`.** Nesse
 * outro modo ele aplica `transform: translate3d()` num wrapper de conteúdo, e
 * esse transform criaria contexto de empilhamento em cima de todo o `<main>`,
 * matando o `mix-blend-mode` de todas as seções de uma vez (F1). O sintoma
 * seria o mesmo de sempre: o efeito principal do site some e o console fica
 * limpo. Se alguém "otimizar" isso depois, quebra o site inteiro sem entender.
 *
 * O progresso vai para o shader por um singleton de módulo, não por estado do
 * React: o evento dispara a cada frame, e re-renderizar a árvore 60 vezes por
 * segundo para atualizar um uniform seria trabalho puro desperdiçado.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    /* Movimento reduzido: rolagem nativa, sem Lenis nenhum. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let frame = 0;
    let instance: Lenis | null = null;

    void (async () => {
      const { default: LenisClass } = await import("lenis");
      if (cancelled) return;

      instance = new LenisClass({
        lerp: 0.1,
        smoothWheel: true,
        /* Toque continua nativo: sincronizar dá sensação de atraso no celular. */
        syncTouch: false,
      });
      lenisRef.current = instance;

      instance.on("scroll", (lenis) => {
        getActiveBackground()?.setProgress(lenis.progress);
      });

      const loop = (time: number) => {
        instance?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      instance?.destroy();
      lenisRef.current = null;
    };
  }, []);

  /*
   * Reset ao trocar de rota (E10).
   *
   * O Lenis guarda a posição de rolagem por conta própria, então sem isso ir de
   * uma rota longa para uma curta abriria a página no meio. O `resize` recalcula
   * o limite, que mudou junto com o conteúdo.
   */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }
    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
    getActiveBackground()?.setProgress(0);
  }, [pathname]);

  return null;
}

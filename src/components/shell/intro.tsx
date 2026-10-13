"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { FUNDO_PRONTO } from "@/components/background/background-config";

import { flip, INTRO, momentoDoDeslize } from "./intro-config";

/**
 * A abertura: cortina preta com o nome, uma vez por sessão (§16.9 do plano).
 *
 * Quem decide se ela aparece é o script do `<head>` em `root-document.tsx`,
 * antes da primeira pintura, marcando `data-intro` no `<html>`. Atributo e não
 * classe, porque o `<BackgroundCanvas>` observa o `class` do `<html>` para
 * trocar de tema. Sem a marca, o CSS mantém a cortina em `display: none`, e é
 * assim que ela vem no HTML do servidor: escondida, para nunca piscar.
 *
 * Quatro coisas que não são óbvias:
 *
 * 1. **Ela nunca envolve o conteúdo.** É `fixed`, irmã do `<main>`, acima do
 *    header (z 60 contra 50). Envolver o site num wrapper com `opacity` ou
 *    `transform` mataria o blend de todas as seções (leis 1 e 3).
 * 2. **O link "Pedro Levi" do header continua visível por baixo.** Ele é o
 *    elemento de LCP nas cinco rotas, e o LCP não leva oclusão em conta: a
 *    cortina só cobre. Escondê-lo empurraria o LCP para o fim da abertura.
 * 3. **O nome da cortina não usa `mix-blend-difference`.** No pouso ele fica
 *    exatamente sobre o do header, que já é `difference`, e a inversão dupla
 *    apagaria o texto. Branco comum sobre o preto, e a cortina se dissolve
 *    por cima do nome de verdade.
 * 4. **Ninguém fica preso.** Clique, tecla, rolagem e toque encerram a
 *    abertura; `pointer-events: none` deixa o clique chegar na página. E se
 *    este JS nunca rodar, o CSS tira a cortina sozinho aos 4 s.
 *
 * A subida das letras é CSS puro, para começar na primeira pintura sem
 * esperar a hidratação. O deslize e a saída são daqui, porque precisam medir.
 */
export function Intro({ name }: { name: string }) {
  const cortinaRef = useRef<HTMLDivElement>(null);
  const nomeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    const cortina = cortinaRef.current;
    const nome = nomeRef.current;
    if (!cortina || !nome || !raiz.hasAttribute("data-intro")) return;

    /* A reserva do CSS é para o caso de este JS nunca rodar. Daqui em diante
       quem tira a cortina é ele, então ela sai. */
    for (const a of cortina.getAnimations()) a.cancel();

    let encerrada = false;
    let saindo = false;

    const eventos = [
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "resize",
    ] as const;

    const terminar = () => {
      if (encerrada) return;
      encerrada = true;
      for (const e of eventos) window.removeEventListener(e, pular);
      try {
        sessionStorage.setItem(INTRO.chave, "1");
      } catch {
        /* modo privado: ela volta na próxima página, e é só isso */
      }
      raiz.removeAttribute("data-intro");
    };

    const sair = (duracao: number, easing: string) => {
      if (saindo) return;
      saindo = true;
      cortina
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: duracao,
          easing,
          fill: "forwards",
        })
        .finished.then(terminar, terminar);
    };

    /* Redimensionar também encerra: o lugar de pouso mudou. */
    function pular() {
      sair(INTRO.puloMs, "ease-out");
    }
    for (const e of eventos) {
      window.addEventListener(e, pular, { passive: true });
    }

    const esperar = (ms: number) =>
      new Promise<void>((r) => setTimeout(r, Math.max(0, ms)));

    const pronto = new Promise<number>((resolve) => {
      if (document.querySelector("[data-fundo-pronto]")) resolve(0);
      else
        window.addEventListener(
          FUNDO_PRONTO,
          () => resolve(performance.now()),
          { once: true }
        );
    });

    void (async () => {
      const letras = nome.getAnimations({ subtree: true });
      await Promise.all([
        document.fonts.ready,
        ...letras.map((a) => a.finished.catch(() => undefined)),
      ]);
      const fimLetras = performance.now();
      const prontoEm = await Promise.race([
        pronto,
        esperar(INTRO.tetoMs - performance.now()).then(() => Infinity),
      ]);
      await esperar(momentoDoDeslize(fimLetras, prontoEm) - performance.now());
      if (saindo) return;

      const alvo = document.querySelector("[data-intro-alvo]");
      if (!alvo) return pular();
      const { dx, dy, escala } = flip(
        nome.getBoundingClientRect(),
        alvo.getBoundingClientRect()
      );
      await nome
        .animate(
          [
            { transform: "none" },
            { transform: `translate(${dx}px, ${dy}px) scale(${escala})` },
          ],
          {
            id: "intro-deslize",
            duration: INTRO.deslizeMs,
            easing: "cubic-bezier(0.7, 0, 0.2, 1)",
            fill: "forwards",
          }
        )
        .finished.catch(() => undefined);
      sair(INTRO.saidaMs, "cubic-bezier(0.65, 0, 0.35, 1)");
    })();

    return () => {
      for (const e of eventos) window.removeEventListener(e, pular);
    };
  }, []);

  return (
    <div
      ref={cortinaRef}
      aria-hidden
      className="intro pointer-events-none fixed inset-0 z-[60] bg-[#0b0b0c]"
      style={
        {
          "--intro-letra": `${INTRO.letraMs}ms`,
          "--intro-passo": `${INTRO.passoMs}ms`,
        } as CSSProperties
      }
    >
      {/*
        Mesma fonte, peso, espaçamento e razão de altura de linha do link do
        header (`text-2xl`, e `text-3xl` de `lg` para cima). A razão é o que
        faz a altura acompanhar a largura no FLIP; a escala sai da largura.
      */}
      <span
        ref={nomeRef}
        data-intro-nome
        className="absolute top-1/2 left-1/2 origin-top-left -translate-x-1/2 -translate-y-1/2 text-[clamp(36px,7vw,96px)] leading-(--text-2xl--line-height) font-medium tracking-tight whitespace-pre text-white lg:leading-(--text-3xl--line-height)"
      >
        {[...name].map((letra, i) => (
          <span key={i} className="intro-caixa">
            <span className="intro-letra" style={{ "--i": i } as CSSProperties}>
              {letra === " " ? " " : letra}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

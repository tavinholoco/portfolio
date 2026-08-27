import type { ReactNode } from "react";

import { BackgroundCanvas } from "@/components/background/background-canvas";
import type { PalettePreset } from "@/components/background/background-config";
import { Frame } from "@/components/shell/frame";
import { SmoothScroll } from "@/components/shell/smooth-scroll";
import { ViewportMask } from "@/components/shell/viewport-mask";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/i18n";

/**
 * O shell do site, compartilhado pelos dois root layouts.
 *
 * Existem dois layouts raiz, um por idioma, e tudo que vive no `<body>` precisa
 * entrar nos dois. Concentrar a montagem aqui é o que impede pt e en de
 * divergirem em silêncio.
 *
 * A ordem e as camadas seguem a tabela de F1 (seção 6.1 do plano):
 *
 * | Elemento          | Posição              | z-index |
 * |-------------------|----------------------|---------|
 * | BackgroundCanvas  | fixed, inset var(--pad) | -1   |
 * | main              | estático, sem z      | auto    |
 * | ViewportMask      | fixed                | 30      |
 * | Frame             | fixed                | 40      |
 * | SiteHeader        | fixed                | 50      |
 * | SiteFooter        | fixed                | 50      |
 *
 * ⚠️ O `<main>` abaixo é deliberadamente pelado: sem `position`, sem `z-index`,
 * sem `transform`, sem `isolation`. Qualquer um desses transformaria o `<main>`
 * em contexto de empilhamento e as seções `blend` passariam a misturar contra o
 * fundo dele, que é transparente, em vez de contra o canvas. O efeito principal
 * do site sumiria sem gerar erro nenhum. Ver o comentário no topo de
 * `src/components/section.tsx`.
 *
 * O canvas precisa continuar dentro de um wrapper dimensionado por CSS: o
 * construtor do `Renderer` do OGL grava largura e altura inline no elemento
 * canvas, então o motor mede o contêiner, não o canvas.
 */
export function SiteShell({
  lang,
  palette = "graphite",
  children,
}: {
  lang: Locale;
  palette?: PalettePreset;
  children: ReactNode;
}) {
  return (
    <>
      <BackgroundCanvas preset={palette} />
      <SmoothScroll />
      <SiteHeader lang={lang} />
      {/*
        Sem padding vertical, de propósito. Header e footer são fixos e em
        difference: o conteúdo passa por baixo deles e eles invertem contra o
        que estiver ali, que é o desenho pretendido. Um padding aqui abriria uma
        faixa do canvas entre o header e a primeira seção, com uma borda dura
        que parece acidente. O respiro vem do padding vertical das seções, e as
        faixas de var(--pad) no topo e na base são cobertas pela ViewportMask.
      */}
      <main>{children}</main>
      <SiteFooter />
      <ViewportMask />
      <Frame />
    </>
  );
}

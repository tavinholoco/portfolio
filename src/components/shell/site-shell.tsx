import type { ReactNode } from "react";

import { BackgroundCanvas } from "@/components/background/background-canvas";
import { Frame } from "@/components/shell/frame";
import { ViewportMask } from "@/components/shell/viewport-mask";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dictionaries, type Locale } from "@/i18n";

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
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  return (
    <>
      <BackgroundCanvas />
      {/*
        As strings do header saem daqui, que é server component, e não de um
        `dictionaries[lang]` lá dentro. Ver `HeaderLabels`: era esse acesso
        que arrastava os dois dicionários inteiros para o bundle do cliente.
      */}
      <SiteHeader
        lang={lang}
        labels={{
          name: dictionaries[lang].hero.name,
          role: dictionaries[lang].hero.role,
          downloadCv: dictionaries[lang].hero.downloadCv,
          nav: dictionaries[lang].nav,
          controls: dictionaries[lang].controls,
        }}
      />
      {/*
        Sem padding vertical, de propósito. Header e footer são fixos e em
        difference: o conteúdo passa por baixo deles e eles invertem contra o
        que estiver ali, que é o desenho pretendido. Um padding aqui abriria uma
        faixa do canvas entre o header e a primeira seção, com uma borda dura
        que parece acidente. O respiro vem do padding vertical das seções, e as
        faixas de var(--pad) no topo e na base são cobertas pela ViewportMask.
      */}
      {/*
        A primeira seção de cada rota precisa passar por baixo do bloco de
        identidade, que é `fixed` e mede `1.5 * --pad` de recuo mais umas
        4.5rem de nome e cargo. Abaixo de `lg` não existe a coluna da nav para
        afastar o conteúdo na horizontal, então a folga tem que ser vertical:
        sem ela, em 768px o h1 encosta no cargo. A conta acompanha o `--pad`,
        que varia com a viewport, e por isso a folga fica igual em 390 e 768.

        Vai só na primeira seção, e não no padding de todas, senão o espaço
        entre seções dobraria no mobile. E vai como padding num descendente,
        nunca no `<main>`: no `<main>` o fundo das seções com cor própria
        pararia antes da faixa. Padding não cria contexto de empilhamento,
        então a F1 continua de pé.
      */}
      <main className="[&>section:first-of-type]:pt-[calc(var(--pad)*1.5+6rem)] lg:[&>section:first-of-type]:pt-28">
        {children}
      </main>
      <SiteFooter />
      <ViewportMask />
      <Frame />
    </>
  );
}

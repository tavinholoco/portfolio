import { expect, test } from "@playwright/test";

/**
 * Auditoria de responsividade: 6 rotas em 7 larguras.
 *
 * Cinco classes de defeito, todas encontradas na prática e nenhuma delas
 * visível num teste de conteúdo:
 *
 * 1. **Rolagem horizontal.** Um elemento largo demais empurra a página e o site
 *    passa a rolar de lado no celular.
 * 2. **Conteúdo por baixo do bloco de identidade.** O header é `fixed`, e abaixo
 *    de `lg` não existe a coluna da nav para afastar o conteúdo na horizontal.
 *    Em 768px o `h1` chegou a encostar no cargo, porque `--pad` cresce com a
 *    viewport e o recuo do header cresce junto.
 * 3. **Texto estourando a moldura.** O padding do container é `2 * --pad` para o
 *    texto nunca passar por baixo das linhas de 1px, que ficam em `--pad`.
 * 4. **Palavra estourando a própria caixa.** Item de grid nasce com
 *    `min-width: auto`, e uma palavra longa não encolhe a trilha: transborda por
 *    cima da coluna vizinha. Só a caixa do elemento denuncia, comparando
 *    `scrollWidth` com `clientWidth`.
 * 5. **Header saindo da tela.** O header é `fixed`, e o que transborda dele
 *    **não entra no `scrollWidth` do documento**: a asserção 1 não vê. Com o
 *    "Baixar CV" no header, os controles saíam 88px da tela em 320px e o botão
 *    do menu ficava inalcançável em 320, 360 e 390px, que é a maioria dos
 *    celulares. Precisa de medição própria.
 *
 * **As cinco rodam num carregamento só.** Antes eram quatro testes com quatro
 * `goto` por combinação, o que fazia cada largura nova custar 4x mais tempo e
 * desestimulava justamente o que faltava: cobrir mais larguras.
 *
 * ⚠️ **A lista de rotas inclui uma página de case, e isso não é detalhe.** A
 * versão anterior cobria só as 5 rotas de nav, e por isso não viu que
 * "Repertório Progressivo" estourava a caixa em **todo desktop de 1440 para
 * cima**, desde que a V3.5 reservou `--nav-col` e encolheu o container sem que
 * a escala tipográfica acompanhasse. Rota que não é visitada não é testada.
 */

const rotas = [
  "/",
  "/clientes/",
  "/projetos/",
  "/info/",
  "/contato/",
  /* O título mais longo do site, e o que pegou o defeito da escala. */
  "/projetos/repertorio-progressivo/",
] as const;

const larguras = [
  { nome: "estreito", width: 320, height: 800 },
  { nome: "mobile", width: 390, height: 844 },
  { nome: "paisagem", width: 844, height: 390 },
  { nome: "tablet", width: 768, height: 1024 },
  { nome: "laptop", width: 1024, height: 768 },
  { nome: "desktop", width: 1440, height: 900 },
  { nome: "ultrawide", width: 2560, height: 1440 },
] as const;

for (const largura of larguras) {
  test.describe(`${largura.nome} (${largura.width}px)`, () => {
    test.use({ viewport: { width: largura.width, height: largura.height } });

    for (const rota of rotas) {
      test(`${rota} se comporta`, async ({ page }) => {
        await page.goto(rota);
        await page.waitForTimeout(300);

        const problemas = await page.evaluate(() => {
          const achados: string[] = [];
          const doc = document.documentElement;

          /*
           * `--pad` é `max(20px, 4vmin)`, e `getPropertyValue` devolve a
           * expressão literal, não o valor resolvido: `parseFloat` nela dá NaN
           * e toda comparação vira falsa, ou seja, o teste passa sem testar. A
           * régua tem que ser medida num elemento de verdade.
           */
          const regua = document.createElement("div");
          regua.style.cssText =
            "position:absolute;visibility:hidden;width:var(--pad)";
          document.body.appendChild(regua);
          const pad = regua.getBoundingClientRect().width;
          regua.remove();
          if (!pad) throw new Error("--pad não resolveu");

          /* 1. Rolagem horizontal, com 1px de folga para subpixel. */
          if (doc.scrollWidth > doc.clientWidth + 1) {
            achados.push(
              `rola na horizontal: ${doc.scrollWidth} > ${doc.clientWidth}`
            );
          }

          const texto = [
            ...document.querySelectorAll(
              "main h1, main h2, main h3, main p, main dt, main dd, main span"
            ),
          ].filter(
            (el) => el.textContent?.trim() && !el.closest(".sr-only")
          ) as HTMLElement[];

          /* 5. Header dentro da tela. Antes da asserção 1, porque um header
             estourado não produz rolagem e passaria batido. */
          const header = document.querySelector("header");
          if (header) {
            for (const el of header.querySelectorAll("a, button, p, nav")) {
              const r = el.getBoundingClientRect();
              if (r.width === 0) continue;
              if (r.right > doc.clientWidth + 1 || r.left < -1) {
                achados.push(
                  `header fora da tela: ${el.tagName} "${(el.textContent ?? "").trim().slice(0, 16)}" ` +
                    `termina em ${Math.round(r.right)}px de ${doc.clientWidth}px`
                );
              }
            }
          }

          /* 2. Colisão com o bloco de identidade, que é `fixed`. */
          const bloco = header?.firstElementChild?.firstElementChild;
          const primeira = document.querySelector("main section");
          if (bloco && primeira) {
            /* Elemento de TEXTO, nunca um container: o container da seção ocupa
               a largura toda, inclusive a faixa reservada da nav, e cruzaria o
               bloco sempre, sem que nada de visível encoste. */
            const alvo = [
              ...primeira.querySelectorAll(
                "h1:not(.sr-only), h2, h3, p, li, a"
              ),
            ].find((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0 && el.textContent?.trim();
            });
            if (alvo) {
              const b = bloco.getBoundingClientRect();
              const a = alvo.getBoundingClientRect();
              if (
                a.left < b.right &&
                a.right > b.left &&
                a.top < b.bottom &&
                a.bottom > b.top
              ) {
                achados.push(
                  `conteúdo por baixo da identidade (folga ${Math.round(a.top - b.bottom)}px)`
                );
              }
            }
          }

          const limite = doc.clientWidth - pad;
          for (const el of texto) {
            const r = el.getBoundingClientRect();

            /* 3. Texto passando por baixo das linhas da moldura. */
            if (r.width > 0 && (r.left < pad - 1 || r.right > limite + 1)) {
              achados.push(
                `fora da moldura: ${el.tagName} "${el.textContent!.trim().slice(0, 24)}"`
              );
            }

            /* 4. Palavra maior que a própria caixa. Inline não tem caixa. */
            if (el.clientWidth && el.scrollWidth > el.clientWidth + 1) {
              achados.push(
                `estoura a caixa: ${el.tagName} "${el.textContent!.trim().slice(0, 24)}" ` +
                  `${el.scrollWidth}px em ${el.clientWidth}px`
              );
            }
          }

          return [...new Set(achados)];
        });

        expect(problemas, problemas.join(" | ")).toHaveLength(0);
      });
    }
  });
}

import { expect, test } from "@playwright/test";

/**
 * Auditoria de responsividade das 5 rotas em 4 larguras.
 *
 * Três classes de defeito, todas encontradas na prática e nenhuma delas visível
 * num teste de conteúdo:
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
 *    `min-width: auto`, então uma palavra longa não encolhe a trilha: ela
 *    transborda por cima da coluna vizinha. Aconteceu com "contratando" em
 *    `/contato/`, e as três asserções acima passaram, porque o texto continuava
 *    dentro da moldura e a página não rolava de lado. Só a caixa do elemento
 *    denuncia: `scrollWidth` maior que `clientWidth`.
 */

const rotas = ["/", "/clientes/", "/projetos/", "/info/", "/contato/"] as const;

const larguras = [
  { nome: "mobile", width: 390, height: 844 },
  { nome: "tablet", width: 768, height: 1024 },
  { nome: "laptop", width: 1024, height: 768 },
  { nome: "desktop", width: 1440, height: 900 },
] as const;

for (const largura of larguras) {
  test.describe(`${largura.nome} (${largura.width}px)`, () => {
    test.use({ viewport: { width: largura.width, height: largura.height } });

    for (const rota of rotas) {
      test(`${rota} não rola na horizontal`, async ({ page }) => {
        await page.goto(rota);
        await page.waitForTimeout(300);

        const medidas = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        /* Um pixel de folga para arredondamento de subpixel. */
        expect(
          medidas.scrollWidth,
          `${medidas.scrollWidth} > ${medidas.clientWidth}`
        ).toBeLessThanOrEqual(medidas.clientWidth + 1);
      });

      test(`${rota} não deixa conteúdo por baixo da identidade`, async ({
        page,
      }) => {
        await page.goto(rota);
        await page.waitForTimeout(300);

        const colisao = await page.evaluate(() => {
          const header = document.querySelector("header");
          const primeira = document.querySelector("main section");
          if (!header || !primeira) return null;

          /* O bloco de identidade, não o header inteiro: o header é de largura
             cheia e sempre cruzaria a coluna do conteúdo. */
          const bloco = header.firstElementChild?.firstElementChild;
          if (!bloco) return null;

          /* Elemento de TEXTO, nunca um container: o container da seção
             ocupa a largura toda, inclusive a faixa reservada da nav, e
             cruzaria o bloco de identidade sempre, sem que nada de
             visível encoste. */
          const alvo = [
            ...primeira.querySelectorAll("h1:not(.sr-only), h2, h3, p, li, a"),
          ].find((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && el.textContent?.trim();
          });
          if (!alvo) return null;

          const b = bloco.getBoundingClientRect();
          const a = alvo.getBoundingClientRect();
          const cruzaX = a.left < b.right && a.right > b.left;
          const cruzaY = a.top < b.bottom && a.bottom > b.top;
          return {
            sobrepoe: cruzaX && cruzaY,
            folga: Math.round(a.top - b.bottom),
          };
        });

        if (colisao === null) test.skip();
        expect(
          colisao!.sobrepoe,
          `folga vertical de ${colisao!.folga}px entre a identidade e o conteúdo`
        ).toBe(false);
      });

      test(`${rota} não deixa palavra estourar a própria caixa`, async ({
        page,
      }) => {
        await page.goto(rota);
        await page.waitForTimeout(300);

        const estourando = await page.evaluate(() => {
          const fora: string[] = [];
          for (const el of document.querySelectorAll(
            "main h1, main h2, main h3, main p, main dt, main dd"
          )) {
            if (!el.textContent?.trim()) continue;
            if (el.closest(".sr-only")) continue;
            /* clientWidth é 0 em elemento inline: só bloco tem caixa medível. */
            if (el.clientWidth === 0) continue;
            if (el.scrollWidth > el.clientWidth + 1) {
              fora.push(
                `${el.tagName} "${el.textContent.trim().slice(0, 24)}" ` +
                  `${el.scrollWidth}px numa caixa de ${el.clientWidth}px`
              );
            }
          }
          return fora;
        });

        expect(estourando, estourando.join(" | ")).toHaveLength(0);
      });

      test(`${rota} mantém o texto dentro da moldura`, async ({ page }) => {
        await page.goto(rota);
        await page.waitForTimeout(300);

        const vazando = await page.evaluate(() => {
          /*
           * `--pad` é `max(20px, 4vmin)`, e getPropertyValue devolve a
           * expressão literal, não o valor resolvido: `parseFloat` nela dá
           * NaN, e toda comparação vira falsa. A régua tem que ser medida
           * num elemento de verdade.
           */
          const regua = document.createElement("div");
          regua.style.cssText =
            "position:absolute;visibility:hidden;width:var(--pad)";
          document.body.appendChild(regua);
          const pad = regua.getBoundingClientRect().width;
          regua.remove();
          if (!pad) throw new Error("--pad não resolveu");
          const limite = document.documentElement.clientWidth - pad;
          const fora: string[] = [];

          const alvos = document.querySelectorAll(
            "main p, main h1, main h2, main h3, main span"
          );
          for (const el of alvos) {
            if (!el.textContent?.trim()) continue;
            /* sr-only fica em 1px fora de vista, de propósito. */
            if (el.closest(".sr-only")) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0) continue;
            if (r.left < pad - 1 || r.right > limite + 1) {
              fora.push(`${el.tagName}: ${el.textContent.trim().slice(0, 30)}`);
            }
          }
          return fora;
        });

        expect(vazando, vazando.join(" | ")).toHaveLength(0);
      });
    }
  });
}

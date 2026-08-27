import { expect, test, type Page } from "@playwright/test";

/**
 * As invariantes do shell da v3, que nenhum teste unitário alcança porque
 * dependem de layout e composição reais.
 *
 * A primeira delas é a lei F1 (seção 6.1 do plano), e é a razão principal deste
 * arquivo existir: se algum ancestral de uma seção `blend` passar a criar
 * contexto de empilhamento, o efeito central do site some **sem erro nenhum no
 * console**. Um teste é a única rede que pega isso, porque revisão de código
 * não pega: o culpado pode ser um `transform` acrescentado três componentes
 * acima, em outro arquivo, por outro motivo.
 */

const rotas = [
  "/",
  "/clientes/",
  "/projetos/",
  "/info/",
  "/contato/",
  "/en/",
  "/en/clients/",
  "/en/projects/",
  "/en/info/",
  "/en/contact/",
  "/projetos/newra-news/",
] as const;

/**
 * Roda no navegador: para cada seção `blend`, sobe a árvore procurando
 * ancestral que crie contexto de empilhamento. Devolve a lista de culpados.
 */
async function ancestraisQueQuebramOBlend(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    function motivos(el: Element): string | null {
      if (el === document.documentElement) return null;
      const s = getComputedStyle(el);
      const r: string[] = [];
      if (s.position !== "static" && s.zIndex !== "auto") {
        r.push(`position:${s.position} + z-index:${s.zIndex}`);
      }
      if (s.position === "fixed" || s.position === "sticky") {
        r.push(`position:${s.position}`);
      }
      if (s.transform !== "none") r.push("transform");
      if (parseFloat(s.opacity) < 1) r.push(`opacity:${s.opacity}`);
      if (s.filter !== "none") r.push("filter");
      if (s.isolation === "isolate") r.push("isolation:isolate");
      if (s.contain && /paint|layout|strict|content/.test(s.contain)) {
        r.push(`contain:${s.contain}`);
      }
      if (s.mixBlendMode !== "normal") r.push(`mix-blend-mode:${s.mixBlendMode}`);
      if (s.willChange && /transform|opacity|filter/.test(s.willChange)) {
        r.push(`will-change:${s.willChange}`);
      }
      if (s.backdropFilter && s.backdropFilter !== "none") {
        r.push("backdrop-filter");
      }
      return r.length ? r.join(", ") : null;
    }

    const culpados: string[] = [];
    for (const secao of document.querySelectorAll('[data-variant="blend"]')) {
      let el = secao.parentElement;
      while (el) {
        const motivo = motivos(el);
        if (motivo) {
          const nome = el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "");
          culpados.push(`#${secao.id} confinado por ${nome} (${motivo})`);
        }
        el = el.parentElement;
      }
    }
    return culpados;
  });
}

test.describe("F1: o blend precisa alcançar o canvas", () => {
  for (const rota of rotas) {
    test(`${rota} não tem ancestral criando contexto de empilhamento`, async ({
      page,
    }) => {
      await page.goto(rota);
      expect(await ancestraisQueQuebramOBlend(page)).toEqual([]);
    });
  }

  test("o teste detecta a quebra quando ela existe", async ({ page }) => {
    /*
     * Sem este caso, o conjunto acima passaria igual se a função de auditoria
     * estivesse quebrada e sempre devolvesse lista vazia. Aqui a quebra é
     * introduzida de propósito no <main> e o teste precisa vê-la.
     */
    await page.goto("/");
    await page.evaluate(() => {
      document.querySelector("main")?.setAttribute("style", "isolation: isolate");
    });
    const culpados = await ancestraisQueQuebramOBlend(page);
    expect(culpados.length).toBeGreaterThan(0);
    expect(culpados.join(" ")).toContain("isolation");
  });
});

test.describe("camadas do shell", () => {
  test("a pilha segue a tabela de F1", async ({ page }) => {
    await page.goto("/");
    const camadas = await page.evaluate(() => {
      const z = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).zIndex : null;
      };
      const main = document.querySelector("main");
      const ms = main ? getComputedStyle(main) : null;
      return {
        canvas: z("canvas + *, canvas") ?? null,
        canvasWrapper: document.querySelector("canvas")?.parentElement
          ? getComputedStyle(document.querySelector("canvas")!.parentElement!)
              .zIndex
          : null,
        header: z("header"),
        footer: z("footer"),
        mainPosition: ms?.position ?? null,
        mainZIndex: ms?.zIndex ?? null,
      };
    });

    expect(camadas.canvasWrapper).toBe("-1");
    expect(camadas.header).toBe("50");
    expect(camadas.footer).toBe("50");
    /* O <main> pelado é a condição de F1, e por isso é asserção e não detalhe. */
    expect(camadas.mainPosition).toBe("static");
    expect(camadas.mainZIndex).toBe("auto");
  });

  test("o fundo da página vive no :root, nunca no body (F1)", async ({
    page,
  }) => {
    await page.goto("/");
    const cores = await page.evaluate(() => ({
      root: getComputedStyle(document.documentElement).backgroundColor,
      body: getComputedStyle(document.body).backgroundColor,
    }));

    expect(cores.body).toBe("rgba(0, 0, 0, 0)");
    expect(cores.root).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("nada aplica transform em html, body ou main (F1)", async ({
    page,
  }) => {
    await page.goto("/");
    /*
     * Era o teste do Lenis, que na v3.5 saiu do projeto. A invariante fica:
     * transform em qualquer um destes cria contexto de empilhamento e mata o
     * blend de todas as seções, venha de uma lib de rolagem ou de qualquer
     * outra coisa que alguém acrescente depois.
     */
    await page.waitForTimeout(300);

    const transforms = await page.evaluate(() => ({
      html: getComputedStyle(document.documentElement).transform,
      body: getComputedStyle(document.body).transform,
      main: getComputedStyle(document.querySelector("main")!).transform,
    }));

    expect(transforms.html).toBe("none");
    expect(transforms.body).toBe("none");
    expect(transforms.main).toBe("none");
  });

  test("a seleção de texto continua ligada, porque recrutador copia email", async ({
    page,
  }) => {
    await page.goto("/contato/");
    const select = await page.evaluate(
      () => getComputedStyle(document.body).userSelect
    );
    expect(select).not.toBe("none");
  });
});

test.describe("o canvas do fundo", () => {
  test("é renderizado no SSR e ganha dimensões reais", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(800);

    const canvas = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      if (!c) return null;
      return {
        buffer: [c.width, c.height],
        css: [c.clientWidth, c.clientHeight],
        fallback: !!document.querySelector(".background-fallback"),
      };
    });

    expect(canvas).not.toBeNull();
    expect(canvas!.buffer[0]).toBeGreaterThan(1);
    expect(canvas!.buffer[1]).toBeGreaterThan(1);
    expect(canvas!.fallback).toBe(false);
  });

  test("cai no fallback CSS quando não há WebGL", async ({ page }) => {
    /* Simula ambiente sem WebGL negando o contexto antes de qualquer script. */
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        tipo: string,
        ...resto: unknown[]
      ) {
        if (tipo.startsWith("webgl")) return null;
        return (original as never as (...a: unknown[]) => unknown).call(
          this,
          tipo,
          ...resto
        );
      } as typeof HTMLCanvasElement.prototype.getContext;
    });

    await page.goto("/");
    await expect(page.locator(".background-fallback")).toBeVisible();
  });

  test("limita o DPR a 1.5 em tela grande", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(800);

    const dpr = await page.evaluate(() => {
      const c = document.querySelector("canvas")!;
      return c.width / Math.max(c.clientWidth, 1);
    });

    expect(dpr).toBeGreaterThan(0);
    expect(dpr).toBeLessThanOrEqual(1.5);
  });

  test("cai para DPR 1 e alvo menor em tela pequena", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      baseURL: "http://localhost:3000",
    });
    const page = await context.newPage();

    try {
      await page.goto("/");
      await page.waitForTimeout(900);

      const dpr = await page.evaluate(() => {
        const c = document.querySelector("canvas")!;
        return c.width / Math.max(c.clientWidth, 1);
      });

      /* Abaixo de 768px o motor ignora o devicePixelRatio do aparelho: num
         celular de DPR 3 isso seria nove vezes mais pixels para pintar. */
      expect(dpr).toBeLessThanOrEqual(1.01);
    } finally {
      await context.close();
    }
  });

  test("sobrevive a nascer em aba oculta e voltar a ficar visível", async ({
    page,
  }) => {
    /*
     * Regressão real: uma aba em segundo plano não faz layout, o contêiner
     * mede 0 no mount e o canvas nasce em 1x1. O ResizeObserver não salva
     * sozinho, porque entrega nas etapas de renderização, que uma página
     * oculta não executa. Sem a remedição no `visibilitychange`, a aba voltaria
     * pintando um único pixel esticado na tela inteira.
     */
    await page.goto("/");
    await page.waitForTimeout(600);

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(200);

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(400);

    const canvas = await page.evaluate(() => {
      const c = document.querySelector("canvas")!;
      return { buffer: c.width, css: c.clientWidth };
    });

    expect(canvas.buffer).toBeGreaterThan(1);
    expect(canvas.css).toBeGreaterThan(1);
  });
});

test.describe("movimento reduzido", () => {
  test("a página funciona, sem erro de console e com o fundo em pé", async ({
    page,
  }) => {
    /* Emulado antes do goto: o motor lê a preferência no mount. */
    await page.emulateMedia({ reducedMotion: "reduce" });

    const erros: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") erros.push(msg.text());
    });
    page.on("pageerror", (err) => erros.push(err.message));

    await page.goto("/projetos/");
    await page.waitForTimeout(900);

    const estado = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      return {
        canvasOk: !!c && c.width > 1,
        temConteudo: (document.body.innerText || "").length > 100,
      };
    });

    expect(erros).toEqual([]);
    expect(estado.canvasOk).toBe(true);
    expect(estado.temConteudo).toBe(true);
  });

  test("o preview do showcase troca sem crossfade", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/projetos/");
    const duracao = await page.evaluate(() => {
      const alvo = document.querySelector(
        '[data-variant="solid"] .absolute'
      ) as HTMLElement | null;
      return alvo ? getComputedStyle(alvo).transitionDuration : null;
    });

    /* O bloco global de prefers-reduced-motion zera toda transição. */
    expect(duracao === null || parseFloat(duracao) < 0.05).toBe(true);
  });
});

test.describe("contraste: a regra de opacidade em texto", () => {
  /*
   * A auditoria da Fase 6 encontrou contraste de 2.0:1 em texto de 12px, bem
   * abaixo dos 4.5:1 da WCAG AA. A causa não era um valor exagerado isolado, e
   * sim **opacidade aninhada**: uma linha da lista a 60% com um número a 40%
   * dentro dela resulta em 24% efetivo, e ninguém percebe lendo o código,
   * porque os dois valores parecem razoáveis separadamente.
   *
   * Este teste multiplica as opacidades ao longo da árvore, que é o que o
   * navegador faz, e por isso pega o caso que a leitura não pega.
   */
  const MINIMO = 0.7;

  for (const rota of ["/", "/projetos/", "/info/", "/contato/"]) {
    test(`${rota}: nenhum texto abaixo de ${MINIMO} de opacidade efetiva`, async ({
      page,
    }) => {
      /*
       * Movimento reduzido zera a animação de entrada, e é isso que torna a
       * medida determinística: no meio do fade a opacidade está a caminho do
       * valor final e qualquer limiar acusaria falso positivo. O contraste que
       * a WCAG cobra é o do estado assentado.
       */
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(rota);
      await page.waitForTimeout(400);

      const fracos = await page.evaluate((minimo) => {
        const problemas: string[] = [];

        for (const el of document.querySelectorAll("main *")) {
          /* Só elementos com texto próprio. */
          const texto = [...el.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent?.trim() ?? "")
            .join("");
          if (!texto) continue;
          if (el.closest("[aria-hidden='true']")) continue;

          let efetiva = 1;
          let atual: Element | null = el;
          while (atual && atual !== document.body) {
            efetiva *= parseFloat(getComputedStyle(atual).opacity);
            atual = atual.parentElement;
          }

          if (efetiva < minimo - 0.001) {
            problemas.push(
              `${el.tagName.toLowerCase()} "${texto.slice(0, 30)}" -> ${efetiva.toFixed(2)}`
            );
          }
        }
        return problemas;
      }, MINIMO);

      expect(fracos).toEqual([]);
    });
  }
});

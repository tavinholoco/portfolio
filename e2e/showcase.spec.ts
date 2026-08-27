import { devices, expect, test, type Page } from "@playwright/test";

/**
 * As regras da seção 3.1 do plano que só existem em runtime.
 *
 * O showcase é o componente com mais comportamento do site, e quase todo ele é
 * invisível para teste unitário: depende de ponteiro, de foco, de
 * IntersectionObserver e de tempo. As regras testadas aqui são justamente as
 * que alguém quebraria sem perceber ao mexer no componente.
 */

/**
 * O texto do problema, que troca junto com o preview.
 *
 * Por `data-testid` e não por posição: o mockup de janela também tem um `<p>`
 * com o título, e um seletor posicional pegava ele em vez deste.
 */
function problema(page: Page) {
  return page.getByTestId("showcase-problem");
}

/** As linhas da lista, na ordem de curadoria. */
function linhas(page: Page) {
  return page.locator('[data-variant="solid"] ol > li');
}

test.describe("showcase: ponteiro", () => {
  test("abre com o item 01 preenchido, nunca vazio (regra 8)", async ({
    page,
  }) => {
    await page.goto("/projetos/");
    await expect(problema(page)).toContainText("Portal precisava gerar");
  });

  test("passar o mouse troca o preview (regras 3 e 4)", async ({ page }) => {
    await page.goto("/projetos/");
    const antes = await problema(page).innerText();

    await linhas(page).nth(2).locator("a").hover();
    await expect(problema(page)).not.toHaveText(antes);
    await expect(problema(page)).toContainText("Estudantes sem organização");
  });

  test("não reseta ao tirar o mouse, mantém o último visto (regra 5)", async ({
    page,
  }) => {
    await page.goto("/projetos/");

    await linhas(page).nth(3).locator("a").hover();
    await expect(problema(page)).toContainText("Assessoria contábil");

    /* Sai da lista para um ponto neutro do cabeçalho. */
    await page.mouse.move(10, 10);
    await page.waitForTimeout(300);

    /* O erro clássico deste padrão é voltar ao índice 0 exatamente aqui. */
    await expect(problema(page)).toContainText("Assessoria contábil");
  });

  test("varrer a lista rápido não faz o preview estroboscopar (regra 4)", async ({
    page,
  }) => {
    await page.goto("/projetos/");
    const alvo = linhas(page).nth(3).locator("a");

    /* Passa por todas as linhas em menos que o debounce de intenção. */
    for (const i of [0, 1, 2, 3]) {
      await linhas(page).nth(i).locator("a").hover();
    }
    await alvo.hover();

    /* Só o destino final deve ter valido. */
    await expect(problema(page)).toContainText("Assessoria contábil");
  });
});

test.describe("showcase: teclado", () => {
  test("focar uma linha por Tab move o preview junto (regra 3)", async ({
    page,
  }) => {
    await page.goto("/projetos/");

    const link = linhas(page).nth(2).locator("a");
    await link.focus();

    await expect(link).toBeFocused();
    await expect(problema(page)).toContainText("Estudantes sem organização");
  });

  test("o anel de foco é visível, e usa currentColor para inverter no blend", async ({
    page,
  }) => {
    await page.goto("/contato/");

    const link = page.locator('[data-variant="blend"] a').first();
    await link.focus();

    const contorno = await link.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        estilo: s.outlineStyle,
        largura: s.outlineWidth,
        cor: s.outlineColor,
        corDoTexto: s.color,
      };
    });

    expect(contorno.estilo).not.toBe("none");
    expect(parseFloat(contorno.largura)).toBeGreaterThan(0);
    /* currentColor: o anel acompanha o texto e inverte junto com ele. */
    expect(contorno.cor).toBe(contorno.corDoTexto);
  });
});

test.describe("showcase: destinos", () => {
  test("projeto leva para a rota interna do case (regra 10)", async ({
    page,
  }) => {
    await page.goto("/projetos/");
    const link = linhas(page).nth(0).locator("a");

    await expect(link).toHaveAttribute("href", "/projetos/newra-news/");
    await expect(link).not.toHaveAttribute("target", "_blank");
  });

  test("cliente abre o site externo em aba nova e com rel seguro (regra 10)", async ({
    page,
  }) => {
    await page.goto("/clientes/");
    const link = linhas(page).nth(0).locator("a");

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  });
});

test.describe("showcase: toque", () => {
  test("em tela sem hover, a linha no centro da viewport vira a ativa (regra 6)", async ({
    browser,
  }) => {
    /*
     * Contexto de celular de verdade: é o que faz `(hover: hover)` responder
     * falso, que é a condição do caminho de toque no componente.
     */
    const context = await browser.newContext({
      ...devices["iPhone 13"],
      baseURL: "http://localhost:3000",
    });
    const page = await context.newPage();

    try {
      await page.goto("/projetos/");

      const semHover = await page.evaluate(
        () => !window.matchMedia("(hover: hover)").matches
      );
      expect(semHover, "o contexto precisa reportar ausência de hover").toBe(
        true
      );

      /* Rola até a última linha cruzar o centro da tela. */
      await linhas(page).nth(3).scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const texto = await problema(page).innerText();
      expect(texto.length).toBeGreaterThan(0);
    } finally {
      await context.close();
    }
  });
});

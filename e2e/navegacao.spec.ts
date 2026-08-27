import { expect, test } from "@playwright/test";

/**
 * Navegação pelas 5 rotas, nos dois idiomas.
 *
 * O que importa aqui não é "a página abre", e sim as duas coisas que a divisão
 * em cinco rotas tornou possíveis de quebrar em silêncio: o item ativo da nav
 * apontar para a rota errada, e a troca de idioma jogar a pessoa na home em vez
 * do par correspondente.
 */

const rotas = [
  { pt: "/", en: "/en/", nav: "Home" },
  { pt: "/clientes/", en: "/en/clients/", nav: "Clientes" },
  { pt: "/projetos/", en: "/en/projects/", nav: "Projetos" },
  { pt: "/info/", en: "/en/info/", nav: "Info" },
  { pt: "/contato/", en: "/en/contact/", nav: "Contato" },
] as const;

test.describe("as 5 rotas", () => {
  for (const rota of rotas) {
    test(`${rota.pt} abre e marca "${rota.nav}" como ativo`, async ({
      page,
    }) => {
      await page.goto(rota.pt);

      const ativo = page.locator('header nav a[aria-current="page"]');
      await expect(ativo).toHaveCount(1);
      await expect(ativo).toHaveText(rota.nav);
    });

    test(`${rota.en} abre e tem exatamente um item ativo`, async ({ page }) => {
      await page.goto(rota.en);
      await expect(
        page.locator('header nav a[aria-current="page"]')
      ).toHaveCount(1);
    });
  }

  test("dentro de uma página de projeto, Projetos continua ativo", async ({
    page,
  }) => {
    await page.goto("/projetos/newra-news/");

    const ativo = page.locator('header nav a[aria-current="page"]');
    await expect(ativo).toHaveText("Projetos");
  });
});

test.describe("troca de idioma", () => {
  for (const rota of rotas) {
    test(`${rota.pt} leva ao par em inglês, não à home`, async ({ page }) => {
      await page.goto(rota.pt);

      const alvo = await page
        .locator("header a", { hasText: "EN" })
        .first()
        .getAttribute("href");

      expect(alvo).toBe(rota.en);
    });
  }

  test("numa página de projeto, preserva o slug", async ({ page }) => {
    await page.goto("/projetos/newra-news/");

    const alvo = await page
      .locator("header a", { hasText: "EN" })
      .first()
      .getAttribute("href");

    expect(alvo).toBe("/en/projects/newra-news/");
  });
});

test.describe("rolagem", () => {
  test("trocar de rota abre a página nova no topo (E10)", async ({ page }) => {
    await page.goto("/projetos/");
    await page.waitForTimeout(600);

    /* Desce até o fim de uma rota longa. */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(50);

    /* Navega por link interno, que é o caminho que o Lenis intercepta. */
    await page.locator('header nav a[href="/info/"]').click();
    await page.waitForURL("**/info/");
    await page.waitForTimeout(800);

    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });
});

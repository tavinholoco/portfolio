import { expect, test } from "./fixtures";

/**
 * A página 404 própria (F3.8 do plano V4).
 *
 * Até aqui o site servia a 404 padrão do Next: em inglês, sem `lang`, sem
 * estilo e sem link de volta, e nada acusava, porque nenhum teste abria uma URL
 * que não existe. Com dois root layouts ela vem de `global-not-found.tsx`, que
 * não passa por layout nenhum: se o export deixar de gravar o `out/404.html`,
 * ou se o arquivo perder o CSS, a página volta a ser a padrão calada.
 *
 * Roda contra o `wrangler dev`, que serve o `404.html` como a produção
 * (`not_found_handling: "404-page"` no `wrangler.jsonc`).
 */

const inexistentes = ["/nao-existe/", "/en/nope/", "/projetos/nao-existe/"];

test.describe("página 404 (SSR)", () => {
  for (const rota of inexistentes) {
    test(`${rota} responde 404 com a página do site`, async ({ request }) => {
      const resposta = await request.get(rota, { maxRedirects: 0 });
      expect(resposta.status()).toBe(404);

      const html = await resposta.text();
      expect(html).toMatch(/<html[^>]*lang="pt-BR"/);
      expect(html).toContain("<title>Página não encontrada | Pedro Levi</title>");
      expect(html.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1]).toBe(
        "Página não encontrada",
      );

      /* Os dois caminhos de volta, um por idioma. */
      expect(html).toMatch(/<a[^>]*href="\/"[^>]*>/);
      expect(html).toMatch(/<a[^>]*href="\/en\/"[^>]*>/);
      expect(html).toContain("Page not found");

      /* Fora do índice, e com o CSS do site (a padrão do Next não tem). */
      expect(html).toMatch(/<meta name="robots" content="noindex"/);
      expect(html).toMatch(/<link[^>]*rel="stylesheet"[^>]*_next\/static/);
    });
  }
});

test.describe("página 404 (no navegador)", () => {
  test("tem estilo, tema e leva de volta para a home", async ({ page }) => {
    const erros: string[] = [];
    page.on("pageerror", (erro) => erros.push(erro.message));

    await page.goto("/nao-existe/");

    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Página não encontrada");

    /* Fonte do site, e não a serifada padrão do navegador. */
    const fonte = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fonte).toMatch(/Fira Code/i);

    /* O script de tema rodou: sem preferência salva, o padrão é o escuro. */
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.locator('a[href="/"]').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("header")).toBeVisible();

    expect(erros).toEqual([]);
  });
});

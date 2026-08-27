import { expect, test } from "@playwright/test";

/**
 * O ícone de aba precisa existir em toda rota, nos dois idiomas.
 *
 * Existe porque falhou exatamente assim: `icon.svg` e `favicon.ico` moravam em
 * `src/app/(home)/`, e convenção de metadado do App Router vale para o segmento
 * e os descendentes dele. Como `(home)` e `en` são irmãos, **`/en/` ficava sem
 * ícone nenhum** e o `/favicon.ico` respondia 404. Quem viu foi o Pedro,
 * trocando o idioma e reparando na aba.
 *
 * O `brand-assets.test.ts` cuida das cores desses arquivos; aqui é a entrega:
 * de nada adianta a cor certa num ícone que a rota não declara.
 */

const rotas = [
  "/",
  "/en/",
  "/clientes/",
  "/en/clients/",
  "/projetos/",
  "/en/projects/",
  "/projetos/newra-news/",
  "/en/projects/newra-news/",
  "/info/",
  "/en/info/",
  "/contato/",
  "/en/contact/",
] as const;

test.describe("ícone de aba", () => {
  for (const rota of rotas) {
    test(`${rota} declara o ícone`, async ({ page }) => {
      await page.goto(rota);
      await expect(page.locator('link[rel="icon"]')).not.toHaveCount(0);
    });
  }

  test("os dois arquivos são servidos de verdade", async ({ request }) => {
    const svg = await request.get("/icon.svg");
    expect(svg.status()).toBe(200);
    expect(svg.headers()["content-type"]).toContain("svg");

    const ico = await request.get("/favicon.ico");
    expect(ico.status()).toBe(200);
    /* Cabeçalho ICONDIR, para não passar com um HTML de 404 no lugar. */
    const bytes = await ico.body();
    expect(bytes.readUInt16LE(0)).toBe(0);
    expect(bytes.readUInt16LE(2)).toBe(1);
  });
});

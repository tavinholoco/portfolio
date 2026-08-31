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

/**
 * Os metadados do documento precisam sobreviver ao `<RootDocument>`.
 *
 * `metadata` e `viewport` moram no componente compartilhado desde o M4, e o
 * Next os lê no **módulo do segmento**, não no componente. Os dois layouts
 * fazem `export { metadata, viewport }` para compensar, e é o tipo de linha
 * que alguém remove por parecer redundante: o build passa, a página serve, e
 * o site perde os metadados dos dois idiomas de uma vez.
 *
 * Estes testes fecham a lacuna registrada na §13.5 do plano, que era a única
 * lei do `CLAUDE.md` sem prova. Vão contra o **HTML bruto servido**, não
 * contra o DOM, porque o script de tema reescreve o `theme-color` no primeiro
 * paint e mascararia a ausência do `viewport`.
 */

/** Lê o `content` de uma meta pelo `name` ou pelo `property`. */
function conteudoMeta(html: string, chave: string): string | null {
  const tag = html.match(
    new RegExp(`<meta[^>]*(?:name|property)="${chave}"[^>]*>`, "i"),
  )?.[0];
  return tag?.match(/content="([^"]*)"/)?.[1] ?? null;
}

/* O padrão do `viewport`, antes de o script de tema tocar no DOM. */
const THEME_COLOR = "#0b0b0c";

test.describe("metadados do documento (SSR)", () => {
  for (const rota of rotas) {
    test(`${rota} serve theme-color e imagem de link`, async ({ request }) => {
      const html = await (await request.get(rota)).text();

      /* Prova o reexport de `viewport`. */
      expect(conteudoMeta(html, "theme-color")).toBe(THEME_COLOR);

      /* Prova o reexport de `metadata` (o metadataBase resolve a imagem) e a
         correção do merge raso: sem ela, só / e /en/ tinham imagem. */
      const og = conteudoMeta(html, "og:image");
      expect(og, `${rota} sem og:image`).toBeTruthy();
      expect(og).toContain("opengraph-image");
      /* metadataBase ausente cairia em localhost:0. */
      expect(og).not.toContain(":0/");

      /* O idioma certo: a imagem do inglês vive sob /en/. */
      const ehIngles = rota.startsWith("/en/");
      expect(og?.includes("/en/opengraph-image")).toBe(ehIngles);

      expect(conteudoMeta(html, "twitter:image")).toBeTruthy();
    });
  }

  test("o alt da imagem difere entre os idiomas", async ({ request }) => {
    const pt = await (await request.get("/")).text();
    const en = await (await request.get("/en/")).text();

    const altPt = conteudoMeta(pt, "og:image:alt");
    const altEn = conteudoMeta(en, "og:image:alt");

    expect(altPt).toBe("Pedro Levi | Desenvolvedor Full Stack");
    expect(altEn).toBe("Pedro Levi | Full Stack Developer");
    expect(altPt).not.toBe(altEn);
  });

  /**
   * O caminho da imagem é literal em `src/lib/metadata.ts`, porque o sufixo
   * que o Next gera para o grupo de rota não é derivável do código. Este teste
   * é o que impede a constante de apodrecer: se o esquema mudar, ele falha em
   * vez de o site servir uma imagem de link quebrada sem ninguém ver.
   */
  test("as duas imagens de link são servidas de verdade", async ({
    request,
  }) => {
    for (const rota of ["/", "/en/"] as const) {
      const html = await (await request.get(rota)).text();
      const url = conteudoMeta(html, "og:image");
      expect(url).toBeTruthy();

      const img = await request.get(new URL(url!).pathname);
      expect(img.status(), `${url} não respondeu 200`).toBe(200);
      expect(img.headers()["content-type"]).toContain("image/png");
    }
  });
});

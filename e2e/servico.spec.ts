import { expect, test } from "./fixtures";

/**
 * A página de criação de sites e o que a busca local depende dela.
 *
 * Quase tudo aqui vai contra o **HTML bruto**, que é o que o Googlebot lê. Nada
 * disso aparece em captura: sem título, sem cidade ou com o hreflang errado, a
 * página continua igual na tela e simplesmente não é encontrada.
 */

const paginas = [
  {
    rota: "/criacao-de-sites/",
    par: "/en/websites/",
    titulo: "Criação de sites em todo o Brasil",
    pasta: "/criacao-de-sites/",
  },
  {
    rota: "/en/websites/",
    par: "/criacao-de-sites/",
    titulo: "Web design across Brazil",
    pasta: "/en/websites/",
  },
] as const;

function atributo(tag: string | undefined, nome: string): string | null {
  return tag?.match(new RegExp(`${nome}="([^"]*)"`))?.[1] ?? null;
}

function pathname(url: string | null): string | null {
  return url ? new URL(url).pathname : null;
}

test.describe("a página de serviço (SSR)", () => {
  for (const { rota, par, titulo, pasta } of paginas) {
    test(`${rota} responde 200 sem redirecionar, com título e h1`, async ({
      request,
    }) => {
      const resposta = await request.get(rota, { maxRedirects: 0 });
      expect(resposta.status()).toBe(200);

      const html = await resposta.text();
      expect(html).toContain(`<title>${titulo}</title>`);
      expect(html.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1]).toBe(titulo);
    });

    test(`${rota} tem canonical, hreflang e imagem de link próprios`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();

      const canonical = html.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0];
      expect(pathname(atributo(canonical, "href"))).toBe(pasta);

      const alternates = [...html.matchAll(/<link[^>]*hrefLang="([^"]*)"[^>]*>/g)];
      const destino = (idioma: string) =>
        pathname(atributo(alternates.find((a) => a[1] === idioma)?.[0], "href"));

      expect(destino(rota.startsWith("/en/") ? "en" : "pt-BR")).toBe(rota);
      expect(destino(rota.startsWith("/en/") ? "pt-BR" : "en")).toBe(par);
      expect(destino("x-default")).toBe("/criacao-de-sites/");

      expect(html).toMatch(/<meta[^>]*property="og:image"[^>]*opengraph-image/);
    });

    test(`${rota} descreve o Service, para o Brasil todo e com a Person`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();
      const bloco = html.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
      )?.[1];
      const nos = JSON.parse(bloco ?? "{}")["@graph"] as Record<string, never>[];

      const servico = nos.find((no) => no["@type"] === "Service") as
        | { provider: { "@id": string }; areaServed: { identifier: string } }
        | undefined;
      const pessoa = nos.find((no) => no["@type"] === "Person");

      expect(servico?.areaServed.identifier).toBe("BR");
      expect(servico?.provider["@id"]).toBe(pessoa?.["@id"]);
    });
  }

  test("o sitemap anuncia as duas páginas", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/criacao-de-sites/</loc>");
    expect(xml).toContain("/en/websites/</loc>");
  });
});

test.describe("a página de serviço (no navegador)", () => {
  test("o WhatsApp abre em aba nova, nos dois botões", async ({ page }) => {
    await page.goto("/criacao-de-sites/");

    const botoes = page.locator('main a[href="https://wa.me/5518996260781"]');
    await expect(botoes).toHaveCount(2);
    await expect(botoes.first()).toHaveAttribute("target", "_blank");
  });

  test("a Trak aparece como projeto próprio e a Dandarkness como cliente", async ({
    page,
  }) => {
    await page.goto("/criacao-de-sites/");

    const linha = (nome: string) =>
      page.locator("main li").filter({ hasText: nome });
    await expect(linha("Trak Assessoria")).toContainText("Projeto próprio");
    await expect(linha("Dandarkness")).toContainText("Cliente");
  });

  test("o item entra logo depois de Home no menu", async ({ page }) => {
    await page.goto("/");

    const itens = page.locator("header nav a");
    await expect(itens).toHaveCount(6);
    await expect(itens.nth(0)).toHaveText("Home");
    await expect(itens.nth(1)).toHaveText("Criação de sites");
    await expect(itens.nth(1)).toHaveAttribute("href", "/criacao-de-sites/");
  });

  for (const origem of ["/clientes/", "/contato/", "/projetos/trak-assessoria/"]) {
    test(`${origem} leva à página de serviço pelo conteúdo`, async ({ page }) => {
      await page.goto(origem);
      await expect(
        page.locator('main a[href="/criacao-de-sites/"]'),
      ).toHaveCount(1);
    });
  }

  test("o link não aparece no case que não é landing", async ({ page }) => {
    await page.goto("/projetos/newra-news/");
    await expect(page.locator('main a[href="/criacao-de-sites/"]')).toHaveCount(0);
  });
});

test.describe("Rancharia de volta", () => {
  test("/info/ e o rodapé dizem a cidade, sem rua", async ({ request }) => {
    for (const rota of ["/info/", "/en/info/"]) {
      const html = await (await request.get(rota)).text();
      expect(html).toContain("Rancharia, SP");
      expect(html).not.toContain("streetAddress");
    }
  });

  test("a home diz o que ele faz e para onde, no título e no h1", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain(
      "<title>Pedro Levi | Criador de sites para todo o Brasil</title>",
    );
    expect(html.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1]).toBe(
      "Pedro Levi, criador de sites para todo o Brasil",
    );
  });
});

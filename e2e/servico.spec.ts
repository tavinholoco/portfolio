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
    titulo: "Criação de sites e landing pages | Pedro Levi",
    h1: "Criação de sites e landing pages",
    regiao: ["Rancharia", "Presidente Prudente", "Oeste Paulista"],
    pasta: "/criacao-de-sites/",
  },
  {
    rota: "/en/websites/",
    par: "/criacao-de-sites/",
    titulo: "Websites and landing pages | Pedro Levi",
    h1: "Websites and landing pages",
    regiao: ["Rancharia", "Presidente Prudente", "western São Paulo"],
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
  for (const { rota, par, titulo, h1, regiao, pasta } of paginas) {
    test(`${rota} responde 200 sem redirecionar, com título e h1`, async ({
      request,
    }) => {
      const resposta = await request.get(rota, { maxRedirects: 0 });
      expect(resposta.status()).toBe(200);

      const html = await resposta.text();
      expect(html).toContain(`<title>${titulo}</title>`);
      expect(html.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1]).toBe(h1);
    });

    /*
     * A fase 2 do plano V4. A região entra em frase corrida (D1), e o que a
     * busca lê é o HTML bruto: texto que só aparecesse depois do JS não conta.
     */
    test(`${rota} cita a região no texto, sem virar lista de cidades`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();
      const principal = html.slice(html.indexOf("<main"), html.indexOf("</main>"));

      for (const lugar of regiao) expect(principal).toContain(lugar);

      /* Lista de cidades é keyword stuffing (§5): nenhuma cidade em <li>. */
      const itens = [...principal.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
      for (const [, item] of itens) {
        expect(item.replace(/<[^>]+>/g, "").trim()).not.toMatch(
          /^(Rancharia|Presidente Prudente)/,
        );
      }
    });

    test(`${rota} responde as perguntas de quem vai contratar`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();
      const secao = html.slice(html.indexOf('id="como-funciona"'));
      const perguntas = [...secao.matchAll(/<h3[^>]*class="text-lg[^>]*>/g)];
      expect(perguntas.length).toBeGreaterThanOrEqual(7);
    });

    test(`${rota} mostra os exemplos com imagem, fora da seção misturada`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();
      const inicio = html.indexOf('id="exemplos"');
      expect(inicio).toBeGreaterThan(-1);

      const secao = html.slice(inicio, html.indexOf('id="como-funciona"'));
      /* Lei 5: imagem em `difference` sai em negativo. */
      expect(html.slice(inicio - 200, inicio + 200)).toContain(
        'data-variant="plain"',
      );

      const imagens = [...secao.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
      expect(imagens).toHaveLength(2);
      for (const img of imagens) {
        /* Lei 19: importada (hash e immutable) e com `loading` escrito. */
        expect(img).toMatch(/src="\/_next\/static\/media\/[^"]+\.webp"/);
        expect(img).toContain('loading="lazy"');
        expect(img).toMatch(/alt="[^"]+"/);
      }
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
    await expect(linha("Trak Assessoria")).toHaveCount(1);
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

test.describe("a home e os cases (fase 2 do plano V4)", () => {
  for (const [rota, destino] of [
    ["/", "/criacao-de-sites/"],
    ["/en/", "/en/websites/"],
  ] as const) {
    test(`${rota} tem uma linha visível e um link para o serviço`, async ({
      page,
      request,
    }) => {
      /* No HTML bruto, que é o que a busca lê. */
      const html = await (await request.get(rota)).text();
      const principal = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
      expect(principal).toMatch(/<p[^>]*>[^<]{30,}<\/p>/);

      await page.goto(rota);
      const link = page.locator(`main a[href="${destino}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toBeVisible();
      await expect(page.locator("main p")).toBeVisible();

      /* A linha não pode criar rolagem: a home continua sendo uma tela só. */
      const rola = await page.evaluate(
        () => document.documentElement.scrollHeight > window.innerHeight + 1,
      );
      expect(rola).toBe(false);
    });
  }

  test("a linha da home não entra com fade, para o LCP não esperar", async ({
    page,
  }) => {
    await page.goto("/");
    const animado = await page.locator("main p").evaluate((p) => {
      for (let el: Element | null = p; el && el.tagName !== "MAIN"; el = el.parentElement) {
        if (getComputedStyle(el).animationName !== "none") return true;
      }
      return false;
    });
    expect(animado).toBe(false);
  });

  for (const rota of ["/projetos/newra-news/", "/en/projects/trak-assessoria/"]) {
    test(`${rota} tem descrição própria, contexto e a prévia`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();

      const descricao = html.match(
        /<meta name="description" content="([^"]*)"/,
      )?.[1];
      const lede = html.match(/<p[^>]*text-lede[^>]*>([^<]*)<\/p>/)?.[1];
      /* A descrição reusava a tagline de uma linha, que é o lede do hero. */
      expect(descricao).toBeTruthy();
      expect(descricao).not.toBe(lede);
      expect(descricao!.length).toBeGreaterThan(80);

      const corpo = html.slice(html.indexOf('id="case"'));
      const img = corpo.match(/<img[^>]*>/)?.[0] ?? "";
      expect(img).toMatch(/src="\/_next\/static\/media\/[^"]+\.webp"/);
      expect(img).toContain('loading="eager"');
      expect(corpo).toMatch(/<p[^>]*text-lede[^>]*>[^<]{120,}<\/p>/);
    });
  }

  test("o case sem captura fica sem a moldura, e com o contexto", async ({
    request,
  }) => {
    const html = await (await request.get("/projetos/netsheet-engine/")).text();
    const corpo = html.slice(html.indexOf('id="case"'), html.indexOf("</main>"));
    expect(corpo).not.toContain("<img");
    expect(corpo).toMatch(/<p[^>]*text-lede[^>]*>[^<]{120,}<\/p>/);
  });

  test("/info/ se chama Sobre no título, sem mudar de endereço", async ({
    request,
  }) => {
    const pt = await request.get("/info/", { maxRedirects: 0 });
    expect(pt.status()).toBe(200);
    expect(await pt.text()).toContain("<title>Sobre | Pedro Levi</title>");
    expect(await (await request.get("/en/info/")).text()).toContain(
      "<title>About | Pedro Levi</title>",
    );
  });
});

test.describe("SEO técnico (fase 3 do plano V4)", () => {
  test("o sitemap só tem URL e hreflang, sem o que o Google ignora", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml.match(/<loc>/g)).toHaveLength(20);
    expect(xml).not.toContain("<priority>");
    expect(xml).not.toContain("<changefreq>");
    expect(xml).not.toContain("<lastmod>");
    expect(xml).toContain('hreflang="x-default"');
  });

  for (const rota of ["/", "/en/websites/", "/projetos/newra-news/"]) {
    test(`${rota} não manda meta keywords e declara o outro idioma no og`, async ({
      request,
    }) => {
      const html = await (await request.get(rota)).text();
      expect(html).not.toMatch(/<meta name="keywords"/);

      const ingles = rota.startsWith("/en/");
      expect(html).toContain(
        `<meta property="og:locale" content="${ingles ? "en_US" : "pt_BR"}"/>`,
      );
      expect(html).toContain(
        `<meta property="og:locale:alternate" content="${ingles ? "pt_BR" : "en_US"}"/>`,
      );
    });
  }
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

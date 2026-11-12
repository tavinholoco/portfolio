import { expect, test } from "./fixtures";

/**
 * Todo JSON-LD servido precisa do `@context`.
 *
 * Sem ele os dados não são schema.org, e **nada acusa**: o site passou da v2 até
 * 06/11/2026 assim, com o build verde e o Lighthouse em 100 no SEO. Vai contra o
 * HTML bruto, que é o que o Googlebot lê, e não contra o DOM.
 *
 * `minimo: 1` é o que impede o teste de passar sem ler nada: se o seletor parar
 * de casar, ou a rota perder os dados, ele reprova. O contato não tem JSON-LD
 * hoje, mas entra na varredura: se ganhar, já nasce cobrado.
 *
 * `tipos` é a fase 3 do plano V4: os nós que cada rota tem de servir. Um nó
 * que some não quebra nada à vista, então é aqui que ele é cobrado.
 */
const rotas = [
  { rota: "/", minimo: 1, tipos: ["Person", "WebSite"] },
  { rota: "/en/", minimo: 1, tipos: ["Person", "WebSite"] },
  { rota: "/criacao-de-sites/", minimo: 1, tipos: ["Person", "Service", "FAQPage"] },
  { rota: "/en/websites/", minimo: 1, tipos: ["Person", "Service", "FAQPage"] },
  { rota: "/clientes/", minimo: 1, tipos: ["ItemList"] },
  { rota: "/en/clients/", minimo: 1, tipos: ["ItemList"] },
  { rota: "/projetos/", minimo: 1, tipos: ["ItemList"] },
  { rota: "/en/projects/", minimo: 1, tipos: ["ItemList"] },
  {
    rota: "/projetos/newra-news/",
    minimo: 1,
    tipos: ["Person", "SoftwareSourceCode", "BreadcrumbList"],
  },
  {
    rota: "/en/projects/newra-news/",
    minimo: 1,
    tipos: ["Person", "SoftwareSourceCode", "BreadcrumbList"],
  },
  { rota: "/info/", minimo: 1, tipos: ["Person", "ProfilePage"] },
  { rota: "/en/info/", minimo: 1, tipos: ["Person", "ProfilePage"] },
  { rota: "/contato/", minimo: 0, tipos: [] },
  { rota: "/en/contact/", minimo: 0, tipos: [] },
] as const;

/** Todos os nós de todos os blocos de uma rota. */
async function nosDe(
  request: { get: (rota: string) => Promise<{ text: () => Promise<string> }> },
  rota: string,
): Promise<Record<string, never>[]> {
  const blocos = blocosJsonLd(await (await request.get(rota)).text());
  return blocos.flatMap((bloco) => bloco["@graph"] as Record<string, never>[]);
}

/** Faz o parse de cada `application/ld+json` do HTML. */
function blocosJsonLd(html: string): Record<string, unknown>[] {
  const blocos = html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  );
  return [...blocos].map((bloco) => JSON.parse(bloco[1]));
}

test.describe("JSON-LD (SSR)", () => {
  for (const { rota, tipos } of rotas) {
    if (tipos.length === 0) continue;
    test(`${rota} serve ${tipos.join(", ")}`, async ({ request }) => {
      const servidos = (await nosDe(request, rota)).map((no) => no["@type"]);
      for (const tipo of tipos) expect(servidos).toContain(tipo);
    });
  }

  test("o nome do site é curto, no WebSite e no og:site_name", async ({
    request,
  }) => {
    for (const rota of ["/", "/en/"]) {
      const html = await (await request.get(rota)).text();
      const site = (await nosDe(request, rota)).find(
        (no) => no["@type"] === "WebSite",
      ) as { name: string; alternateName: string; "@id": string } | undefined;

      expect(site?.name).toBe("Pedro Levi");
      expect(site?.["@id"]).toMatch(/\/#website$/);
      expect(site?.alternateName).toContain("Portf");
      expect(html).toMatch(
        /<meta property="og:site_name" content="Pedro Levi"\/>/,
      );
    }
  });

  test("a Person tem imagem absoluta que existe, e a formação", async ({
    request,
  }) => {
    const pessoa = (await nosDe(request, "/info/")).find(
      (no) => no["@type"] === "Person",
    ) as { image: string; alumniOf: { name: string } } | undefined;

    /* A URL tem hash de conteúdo: só o build sabe qual é. */
    expect(pessoa?.image).toMatch(/^https?:\/\/.+\/_next\/static\/media\/.+\.webp$/);
    const imagem = await request.get(new URL(pessoa!.image).pathname);
    expect(imagem.status()).toBe(200);
    expect(imagem.headers()["content-type"]).toContain("image/webp");
    expect(pessoa?.alumniOf.name).toContain("Oeste Paulista");
  });

  test("as referências por @id apontam para um nó servido na mesma página", async ({
    request,
  }) => {
    const casos = [
      ["/info/", "ProfilePage", "mainEntity"],
      ["/criacao-de-sites/", "Service", "provider"],
      ["/projetos/newra-news/", "SoftwareSourceCode", "author"],
    ] as const;

    for (const [rota, tipo, campo] of casos) {
      const nos = await nosDe(request, rota);
      const no = nos.find((n) => n["@type"] === tipo) as
        | Record<string, { "@id": string }>
        | undefined;
      const alvo = no?.[campo]?.["@id"];

      expect(alvo, `${rota}: ${tipo}.${campo} sem @id`).toBeTruthy();
      expect(nos.some((n) => n["@id"] === alvo)).toBe(true);
    }
  });

  test("o FAQPage repete as perguntas que estão na tela", async ({ request }) => {
    const html = await (await request.get("/criacao-de-sites/")).text();
    const faq = (await nosDe(request, "/criacao-de-sites/")).find(
      (no) => no["@type"] === "FAQPage",
    ) as { mainEntity: { name: string }[] } | undefined;

    expect(faq?.mainEntity.length).toBeGreaterThanOrEqual(7);
    /* Marcação sem o texto visível correspondente é o que o Google pune. */
    const visivel = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    for (const pergunta of faq!.mainEntity) {
      expect(visivel).toContain(pergunta.name);
    }
  });

  test("a trilha do case tem três níveis que respondem 200", async ({
    request,
  }) => {
    const trilha = (await nosDe(request, "/projetos/newra-news/")).find(
      (no) => no["@type"] === "BreadcrumbList",
    ) as { itemListElement: { item: string; position: number }[] } | undefined;

    expect(trilha?.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    for (const nivel of trilha!.itemListElement) {
      const resposta = await request.get(new URL(nivel.item).pathname, {
        maxRedirects: 0,
      });
      expect(resposta.status(), nivel.item).toBe(200);
    }
  });

  for (const { rota, minimo } of rotas) {
    test(`${rota} serve schema.org com @context`, async ({ request }) => {
      const blocos = blocosJsonLd(await (await request.get(rota)).text());

      expect(blocos.length).toBeGreaterThanOrEqual(minimo);
      for (const bloco of blocos) {
        expect(bloco["@context"]).toBe("https://schema.org");

        const nos = bloco["@graph"] as Record<string, unknown>[];
        expect(nos.length).toBeGreaterThan(0);
        for (const no of nos) {
          expect(typeof no["@type"]).toBe("string");
        }
      }
    });
  }

  test("o knowsAbout servido não diz que ele entende de si mesmo", async ({
    request,
  }) => {
    for (const rota of ["/", "/en/", "/info/", "/en/info/"]) {
      const blocos = blocosJsonLd(await (await request.get(rota)).text());
      const pessoa = blocos
        .flatMap((bloco) => bloco["@graph"] as Record<string, unknown>[])
        .find((no) => no["@type"] === "Person");

      expect(pessoa, `${rota} sem Person`).toBeTruthy();
      expect(pessoa?.knowsAbout).not.toContain("Pedro Levi");
    }
  });
});

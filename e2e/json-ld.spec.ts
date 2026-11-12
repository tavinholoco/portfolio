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
 */
const rotas = [
  { rota: "/", minimo: 1 },
  { rota: "/en/", minimo: 1 },
  { rota: "/clientes/", minimo: 1 },
  { rota: "/en/clients/", minimo: 1 },
  { rota: "/projetos/", minimo: 1 },
  { rota: "/en/projects/", minimo: 1 },
  { rota: "/projetos/newra-news/", minimo: 1 },
  { rota: "/en/projects/newra-news/", minimo: 1 },
  { rota: "/info/", minimo: 1 },
  { rota: "/en/info/", minimo: 1 },
  { rota: "/contato/", minimo: 0 },
  { rota: "/en/contact/", minimo: 0 },
] as const;

/** Faz o parse de cada `application/ld+json` do HTML. */
function blocosJsonLd(html: string): Record<string, unknown>[] {
  const blocos = html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  );
  return [...blocos].map((bloco) => JSON.parse(bloco[1]));
}

test.describe("JSON-LD (SSR)", () => {
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

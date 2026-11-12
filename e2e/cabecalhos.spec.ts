import { expect, test } from "./fixtures";

/**
 * O HSTS que a Vercel mandava sozinha mora no `public/_headers` desde a §17.16
 * do plano (lei 22). O `cloudflare-assets.test.ts` confere o arquivo; este
 * confere a entrega, contra o `wrangler dev`, que aplica o `_headers` como a
 * produção.
 *
 * A regra é `/*`, e ela precisa se **somar** às outras, não ganhar delas: um
 * asset de `_next/static` tem de sair com o HSTS e com o `immutable` (lei 19),
 * e a imagem de link com o HSTS e com o `image/png` (lei 22). Se o servidor
 * aplicasse só a regra mais específica, o arquivo continuaria certo e a
 * entrega não.
 */

const HSTS = /max-age=\d+; includeSubDomains/;

/* F4.4 do plano V4. O valor exato importa: um Referrer-Policy mais solto ou
   um X-Frame-Options trocado continuam "presentes" e deixam de proteger. */
const SEGURANCA = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
} as const;

test.describe("cabeçalhos de segurança", () => {
  for (const rota of ["/", "/en/websites/", "/nao-existe/"] as const) {
    test(`${rota} manda os quatro cabeçalhos`, async ({ request }) => {
      const cabecalhos = (await request.get(rota, { maxRedirects: 0 })).headers();
      for (const [nome, valor] of Object.entries(SEGURANCA)) {
        expect(cabecalhos[nome], `${rota}: ${nome}`).toBe(valor);
      }
      expect(cabecalhos["permissions-policy"]).toContain("camera=()");
      /* CSP fica de fora de propósito, até ter hash para os scripts inline. */
      expect(cabecalhos["content-security-policy"]).toBeUndefined();
    });
  }

  test("valem também para asset e para a imagem de link, que segue com tipo", async ({
    request,
  }) => {
    const html = await (await request.get("/criacao-de-sites/")).text();
    const og = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
    const img = await request.get(new URL(og!).pathname, { maxRedirects: 0 });

    /* Com nosniff, imagem sem Content-Type deixaria de ser imagem. */
    expect(img.status()).toBe(200);
    expect(img.headers()["x-content-type-options"]).toBe("nosniff");
    expect(img.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("cabeçalhos do servidor de assets", () => {
  test("HSTS nas páginas dos dois idiomas", async ({ request }) => {
    for (const rota of ["/", "/en/", "/projetos/newra-news/"] as const) {
      const resposta = await request.get(rota, { maxRedirects: 0 });
      expect(resposta.status(), rota).toBe(200);
      expect(resposta.headers()["strict-transport-security"], rota).toMatch(HSTS);
    }
  });

  test("o HSTS se soma ao immutable e ao image/png", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const asset = /\/_next\/static\/[^"'\s]+\.js/.exec(html)?.[0];
    expect(asset, "nenhum script de _next/static no HTML da home").toBeTruthy();

    const js = await request.get(asset!);
    expect(js.status()).toBe(200);
    expect(js.headers()["cache-control"]).toContain("immutable");
    expect(js.headers()["strict-transport-security"]).toMatch(HSTS);

    const og = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
    expect(og, "sem og:image na home").toBeTruthy();
    const img = await request.get(new URL(og!).pathname, { maxRedirects: 0 });
    expect(img.status()).toBe(200);
    expect(img.headers()["content-type"]).toContain("image/png");
    expect(img.headers()["strict-transport-security"]).toMatch(HSTS);
  });
});

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Os dicionários não podem ir para o bundle do cliente.
 *
 * Existe porque foram, e ninguém viu. O `<SiteHeader>` precisa ser client
 * component por causa do `usePathname()`, e enquanto ele importava
 * `dictionaries`, o `dictionaries[lang]` impedia o bundler de descartar
 * qualquer um dos dois idiomas: **os dois iam inteiros**, para um visitante que
 * lê um só. Agora as nove strings que ele usa chegam por prop, montadas no
 * `<SiteShell>`, que roda no servidor.
 *
 * O teste lê a maior string literal de cada dicionário e procura nos chunks.
 * Ler do arquivo em vez de fixar o texto aqui é o que impede o teste de
 * envelhecer quando alguém reescrever a bio.
 *
 * ⚠️ Roda no E2E, e não no Vitest, por uma razão simples: precisa do `.next`,
 * e no CI os testes unitários rodam **antes** do build.
 */

const CHUNKS = ".next/static/chunks";

/** A maior string entre aspas do arquivo, que é a menos sujeita a colisão. */
function maiorLiteral(caminho: string): string {
  const fonte = readFileSync(caminho, "utf8");
  const literais = fonte.match(/"[^"\\\n]{40,}"/g) ?? [];
  expect(literais.length, `sem literal longo em ${caminho}`).toBeGreaterThan(0);
  return literais
    .map((l) => l.slice(1, -1))
    .reduce((a, b) => (b.length > a.length ? b : a));
}

test("nenhum chunk de cliente carrega os dicionários", () => {
  const marcadores = {
    pt: maiorLiteral("src/i18n/pt.ts"),
    en: maiorLiteral("src/i18n/en.ts"),
  };

  const arquivos = readdirSync(CHUNKS).filter((f) => f.endsWith(".js"));
  expect(arquivos.length, "build não encontrado, rode pnpm build").toBeGreaterThan(0);

  const culpados: string[] = [];
  for (const arquivo of arquivos) {
    const conteudo = readFileSync(join(CHUNKS, arquivo), "utf8");
    for (const [idioma, marcador] of Object.entries(marcadores)) {
      if (conteudo.includes(marcador)) {
        culpados.push(`${arquivo} carrega o dicionário ${idioma}`);
      }
    }
  }

  expect(culpados, culpados.join(" | ")).toEqual([]);
});

test("o HTML de cada rota traz só o idioma dela", async ({ request }) => {
  const pt = maiorLiteral("src/i18n/pt.ts");
  const en = maiorLiteral("src/i18n/en.ts");

  const html = {
    pt: await (await request.get("/info/")).text(),
    en: await (await request.get("/en/info/")).text(),
  };

  /*
   * O conteúdo da rota tem que estar lá, senão o teste passaria com um 404.
   * O do outro idioma, não: é isso que prova que o dicionário não viajou junto.
   */
  expect(html.pt.includes(pt), "/info/ deveria ter texto em português").toBe(true);
  expect(html.pt.includes(en), "/info/ não pode carregar o dicionário inglês").toBe(
    false
  );
  expect(html.en.includes(en), "/en/info/ deveria ter texto em inglês").toBe(true);
  expect(html.en.includes(pt), "/en/info/ não pode carregar o dicionário português").toBe(
    false
  );
});

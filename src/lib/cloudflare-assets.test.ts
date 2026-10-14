import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { ogImageMeta } from "./metadata";

/**
 * Lei 22: com o export estático, o que a Vercel fazia sozinha passou a morar
 * em dois arquivos de texto em `public/`, que o export copia para `out/` e a
 * Cloudflare aplica. Nenhum dos dois é código: não passam por typecheck, e se
 * envelhecerem o site continua servindo. O caminho da imagem de link está
 * escrito à mão neles, e ele vem de `ogImageMeta`. Se um dia mudar, a imagem
 * volta a responder 404 com a barra ou a sair sem `Content-Type`, e o
 * LinkedIn e o WhatsApp desistem dela sem avisar ninguém (§17.4, item 2).
 */

const publico = join(process.cwd(), "public");

function linhasUteis(arquivo: string): string[] {
  return readFileSync(join(publico, arquivo), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "" && !l.trim().startsWith("#"));
}

/** Regras do `_headers`: cada linha sem recuo abre uma regra, as recuadas são os cabeçalhos dela. */
function regrasDeCabecalho(): Map<string, string[]> {
  const regras = new Map<string, string[]>();
  let atual: string | null = null;
  for (const linha of linhasUteis("_headers")) {
    if (/^\s/.test(linha)) {
      expect(atual, `cabeçalho fora de regra: "${linha}"`).not.toBeNull();
      regras.get(atual!)!.push(linha.trim());
    } else {
      atual = linha.trim();
      regras.set(atual, regras.get(atual) ?? []);
    }
  }
  return regras;
}

const caminhos = (["pt", "en"] as const).map((lang) => {
  const comBarra = ogImageMeta(lang).url;
  return { lang, comBarra, semBarra: comBarra.replace(/\/$/, "") };
});

describe("public/_redirects e public/_headers da Cloudflare", () => {
  it("a meta anuncia as imagens com barra, que é o que as regras supõem", () => {
    for (const { comBarra, semBarra } of caminhos) {
      expect(comBarra.endsWith("/")).toBe(true);
      expect(semBarra).not.toBe(comBarra);
    }
  });

  it("o _redirects reescreve cada imagem anunciada para o arquivo do export", () => {
    const regras = linhasUteis("_redirects").map((l) => l.trim().split(/\s+/));
    for (const { comBarra, semBarra } of caminhos) {
      expect(regras, `falta a reescrita de ${comBarra}`).toContainEqual([
        comBarra,
        semBarra,
        "200",
      ]);
    }
  });

  it("o _headers dá image/png às imagens nos dois caminhos, com e sem barra", () => {
    const regras = regrasDeCabecalho();
    for (const { comBarra, semBarra } of caminhos) {
      for (const caminho of [comBarra, semBarra]) {
        expect(
          regras.get(caminho),
          `${caminho} sem Content-Type: a imagem de link sai sem tipo`
        ).toContain("Content-Type: image/png");
      }
    }
  });

  it("o _headers devolve o immutable aos assets com hash (lei 19)", () => {
    const regra = regrasDeCabecalho().get("/_next/static/*");
    expect(regra).toBeDefined();
    expect(regra!.join("\n")).toMatch(/^Cache-Control: .*max-age=31536000.*immutable/m);
  });

  it("o _headers tira do índice o workers.dev e as prévias", () => {
    const workersDev = [...regrasDeCabecalho()].find(([padrao]) =>
      /^https:\/\/:\w+\.:\w+\.workers\.dev\/\*$/.test(padrao)
    );
    expect(workersDev, "falta a regra do workers.dev").toBeDefined();
    expect(workersDev![1]).toContain("X-Robots-Tag: noindex");
  });

  /*
   * Controle negativo do noindex: se a regra pegasse todo caminho, o site de
   * verdade sairia do Google. Nenhuma regra sem host pode levar noindex.
   */
  it("nenhuma regra de caminho tira o domínio próprio do índice", () => {
    for (const [padrao, cabecalhos] of regrasDeCabecalho()) {
      if (padrao.startsWith("/")) {
        expect(cabecalhos.join("\n"), padrao).not.toMatch(/noindex/i);
      }
    }
  });
});

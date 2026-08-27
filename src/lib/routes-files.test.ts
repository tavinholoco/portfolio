import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { routes } from "./routes";

/**
 * O manifesto contra o disco.
 *
 * Este teste ficou pendente desde a Fase 0 de propósito: as quatro rotas novas
 * só nasceram na Fase 3, e escrevê-lo antes deixaria `pnpm test` vermelho por
 * duas fases inteiras.
 *
 * O que ele protege é a única falha que o manifesto sozinho não pega:
 * acrescentar uma rota lá e esquecer de criar o arquivo de um dos dois idiomas.
 * A nav passaria a mostrar um link, o sitemap a anunciar uma URL, o hreflang a
 * apontar para ela, e a rota devolveria 404. Nada disso quebra em compilação.
 *
 * Existem dois root layouts, um por idioma, e por isso a árvore é duplicada em
 * disco. É essa duplicação que o teste vigia.
 */

const raiz = process.cwd();

/** Traduz o path público no caminho do arquivo de rota correspondente. */
function arquivoDaRota(path: string): string {
  if (path === "/") return "src/app/(home)/page.tsx";
  if (path === "/en/") return "src/app/en/page.tsx";

  /* O português vive no route group `(home)`; o inglês, no segmento `en`. */
  const segmentos = path.replace(/^\/|\/$/g, "");
  return segmentos.startsWith("en/")
    ? `src/app/${segmentos}/page.tsx`
    : `src/app/(home)/${segmentos}/page.tsx`;
}

describe("manifesto de rotas contra os arquivos em disco", () => {
  for (const route of routes) {
    it(`"${route.id}" tem página nos dois idiomas`, () => {
      for (const path of [route.pt, route.en]) {
        const arquivo = arquivoDaRota(path);
        expect(
          existsSync(join(raiz, arquivo)),
          `a rota "${route.id}" anuncia ${path} mas ${arquivo} não existe`
        ).toBe(true);
      }
    });
  }

  it("as páginas de projeto existem nos dois idiomas", () => {
    /* Não estão no manifesto porque o slug é dado, mas o par também precisa
       existir, senão a troca de idioma dentro de um case leva a 404. */
    for (const arquivo of [
      "src/app/(home)/projetos/[slug]/page.tsx",
      "src/app/en/projects/[slug]/page.tsx",
    ]) {
      expect(existsSync(join(raiz, arquivo)), `${arquivo} não existe`).toBe(
        true
      );
    }
  });

  it("o mapeamento de path para arquivo é o esperado", () => {
    /* Sem este caso, um erro em `arquivoDaRota` faria os testes acima passarem
       procurando arquivos errados que por acaso existem. */
    expect(arquivoDaRota("/")).toBe("src/app/(home)/page.tsx");
    expect(arquivoDaRota("/en/")).toBe("src/app/en/page.tsx");
    expect(arquivoDaRota("/clientes/")).toBe(
      "src/app/(home)/clientes/page.tsx"
    );
    expect(arquivoDaRota("/en/clients/")).toBe("src/app/en/clients/page.tsx");
  });

  it("detecta a ausência de um arquivo, em vez de sempre passar", () => {
    expect(existsSync(join(raiz, "src/app/(home)/rota-que-nao-existe/page.tsx"))).toBe(
      false
    );
  });
});

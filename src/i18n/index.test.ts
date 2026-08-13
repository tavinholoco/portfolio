import { describe, expect, it } from "vitest";

import { dictionaries, resolveLocale } from "./index";

/** Coleta todos os caminhos de folhas de um objeto (ex.: ["nav", "links", "0", "label"]). */
function leafPaths(value: unknown, prefix: string[] = []): string[] {
  if (value === null || typeof value !== "object") return [prefix.join(".")];
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]) => leafPaths(child, [...prefix, key])
  );
}

describe("resolveLocale", () => {
  it("resolve 'en' para en", () => {
    expect(resolveLocale("en")).toBe("en");
  });

  it("resolve qualquer outra coisa para pt (padrão)", () => {
    expect(resolveLocale("pt")).toBe("pt");
    expect(resolveLocale("es")).toBe("pt");
    expect(resolveLocale("")).toBe("pt");
    expect(resolveLocale(null)).toBe("pt");
    expect(resolveLocale(undefined)).toBe("pt");
  });
});

describe("dicionários pt-BR / en", () => {
  it("tem exatamente a mesma estrutura de chaves", () => {
    const ptKeys = leafPaths(dictionaries.pt).sort();
    const enKeys = leafPaths(dictionaries.en).sort();

    expect(enKeys).toEqual(ptKeys);
  });

  it("não tem chaves vazias em nenhum dos idiomas", () => {
    for (const locale of ["pt", "en"] as const) {
      const empty = leafPaths(dictionaries[locale]).filter((path) => {
        const value = path
          .split(".")
          .reduce<unknown>(
            (acc, key) => (acc as Record<string, unknown>)?.[key],
            dictionaries[locale]
          );
        return typeof value === "string" && value.trim() === "";
      });
      expect(empty, `chaves vazias em ${locale}`).toEqual([]);
    }
  });

  it("expõe os mesmos repositórios em destaque nos dois idiomas", () => {
    const ptRepos = dictionaries.pt.projects.featured.map((p) => p.repo);
    const enRepos = dictionaries.en.projects.featured.map((p) => p.repo);

    expect(enRepos).toEqual(ptRepos);
  });

  it("tem os mesmos projetos de clientes nos dois idiomas", () => {
    const ptUrls = dictionaries.pt.clients.projects.map((p) => p.url);
    const enUrls = dictionaries.en.clients.projects.map((p) => p.url);

    expect(enUrls).toEqual(ptUrls);
  });

  it("as âncoras do nav existem nas duas rotas (sem duplicatas)", () => {
    for (const locale of ["pt", "en"] as const) {
      const hrefs = dictionaries[locale].nav.links.map((l) => l.href);
      expect(new Set(hrefs).size, `âncoras duplicadas em ${locale}`).toBe(
        hrefs.length
      );
      for (const href of hrefs) {
        expect(href).toMatch(/^#/);
      }
    }
  });
});

import { describe, expect, it } from "vitest";

import { projectMetas } from "@/data/projects";
import { routeIds } from "@/lib/routes";

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

  it("expõe os mesmos slugs em destaque nos dois idiomas", () => {
    const ptSlugs = dictionaries.pt.projects.featured.map((p) => p.slug);
    const enSlugs = dictionaries.en.projects.featured.map((p) => p.slug);

    expect(enSlugs).toEqual(ptSlugs);
  });

  it("cada slug em destaque tem metadado curado (repo/demo) em src/data/projects.ts", () => {
    for (const locale of ["pt", "en"] as const) {
      const slugs = dictionaries[locale].projects.featured.map((p) => p.slug);
      for (const slug of slugs) {
        expect(
          projectMetas.some((meta) => meta.slug === slug),
          `slug "${slug}" sem metadado em src/data/projects.ts`
        ).toBe(true);
      }
    }
  });

  it("tem os mesmos projetos de clientes nos dois idiomas", () => {
    const ptUrls = dictionaries.pt.clients.projects.map((p) => p.url);
    const enUrls = dictionaries.en.clients.projects.map((p) => p.url);

    expect(enUrls).toEqual(ptUrls);
  });

  /*
   * A Trak é projeto próprio, e o site a apresentava como trabalho para cliente.
   * Quem não é cliente não pode nascer como tal em nenhum dos dois idiomas.
   */
  it("só a Dandarkness é cliente, e o texto da Trak não diz o contrário", () => {
    for (const locale of ["pt", "en"] as const) {
      const d = dictionaries[locale];

      expect(d.clients.projects.map((p) => p.name)).toEqual(["Dandarkness"]);

      const trak = d.projects.featured.find((p) => p.slug === "trak-assessoria");
      const texto = JSON.stringify(trak).toLowerCase();
      expect(texto).not.toMatch(/cliente|client|entreg|deliver/);

      const exemplo = d.websites.examples.find((e) => e.id === "trak");
      expect(JSON.stringify(exemplo).toLowerCase()).not.toMatch(
        /cliente|client|entreg|deliver/
      );
    }
  });

  it("os exemplos da página de serviço apontam para os endereços cadastrados", () => {
    const demoTrak = projectMetas.find(
      (meta) => meta.slug === "trak-assessoria"
    )?.demoUrl;

    for (const locale of ["pt", "en"] as const) {
      const d = dictionaries[locale];
      const url = (id: string) => d.websites.examples.find((e) => e.id === id)?.url;

      expect(url("trak")).toBe(demoTrak);
      expect(url("dandarkness")).toBe(d.clients.projects[0].url);
    }
  });

  it("a página de serviço não promete valor nem prazo sem o Pedro decidir", () => {
    /* P1 do plano. Quando ele decidir, este teste sai junto com o texto novo. */
    expect(JSON.stringify(dictionaries.pt.websites)).not.toMatch(
      /R\$|a partir de|\bdias\b|semanas?\b/i
    );
    expect(JSON.stringify(dictionaries.en.websites)).not.toMatch(
      /R\$|starting at|\bdays\b|weeks?\b/i
    );
  });

  it("tem título e descrição para toda rota do manifesto", () => {
    for (const locale of ["pt", "en"] as const) {
      for (const id of routeIds) {
        const route = dictionaries[locale].routes[id];
        expect(route, `rota "${id}" sem textos em ${locale}`).toBeDefined();
        expect(route.title.length).toBeGreaterThan(0);
        expect(route.description.length).toBeGreaterThan(0);
      }
    }
  });

  it("não repete título entre rotas, senão o SEO por rota não serve", () => {
    for (const locale of ["pt", "en"] as const) {
      const titles = routeIds.map((id) => dictionaries[locale].routes[id].title);
      expect(new Set(titles).size, `títulos repetidos em ${locale}`).toBe(
        titles.length
      );
    }
  });
});

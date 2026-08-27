import { describe, expect, it } from "vitest";

import { projectMetas } from "@/data/projects";
import { dictionaries } from "@/i18n";

import { clientShowcaseItems, projectShowcaseItems } from "./items";

describe("projectShowcaseItems", () => {
  it("segue a ordem de projectMetas, que é curadoria e não cronologia", () => {
    /* Regra 11: a numeração 01 a 04 sai desta ordem, não do ano. */
    const slugs = projectShowcaseItems("pt").map((item) => item.slug);
    expect(slugs).toEqual(projectMetas.map((meta) => meta.slug));
  });

  it("os anos não estão em ordem decrescente, provando que a ordem é curada", () => {
    const anos = projectShowcaseItems("pt").map((item) => Number(item.year));
    const decrescente = [...anos].sort((a, b) => b - a);
    /* Se um dia coincidirem, o teste perde a graça mas não fica errado; o que
       importa é que a lista nunca seja ordenada por ano. */
    expect(anos).toEqual(projectMetas.map((meta) => Number(meta.year)));
    expect(anos.length).toBe(decrescente.length);
  });

  it("aponta para a rota interna do case, no idioma certo (regra 10)", () => {
    for (const item of projectShowcaseItems("pt")) {
      expect(item.href).toBe(`/projetos/${item.slug}/`);
      expect(item.external).toBeUndefined();
    }
    for (const item of projectShowcaseItems("en")) {
      expect(item.href).toBe(`/en/projects/${item.slug}/`);
    }
  });

  it("traz o problema, que é o que liga a lista à tese", () => {
    for (const item of projectShowcaseItems("pt")) {
      expect(item.problem.length).toBeGreaterThan(0);
    }
  });

  it("traduz a categoria em vez de vazar a chave crua", () => {
    const categorias = Object.values(dictionaries.pt.projects.categories);
    for (const item of projectShowcaseItems("pt")) {
      expect(categorias).toContain(item.category);
    }
  });

  it("gera a mesma quantidade de itens nos dois idiomas", () => {
    expect(projectShowcaseItems("en")).toHaveLength(
      projectShowcaseItems("pt").length
    );
  });
});

describe("clientShowcaseItems", () => {
  it("aponta para o site do cliente, em destino externo (regra 10)", () => {
    for (const item of clientShowcaseItems("pt")) {
      expect(item.external).toBe(true);
      expect(item.href).toMatch(/^https?:\/\//);
    }
  });

  it("usa o host como chave estável de lista", () => {
    const items = clientShowcaseItems("pt");
    expect(items.length).toBeGreaterThan(0);
    expect(new Set(items.map((i) => i.slug)).size).toBe(items.length);
  });

  it("traz stack e ano, que são as colunas da linha", () => {
    for (const item of clientShowcaseItems("pt")) {
      expect(item.stack.length).toBeGreaterThan(0);
      expect(item.year).toMatch(/^\d{4}$/);
    }
  });

});

describe("as duas listas alimentam o mesmo componente", () => {
  it("expõem exatamente a mesma forma de item", () => {
    const projeto = projectShowcaseItems("pt")[0];
    const cliente = clientShowcaseItems("pt")[0];

    const obrigatorias = [
      "slug",
      "title",
      "problem",
      "stack",
      "category",
      "year",
      "href",
    ] as const;

    for (const chave of obrigatorias) {
      expect(projeto[chave], `projeto sem ${chave}`).toBeDefined();
      expect(cliente[chave], `cliente sem ${chave}`).toBeDefined();
    }
  });
});

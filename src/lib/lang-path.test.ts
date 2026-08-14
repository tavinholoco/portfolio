import { describe, expect, it } from "vitest";

import { translatedPath } from "./lang-path";

describe("translatedPath — rota correspondente no outro idioma", () => {
  it("troca a home pt ↔ en", () => {
    expect(translatedPath("/", "pt")).toBe("/en/");
    expect(translatedPath("/en/", "en")).toBe("/");
    expect(translatedPath("/en", "en")).toBe("/");
  });

  it("preserva o contexto da página de projeto (pt → en)", () => {
    expect(translatedPath("/projetos/newra-news/", "pt")).toBe(
      "/en/projects/newra-news/"
    );
    expect(translatedPath("/projetos/netsheet-engine/", "pt")).toBe(
      "/en/projects/netsheet-engine/"
    );
  });

  it("preserva o contexto da página de projeto (en → pt)", () => {
    expect(translatedPath("/en/projects/newra-news/", "en")).toBe(
      "/projetos/newra-news/"
    );
    expect(translatedPath("/en/projects/repertorio-progressivo/", "en")).toBe(
      "/projetos/repertorio-progressivo/"
    );
  });

  it("cai na home do idioma de destino em rotas desconhecidas", () => {
    expect(translatedPath("/rota-inexistente", "pt")).toBe("/en/");
    expect(translatedPath("/en/outra-rota", "en")).toBe("/");
  });
});

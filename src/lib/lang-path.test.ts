import { describe, expect, it } from "vitest";

import { translatedPath } from "./lang-path";
import { pathFor, routes } from "./routes";

/**
 * Reescrito na v3 (E3): antes existiam duas rotas e o teste listava as duas à
 * mão. Agora a função deriva do manifesto, então o teste varre o manifesto
 * inteiro. Acrescentar uma rota passa a ser coberto sem tocar aqui.
 */
describe("translatedPath: rota correspondente no outro idioma", () => {
  it("leva toda rota do manifesto ao par dela, nos dois sentidos", () => {
    for (const route of routes) {
      expect(translatedPath(route.pt, "pt"), `${route.id} pt para en`).toBe(
        route.en
      );
      expect(translatedPath(route.en, "en"), `${route.id} en para pt`).toBe(
        route.pt
      );
    }
  });

  it("nunca cai na home ao trocar de idioma numa rota conhecida", () => {
    for (const route of routes) {
      if (route.id === "home") continue;
      expect(translatedPath(route.pt, "pt")).not.toBe(pathFor("home", "en"));
      expect(translatedPath(route.en, "en")).not.toBe(pathFor("home", "pt"));
    }
  });

  it("tolera a barra final ausente, que o usePathname pode omitir", () => {
    expect(translatedPath("/en", "en")).toBe("/");
    expect(translatedPath("/contato", "pt")).toBe("/en/contact/");
  });

  it("preserva o slug da página de projeto (pt para en)", () => {
    expect(translatedPath("/projetos/newra-news/", "pt")).toBe(
      "/en/projects/newra-news/"
    );
    expect(translatedPath("/projetos/netsheet-engine/", "pt")).toBe(
      "/en/projects/netsheet-engine/"
    );
  });

  it("preserva o slug da página de projeto (en para pt)", () => {
    expect(translatedPath("/en/projects/newra-news/", "en")).toBe(
      "/projetos/newra-news/"
    );
    expect(translatedPath("/en/projects/repertorio-progressivo/", "en")).toBe(
      "/projetos/repertorio-progressivo/"
    );
  });

  it("não confunde a rota de projetos com uma página de projeto", () => {
    expect(translatedPath("/projetos/", "pt")).toBe("/en/projects/");
    expect(translatedPath("/en/projects/", "en")).toBe("/projetos/");
  });

  it("cai na home do idioma de destino em rotas desconhecidas", () => {
    expect(translatedPath("/rota-inexistente", "pt")).toBe("/en/");
    expect(translatedPath("/en/outra-rota", "en")).toBe("/");
  });
});

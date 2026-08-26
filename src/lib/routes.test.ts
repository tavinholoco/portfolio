import { describe, expect, it } from "vitest";

import {
  navLabelFor,
  navRoutes,
  normalizePath,
  pathFor,
  routeIdFromPath,
  routeIds,
  routes,
} from "./routes";

describe("manifesto de rotas: invariantes", () => {
  it("tem as 5 rotas da v3, na ordem da navegação", () => {
    expect(routeIds).toEqual([
      "home",
      "clients",
      "projects",
      "info",
      "contact",
    ]);
  });

  it("não repete id", () => {
    expect(new Set(routeIds).size).toBe(routeIds.length);
  });

  it("todo path termina em barra, porque trailingSlash está ligado", () => {
    for (const route of routes) {
      expect(route.pt.endsWith("/")).toBe(true);
      expect(route.en.endsWith("/")).toBe(true);
    }
  });

  it("todo path do inglês vive sob /en/", () => {
    for (const route of routes) {
      expect(route.en.startsWith("/en/")).toBe(true);
    }
  });

  it("nenhum path se repete, nem dentro nem entre os idiomas", () => {
    const paths = routes.flatMap((route) => [route.pt, route.en]);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("todo rótulo de nav está preenchido nos dois idiomas", () => {
    for (const route of routes) {
      expect(route.navPt.length).toBeGreaterThan(0);
      expect(route.navEn.length).toBeGreaterThan(0);
    }
  });
});

describe("pathFor e navLabelFor", () => {
  it("resolve o path por idioma", () => {
    expect(pathFor("home", "pt")).toBe("/");
    expect(pathFor("home", "en")).toBe("/en/");
    expect(pathFor("clients", "pt")).toBe("/clientes/");
    expect(pathFor("clients", "en")).toBe("/en/clients/");
    expect(pathFor("contact", "pt")).toBe("/contato/");
    expect(pathFor("contact", "en")).toBe("/en/contact/");
  });

  it("resolve o rótulo por idioma", () => {
    expect(navLabelFor("projects", "pt")).toBe("Projetos");
    expect(navLabelFor("projects", "en")).toBe("Projects");
    expect(navLabelFor("info", "pt")).toBe("Info");
  });
});

describe("navRoutes", () => {
  it("monta a nav do idioma na ordem do manifesto", () => {
    expect(navRoutes("pt")).toEqual([
      { id: "home", href: "/", label: "Home" },
      { id: "clients", href: "/clientes/", label: "Clientes" },
      { id: "projects", href: "/projetos/", label: "Projetos" },
      { id: "info", href: "/info/", label: "Info" },
      { id: "contact", href: "/contato/", label: "Contato" },
    ]);
  });

  it("monta a nav do inglês com os paths prefixados", () => {
    expect(navRoutes("en").map((item) => item.href)).toEqual([
      "/en/",
      "/en/clients/",
      "/en/projects/",
      "/en/info/",
      "/en/contact/",
    ]);
  });
});

describe("normalizePath", () => {
  it("acrescenta a barra final que o usePathname pode omitir", () => {
    expect(normalizePath("/en")).toBe("/en/");
    expect(normalizePath("/clientes")).toBe("/clientes/");
  });

  it("preserva paths que já terminam em barra", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/en/info/")).toBe("/en/info/");
  });

  it("trata string vazia como raiz", () => {
    expect(normalizePath("")).toBe("/");
  });
});

describe("routeIdFromPath", () => {
  it("identifica a rota nos dois idiomas", () => {
    expect(routeIdFromPath("/")).toBe("home");
    expect(routeIdFromPath("/en/")).toBe("home");
    expect(routeIdFromPath("/projetos/")).toBe("projects");
    expect(routeIdFromPath("/en/projects/")).toBe("projects");
  });

  it("identifica mesmo sem a barra final", () => {
    expect(routeIdFromPath("/en")).toBe("home");
    expect(routeIdFromPath("/contato")).toBe("contact");
  });

  it("devolve null fora do manifesto, inclusive nas páginas de projeto", () => {
    expect(routeIdFromPath("/projetos/newra-news/")).toBeNull();
    expect(routeIdFromPath("/en/projects/newra-news/")).toBeNull();
    expect(routeIdFromPath("/rota-inexistente/")).toBeNull();
  });
});

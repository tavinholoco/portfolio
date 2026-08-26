import { afterEach, describe, expect, it, vi } from "vitest";

import { projectMetas } from "@/data/projects";
import { routes } from "@/lib/routes";

function setEnv(vars: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  setEnv({
    NEXT_PUBLIC_SITE_URL: undefined,
    VERCEL_PROJECT_PRODUCTION_URL: undefined,
    VERCEL_URL: undefined,
  });
});

async function freshSitemap() {
  setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
  vi.resetModules();
  const { default: sitemap } = await import("./sitemap");
  return sitemap();
}

/**
 * Reescrito na v3 (E3): antes o sitemap era uma lista à mão de duas rotas, e
 * agora deriva do manifesto. Os testes deixam de conferir URLs digitadas e
 * passam a conferir que a derivação cobre o manifesto inteiro, que é o que
 * garante que acrescentar uma rota não deixe buraco no SEO.
 */
describe("sitemap", () => {
  it("cobre as duas versões de idioma de toda rota do manifesto", async () => {
    const urls = (await freshSitemap()).map((entry) => entry.url);

    for (const route of routes) {
      expect(urls, `rota "${route.id}" em pt`).toContain(
        `https://pedrolevi.dev${route.pt}`
      );
      expect(urls, `rota "${route.id}" em en`).toContain(
        `https://pedrolevi.dev${route.en}`
      );
    }
  });

  it("cobre as duas versões de idioma de toda página de projeto", async () => {
    const urls = (await freshSitemap()).map((entry) => entry.url);

    for (const meta of projectMetas) {
      expect(urls).toContain(`https://pedrolevi.dev/projetos/${meta.slug}/`);
      expect(urls).toContain(
        `https://pedrolevi.dev/en/projects/${meta.slug}/`
      );
    }
  });

  it("tem exatamente 2 URLs por rota e por projeto, sem duplicata", async () => {
    const entries = await freshSitemap();
    const esperado = (routes.length + projectMetas.length) * 2;

    expect(entries).toHaveLength(esperado);
    expect(new Set(entries.map((e) => e.url)).size).toBe(esperado);
  });

  it("toda URL termina em barra, batendo com trailingSlash", async () => {
    for (const entry of await freshSitemap()) {
      expect(entry.url.endsWith("/"), entry.url).toBe(true);
    }
  });

  it("a home é a de maior prioridade", async () => {
    const entries = await freshSitemap();
    const home = entries.find((e) => e.url === "https://pedrolevi.dev/");
    const outras = entries.filter((e) => e.url !== "https://pedrolevi.dev/");

    expect(home?.priority).toBe(1);
    for (const entry of outras) {
      expect(entry.priority ?? 0).toBeLessThan(1);
    }
  });

  it("cada rota aponta o hreflang para o par dela, não para a home", async () => {
    const entries = await freshSitemap();
    const info = entries.find((e) => e.url === "https://pedrolevi.dev/info/");

    expect(info?.alternates?.languages).toEqual({
      "pt-BR": "https://pedrolevi.dev/info/",
      en: "https://pedrolevi.dev/en/info/",
      "x-default": "https://pedrolevi.dev/info/",
    });
  });

  it("as páginas de projeto têm hreflang apontando para os dois idiomas", async () => {
    const entries = await freshSitemap();
    const entry = entries.find((e) =>
      e.url.endsWith("/projetos/newra-news/")
    );

    expect(entry?.alternates?.languages).toEqual({
      "pt-BR": "https://pedrolevi.dev/projetos/newra-news/",
      en: "https://pedrolevi.dev/en/projects/newra-news/",
      "x-default": "https://pedrolevi.dev/projetos/newra-news/",
    });
  });
});

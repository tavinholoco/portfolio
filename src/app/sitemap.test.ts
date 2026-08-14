import { afterEach, describe, expect, it, vi } from "vitest";

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

describe("sitemap", () => {
  it("lista as 2 rotas principais + 8 rotas de projeto (10 URLs)", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    vi.resetModules();
    const { default: sitemap } = await import("./sitemap");

    const entries = sitemap();
    expect(entries).toHaveLength(10);

    const urls = entries.map((entry) => entry.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://pedrolevi.dev/",
        "https://pedrolevi.dev/en/",
        "https://pedrolevi.dev/projetos/newra-news/",
        "https://pedrolevi.dev/projetos/netsheet-engine/",
        "https://pedrolevi.dev/projetos/repertorio-progressivo/",
        "https://pedrolevi.dev/projetos/trak-assessoria/",
        "https://pedrolevi.dev/en/projects/newra-news/",
        "https://pedrolevi.dev/en/projects/netsheet-engine/",
        "https://pedrolevi.dev/en/projects/repertorio-progressivo/",
        "https://pedrolevi.dev/en/projects/trak-assessoria/",
      ])
    );
  });

  it("as rotas de projeto têm hreflang apontando para os dois idiomas", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    vi.resetModules();
    const { default: sitemap } = await import("./sitemap");

    const entry = sitemap().find((e) =>
      e.url.endsWith("/projetos/newra-news/")
    );
    expect(entry?.alternates?.languages).toEqual({
      "pt-BR": "https://pedrolevi.dev/projetos/newra-news/",
      en: "https://pedrolevi.dev/en/projects/newra-news/",
      "x-default": "https://pedrolevi.dev/projetos/newra-news/",
    });
  });
});

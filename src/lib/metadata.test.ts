import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl } from "./metadata";

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

describe("getSiteUrl", () => {
  it("prioriza NEXT_PUBLIC_SITE_URL", () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    expect(getSiteUrl()).toBe("https://pedrolevi.dev");
  });

  it("cai para a URL de produção da Vercel quando não há domínio próprio", () => {
    setEnv({
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(getSiteUrl()).toBe("https://portfolio.vercel.app");
  });

  it("cai para VERCEL_URL (preview) se for a única disponível", () => {
    setEnv({ VERCEL_URL: "portfolio-preview.vercel.app" });
    expect(getSiteUrl()).toBe("https://portfolio-preview.vercel.app");
  });

  it("usa o fallback local sem nenhuma variável", () => {
    expect(getSiteUrl()).toBe("https://localhost:3000");
  });
});

describe("buildMetadata", () => {
  // siteUrl é calculada na carga do módulo; importa-se fresco após setar o env.
  async function freshMetadata() {
    vi.resetModules();
    return import("./metadata");
  }

  it("gera canonical e hreflang por idioma", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    const { buildMetadata: build } = await freshMetadata();

    const pt = build("pt");
    expect(pt.alternates?.canonical).toBe("/");
    expect(pt.alternates?.languages).toEqual({
      "pt-BR": "https://pedrolevi.dev/",
      en: "https://pedrolevi.dev/en/",
      "x-default": "https://pedrolevi.dev/",
    });
    expect(pt.openGraph?.locale).toBe("pt_BR");

    const en = build("en");
    expect(en.alternates?.canonical).toBe("/en/");
    expect(en.openGraph?.locale).toBe("en_US");
  });

  it("usa os textos do dicionário de cada idioma", async () => {
    const { buildMetadata: build } = await freshMetadata();

    const pt = build("pt");
    const en = build("en");

    expect(pt.title).toEqual(
      expect.objectContaining({ default: expect.any(String) })
    );
    expect(en.title).toEqual(
      expect.objectContaining({ default: expect.any(String) })
    );
    // Cada idioma tem seus próprios textos (não são idênticos)
    expect(JSON.stringify(pt)).not.toBe(JSON.stringify(en));
  });
});

describe("buildProjectMetadata", () => {
  async function freshMetadata() {
    vi.resetModules();
    return import("./metadata");
  }

  it("gera canonical com barra final e hreflang por idioma do projeto", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    const { buildProjectMetadata: build, languageUrlsFor } =
      await freshMetadata();

    const pt = build("newra-news", "pt");
    expect(pt.title).toBe("Newra News | Pedro Levi");
    expect(pt.alternates?.canonical).toBe("/projetos/newra-news/");
    expect(pt.alternates?.languages).toEqual(languageUrlsFor("newra-news"));
    expect(pt.openGraph?.locale).toBe("pt_BR");

    const en = build("newra-news", "en");
    expect(en.alternates?.canonical).toBe("/en/projects/newra-news/");
    expect(en.description).toMatch(/news portal/i);
  });

  it("cai nos metadados da raiz quando o slug não existe", async () => {
    const { buildProjectMetadata: build } = await freshMetadata();
    const fallback = build("slug-inexistente", "pt");
    expect(fallback.alternates?.canonical).toBe("/");
  });

  it("languageUrlsFor aponta as duas rotas do projeto", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    const { languageUrlsFor } = await freshMetadata();
    expect(languageUrlsFor("netsheet-engine")).toEqual({
      "pt-BR": "https://pedrolevi.dev/projetos/netsheet-engine/",
      en: "https://pedrolevi.dev/en/projects/netsheet-engine/",
      "x-default": "https://pedrolevi.dev/projetos/netsheet-engine/",
    });
  });
});

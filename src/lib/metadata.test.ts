import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, ogImageMeta } from "./metadata";
import { ogImageAlt, size as ogImageSize } from "@/components/og-image";

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

    /* Título é string simples, não mais o par default/template: cada rota traz
       o próprio título completo do dicionário, então não há o que compor. */
    expect(typeof pt.title).toBe("string");
    expect(typeof en.title).toBe("string");
    expect(JSON.stringify(pt)).not.toBe(JSON.stringify(en));
  });
});

describe("buildRouteMetadata: SEO por rota", () => {
  it("dá canonical próprio a cada rota, no idioma certo", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    vi.resetModules();
    const { buildRouteMetadata } = await import("./metadata");

    expect(buildRouteMetadata("home", "pt").alternates?.canonical).toBe("/");
    expect(buildRouteMetadata("clients", "pt").alternates?.canonical).toBe(
      "/clientes/"
    );
    expect(buildRouteMetadata("clients", "en").alternates?.canonical).toBe(
      "/en/clients/"
    );
    expect(buildRouteMetadata("contact", "pt").alternates?.canonical).toBe(
      "/contato/"
    );
  });

  it("aponta o hreflang de cada rota para o par dela, não para a home", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    vi.resetModules();
    const { buildRouteMetadata } = await import("./metadata");

    expect(buildRouteMetadata("info", "pt").alternates?.languages).toEqual({
      "pt-BR": "https://pedrolevi.dev/info/",
      en: "https://pedrolevi.dev/en/info/",
      "x-default": "https://pedrolevi.dev/info/",
    });
  });

  it("dá título distinto a cada rota, que é o ponto de dividir em cinco", async () => {
    vi.resetModules();
    const { buildRouteMetadata } = await import("./metadata");
    const { routeIds } = await import("./routes");

    const titles = routeIds.map((id) => buildRouteMetadata(id, "pt").title);
    expect(new Set(titles).size).toBe(routeIds.length);
  });

  it("buildMetadata é a rota home, e nada além disso", async () => {
    vi.resetModules();
    const { buildMetadata: build, buildRouteMetadata } = await import(
      "./metadata"
    );
    expect(JSON.stringify(build("pt"))).toBe(
      JSON.stringify(buildRouteMetadata("home", "pt"))
    );
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

/**
 * O caminho da imagem de link é literal em `metadata.ts`, e este teste é o que
 * o impede de apodrecer sem ninguém ver.
 *
 * **De onde vem o sufixo.** O Next só acrescenta hash ao caminho de uma rota de
 * metadado quando o **caminho pai contém grupo de rota** `(...)` ou rota
 * paralela `@...`, e o hash é `djb2Hash(caminhoPai).toString(36).slice(0, 6)`.
 * Está em `next/dist/lib/metadata/get-metadata-route.js`.
 *
 * Daí a assimetria que parece arbitrária ao ler o fonte: o português mora em
 * `src/app/(home)/opengraph-image.tsx`, cujo pai é `/(home)`, e ganha sufixo;
 * o inglês mora em `src/app/en/opengraph-image.tsx`, cujo pai é `/en`, e não
 * ganha. Não é escolha nossa, e não dá para renomear para fugir dela sem tirar
 * o português do grupo de rota.
 *
 * A função abaixo **reimplementa o algoritmo do Next de propósito**, para o
 * literal ser conferido contra a regra e não contra si mesmo. Se o Next mudar
 * o esquema, este teste falha aqui, barato e cedo, antes do E2E que busca a
 * URL de verdade em `e2e/marca.spec.ts`.
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash >>> 0;
}

/**
 * O caminho que o Next gera para um `opengraph-image.tsx` num dado pai.
 *
 * Duas regras, e elas se cruzam: o **hash** é calculado sobre o caminho pai
 * **com** o grupo, e a **URL** é montada **sem** ele, porque grupo de rota não
 * aparece em URL nenhuma. Trocar a ordem dá o hash certo no lugar errado.
 */
function rotaDeImagem(caminhoPai: string): string {
  const segmentos = caminhoPai.split("/").filter(Boolean);
  const ehGrupo = (seg: string) => seg.startsWith("(") || seg.startsWith("@");

  const sufixo = segmentos.some(ehGrupo)
    ? `-${djb2Hash(caminhoPai).toString(36).slice(0, 6)}`
    : "";

  /* O grupo some da URL, mas não some do hash. */
  const url = segmentos.filter((seg) => !ehGrupo(seg)).join("/");
  return `${url ? `/${url}` : ""}/opengraph-image${sufixo}`;
}

describe("ogImageMeta: a imagem de link", () => {
  /*
   * `rotaDeImagem` modela a rota que o Next gera, que não tem barra final. A
   * barra vem do `trailingSlash: true` do projeto, e é concern separado: sem
   * ela o site devolve 308 antes de servir a imagem. Somar aqui, em vez de
   * embutir no helper, mantém as duas regras visíveis e independentes.
   */
  const comBarra = (rota: string) => `${rota}/`;

  it("o caminho do português bate com o que o Next gera para /(home)", () => {
    expect(ogImageMeta("pt").url).toBe(comBarra(rotaDeImagem("/(home)")));
  });

  it("o do inglês não leva sufixo, porque /en não é grupo de rota", () => {
    expect(ogImageMeta("en").url).toBe(comBarra(rotaDeImagem("/en")));
    expect(ogImageMeta("en").url).toBe("/en/opengraph-image/");
  });

  it("os dois terminam em barra, senão o trailingSlash cobra um 308", () => {
    for (const lang of ["pt", "en"] as const) {
      expect(ogImageMeta(lang).url.endsWith("/")).toBe(true);
    }
  });

  it("os dois caminhos são diferentes, senão os idiomas compartilhariam imagem", () => {
    expect(ogImageMeta("pt").url).not.toBe(ogImageMeta("en").url);
  });

  it("dimensões e alt saem de og-image.tsx, sem segunda verdade", () => {
    for (const lang of ["pt", "en"] as const) {
      const meta = ogImageMeta(lang);
      expect(meta.width).toBe(ogImageSize.width);
      expect(meta.height).toBe(ogImageSize.height);
      expect(meta.alt).toBe(ogImageAlt[lang]);
    }
  });
});

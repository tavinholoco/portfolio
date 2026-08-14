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

describe("json-ld", () => {
  // siteUrl é calculada na carga do módulo; importa-se fresco após setar o env.
  async function freshJsonLd() {
    vi.resetModules();
    return import("./json-ld");
  }

  it("person tem nome, cargo e links sociais", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    const { personJsonLd } = await freshJsonLd();

    const person = personJsonLd("pt");
    expect(person["@type"]).toBe("Person");
    expect(person.jobTitle).toBe("Desenvolvedor Full Stack");
    expect(person.sameAs).toEqual(
      expect.arrayContaining(["https://github.com/tavinholoco"])
    );
  });

  it("projectJsonLd gera SoftwareApplication com URL absoluta", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.dev" });
    const { projectJsonLd } = await freshJsonLd();

    const ld = projectJsonLd("newra-news", "pt");
    expect(ld?.["@type"]).toBe("SoftwareApplication");
    expect(ld?.url).toBe("https://pedrolevi.dev/projetos/newra-news/");
    expect(ld?.keywords).toContain("Turborepo");

    const en = projectJsonLd("newra-news", "en");
    expect(en?.url).toBe("https://pedrolevi.dev/en/projects/newra-news/");
  });

  it("projectJsonLd retorna null para slug desconhecido", async () => {
    const { projectJsonLd } = await freshJsonLd();
    expect(projectJsonLd("nao-existe", "pt")).toBeNull();
  });

  it("projectListJsonLd lista um item por projeto em destaque", async () => {
    const { projectListJsonLd } = await freshJsonLd();
    const ld = projectListJsonLd("pt");
    expect(ld.itemListElement).toHaveLength(4);
  });
});

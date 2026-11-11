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
    WORKERS_CI: undefined,
  });
});

describe("json-ld", () => {
  // siteUrl é calculada na carga do módulo; importa-se fresco após setar o env.
  async function freshJsonLd() {
    vi.resetModules();
    return import("./json-ld");
  }

  it("person tem nome, cargo e links sociais", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.com.br" });
    const { personJsonLd } = await freshJsonLd();

    const person = personJsonLd("pt");
    expect(person["@type"]).toBe("Person");
    expect(person.jobTitle).toBe("Desenvolvedor Full Stack");
    expect(person.sameAs).toEqual(
      expect.arrayContaining(["https://github.com/tavinholoco"])
    );
  });

  it("projectJsonLd gera SoftwareApplication com URL absoluta", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.com.br" });
    const { projectJsonLd } = await freshJsonLd();

    const ld = projectJsonLd("newra-news", "pt");
    expect(ld?.["@type"]).toBe("SoftwareApplication");
    expect(ld?.url).toBe("https://pedrolevi.com.br/projetos/newra-news/");
    expect(ld?.keywords).toContain("Turborepo");

    const en = projectJsonLd("newra-news", "en");
    expect(en?.url).toBe("https://pedrolevi.com.br/en/projects/newra-news/");
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

describe("o @context do documento", () => {
  /* O que o E2E cobra no HTML servido, aqui sobre a função pura. */
  function exigeSchemaOrg(documento: Record<string, unknown>) {
    expect(documento["@context"]).toBe("https://schema.org");
    expect(Array.isArray(documento["@graph"])).toBe(true);
    expect((documento["@graph"] as unknown[]).length).toBeGreaterThan(0);
  }

  it("objeto e lista saem no mesmo formato, com o @context", async () => {
    const { jsonLdDocument, personJsonLd, webSiteJsonLd } = await import(
      "./json-ld"
    );
    const person = personJsonLd("pt");
    const site = webSiteJsonLd("pt");

    exigeSchemaOrg(jsonLdDocument(person));
    exigeSchemaOrg(jsonLdDocument([person, site]));
    expect(jsonLdDocument(person)["@graph"]).toEqual([person]);
    expect(jsonLdDocument([person, site])["@graph"]).toEqual([person, site]);
  });

  it("controle negativo: o nó cru, como o site servia, reprova", async () => {
    const { personJsonLd } = await import("./json-ld");
    expect(() => exigeSchemaOrg(personJsonLd("pt"))).toThrow();
  });

  it("a serialização leva o @context e sobrevive ao parse", async () => {
    const { serializeJsonLd, personJsonLd } = await import("./json-ld");
    const texto = serializeJsonLd(personJsonLd("en"));

    exigeSchemaOrg(JSON.parse(texto));
  });

  it("um texto com </script> não fecha a tag, e o parse devolve o original", async () => {
    const { serializeJsonLd } = await import("./json-ld");
    const texto = serializeJsonLd({
      "@type": "Thing",
      name: "</script><b>",
    });

    expect(texto).not.toContain("<");
    expect(JSON.parse(texto)["@graph"][0].name).toBe("</script><b>");
  });
});

describe("knowsAbout", () => {
  it("lista competências, sem o nome dele e sem reaproveitar as keywords", async () => {
    const { personJsonLd } = await import("./json-ld");
    const { dictionaries } = await import("@/i18n");

    for (const lang of ["pt", "en"] as const) {
      const { knowsAbout } = personJsonLd(lang);
      expect(knowsAbout.length).toBeGreaterThan(0);
      expect(knowsAbout).not.toContain(dictionaries[lang].meta.name);
      expect(knowsAbout).not.toEqual(dictionaries[lang].meta.keywords);
    }
  });
});

describe("o endereço da Person", () => {
  it("diz cidade, estado e país, com o telefone público", async () => {
    const { personJsonLd } = await import("./json-ld");
    const person = personJsonLd("pt");

    expect(person.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Rancharia",
      addressRegion: "SP",
      addressCountry: "BR",
    });
    expect(person.telephone).toBe("+5518996260781");
  });

  it("nunca publica a rua, nem vira LocalBusiness", async () => {
    const { personJsonLd, serviceJsonLd } = await import("./json-ld");

    for (const lang of ["pt", "en"] as const) {
      const texto = JSON.stringify([personJsonLd(lang), serviceJsonLd(lang)]);
      expect(texto).not.toContain("streetAddress");
      expect(texto).not.toContain("postalCode");
      expect(texto).not.toContain("LocalBusiness");
    }
  });
});

describe("serviceJsonLd", () => {
  it("aponta o provider para a Person pelo @id", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.com.br" });
    vi.resetModules();
    const { personJsonLd, serviceJsonLd } = await import("./json-ld");

    expect(serviceJsonLd("pt").provider).toEqual({
      "@id": personJsonLd("pt")["@id"],
    });
    expect(personJsonLd("en")["@id"]).toBe(personJsonLd("pt")["@id"]);
  });

  it("atende o Brasil todo, e a URL é a do idioma", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.com.br" });
    vi.resetModules();
    const { serviceJsonLd } = await import("./json-ld");

    expect(serviceJsonLd("pt").areaServed).toEqual({
      "@type": "Country",
      name: "Brasil",
      identifier: "BR",
    });
    expect(serviceJsonLd("pt").url).toBe(
      "https://pedrolevi.com.br/criacao-de-sites/"
    );
    expect(serviceJsonLd("en").url).toBe(
      "https://pedrolevi.com.br/en/websites/"
    );
  });
});

describe("itemListJsonLd", () => {
  /* Mesmo motivo do bloco acima: siteUrl é calculada na carga do módulo. */
  async function freshJsonLd() {
    vi.resetModules();
    return import("./json-ld");
  }

  it("numera as posições a partir de 1, como o Schema.org exige", async () => {
    const { itemListJsonLd } = await freshJsonLd();
    const list = itemListJsonLd([
      { name: "A", description: "a", url: "https://a.test/" },
      { name: "B", description: "b", url: "https://b.test/" },
    ]);

    expect(list["@type"]).toBe("ItemList");
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it("sobrevive a lista vazia sem gerar dado inválido", async () => {
    const { itemListJsonLd } = await freshJsonLd();
    const list = itemListJsonLd([]);

    expect(list.numberOfItems).toBe(0);
    expect(list.itemListElement).toEqual([]);
  });

  it("projectListJsonLd aponta para a rota de projeto de cada idioma", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.com.br" });
    const { projectListJsonLd } = await freshJsonLd();

    const pt = projectListJsonLd("pt");
    const en = projectListJsonLd("en");

    expect(pt.itemListElement[0].item.url).toContain("/projetos/");
    expect(en.itemListElement[0].item.url).toContain("/en/projects/");
    expect(pt.numberOfItems).toBe(en.numberOfItems);
  });

  it("clientListJsonLd usa a URL externa do cliente, não uma rota interna", async () => {
    const { clientListJsonLd } = await freshJsonLd();
    const list = clientListJsonLd("pt");

    expect(list.numberOfItems).toBeGreaterThan(0);
    for (const entry of list.itemListElement) {
      expect(entry.item.url).toMatch(/^https?:\/\//);
    }
  });
});

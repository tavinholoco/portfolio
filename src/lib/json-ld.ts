import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { getSiteUrl } from "@/lib/metadata";
import { pathFor } from "@/lib/routes";

const siteUrl = getSiteUrl();

export type JsonLdNode = Record<string, unknown>;

/**
 * Embrulha um ou mais nós no documento que vai para o HTML.
 *
 * **Sem `@context` os dados não são schema.org**, e nada acusa: o build passa, a
 * página serve e o Lighthouse não reclama. O site ficou assim desde a v2. Por
 * isso o campo mora aqui, num ponto só, e os nós de cada rota não o declaram.
 * Objeto e lista viram o mesmo formato, com `@graph`, para o `@context` não
 * precisar ser repetido em cada nó.
 */
export function jsonLdDocument(data: JsonLdNode | JsonLdNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": Array.isArray(data) ? data : [data],
  };
}

/**
 * O documento como texto, pronto para o `<script>`.
 *
 * Troca `<` pelo escape unicode, como manda o guia de JSON-LD do Next: um `</script>`
 * dentro de um texto fecharia a tag. O `JSON.parse` devolve o caractere original.
 */
export function serializeJsonLd(data: JsonLdNode | JsonLdNode[]): string {
  return JSON.stringify(jsonLdDocument(data)).replace(/</g, "\\u003c");
}

/** O mesmo nos dois idiomas: é a mesma pessoa, e é o que o `Service` referencia. */
const personId = `${siteUrl}/#person`;

/**
 * Schema.org Person: perfil do dono do site (home).
 *
 * O endereço para em cidade e estado, e a rua nunca entra: ele atende só pelo
 * WhatsApp e não publica onde mora. O telefone já é público no contato.
 *
 * **Não trocar por `LocalBusiness`:** o Google exige endereço físico para esse
 * tipo.
 */
export function personJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return {
    "@type": "Person",
    "@id": personId,
    name: d.meta.name,
    url: siteUrl,
    jobTitle: d.hero.role,
    email: profile.email,
    telephone: profile.phoneRaw,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: profile.location.country,
    },
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: d.meta.knowsAbout,
  };
}

/**
 * Schema.org Service: a página de criação de sites.
 *
 * O `provider` referencia a `Person` pelo `@id`, então a página precisa servir a
 * `Person` no mesmo documento.
 */
export function serviceJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return {
    "@type": "Service",
    name: d.routes.websites.title,
    serviceType: d.websites.serviceType,
    description: d.routes.websites.description,
    url: `${siteUrl}${pathFor("websites", lang)}`,
    provider: { "@id": personId },
    areaServed: profile.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: "São Paulo" },
    })),
  };
}

/** Schema.org WebSite: home por idioma. */
export function webSiteJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return {
    "@type": "WebSite",
    name: d.meta.ogSiteName,
    url: siteUrl,
    inLanguage: lang === "pt" ? "pt-BR" : "en",
  };
}

type ListItemInput = { name: string; description: string; url: string };

/**
 * Schema.org ItemList genérico, usado pelas rotas de Projetos e de Clientes.
 *
 * Vale a pena existir porque as duas rotas são listas do mesmo tipo para o
 * buscador, e é o dado estruturado que faz cada uma valer como ponto de entrada
 * próprio depois da divisão em cinco rotas (E2).
 */
export function itemListJsonLd(items: ListItemInput[]) {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.name,
        description: item.description,
        url: item.url,
      },
    })),
  };
}

/** ItemList dos projetos próprios (rota de Projetos). */
export function projectListJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return itemListJsonLd(
    d.projects.featured.map((project) => ({
      name: project.title,
      description: project.tagline,
      url: `${siteUrl}${pathFor("projects", lang)}${project.slug}/`,
    }))
  );
}

/** ItemList dos trabalhos de cliente (rota de Clientes). */
export function clientListJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return itemListJsonLd(
    d.clients.projects.map((project) => ({
      name: project.name,
      description: project.description,
      url: project.url,
    }))
  );
}

/** Schema.org SoftwareApplication: página individual de projeto. */
export function projectJsonLd(slug: string, lang: Locale) {
  const d = dictionaries[lang];
  const project = d.projects.featured.find((p) => p.slug === slug);
  if (!project) return null;
  return {
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.tagline,
    url: `${siteUrl}${pathFor("projects", lang)}${slug}/`,
    applicationCategory: "WebApplication",
    keywords: project.stack.join(", "),
    inLanguage: lang === "pt" ? "pt-BR" : "en",
    author: { "@type": "Person", name: d.meta.name, url: siteUrl },
  };
}

import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { getSiteUrl } from "@/lib/metadata";
import { pathFor } from "@/lib/routes";

const siteUrl = getSiteUrl();

/** Schema.org Person: perfil do dono do site (home). */
export function personJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return {
    "@type": "Person",
    name: d.meta.name,
    url: siteUrl,
    jobTitle: d.hero.role,
    email: profile.email,
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: d.meta.keywords,
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

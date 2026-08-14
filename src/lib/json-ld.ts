import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { getSiteUrl } from "@/lib/metadata";

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
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rancharia",
      addressRegion: "São Paulo",
      addressCountry: "BR",
    },
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

/** Schema.org ItemList com os projetos em destaque (home). */
export function projectListJsonLd(lang: Locale) {
  const d = dictionaries[lang];
  return {
    "@type": "ItemList",
    itemListElement: d.projects.featured.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.tagline,
        url: `${siteUrl}/${
          lang === "pt" ? "projetos" : "en/projects"
        }/${project.slug}/`,
      },
    })),
  };
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
    url: `${siteUrl}/${
      lang === "pt" ? "projetos" : "en/projects"
    }/${slug}/`,
    applicationCategory: "WebApplication",
    keywords: project.stack.join(", "),
    inLanguage: lang === "pt" ? "pt-BR" : "en",
    author: { "@type": "Person", name: d.meta.name, url: siteUrl },
  };
}

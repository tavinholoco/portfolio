import type { MetadataRoute } from "next";

import { projectMetas } from "@/data/projects";
import { getSiteUrl, languageUrlsFor, languageUrlsForRoute } from "@/lib/metadata";
import { pathFor, routes } from "@/lib/routes";

const siteUrl = getSiteUrl();

/**
 * O sitemap deriva do manifesto de rotas, então acrescentar uma rota lá já a
 * coloca aqui, nos dois idiomas e com o hreflang certo.
 *
 * O arquivo continua dentro do route group `(home)` de propósito: a v2
 * registrou que nesta versão do Next o `robots.ts` precisa ficar fora do group
 * e o `sitemap.ts` dentro. A assimetria não é descuido, e "arrumar" ela quebra
 * a geração (F15).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const alternates = { languages: languageUrlsForRoute(route.id) };
    /* A home é o ponto de entrada principal; as demais rotas vêm logo abaixo. */
    const priority = route.id === "home" ? 1 : 0.8;

    entries.push(
      {
        url: `${siteUrl}${route.pt}`,
        lastModified,
        changeFrequency: "monthly",
        priority,
        alternates,
      },
      {
        url: `${siteUrl}${route.en}`,
        lastModified,
        changeFrequency: "monthly",
        priority: priority - 0.1,
        alternates,
      }
    );
  }

  for (const meta of projectMetas) {
    const alternates = { languages: languageUrlsFor(meta.slug) };
    entries.push(
      {
        url: `${siteUrl}${pathFor("projects", "pt")}${meta.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates,
      },
      {
        url: `${siteUrl}${pathFor("projects", "en")}${meta.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates,
      }
    );
  }

  return entries;
}

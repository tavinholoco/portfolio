import type { MetadataRoute } from "next";

import { projectMetas } from "@/data/projects";
import { getSiteUrl, languageUrls, languageUrlsFor } from "@/lib/metadata";

const siteUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languageUrls },
    },
    {
      url: `${siteUrl}/en/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: languageUrls },
    },
  ];

  for (const meta of projectMetas) {
    entries.push(
      {
        url: `${siteUrl}/projetos/${meta.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: languageUrlsFor(meta.slug) },
      },
      {
        url: `${siteUrl}/en/projects/${meta.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: languageUrlsFor(meta.slug) },
      }
    );
  }

  return entries;
}

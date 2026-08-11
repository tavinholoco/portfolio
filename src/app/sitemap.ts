import type { MetadataRoute } from "next";

import { languageUrls } from "@/lib/metadata";

/** Defina NEXT_PUBLIC_SITE_URL no deploy (ex.: https://pedrolevi.dev). */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrolevi.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
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
}

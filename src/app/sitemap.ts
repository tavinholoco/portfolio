import type { MetadataRoute } from "next";

import { getSiteUrl, languageUrls } from "@/lib/metadata";

const siteUrl = getSiteUrl();

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

import type { Metadata } from "next";

import { dictionaries, type Locale } from "@/i18n";

/** Defina NEXT_PUBLIC_SITE_URL no deploy (ex.: https://pedrolevi.dev). */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrolevi.dev";

/** URLs por idioma usadas no canonical e no hreflang. */
export const languageUrls: Record<string, string> = {
  "pt-BR": `${siteUrl}/`,
  en: `${siteUrl}/en/`,
  "x-default": `${siteUrl}/`,
};

/** Metadados completos de uma variante de idioma (título, OG, Twitter, canonical e hreflang). */
export function buildMetadata(lang: Locale): Metadata {
  const d = dictionaries[lang].meta;
  const path = lang === "pt" ? "/" : "/en/";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: d.title,
      template: `%s | ${d.name}`,
    },
    description: d.description,
    keywords: d.keywords,
    authors: [{ name: "Pedro Levi Dias Rosa Paula", url: siteUrl }],
    creator: "Pedro Levi Dias Rosa Paula",
    alternates: {
      canonical: path,
      languages: languageUrls,
    },
    openGraph: {
      type: "website",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      url: `${siteUrl}${path}`,
      siteName: d.ogSiteName,
      title: d.title,
      description: d.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: d.title,
      description: d.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

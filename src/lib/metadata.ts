import type { Metadata } from "next";

import { dictionaries, type Locale } from "@/i18n";

/**
 * URL canônica do site. Prioridade:
 * 1. NEXT_PUBLIC_SITE_URL (domínio próprio, ex.: https://pedrolevi.dev)
 * 2. VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL (URL real do deploy na Vercel)
 * 3. Fallback local
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://localhost:3000";
}

const siteUrl = getSiteUrl();

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

/** URLs por idioma de uma página individual de projeto (hreflang do sitemap e da página). */
export function languageUrlsFor(slug: string): Record<string, string> {
  return {
    "pt-BR": `${siteUrl}/projetos/${slug}/`,
    en: `${siteUrl}/en/projects/${slug}/`,
    "x-default": `${siteUrl}/projetos/${slug}/`,
  };
}

/**
 * Metadados de uma página individual de projeto (canonical, hreflang, OG e Twitter).
 * Slug desconhecido → cai nos metadados da raiz do idioma.
 */
export function buildProjectMetadata(slug: string, lang: Locale): Metadata {
  const d = dictionaries[lang];
  const project = d.projects.featured.find((p) => p.slug === slug);
  if (!project) return buildMetadata(lang);

  const path = lang === "pt" ? `/projetos/${slug}/` : `/en/projects/${slug}/`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${project.title} | ${d.meta.name}`,
    description: project.tagline,
    alternates: {
      canonical: path,
      languages: languageUrlsFor(slug),
    },
    openGraph: {
      type: "website",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      url: `${siteUrl}${path}`,
      siteName: d.meta.ogSiteName,
      title: project.title,
      description: project.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.tagline,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

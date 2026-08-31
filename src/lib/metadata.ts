import type { Metadata } from "next";

import { ogImageAlt, size as ogImageSize } from "@/components/og-image";
import { dictionaries, type Locale } from "@/i18n";
import { pathFor, type RouteId } from "@/lib/routes";

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

/**
 * URLs por idioma de uma rota do manifesto, para o canonical e o hreflang.
 *
 * `x-default` aponta para o português porque o público primário é brasileiro
 * (decisão da seção 4.5 do plano).
 */
export function languageUrlsForRoute(id: RouteId): Record<string, string> {
  return {
    "pt-BR": `${siteUrl}${pathFor(id, "pt")}`,
    en: `${siteUrl}${pathFor(id, "en")}`,
    "x-default": `${siteUrl}${pathFor(id, "pt")}`,
  };
}

/** URLs por idioma da home. Mantido porque o JSON-LD e o sitemap consomem. */
export const languageUrls: Record<string, string> =
  languageUrlsForRoute("home");

/**
 * Caminho da imagem de link gerada por `opengraph-image.tsx`, por idioma.
 *
 * **Por que isto existe, e por que é literal.** O merge de metadados do Next é
 * **raso**: quando uma página exporta `openGraph`, ela substitui o objeto
 * inteiro do layout, imagens inclusive. Como todas as rotas passam por
 * `buildRouteMetadata`, que define `openGraph`, só `/` e `/en/` ficavam com
 * imagem de link: nelas o `opengraph-image.tsx` é do **mesmo segmento** e a
 * convenção de arquivo ganha. As outras oito rotas e as páginas de case eram
 * compartilhadas sem imagem nenhuma. Estava assim em produção.
 *
 * A saída é a que a própria documentação do Next prescreve: extrair o campo
 * para uma variável e espalhá-la em cada `openGraph`.
 *
 * O sufixo de `pt` é gerado pelo Next porque `(home)` é grupo de rota, e sai de
 * `djb2Hash(caminhoPai)` em base 36 truncado em 6. `src/lib/metadata.test.ts`
 * reimplementa a regra e confere estes literais contra ela; `e2e/marca.spec.ts`
 * busca as duas URLs de verdade.
 *
 * **A barra final não é enfeite.** O projeto roda com `trailingSlash: true`, e
 * sem ela o Next devolve 308 para a versão com barra antes de servir a imagem.
 * Funcionava, porque todo scraper segue 308, mas anunciávamos uma URL que não
 * é a canônica e cobrávamos um salto a mais de quem tem timeout curto. Passou
 * despercebido porque tanto o Playwright quanto `curl -L` seguem redirecionamento
 * por padrão: por isso o teste agora exige **200 sem seguir**.
 */
const ogImagePath: Record<Locale, string> = {
  pt: "/opengraph-image-12gd74/",
  en: "/en/opengraph-image/",
};

/**
 * O bloco de imagem para espalhar em `openGraph` e `twitter`.
 *
 * Dimensões e `alt` saem de `src/components/og-image.tsx`, que é quem desenha,
 * para não existirem duas verdades sobre a mesma imagem.
 */
export function ogImageMeta(lang: Locale) {
  return {
    url: ogImagePath[lang],
    width: ogImageSize.width,
    height: ogImageSize.height,
    alt: ogImageAlt[lang],
  };
}

/**
 * Metadados de uma rota do manifesto, num idioma.
 *
 * Cada rota tem título e descrição próprios, que é o que faz dividir a página
 * única em cinco melhorar o SEO em vez de piorar: passam a existir cinco pontos
 * de entrada em vez de um. Roda no build, não a cada acesso.
 */
export function buildRouteMetadata(id: RouteId, lang: Locale): Metadata {
  const d = dictionaries[lang];
  const route = d.routes[id];
  const path = pathFor(id, lang);

  return {
    metadataBase: new URL(siteUrl),
    title: route.title,
    description: route.description,
    keywords: d.meta.keywords,
    authors: [{ name: "Pedro Levi Dias Rosa Paula", url: siteUrl }],
    creator: "Pedro Levi Dias Rosa Paula",
    alternates: {
      canonical: path,
      languages: languageUrlsForRoute(id),
    },
    openGraph: {
      type: "website",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      url: `${siteUrl}${path}`,
      siteName: d.meta.ogSiteName,
      title: route.title,
      description: route.description,
      images: [ogImageMeta(lang)],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [ogImageMeta(lang)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** Metadados da home de um idioma. Atalho para a rota `home` do manifesto. */
export function buildMetadata(lang: Locale): Metadata {
  return buildRouteMetadata("home", lang);
}

/** URLs por idioma de uma página individual de projeto. */
export function languageUrlsFor(slug: string): Record<string, string> {
  const pt = `${siteUrl}${pathFor("projects", "pt")}${slug}/`;
  const en = `${siteUrl}${pathFor("projects", "en")}${slug}/`;
  return { "pt-BR": pt, en, "x-default": pt };
}

/**
 * Metadados de uma página individual de projeto (canonical, hreflang, OG e Twitter).
 * Slug desconhecido cai nos metadados da raiz do idioma.
 */
export function buildProjectMetadata(slug: string, lang: Locale): Metadata {
  const d = dictionaries[lang];
  const project = d.projects.featured.find((p) => p.slug === slug);
  if (!project) return buildMetadata(lang);

  const path = `${pathFor("projects", lang)}${slug}/`;

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
      images: [ogImageMeta(lang)],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.tagline,
      images: [ogImageMeta(lang)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

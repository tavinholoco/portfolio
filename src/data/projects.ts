/**
 * Metadados neutros dos projetos em destaque (não dependem do idioma).
 * Textos traduzíveis (tagline, problema, solução, destaque, stack) ficam
 * nos dicionários em `src/i18n/` — aqui só slug + repo + demoUrl
 * (decisão 5 do plano v2).
 */

/** Categorias possíveis dos projetos em destaque. */
export type ProjectCategory = "fullstack" | "mobile" | "landing";

/** Metadados neutros de um projeto em destaque. */
export type ProjectMeta = {
  /** Slug da página individual (/projetos/[slug]) e chave de ligação com o dicionário. */
  slug: string;
  /** Nome do repositório no GitHub (pode ter maiúsculas, ex.: NetsheetEngine). */
  repo: string;
  /** Link público do projeto (demo), quando existe. */
  demoUrl?: string;
};

/** Curadoria: slug + repo + demoUrl de cada projeto em destaque. */
export const projectMetas: ProjectMeta[] = [
  {
    slug: "newra-news",
    repo: "newra-news",
    demoUrl: "https://newra-news-web.vercel.app",
  },
  { slug: "netsheet-engine", repo: "NetsheetEngine" },
  { slug: "repertorio-progressivo", repo: "repertorio-progressivo" },
  { slug: "trak-assessoria", repo: "Trak-Acessoria" },
];

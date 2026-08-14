import { projectMetas } from "@/data/projects";
import type { FeaturedProject, Locale } from "@/i18n";

const GITHUB_USER = "tavinholoco";
/** Regeneração a cada 1h (ISR), suficiente para o rate limit de 60 req/h sem token. */
const REVALIDATE_SECONDS = 3600;

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
};

/** Projeto pronto para renderização: curadoria traduzida + metadados do GitHub. */
export type Project = FeaturedProject & {
  repo: string;
  language: string | null;
  /** Data do último push formatada (ex.: "ago 2026"). */
  updatedAt: string | null;
  repoUrl: string;
  demoUrl: string | null;
};

function formatDate(iso: string | null, lang: Locale): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

/**
 * Busca os projetos em destaque no GitHub e mescla com a curadoria.
 * Roda no servidor (SSG/ISR). Se a API falhar ou estiver em rate limit,
 * cai no fallback estático (repo/demo da curadoria), o site nunca quebra.
 */
export async function getFeaturedProjects(
  featured: FeaturedProject[],
  lang: Locale = "pt"
): Promise<Project[]> {
  let repos: GitHubRepo[] = [];

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "pedrolevi-portfolio",
        },
      }
    );
    if (res.ok) {
      repos = (await res.json()) as GitHubRepo[];
    }
  } catch {
    // API indisponível, usa o fallback abaixo
  }

  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  const metaBySlug = new Map(projectMetas.map((meta) => [meta.slug, meta]));

  return featured.map((f) => {
    const meta = metaBySlug.get(f.slug);
    const repo = meta?.repo ?? f.slug;
    const gh = byName.get(repo.toLowerCase());
    return {
      ...f,
      repo,
      language: gh?.language ?? null,
      updatedAt: formatDate(gh?.pushed_at ?? null, lang),
      repoUrl: gh?.html_url ?? `https://github.com/${GITHUB_USER}/${repo}`,
      // A homepage do GitHub tem prioridade; a demo curada é o fallback (não o contrário).
      demoUrl: gh?.homepage ?? meta?.demoUrl ?? null,
    };
  });
}

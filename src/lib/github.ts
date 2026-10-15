import { projectMetas } from "@/data/projects";
import type { FeaturedProject, Locale } from "@/i18n";

const GITHUB_USER = "tavinholoco";
/**
 * Validade da resposta no cache de fetch do Next.
 *
 * Com o export estático não existe mais ISR: o dado do GitHub é o do build, e
 * o build roda toda semana (§17.6). O número continua por outro motivo. Com o
 * cache de build ligado, o Workers Builds guarda o `.next/cache` entre builds,
 * e o cache de fetch mora ali: com `force-cache` o rebuild semanal reaproveitaria a resposta do
 * primeiro build para sempre, e com `no-store` a rota deixaria de ser estática
 * e o export pararia. Uma hora de validade faz todo rebuild buscar de novo.
 */
const REVALIDATE_SECONDS = 3600;

/**
 * Cabeçalhos da chamada à API. O token é opcional: sem ele o limite é de 60
 * requisições por hora **por IP**, e as máquinas de build da Cloudflare são
 * compartilhadas. Se o limite já estiver gasto por outro projeto, a chamada
 * cai no fallback sem erro e as páginas de case saem sem linguagem e sem data
 * (§17.5). Com `GITHUB_TOKEN` (fine-grained, só leitura de repositório
 * público), o limite passa a ser da conta.
 */
function githubHeaders(comToken = true): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pedrolevi-portfolio",
  };
  if (comToken && process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

/**
 * Token vencido ou revogado faz a API responder 401 a toda chamada, e sem esta
 * volta o fallback engoliria isso calado em todo build: as páginas de case
 * sairiam sem linguagem e sem data, pior do que sem token nenhum (§17.16).
 * No 401 a busca se repete sem o token, que é o limite por IP de antes, e o
 * aviso fica no log do build.
 */
async function buscarRepos(): Promise<Response> {
  const res = await fetch(REPOS_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: githubHeaders(),
  });
  if (res.status !== 401 || !process.env.GITHUB_TOKEN) return res;
  console.warn("GITHUB_TOKEN recusado pela API do GitHub (401): buscando sem ele. Troque o secret no Worker.");
  return fetch(REPOS_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: githubHeaders(false),
  });
}

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
 * Roda no build (export estático). Se a API falhar ou estiver em rate limit,
 * cai no fallback estático (repo/demo da curadoria), o site nunca quebra.
 */
export async function getFeaturedProjects(
  featured: FeaturedProject[],
  lang: Locale = "pt"
): Promise<Project[]> {
  let repos: GitHubRepo[] = [];

  try {
    const res = await buscarRepos();
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

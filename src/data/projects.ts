export type ProjectCategory = "fullstack" | "mobile" | "landing";

export const categoryLabels: Record<ProjectCategory, string> = {
  fullstack: "Fullstack",
  mobile: "Mobile",
  landing: "Landing",
};

export type FeaturedProject = {
  /** Nome do repositório no GitHub (usado para casar com a API). */
  repo: string;
  title: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  /** Marca o projeto como em desenvolvimento (ainda não concluído). */
  inDevelopment?: boolean;
};

/** Projetos em destaque (curadoria manual); metadados (language, links, datas) vêm da GitHub API. */
export const featuredProjects: FeaturedProject[] = [
  {
    repo: "newra-news",
    title: "Newra News",
    description:
      "Portal de notícias com geração diária de conteúdo por IA. Monorepo Turborepo com API Fastify e frontend Next.js integrados ao Google Gemini.",
    category: "fullstack",
    inDevelopment: true,
    tags: ["Next.js", "Fastify", "Gemini API", "Turborepo"],
  },
  {
    repo: "NetsheetEngine",
    title: "Netsheet Engine",
    description:
      "Suite de ficha de personagem e PRD para Cyberpunk 2020, com React 19, Express e Supabase, do CRUD à documentação de produto.",
    category: "fullstack",
    inDevelopment: true,
    tags: ["React 19", "Express", "Supabase"],
  },
  {
    repo: "repertorio-progressivo",
    title: "Repertório Progressivo",
    description:
      "App mobile de organização de estudos com notificações push e suíte de 144 testes automatizados (Jest), construído com React Native, Expo e TypeScript.",
    category: "mobile",
    tags: ["React Native", "Expo", "Jest", "Push notifications"],
  },
  {
    repo: "Trak-Acessoria",
    title: "Trak Assessoria",
    description:
      "Landing page institucional para assessoria contábil, com Next.js 16, Tailwind v4, Vitest e Playwright, testes E2E e design responsivo.",
    category: "landing",
    tags: ["Next.js 16", "Tailwind v4", "Vitest", "Playwright"],
  },
];

/**
 * Projetos entregues para clientes (acesso só pelo site).
 * `image` é o screenshot do topo do site, salvo em public/projects/.
 */
export const clientProjects: ClientProject[] = [
  {
    name: "Dandarkness",
    description:
      "Portfólio do projeto Dandarkness, publicado e no ar. Acesso direto ao site do projeto.",
    url: "https://dandarkness.vercel.app/",
    image: "/projects/dandarkness.jpg",
  },
];

export type ClientProject = {
  name: string;
  description: string;
  url: string;
  image: string;
};

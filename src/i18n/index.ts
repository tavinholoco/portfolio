import type { ProjectCategory } from "@/data/projects";
import type { RouteId } from "@/lib/routes";
import type { TimelineChapter } from "@/data/career";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

/** Valida e resolve o locale a partir de uma string (cookie/URL). Padrão: pt. */
export function resolveLocale(value: string | null | undefined): Locale {
  return value === "en" ? "en" : "pt";
}

export type Fact = {
  id: "formation" | "location" | "email" | "languages";
  label: string;
  value: string;
};

export type Interest = {
  id: "analysis" | "data" | "ai";
  title: string;
  description: string;
};

export type Stat = {
  value: string;
  label: string;
};

/** Projeto em destaque: só texto traduzível. Metadados neutros (slug/repo/demo) ficam em `src/data/projects.ts` (decisão 5 do plano v2). */
export type FeaturedProject = {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  highlight: string;
  stack: string[];
  category: ProjectCategory;
  /** O que aprendi no projeto, usado na página individual. */
  learnings: string[];
};

/** Case de cliente: demonstra capacidade comercial, não só técnica. */
export type ClientProject = {
  name: string;
  description: string;
  responsibilities: string[];
  /** Tecnologias, exibidas como coluna na linha do showcase. */
  stack: string[];
  /** Ano de entrega, exibido como coluna na linha do showcase. */
  year: string;
  status: string;
  url: string;
  image: string;
};

export type SkillBlock = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

export type ContactCard = {
  id: "email" | "whatsapp" | "linkedin" | "github";
  label: string;
  value: string;
};

/** Estrutura completa de textos do site (pt-BR e en). */
export type Dict = {
  meta: {
    title: string;
    name: string;
    description: string;
    keywords: string[];
    ogSiteName: string;
    ogDescription: string;
  };
  /**
   * Título e descrição de cada rota, para o generateMetadata correspondente.
   *
   * Digitado como Record<RouteId, ...>: acrescentar uma rota ao manifesto
   * quebra os dois dicionários até que a tradução exista, que é a falha certa.
   * O import é só de tipo, então o ciclo com lib/routes.ts some na compilação.
   */
  routes: Record<RouteId, { title: string; description: string }>;
  nav: {
    openMenu: string;
    sheetTitle: string;
    sheetDescription: string;
    mainAria: string;
    mobileAria: string;
  };
  hero: {
    role: string;
    name: string;
    bio: string;
    stackLabel: string;
    viewProjects: string;
    downloadCv: string;
    scrollLabel: string;
    socials: { github: string; linkedin: string; email: string };
  };
  about: {
    label: string;
    title: string;
    facts: Fact[];
    summary: string[];
    metricsTitle: string;
    metrics: Stat[];
    interestsHeading: string;
    interests: Interest[];
  };
  projects: {
    label: string;
    title: string;
    description: string;
    updatedAt: string;
    github: string;
    viewProject: string;
    featuredBadge: string;
    problemLabel: string;
    solutionLabel: string;
    highlightLabel: string;
    stackLabel: string;
    backToProjects: string;
    learningsTitle: string;
    previous: string;
    next: string;
    demoLabel: string;
    allOnGithub: string;
    categories: Record<ProjectCategory, string>;
    featured: FeaturedProject[];
  };
  clients: {
    label: string;
    title: string;
    description: string;
    projectKind: string;
    responsibilitiesLabel: string;
    statusLabel: string;
    visit: string;
    previewAlt: string;
    projects: ClientProject[];
  };
  process: {
    label: string;
    title: string;
    description: string;
    steps: { title: string; description: string }[];
  };
  career: {
    label: string;
    title: string;
    description: string;
    learningsTitle: string;
    chapters: TimelineChapter[];
  };
  skills: {
    label: string;
    title: string;
    description: string;
    blocks: SkillBlock[];
  };
  contact: {
    label: string;
    title: string;
    description: string;
    hiringTitle: string;
    hiringDescription: string;
    hiringCta: string;
    projectTitle: string;
    projectDescription: string;
    projectCta: string;
    goToSection: string;
    cards: ContactCard[];
  };
  controls: {
    theme: string;
    toEnglish: string;
    toPortuguese: string;
  };
};

import { en } from "./en";
import { pt } from "./pt";

export const dictionaries: Record<Locale, Dict> = { pt, en };

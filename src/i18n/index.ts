import type { ProjectCategory } from "@/data/projects";
import type { CareerItem } from "@/data/career";

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

/** Projeto em destaque — só texto traduzível. Metadados neutros (slug/repo/demo) ficam em `src/data/projects.ts` (decisão 5 do plano v2). */
export type FeaturedProject = {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  highlight: string;
  stack: string[];
  category: ProjectCategory;
};

export type ClientProject = {
  name: string;
  description: string;
  url: string;
  image: string;
};

export type SkillBlock = {
  id: string;
  title: string;
  description: string;
  level: { label: string; value: number };
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
  nav: {
    links: { label: string; href: string }[];
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
    socials: { github: string; linkedin: string; email: string; phone: string };
  };
  about: {
    label: string;
    title: string;
    description: string;
    facts: Fact[];
    summary: string[];
    stats: Stat[];
    interestsHeading: string;
    interests: Interest[];
  };
  projects: {
    label: string;
    title: string;
    description: string;
    filterAll: string;
    one: string;
    many: string;
    updatedAt: string;
    github: string;
    viewProject: string;
    featuredBadge: string;
    problemLabel: string;
    solutionLabel: string;
    highlightLabel: string;
    stackLabel: string;
    allOnGithub: string;
    categories: Record<ProjectCategory, string>;
    featured: FeaturedProject[];
  };
  clients: {
    label: string;
    title: string;
    description: string;
    live: string;
    visit: string;
    previewAlt: string;
    projects: ClientProject[];
  };
  career: {
    label: string;
    title: string;
    description: string;
    educationTitle: string;
    experienceTitle: string;
    education: CareerItem[];
    experience: CareerItem[];
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
    emailButton: string;
    whatsappButton: string;
    cards: ContactCard[];
  };
  footer: {
    socials: { github: string; linkedin: string; email: string; phone: string };
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

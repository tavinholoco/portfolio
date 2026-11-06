import type { StaticImageData } from "next/image";

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
  /**
   * O que foi feito no projeto, exibido junto do preview.
   *
   * Para trabalho de cliente isso responde uma pergunta diferente da stack:
   * a stack diz qual tecnologia, isto diz até onde foi o envolvimento. Um
   * recrutador quer saber se a pessoa fez só a tela ou levou até o deploy.
   */
  responsibilities: string[];
  /** Tecnologias, exibidas como coluna na linha do showcase. */
  stack: string[];
  /** Ano de entrega, exibido como coluna na linha do showcase. */
  year: string;
  url: string;
  /* Import, nunca caminho em string: ver a nota em src/data/projects.ts. */
  image: StaticImageData;
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

/**
 * Exemplo na página de criação de sites.
 *
 * `kind` existe para dizer o que cada um é: a Trak é projeto próprio, e só a
 * Dandarkness é cliente. A página não pode sugerir o contrário.
 */
export type WebsiteExample = {
  id: "trak" | "dandarkness";
  name: string;
  kind: string;
  description: string;
  url: string;
};

/** Estrutura completa de textos do site (pt-BR e en). */
export type Dict = {
  meta: {
    name: string;
    keywords: string[];
    /**
     * Competências do `knowsAbout` da `Person` no JSON-LD. É uma lista própria
     * porque reaproveitar `keywords` dizia que o Pedro entende de "Pedro Levi".
     */
    knowsAbout: string[];
    ogSiteName: string;
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
    /** O h1 da home, em `sr-only`: uma frase verdadeira só, sem lista de termos. */
    heading: string;
    downloadCv: string;
  };
  /** A página de criação de sites. O `h1` é `routes.websites.title`. */
  websites: {
    /**
     * Partes do mesmo parágrafo. São duas porque uma frase única passaria do
     * maior literal do dicionário, e `e2e/bundle.spec.ts` usa esse literal como
     * marcador no HTML de `/info/`.
     */
    intro: string[];
    cta: string;
    servicesTitle: string;
    services: { id: "landing" | "portfolio"; title: string; description: string }[];
    examplesTitle: string;
    openExample: string;
    examples: WebsiteExample[];
    stepsTitle: string;
    steps: { title: string; description: string }[];
    areaTitle: string;
    area: string;
    faqTitle: string;
    faq: { question: string; answer: string }[];
    /** O `serviceType` do JSON-LD. */
    serviceType: string;
  };
  about: {
    title: string;
    facts: Fact[];
    summary: string[];
    metricsTitle: string;
    metrics: Stat[];
    interestsHeading: string;
    interests: Interest[];
  };
  projects: {
    title: string;
    updatedAt: string;
    github: string;
    problemLabel: string;
    solutionLabel: string;
    highlightLabel: string;
    backToProjects: string;
    learningsTitle: string;
    previous: string;
    next: string;
    demoLabel: string;
    websitesCta: string;
    categories: Record<ProjectCategory, string>;
    featured: FeaturedProject[];
  };
  clients: {
    title: string;
    projectKind: string;
    responsibilitiesLabel: string;
    previewAlt: string;
    websitesCta: string;
    projects: ClientProject[];
  };
  process: {
    title: string;
    description: string;
    steps: { title: string; description: string }[];
  };
  career: {
    title: string;
    description: string;
    learningsTitle: string;
    chapters: TimelineChapter[];
  };
  skills: {
    title: string;
    description: string;
    blocks: SkillBlock[];
  };
  contact: {
    title: string;
    description: string;
    hiringTitle: string;
    hiringDescription: string;
    hiringCta: string;
    projectTitle: string;
    projectDescription: string;
    projectCta: string;
    websitesCta: string;
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

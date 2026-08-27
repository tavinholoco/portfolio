import { projectMetas } from "@/data/projects";
import { dictionaries, type Locale } from "@/i18n";
import { pathFor } from "@/lib/routes";
import type { ShowcaseItem } from "./types";

/**
 * Projetos próprios como itens do showcase.
 *
 * A ordem é a de `projectMetas`, que é curadoria, não cronologia: a numeração
 * 01 a 04 segue essa ordem e o ano é apenas mais uma coluna (regra 11).
 *
 * Destino interno, para a página de case (regra 10). Um slug do dicionário sem
 * metadado curado é ignorado em vez de gerar linha quebrada, e o teste de
 * paridade em `src/i18n/index.test.ts` já garante que isso não aconteça.
 */
export function projectShowcaseItems(lang: Locale): ShowcaseItem[] {
  const d = dictionaries[lang];

  return projectMetas.flatMap((meta) => {
    const project = d.projects.featured.find((p) => p.slug === meta.slug);
    if (!project) return [];

    return [
      {
        slug: meta.slug,
        title: project.title,
        problem: project.problem,
        stack: project.stack,
        category: d.projects.categories[project.category],
        year: meta.year,
        image: meta.image,
        /* O `category` do item já é o rótulo traduzido; a chave crua só existe
           aqui, e é ela que diz se a print é de celular. */
        imageKind: project.category === "mobile" ? "phone" : "browser",
        href: `${pathFor("projects", lang)}${meta.slug}/`,
      },
    ];
  });
}

/**
 * Trabalhos de cliente como itens do showcase.
 *
 * Destino externo, para o site do cliente (regra 10): não existe página de case
 * interna para eles, e mandar o recrutador para o trabalho no ar é mais forte
 * do que uma descrição. O `slug` sai do host da URL, que é estável e único.
 */
export function clientShowcaseItems(lang: Locale): ShowcaseItem[] {
  const d = dictionaries[lang];

  return d.clients.projects.map((project) => ({
    slug: slugFromUrl(project.url, project.name),
    title: project.name,
    problem: project.description,
    stack: project.stack,
    responsibilities: project.responsibilities,
    category: d.clients.projectKind,
    year: project.year,
    image: project.image,
    href: project.url,
    external: true,
  }));
}

/** Chave estável de lista a partir da URL, com o nome como rede de segurança. */
function slugFromUrl(url: string, fallback: string): string {
  try {
    return new URL(url).host;
  } catch {
    return fallback.toLowerCase().replace(/\s+/g, "-");
  }
}

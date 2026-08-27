import { projectMetas } from "@/data/projects";
import { dictionaries, type Locale } from "@/i18n";
import { pathFor } from "@/lib/routes";
import type { PalettePreset } from "@/components/background/background-config";
import type { ShowcaseItem } from "./types";

/**
 * Paleta por posição na lista.
 *
 * Percorrer a lista muda o humor do fundo, e presets distintos por item é o que
 * faz isso ser perceptível. Cicla se um dia houver mais itens que paletas.
 */
const PROJECT_PALETTES: PalettePreset[] = ["cobalt", "ember", "moss", "sand"];
const CLIENT_PALETTES: PalettePreset[] = ["plum", "cobalt", "ember"];

/**
 * Paleta de um projeto pelo slug.
 *
 * Existe para a página individual do case usar a mesma cor que a linha dele na
 * lista: sair da lista e entrar no case não deve mudar o humor do fundo.
 */
export function paletteForSlug(slug: string): PalettePreset {
  const index = projectMetas.findIndex((meta) => meta.slug === slug);
  if (index < 0) return PROJECT_PALETTES[0];
  return PROJECT_PALETTES[index % PROJECT_PALETTES.length];
}

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

  return projectMetas.flatMap((meta, index) => {
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
        palette: PROJECT_PALETTES[index % PROJECT_PALETTES.length],
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

  return d.clients.projects.map((project, index) => ({
    slug: slugFromUrl(project.url, project.name),
    title: project.name,
    problem: project.description,
    stack: project.stack,
    category: d.clients.projectKind,
    year: project.year,
    image: project.image,
    href: project.url,
    external: true,
    palette: CLIENT_PALETTES[index % CLIENT_PALETTES.length],
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

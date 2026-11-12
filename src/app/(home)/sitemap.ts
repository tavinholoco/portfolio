import type { MetadataRoute } from "next";

import { projectMetas } from "@/data/projects";
import { getSiteUrl, languageUrlsFor, languageUrlsForRoute } from "@/lib/metadata";
import { pathFor, routes } from "@/lib/routes";

const siteUrl = getSiteUrl();

/* O export estático (`output: "export"`) exige que rota de metadado declare
   que é estática; sem isto o build para. */
export const dynamic = "force-static";

/**
 * O sitemap deriva do manifesto de rotas, então acrescentar uma rota lá já a
 * coloca aqui, nos dois idiomas e com o hreflang certo.
 *
 * O arquivo continua dentro do route group `(home)` de propósito: a v2
 * registrou que nesta versão do Next o `robots.ts` precisa ficar fora do group
 * e o `sitemap.ts` dentro. A assimetria não é descuido, e "arrumar" ela quebra
 * a geração (F15).
 *
 * **Só URL e hreflang.** O Google ignora `priority` e `changefreq`, e ignora
 * o `lastmod` quando todas as datas mudam juntas. O daqui era a data do
 * build, que muda toda segunda com o rebuild semanal: dizia que as 20 páginas
 * mudaram na mesma hora, toda semana. Sem data nenhuma é mais honesto do que
 * uma data que não quer dizer nada.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const alternates = { languages: languageUrlsForRoute(route.id) };
    entries.push(
      { url: `${siteUrl}${route.pt}`, alternates },
      { url: `${siteUrl}${route.en}`, alternates }
    );
  }

  for (const meta of projectMetas) {
    const alternates = { languages: languageUrlsFor(meta.slug) };
    entries.push(
      { url: `${siteUrl}${pathFor("projects", "pt")}${meta.slug}/`, alternates },
      { url: `${siteUrl}${pathFor("projects", "en")}${meta.slug}/`, alternates }
    );
  }

  return entries;
}

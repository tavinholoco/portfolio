import type { Locale } from "@/i18n";

/**
 * Manifesto de rotas: fonte única de verdade da v3.
 *
 * Existem dois root layouts, um por idioma, então a árvore de rotas é duplicada
 * em disco (`(home)/clientes/` e `en/clients/`). O risco disso é divergência,
 * não performance. Deste arquivo derivam a nav do header, translatedPath(),
 * o sitemap, o hreflang e o `alternates` de cada generateMetadata, de modo que
 * adicionar uma rota seja uma linha só.
 *
 * Todos os paths terminam em barra porque `trailingSlash: true` está ligado em
 * next.config.ts, e canonical, sitemap e hreflang precisam bater com a URL real.
 */
export const routes = [
  { id: "home", pt: "/", en: "/en/", navPt: "Home", navEn: "Home" },
  {
    id: "clients",
    pt: "/clientes/",
    en: "/en/clients/",
    navPt: "Clientes",
    navEn: "Clients",
  },
  {
    id: "projects",
    pt: "/projetos/",
    en: "/en/projects/",
    navPt: "Projetos",
    navEn: "Projects",
  },
  { id: "info", pt: "/info/", en: "/en/info/", navPt: "Info", navEn: "Info" },
  {
    id: "contact",
    pt: "/contato/",
    en: "/en/contact/",
    navPt: "Contato",
    navEn: "Contact",
  },
] as const;

export type Route = (typeof routes)[number];
export type RouteId = Route["id"];

/** Ids na ordem da navegação: Home, Clientes, Projetos, Info, Contato. */
export const routeIds: readonly RouteId[] = routes.map((route) => route.id);

function findRoute(id: RouteId): Route {
  const route = routes.find((candidate) => candidate.id === id);
  /* Impossível pelo tipo, mas o find do TS devolve `| undefined`. */
  if (!route) throw new Error(`Rota desconhecida: ${id}`);
  return route;
}

/** Path da rota no idioma pedido, sempre com barra final. */
export function pathFor(id: RouteId, lang: Locale): string {
  const route = findRoute(id);
  return lang === "pt" ? route.pt : route.en;
}

/** Rótulo de navegação da rota no idioma pedido. */
export function navLabelFor(id: RouteId, lang: Locale): string {
  const route = findRoute(id);
  return lang === "pt" ? route.navPt : route.navEn;
}

/** Um item de navegação já resolvido para um idioma. */
export type NavRoute = { id: RouteId; href: string; label: string };

/** A nav inteira já montada, na ordem do manifesto. */
export function navRoutes(lang: Locale): NavRoute[] {
  return routes.map((route) => ({
    id: route.id,
    href: pathFor(route.id, lang),
    label: navLabelFor(route.id, lang),
  }));
}

/**
 * Normaliza um pathname para o formato do manifesto: sempre com barra final,
 * porque usePathname() pode devolver `/en` onde o manifesto guarda `/en/`.
 */
export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/**
 * Identifica a rota de um pathname. Devolve null em rotas que não estão no
 * manifesto, como as páginas individuais de projeto (`/projetos/[slug]/`).
 */
export function routeIdFromPath(pathname: string): RouteId | null {
  const path = normalizePath(pathname);
  const route = routes.find(
    (candidate) => candidate.pt === path || candidate.en === path
  );
  return route ? route.id : null;
}

/**
 * Rota a destacar na navegação.
 *
 * Diferente de `routeIdFromPath`, casa também sub-rotas: em
 * `/projetos/newra-news/` o item "Projetos" continua ativo, que é o que a
 * pessoa espera ver. O casamento mais longo vence, senão `/en/` reivindicaria
 * tudo que vive sob o inglês.
 */
export function activeRouteId(pathname: string): RouteId | null {
  const path = normalizePath(pathname);

  const exact = routeIdFromPath(path);
  if (exact) return exact;

  let best: RouteId | null = null;
  let bestLength = 0;

  for (const route of routes) {
    for (const candidate of [route.pt, route.en]) {
      /* A home é prefixo de todo caminho, então só casa exatamente. */
      if (candidate === "/") continue;
      if (path.startsWith(candidate) && candidate.length > bestLength) {
        best = route.id;
        bestLength = candidate.length;
      }
    }
  }

  return best;
}

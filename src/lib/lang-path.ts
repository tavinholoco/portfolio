import type { Locale } from "@/i18n";
import { normalizePath, pathFor, routeIdFromPath } from "@/lib/routes";

/**
 * Retorna a rota correspondente no outro idioma, preservando o contexto.
 *
 * `lang` é o idioma **atual** da página, não o de destino: `translatedPath("/", "pt")`
 * devolve `/en/`. É o que o botão de troca de idioma precisa.
 *
 * Deriva tudo do manifesto de rotas, então acrescentar uma rota lá faz o botão
 * passar a funcionar nela sem tocar neste arquivo. As páginas de projeto não
 * estão no manifesto (o slug é dado), e por isso são tratadas trocando o
 * prefixo da rota de projetos.
 */
export function translatedPath(pathname: string, lang: Locale): string {
  const target: Locale = lang === "pt" ? "en" : "pt";
  const path = normalizePath(pathname);

  const id = routeIdFromPath(path);
  if (id) return pathFor(id, target);

  const from = pathFor("projects", lang);
  const to = pathFor("projects", target);
  if (path.startsWith(from)) return `${to}${path.slice(from.length)}`;

  /* Rota desconhecida: a home do idioma de destino é o destino seguro. */
  return pathFor("home", target);
}

import type { Locale } from "@/i18n";

/**
 * Retorna a rota correspondente no outro idioma, preservando o contexto:
 * `/` → `/en/` e `/projetos/[slug]/` → `/en/projects/[slug]/` (e o inverso).
 * Rotas desconhecidas caem na home do idioma de destino.
 */
export function translatedPath(pathname: string, lang: Locale): string {
  if (lang === "en") {
    if (pathname === "/en" || pathname === "/en/") return "/";
    if (pathname.startsWith("/en/projects/")) {
      return `/projetos${pathname.slice("/en/projects".length)}`;
    }
    return "/";
  }

  if (pathname === "/") return "/en/";
  if (pathname.startsWith("/projetos/")) {
    return `/en/projects${pathname.slice("/projetos".length)}`;
  }
  return "/en/";
}

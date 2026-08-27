"use client";

import { useEffect } from "react";

import {
  getActiveBackground,
  type PalettePreset,
} from "./background-config";

/**
 * Define a paleta do fundo para a rota atual.
 *
 * Existe porque o `<SiteShell>` vive nos root layouts e não sabe em que rota
 * está. Um componente que só dispara um efeito resolve isso sem precisar de
 * contexto nem de prop atravessando a árvore inteira.
 *
 * Não renderiza nada, e fala com o motor pelo singleton, não por estado do
 * React: trocar a paleta não deve re-renderizar página nenhuma.
 *
 * ⚠️ Não use nas rotas com showcase. Lá quem manda na paleta é o item ativo da
 * lista, e os dois efeitos brigariam pelo mesmo uniform.
 */
export function BackgroundPalette({ preset }: { preset: PalettePreset }) {
  useEffect(() => {
    getActiveBackground()?.setPalette(preset);
  }, [preset]);

  return null;
}

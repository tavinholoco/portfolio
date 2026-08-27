import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  palettes,
  palettesLight,
} from "@/components/background/background-config";

/**
 * Os ativos de marca que vivem FORA do site: ícone de aba e imagem de link.
 *
 * Existem porque eles envelhecem em silêncio. O `icon.svg`, o `favicon.ico` e as
 * duas imagens de OG ficaram no verde-água `#2dd4bf` da v2 por três versões
 * inteiras depois de a cor sair do site, e ninguém percebeu: ícone de aba não
 * aparece em captura, não aparece em teste de DOM e não aparece em Lighthouse.
 * Quem viu foi o Pedro, olhando a aba do navegador.
 *
 * A regra é simples: todo hexadecimal nesses arquivos tem que sair da paleta do
 * site. Uma cor nova exige um voto consciente aqui.
 */

/** Tokens de shell de `globals.css` que os ativos podem usar. */
const SHELL = [
  "#0b0b0c" /* --c-bg escuro */,
  "#f0f0f0" /* --c-bg claro */,
  "#fafafa" /* --c-ink escuro */,
  "#0d0d0d" /* --c-ink claro */,
  "#9a9a9e" /* --muted-foreground escuro */,
  "#666668" /* --muted-foreground claro */,
];

const PERMITIDAS = new Set(
  [
    ...SHELL,
    ...Object.values(palettes).flat(),
    ...Object.values(palettesLight).flat(),
  ].map((c) => c.toLowerCase())
);

const ARQUIVOS = [
  "src/app/icon.svg",
  "src/app/(home)/opengraph-image.tsx",
  "src/app/en/opengraph-image.tsx",
];

describe("ativos de marca fora do site", () => {
  for (const arquivo of ARQUIVOS) {
    it(`${arquivo} só usa cores da paleta do site`, () => {
      const fonte = readFileSync(arquivo, "utf8");
      const hexes = fonte.match(/#[0-9a-fA-F]{6}\b/g) ?? [];

      const estranhas = [...new Set(hexes.map((h) => h.toLowerCase()))].filter(
        (h) => !PERMITIDAS.has(h)
      );

      expect(
        estranhas,
        `cor fora da paleta: ${estranhas.join(", ")}`
      ).toEqual([]);
    });
  }

  it("o favicon.ico existe e é um ícone de verdade", () => {
    const ico = readFileSync("src/app/favicon.ico");
    /* Cabeçalho ICONDIR: reservado 0, tipo 1, e pelo menos um tamanho. */
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBeGreaterThan(0);
  });
});

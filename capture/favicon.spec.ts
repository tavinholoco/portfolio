import { readFileSync, writeFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

/**
 * Gera o `favicon.ico` a partir do `icon.svg`, para os dois não divergirem.
 *
 * Existe porque eles divergiram: o `icon.svg` e o `.ico` ficaram no verde-água
 * `#2dd4bf` da v2 muito depois de a cor sair do site inteiro, e ninguém vê,
 * porque ícone de aba não aparece em captura nem em teste de DOM.
 *
 * O `.ico` carrega PNG dentro, que é suportado por tudo que importa desde o
 * IE11, em vez do BMP do formato original. As bordas arredondadas do SVG viram
 * canto transparente, que é o comportamento certo.
 *
 * Rode com `pnpm favicon`, e só quando o `icon.svg` mudar.
 */

const TAMANHOS = [16, 32, 48, 64, 128, 256];
const SVG = "src/app/icon.svg";
const ICO = "src/app/favicon.ico";

/** Monta o container ICO em volta dos PNGs já renderizados. */
function montarIco(imagens: { size: number; png: Buffer }[]): Buffer {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0); /* reservado */
  cabecalho.writeUInt16LE(1, 2); /* 1 = ícone */
  cabecalho.writeUInt16LE(imagens.length, 4);

  const entradas: Buffer[] = [];
  let offset = 6 + imagens.length * 16;

  for (const { size, png } of imagens) {
    const e = Buffer.alloc(16);
    /* 0 significa 256 no formato: o byte não comporta o valor. */
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); /* paleta */
    e.writeUInt8(0, 3); /* reservado */
    e.writeUInt16LE(1, 4); /* planos */
    e.writeUInt16LE(32, 6); /* bits por pixel */
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    entradas.push(e);
    offset += png.length;
  }

  return Buffer.concat([
    cabecalho,
    ...entradas,
    ...imagens.map((i) => i.png),
  ]);
}

test("o favicon.ico acompanha o icon.svg", async ({ page }) => {
  const svg = readFileSync(SVG, "utf8");

  const imagens: { size: number; png: Buffer }[] = [];
  for (const size of TAMANHOS) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
    );
    imagens.push({
      size,
      png: await page.locator("svg").screenshot({ omitBackground: true }),
    });
  }

  const ico = montarIco(imagens);
  writeFileSync(ICO, ico);

  /* Sanidade: cabeçalho de ícone, com uma entrada por tamanho. */
  expect(ico.readUInt16LE(2)).toBe(1);
  expect(ico.readUInt16LE(4)).toBe(TAMANHOS.length);
  console.log(`favicon.ico regravado: ${TAMANHOS.length} tamanhos, ${ico.length} bytes`);
});

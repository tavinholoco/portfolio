import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * O teto de peso das imagens versionadas.
 *
 * **Esta guarda só existe porque o otimizador saiu do caminho.** Enquanto o
 * `/_next/image` estava ligado, um arquivo grande demais era aparado antes de
 * chegar ao navegador, e o único custo de errar o tamanho era cota. Com
 * `images.unoptimized` (§15.7), o arquivo que está no repositório é
 * exatamente o que a pessoa baixa: um preview exportado sem querer em 4000px
 * passaria no build, passaria no E2E, apareceria certinho na tela e cobraria
 * megabytes de quem abrisse o site pelo celular.
 *
 * Nada acusaria. Nem o TypeScript, nem o lint, nem a captura, nem o Lighthouse
 * rodado no desktop de quem fez a mudança.
 *
 * Os limites são generosos de propósito, com folga sobre o estado atual: não é
 * teste de regressão de bytes, é rede contra ordem de grandeza errada.
 */
const RAIZ = "src/assets";

/** Teto por arquivo. O maior hoje é `newra-news.webp`, com cerca de 48 KB. */
const TETO_KB = 80;

/** Teto da soma. Hoje são cerca de 132 KB nas cinco imagens. */
const TETO_TOTAL_KB = 200;

/** Extensões que o pipeline de assets aceita. JPEG e PNG entram como origem. */
const PERMITIDAS = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

function imagens(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) return imagens(caminho);
    return PERMITIDAS.some((ext) => entrada.name.toLowerCase().endsWith(ext))
      ? [caminho]
      : [];
  });
}

/**
 * Largura em pixels, lida do cabeçalho do arquivo.
 *
 * Sem dependência de processamento de imagem, que é a mesma regra que o
 * `pnpm capture` segue ao converter pelo canvas do Chromium. São só os dois
 * formatos que o projeto versiona hoje, e o teste falha alto se aparecer um
 * terceiro, em vez de devolver zero calado.
 */
function largura(caminho: string): number {
  const b = readFileSync(caminho);

  /* WebP: contêiner RIFF, e a largura depende do formato do bitstream. */
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const tipo = b.toString("ascii", 12, 16);
    /* VP8X: canvas de 24 bits, menos um, a partir do byte 24. */
    if (tipo === "VP8X") return ((b[24] | (b[25] << 8) | (b[26] << 16)) & 0xffffff) + 1;
    /* VP8L: 14 bits de largura, menos um, logo depois do byte de assinatura. */
    if (tipo === "VP8L") return (((b[22] | (b[23] << 8)) & 0x3fff) + 1);
    /* VP8 simples: 14 bits, depois do start code de 3 bytes. */
    if (tipo === "VP8 ") return b.readUInt16LE(26) & 0x3fff;
  }

  /* JPEG: percorre os marcadores até um SOF, onde a largura mora. */
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) {
        i++;
        continue;
      }
      const marcador = b[i + 1];
      const ehSOF =
        marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador);
      if (ehSOF) return b.readUInt16BE(i + 7);
      i += 2 + b.readUInt16BE(i + 2);
    }
  }

  throw new Error(`formato não reconhecido para medir largura: ${caminho}`);
}

describe("as imagens versionadas em src/assets", () => {
  const arquivos = imagens(RAIZ);

  it("existem, senão o teste passaria por vacuidade", () => {
    expect(arquivos.length).toBeGreaterThanOrEqual(5);
  });

  it.each(arquivos)("%s cabe no teto por arquivo", (caminho) => {
    const kb = statSync(caminho).size / 1024;
    expect(kb, `${caminho} tem ${kb.toFixed(1)} KB`).toBeLessThanOrEqual(TETO_KB);
  });

  it("a soma cabe no teto total", () => {
    const kb = arquivos.reduce((a, c) => a + statSync(c).size, 0) / 1024;
    expect(kb, `as imagens somam ${kb.toFixed(1)} KB`).toBeLessThanOrEqual(
      TETO_TOTAL_KB
    );
  });

  /*
   * A largura importa por si, além do peso: um arquivo enorme mas muito
   * comprimido passaria no teto de KB e ainda assim faria o navegador
   * decodificar e reescalar pixel que ninguém vê, que é custo de CPU e de
   * memória no celular, não de rede.
   *
   * 1000px é a largura de `LARGURA_MAXIMA` em `capture/previews.spec.ts`, e
   * cobre densidade 2 nos cerca de 500px que a prévia ocupa. O avatar tem
   * 320px, o dobro dos 160 em que aparece. O teto único de 1000 vale para os
   * dois, porque é o maior legítimo do projeto.
   */
  it.each(arquivos)("%s não é mais largo que o que a tela usa", (caminho) => {
    const px = largura(caminho);
    expect(px, `${caminho} tem ${px}px de largura`).toBeLessThanOrEqual(1000);
    expect(px, `${caminho} mediu ${px}px, o que indica leitura errada`).toBeGreaterThan(
      100
    );
  });
});

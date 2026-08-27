import { mkdirSync, writeFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

/**
 * Gera os previews do showcase (`pnpm capture`).
 *
 * Roda sob demanda, **nunca no CI**: depende de sites de terceiros estarem no
 * ar, e um pipeline que quebra porque a Vercel de outra pessoa oscilou não
 * serve para nada.
 *
 * Duas origens, porque nem todo projeto tem página web:
 *
 * - **sites**: captura o topo da página publicada, em 16:10.
 * - **imagens**: baixa uma imagem que já existe. É o caso do Repertório
 *   Progressivo, que é app React Native: a imagem vem das prints da V2 no
 *   próprio repositório, e o preview a trata como tela de celular.
 *
 * As duas terminam em WebP versionado em `public/projects/<slug>.webp`. Depois
 * de rodar, aponte `image` em `src/data/projects.ts` (ou no dicionário, para
 * clientes) para o arquivo gerado. Nenhum componente muda.
 */

const sites = [
  { slug: "newra-news", url: "https://newra-news-web.vercel.app" },
  { slug: "trak-assessoria", url: "https://trak-acessoria.vercel.app" },
  { slug: "dandarkness", url: "https://dandarkness.vercel.app" },
] as const;

const imagens = [
  {
    slug: "repertorio-progressivo",
    url: "https://raw.githubusercontent.com/tavinholoco/repertorio-progressivo/HEAD/docs/screenshots/V2/Aproveitamento-anual.png",
  },
] as const;

/** Largura máxima da imagem versionada. O slot do preview tem cerca de 450px. */
const LARGURA_MAXIMA = 1440;

/** Espera fixa para animações de entrada assentarem depois do networkidle. */
const ASSENTAR_MS = 2500;

/**
 * Converte para WebP usando o próprio Chromium.
 *
 * A captura sai em 2880x1800 por causa do `deviceScaleFactor: 2`, o que dá de
 * 1.5 a 3 MB por arquivo, pesado demais para versionar. O canvas do navegador
 * reduz e recodifica sem acrescentar dependência de processamento de imagem ao
 * projeto.
 *
 * Nunca aumenta: uma print de celular tem 385px de largura, e esticar até 1440
 * só produziria borrão e peso.
 */
async function paraWebp(
  page: Page,
  origem: Buffer,
  destino: string
): Promise<number> {
  const base64 = await page.evaluate(
    async ([dados, maxima]) => {
      const img = new Image();
      img.src = `data:image/png;base64,${dados}`;
      await img.decode();

      const largura = Math.min(img.naturalWidth, maxima as number);
      const escala = largura / img.naturalWidth;

      const canvas = document.createElement("canvas");
      canvas.width = largura;
      canvas.height = Math.round(img.naturalHeight * escala);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/webp", 0.82).split(",")[1];
    },
    [origem.toString("base64"), LARGURA_MAXIMA] as const
  );

  const buffer = Buffer.from(base64, "base64");
  mkdirSync("public/projects", { recursive: true });
  writeFileSync(destino, buffer);
  return buffer.length;
}

/** Um WebP fora desta faixa significa que a conversão não rodou como deveria. */
function esperaTamanhoSao(bytes: number) {
  expect(bytes).toBeGreaterThan(1000);
  expect(bytes).toBeLessThan(400_000);
}

test.describe.configure({ mode: "serial" });

for (const alvo of sites) {
  test(`captura o site de ${alvo.slug}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      /* Os três sites são escuros por padrão, e o preview vive no showcase,
         que também é escuro na maior parte do tempo. */
      colorScheme: "dark",
    });

    try {
      const page = await context.newPage();
      const resposta = await page.goto(alvo.url, {
        waitUntil: "networkidle",
        timeout: 45_000,
      });
      expect(
        resposta?.ok(),
        `${alvo.url} não respondeu 200, a captura seria de uma página de erro`
      ).toBe(true);

      /* Esconde o que não deve entrar na imagem. */
      await page.addStyleTag({
        content: `
          [id*="cookie" i], [class*="cookie" i],
          [id*="consent" i], [class*="consent" i],
          [data-nextjs-toast], nextjs-portal { display: none !important; }
        `,
      });
      await page.waitForTimeout(ASSENTAR_MS);

      /* Só a dobra: o preview mostra o topo da página em 16:10. */
      const png = await page.screenshot({
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });

      /* A conversão roda numa página em branco, para o canvas não herdar
         estilo nem script do site capturado. */
      const conversor = await context.newPage();
      esperaTamanhoSao(
        await paraWebp(conversor, png, `public/projects/${alvo.slug}.webp`)
      );
    } finally {
      await context.close();
    }
  });
}

for (const alvo of imagens) {
  test(`converte a imagem de ${alvo.slug}`, async ({ browser, request }) => {
    const resposta = await request.get(alvo.url);
    expect(resposta.ok(), `${alvo.url} não respondeu 200`).toBe(true);

    const context = await browser.newContext();
    try {
      const conversor = await context.newPage();
      esperaTamanhoSao(
        await paraWebp(
          conversor,
          await resposta.body(),
          `public/projects/${alvo.slug}.webp`
        )
      );
    } finally {
      await context.close();
    }
  });
}

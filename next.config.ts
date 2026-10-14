import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Export estático: o `next build` grava o site inteiro em `out/`, e a
   * Cloudflare serve essa pasta como assets de um Worker (`wrangler.jsonc`),
   * sem servidor do Next. É a §17.3 do plano: o site já era estático (nenhuma
   * rota lê a requisição, `dynamicParams = false` nos cases, imagens sem
   * otimizador), e asset estático na Cloudflare é grátis e ilimitado.
   *
   * O que isso troca, e onde cada coisa passou a morar:
   * - Cabeçalhos (o `immutable` de `_next/static`, o tipo da imagem de link)
   *   e reescritas não vêm mais do Next: vivem em `public/_headers` e
   *   `public/_redirects`, que o export copia para `out/`.
   * - O ISR das páginas de case some: o dado do GitHub é o do build, e o
   *   build roda toda semana (`.github/workflows/rebuild-semanal.yml`).
   * - O `pnpm start` passa a ser o `wrangler dev` servindo `out/`.
   */
  output: "export",
  // URLs estáveis com barra final (ex.: /en/), consistente com canonical e sitemap.
  trailingSlash: true,
  images: {
    /*
     * Sem o otimizador da Vercel, e isto não é economia de configuração: é
     * consequência de um incidente medido.
     *
     * O otimizador da Vercel tem cota. Quando as imagens saíram de `public/`
     * para import, a URL passou a carregar hash, e **toda transformação em
     * cache foi invalidada de uma vez**, para cada largura e cada formato das
     * cinco imagens. Isso esgotou a cota da conta, e o avatar de `/info/`
     * passou a responder `402 Payment Required`
     * (`X-Vercel-Error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`) em
     * produção. Variantes já transformadas continuavam servindo, as novas não:
     * o avatar precisava de `w=256`, que nunca chegou a existir.
     *
     * A troca de tamanho é o que torna isto barato. As cinco imagens são do
     * projeto e aparecem em tamanho conhecido e fixo, então a origem foi
     * reduzida para o que a tela usa (prévia de 1440 para 1000 de largura,
     * avatar de 460 para 320). O otimizador deixou de ter o que fazer, e o que
     * ele fazia de graça (AVIF e variantes por largura) não paga depender de
     * cota para o site não quebrar.
     *
     * O cache continua igual ao da §15: os arquivos são importados, ganham
     * hash e vêm com `immutable`. O que sai do caminho é só o `/_next/image`.
     */
    unoptimized: true,
  },
};

export default nextConfig;

import type { StaticImageData } from "next/image";

import newraNews from "@/assets/projects/newra-news.webp";
import repertorioProgressivo from "@/assets/projects/repertorio-progressivo.webp";
import trakAssessoria from "@/assets/projects/trak-assessoria.webp";

/**
 * Metadados neutros dos projetos em destaque (não dependem do idioma).
 * Textos traduzíveis (tagline, problema, solução, destaque, stack) ficam
 * nos dicionários em `src/i18n/`; aqui só slug + repo + demoUrl
 * (decisão 5 do plano v2).
 */

/** Categorias possíveis dos projetos em destaque. */
export type ProjectCategory = "fullstack" | "mobile" | "landing";

/** Metadados neutros de um projeto em destaque. */
export type ProjectMeta = {
  /** Slug da página individual (/projetos/[slug]) e chave de ligação com o dicionário. */
  slug: string;
  /** Nome do repositório no GitHub (pode ter maiúsculas, ex.: NetsheetEngine). */
  repo: string;
  /** Link público do projeto (demo), quando existe. */
  demoUrl?: string;
  /**
   * Ano de entrega, exibido como coluna na lista do showcase.
   *
   * Não vem do GitHub de propósito: a API devolve a data do último commit, que
   * muda quando se corrige um typo e não diz nada sobre quando o projeto foi
   * feito.
   */
  year: string;
  /**
   * Screenshot do preview do showcase, quando existe.
   *
   * Ausente cai no mockup de janela em CSS (seção 4.4 do plano), que é o
   * placeholder oficial. Depois de rodar a captura, importar o arquivo de
   * `@/assets/projects/<slug>.webp` e preencher aqui é a única mudança
   * necessária: nenhum componente muda.
   *
   * É import, e não caminho em string, de propósito. Arquivo em `public/` é
   * servido pela URL literal e não tem como ser versionado por conteúdo, então
   * a Vercel o entrega com `max-age=0, must-revalidate` e o navegador
   * revalida na rede a cada visita. Importado, ele vira
   * `/_next/static/media/<hash>.webp` e ganha `immutable`.
   */
  image?: StaticImageData;
};

/**
 * Curadoria dos projetos em destaque.
 *
 * A ordem desta lista é a numeração do showcase (01 a 04). É curadoria, não
 * cronologia: o ano é apenas mais uma coluna da linha (regra 11 da seção 3.1).
 */
export const projectMetas: ProjectMeta[] = [
  {
    slug: "newra-news",
    repo: "newra-news",
    demoUrl: "https://newra-news-web.vercel.app",
    year: "2026",
    image: newraNews,
  },
  {
    slug: "netsheet-engine",
    repo: "NetsheetEngine",
    year: "2026",
    /* Sem deploy público ainda, então o preview cai no mockup em CSS. */
  },
  {
    slug: "repertorio-progressivo",
    repo: "repertorio-progressivo",
    year: "2025",
    /* App React Native: a imagem vem das prints da V2 no próprio repositório,
       e o preview a trata como tela de celular, não como janela de browser. */
    image: repertorioProgressivo,
  },
  {
    slug: "trak-assessoria",
    repo: "Trak-Acessoria",
    /* Estava cadastrado como homepage no GitHub mas faltava aqui (E11). */
    demoUrl: "https://trak-acessoria.vercel.app",
    year: "2026",
    image: trakAssessoria,
  },
];

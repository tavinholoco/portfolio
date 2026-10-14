/**
 * Contorna um bug do Next 16.3 que só existe no Windows (§17.4, item 7).
 *
 * O export grava um arquivo de prefetch por segmento de rota, e o roteador do
 * cliente os pede com o caminho do segmento escrito com pontos:
 * `/projetos/__next.!KGhvbWUp.projetos.__PAGE__.txt`. No Windows o export os
 * grava em pastas, `/projetos/__next.!KGhvbWUp/projetos/__PAGE__.txt`, e cada
 * prefetch responde 404. A navegação continua funcionando (o roteador cai no
 * carregamento normal), mas o console suja e o E2E de movimento reduzido
 * reprova.
 *
 * A causa está em `node_modules/next/dist/export/index.js`:
 * `collectSegmentPaths` monta o caminho com `path.relative`, que no Windows
 * devolve barra invertida, e `convertSegmentPathToStaticExportFilename` só
 * troca a barra normal por ponto. No Linux, onde a Cloudflare e o CI buildam,
 * o nome sai certo e este script não faz nada.
 *
 * O conserto é o que o Next faria com a barra certa: cada pasta `__next.X`
 * vira arquivos irmãos `__next.X.<caminho com pontos>`. Quando o Next corrigir
 * o bug, as pastas deixam de existir e o script passa a não achar nada.
 */
import { existsSync } from "node:fs";
import { readdir, rename, rm } from "node:fs/promises";
import { join, relative, sep } from "node:path";

if (process.platform !== "win32") process.exit(0);

const OUT = "out";
const PREFIXO = "__next.";

/** Todos os arquivos abaixo de `dir`, em caminho relativo a ele. */
async function arquivosDentro(dir, base = dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  const listas = await Promise.all(
    entradas.map((e) => {
      const caminho = join(dir, e.name);
      return e.isDirectory()
        ? arquivosDentro(caminho, base)
        : [relative(base, caminho)];
    })
  );
  return listas.flat();
}

/** Pastas `__next.*` em qualquer nível de `out/`. Não desce nelas. */
async function pastasDeSegmento(dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  const achadas = [];
  for (const e of entradas) {
    if (!e.isDirectory()) continue;
    const caminho = join(dir, e.name);
    if (e.name.startsWith(PREFIXO)) achadas.push(caminho);
    else achadas.push(...(await pastasDeSegmento(caminho)));
  }
  return achadas;
}

if (!existsSync(OUT)) {
  console.error(`achata-prefetch-windows: a pasta ${OUT}/ não existe.`);
  process.exit(1);
}

let movidos = 0;
for (const pasta of await pastasDeSegmento(OUT)) {
  for (const rel of await arquivosDentro(pasta)) {
    const destino = `${pasta}.${rel.split(sep).join(".")}`;
    if (existsSync(destino)) {
      console.error(`achata-prefetch-windows: ${destino} já existe.`);
      process.exit(1);
    }
    await rename(join(pasta, rel), destino);
    movidos++;
  }
  await rm(pasta, { recursive: true });
}

console.log(
  `achata-prefetch-windows: ${movidos} arquivos de prefetch renomeados (bug do Next no Windows, §17.4).`
);

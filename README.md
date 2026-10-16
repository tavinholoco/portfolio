# 🚀 Portfólio · Pedro Levi

Portfólio minimalista com fundo WebGL próprio, tipografia fluida e navegação em 5 rotas por idioma. O texto branco das seções usa `mix-blend-mode: difference` e inverte contra o que estiver embaixo, então o contraste sai de graça sem escurecer o fundo.

**Versão atual: V3.5.** Identidade fixa no canto esquerdo (nome, cargo e nav vertical), home reduzida ao campo de ondas, e uma paleta só no site inteiro. O fundo é um campo procedural de ondas de praia: sol que anda sozinho, nuvens em perspectiva, mar com espuma de crista, e a onda se desfazendo na areia em renda de espuma, com a areia molhada secando depois. Tudo por pixel e por frame, **sem nenhum vídeo ou GIF envolvido**, e no tema claro com a paleta "praia" (§16 do plano).

Na primeira visita da sessão há uma abertura: cortina preta, as letras do nome sobem uma a uma, e o nome desliza e encolhe até o lugar dele no canto enquanto a cortina se dissolve (§16.9). Custa 1 KB de JS e não mexeu na nota do Lighthouse; clique, tecla ou rolagem a encerram, e com movimento reduzido ela não aparece.

**Live:** [pedrolevi.com.br](https://pedrolevi.com.br)

> 🚚 **Migrado para a Cloudflare em 14/10/2026, pela §17 do plano:** export estático servido por Workers Static Assets, no domínio próprio. Desde a fase E, o `pedrolevi.vercel.app` responde 308 para o mesmo caminho no domínio. Os números de Lighthouse abaixo são os do domínio, medidos depois da fase F com o beacon de RUM da zona desligado (§17.15): 100 no mobile e 99 a 100 no desktop, contra 97 a 100 e 99 a 100 na Vercel.

| | Desktop | Mobile |
|---|---|---|
| Performance | 99 | 98 a 99 |
| Acessibilidade, Best Practices e SEO | 100 | 100 |

CLS zero nas 5 rotas. Os dois são **medidos contra a URL de produção**, mediana de 3 rodadas por rota (15/10/2026, no domínio, em HTTP/2): o mesmo build servido localmente (pelo `next start`, antes do export) dava 80 a 94 no mobile, porque não tem CDN, HTTP/2 nem Brotli. Rodada única não serve como medida em nenhum dos dois ambientes.

**192 testes unitários e 166 E2E.** A auditoria responsiva sozinha cobre 6 rotas × 7 larguras (320 a 2560) com 5 asserções cada.

> A referência estrutural foi [p5aholic.me](https://p5aholic.me), **sem reúso de código**: shader, paleta, composição e CSS foram escritos do zero. O plano completo está em [PLANO-V3-PORTFOLIO.md](PLANO-V3-PORTFOLIO.md): a V3 nas seções 0 a 11, a **V3.5 na seção 12** rodada por rodada, o **passe de aperfeiçoamento na seção 13**, a entrada suave na 14, as prévias do showcase e as imagens na 15, e a **evolução do fundo de praia na seção 16**, cuja §16.8 é o ponto de partida do trabalho atual.

> ⚡ **Antes de tentar otimizar performance, leia a §13.3 e a §13.4.** Três hipóteses plausíveis foram medidas e duas pioraram o site (adiar as imagens do showcase e o `experimental.inlineCss`). O gargalo do LCP é `Element render delay`, ou seja, trabalho de main thread na hidratação, e não imagens, CSS ou atributos. Isso já está medido para não ser remedido.
>
> **Antes de mexer no shader ou na montagem do fundo, leia a §16.2 e a §16.5.** O Lighthouse e o PageSpeed rodam sem GPU, então o custo que importa é o do SwiftShader, na CPU, e não o da placa de vídeo. E compilação de shader se mede no `chrome.exe` que o Lighthouse usa: o headless shell do Playwright adia a compilação e mostra um custo de montagem que não existe.

## ✨ Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + TypeScript |
| Estilo | **Tailwind CSS v4**, tema claro/escuro via classe `.dark` |
| Fundo | **OGL** (~20 KB gzip), carregado sob demanda junto com o motor. Campo de ondas de praia em dois passes, teto de 30 fps, paleta única |
| Rolagem | Nativa do navegador. O Lenis saiu na V3.5 |
| Componentes | **Base UI** (Sheet do menu mobile). Não é Radix: a API é `render={<a/>}`, não `asChild` |
| Ícones | **Lucide React** |
| Dados | **GitHub API** em Server Component, buscada no build, com rebuild semanal e fallback estático |
| i18n | Rotas por idioma, 5 de cada: `/` (pt-BR) e `/en/`, com dicionários em `src/i18n/` |
| Deploy | **Export estático** (`output: "export"`) em **Cloudflare Workers Static Assets**, buildado pelo Workers Builds (§17 do plano) |

## ⚠️ A lei de camadas, leia antes de mexer no layout

Esta é a única coisa deste repositório que quebra **em silêncio**. Vale um minuto.

`mix-blend-mode` mistura um elemento com o **backdrop** dele, que é tudo o que foi pintado abaixo **dentro do mesmo contexto de empilhamento**. O canvas do fundo é irmão do `<main>`, com `z-index: -1`.

Portanto: **nenhum ancestral de uma seção `blend` pode criar contexto de empilhamento.** Nem o `<body>`, nem o `<main>`, nem qualquer wrapper entre eles pode ganhar `z-index`, `position` com z, `transform`, `opacity < 1`, `filter`, `isolation` ou `contain: paint`.

Se isso for violado, a mistura fica confinada no ancestral e passa a acontecer contra o fundo dele, que é transparente, nunca contra o canvas. O texto some e **não há erro nenhum no console**.

A montagem correta, em `src/components/shell/site-shell.tsx`:

| Elemento | Posição | z-index | Papel |
|---|---|---|---|
| `<BackgroundCanvas>` | `fixed`, `inset: var(--pad)` | **-1** | Canvas WebGL, recuado, sem eventos de ponteiro |
| `<main>` | **estático, sem z-index** | auto | **Não pode** criar contexto de empilhamento |
| `Section variant="blend"` | em fluxo | auto | `mix-blend-difference`, mistura contra o canvas |
| `Section variant="plain"` | em fluxo | auto | Sem fundo e sem blend: para seção com imagem |
| `<ViewportMask>` | `fixed` | 30 | Cobre as faixas de `var(--pad)` no topo e na base |
| `<Frame>` | `fixed` | 40 | Moldura de 1px, em `difference` |
| `<SiteHeader>` / `<SiteFooter>` | `fixed` | 50 | Em `difference`, acima da máscara. Ambos em `pointer-events-none` |
| `<Intro>` | `fixed`, `inset: 0` | 60 | A cortina da abertura, uma vez por sessão. Só cobre: `pointer-events-none`, irmã do `<main>`, e some no fim |

Cinco detalhes decorrentes, todos descobertos na prática:

1. **O fundo da página vive no `:root`, nunca no `body`.** O fundo do elemento raiz é propagado para o canvas do documento e pintado abaixo de tudo, inclusive do canvas em z negativo. No `body`, ele seria o fundo de um bloco em fluxo e cobriria o canvas.
2. **Nada pode aplicar `transform` em `html`, `body` ou `main`.** Era a lei do Lenis, que saiu na V3.5. Vale para qualquer lib de rolagem suave que se pense em adicionar depois: as que envolvem o conteúdo num wrapper com `transform` matam o blend de todas as seções de uma vez.
3. **Não dê fundo opaco a elemento `sticky`** na mesma página de uma seção `blend`. Sticky cria contexto de empilhamento, e a combinação pinta um retângulo da cor do fundo dentro da seção misturada, a centenas de pixels de distância.
4. **O `<SiteHeader>` é `pointer-events-none`, e cada elemento interativo dentro dele é `pointer-events-auto`.** Ele é `fixed` e de largura cheia, e com a nav vertical passou a ter umas 300px de altura. Sem isso essa faixa rouba clique e hover de todo o conteúdo que passa por baixo, inclusive o hover que troca o preview do showcase.
5. **A coluna da nav se reserva por `--nav-col`, no container do `<Section>`, nunca por padding no `<main>`.** Padding no `<main>` faria o fundo de qualquer seção com cor própria parar antes da faixa e abriria uma tira do canvas na lateral esquerda. Padding é seguro para a lei principal, porque não cria contexto de empilhamento. O token é `0px` abaixo de `lg`, onde a nav vira `Sheet`.

Há teste E2E para tudo isso em `e2e/shell.spec.ts`, inclusive com controle negativo: um caso introduz a quebra de propósito e exige que a auditoria a enxergue.

## 🎨 As duas variantes de seção

```tsx
<Section id="contato" variant="blend">  {/* texto branco, mistura com o canvas */}
<Section id="clientes" variant="plain"> {/* sem fundo e sem blend, o canvas aparece atrás */}
```

**Uma seção só pode ser `blend` se o conteúdo dela herdar a cor.** O `color: #fff` da seção alcança apenas texto que herda: classes como `text-muted-foreground`, `bg-card` e `bg-primary` mantêm a própria cor e cada uma inverte para um lado diferente, produzindo um resultado sujo.

Regra prática: qualquer seção com **imagem, foto ou screenshot** vai em `plain`, senão a imagem aparece em negativo. A `plain` resolve isso sem cobrir o fundo, que era o defeito da antiga `solid`.

### Regra de opacidade em texto

A hierarquia é feita por tamanho e opacidade, e é fácil exagerar. Duas regras, medidas e não estimadas:

1. **Texto nunca abaixo de `opacity-70`.** A 0.7 o contraste passa os 4.5:1 da WCAG AA nos dois temas e também dentro de uma seção `blend`.
2. **Nunca aninhe opacidade em texto.** Uma linha a 60% com um filho a 40% resulta em 24% efetivo. Os dois valores parecem razoáveis lidos separadamente, e é por isso que revisão de código não pega. Há teste que multiplica as opacidades ao longo da árvore.

Opacidade em elemento decorativo (moldura, máscara, ícone `aria-hidden`) não entra nesta regra.

## 🚦 Começando

**Pré-requisitos:** Node.js 22 (`.node-version`) e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Para ver o site sem abrir o navegador (útil em revisão automatizada):

```bash
pnpm build && pnpm look
```

Captura as telas em `.captures/` (ignorada pelo git). Parametrizável por `LOOK_PATHS`, `LOOK_THEMES`, `LOOK_FULL`, `LOOK_SCROLL` e `LOOK_HOVER`. No Git Bash do Windows, prefixe com `MSYS_NO_PATHCONV=1`.

> ⚠️ Se houver servidor na porta 3000 iniciado **antes** do último `pnpm build`, ele continua servindo o build antigo, e tanto a captura quanto os E2E veem o estado velho. Derrube a porta antes.
>
> ⚠️ No Windows, o `pnpm start` (o `wrangler dev`) deixa `workerd.exe` órfão ao ser encerrado, segurando a porta 3000 e a pasta `out/` (o build seguinte falha com `EBUSY`). Mate primeiro o processo `node` do wrangler e depois os `workerd.exe`: na ordem inversa, o wrangler sobe o `workerd` de novo.

## 🗂 Estrutura do projeto

```
├── public/
│   ├── cv/                       # currículo PDF (o único documento aqui: URL estável)
│   ├── _headers                  # cabeçalhos da Cloudflare: immutable, tipo da OG, noindex (lei 22)
│   └── _redirects                # a reescrita da OG com barra para o arquivo do export (lei 22)
├── src/
│   ├── assets/                   # imagens importadas, versionadas por hash (lei 19)
│   │   ├── avatar.webp           # foto do perfil, 320x320 (ver nota abaixo)
│   │   └── projects/             # previews do showcase, 1000px de largura
│   ├── app/
│   │   ├── globals.css           # tokens de shell, escala tipográfica e as leis em comentário
│   │   ├── robots.ts             # fora do route group de propósito (ver nota abaixo)
│   │   ├── (home)/               # árvore do português, com root layout próprio
│   │   │   ├── layout.tsx        # 17 linhas: <RootDocument lang="pt"> + reexporta metadata
│   │   │   ├── page.tsx  clientes/  projetos/  info/  contato/
│   │   │   ├── projetos/[slug]/  # páginas de case
│   │   │   └── sitemap.ts        # dentro do group, também de propósito
│   │   └── en/                   # espelho em inglês, mesma estrutura
│   ├── components/
│   │   ├── background/           # o motor do fundo
│   │   │   ├── renderer.ts       # BackgroundRenderer, sem React: teto de quadros, degraus
│   │   │   │                     #   de qualidade e a montagem fatiada (§16.4 e §16.5)
│   │   │   ├── background-config.ts  # paletas, contraste e a curva do crossfade de tema
│   │   │   ├── background-canvas.tsx # componente cliente, carrega o ogl e o motor no efeito
│   │   │   ├── grain-texture.ts  # buffer puro + wrapper de Texture
│   │   │   └── shaders/          # vertex, campo de ondas e composição, em template literal,
│   │   │                         #   e bake.ts, a textura de ruído assada uma vez na montagem
│   │   ├── shell/                # root-document (o <html> dos dois idiomas), site-shell, frame, viewport-mask
│   │   ├── showcase/             # lista com preview trocando no hover, e a legenda fora da moldura
│   │   ├── pages/                # o conteúdo de cada rota, compartilhado pelos dois idiomas
│   │   ├── process.tsx           # os 5 passos, hoje em /info/
│   │   ├── section-intro.tsx     # título + descrição de seção, usado por career, process e skills
│   │   ├── og-image.tsx          # o desenho da imagem de link, um só para os dois idiomas
│   │   ├── site-header.tsx       # identidade fixa no topo esquerdo + nav vertical
│   │   ├── section.tsx           # Section, com a lei F1 no topo
│   │   └── ui/sheet.tsx          # Base UI, usado pelo menu mobile
│   ├── data/                     # dados neutros (não dependem do idioma)
│   ├── i18n/                     # ⭐ TODOS os textos do site, em pt.ts e en.ts
│   └── lib/
│       ├── routes.ts             # ⭐ manifesto de rotas: nav, sitemap e hreflang derivam daqui
│       ├── github.ts             # fetch da GitHub API no build + fallback
│       ├── metadata.ts           # metadados por rota e por idioma
│       ├── json-ld.ts            # dados estruturados
│       └── utils.ts              # helper cn()
├── e2e/                          # Playwright: shell, showcase, navegação, html lang,
│                                 #   responsivo, marca (ícone + metadados) e bundle
├── capture/                      # `pnpm look`, `pnpm capture`, `pnpm waves` e `pnpm favicon`,
│                                 #   config própria, fora do CI
├── scripts/                      # o conserto pós-build do prefetch no Windows (§17.4)
├── wrangler.jsonc                # o Worker da Cloudflare: só assets, servindo out/
└── PLANO-V3-PORTFOLIO.md         # o plano, as auditorias e as notas de cada fase
```

> **Nota sobre `robots.ts` e `sitemap.ts`:** um fica fora do route group e o outro dentro. A assimetria não é descuido, ela existe por causa desta versão do Next. Não "arrume".

## ✏️ Guia de edição

Todo o conteúdo é editável sem tocar em componentes. **Textos traduzíveis** ficam em `src/i18n/`, **dados neutros** em `src/data/`.

> Todo texto vive em dobro: edite o mesmo campo em `src/i18n/pt.ts` **e** em `src/i18n/en.ts`. Um campo novo em um só arquivo quebra o teste de paridade.

### 1. Acrescentar uma rota

Uma linha em `src/lib/routes.ts`:

```ts
{ id: "blog", pt: "/blog/", en: "/en/blog/", navPt: "Blog", navEn: "Blog" },
```

Dela derivam a nav do header, o `translatedPath`, o sitemap, o hreflang e o `alternates` de cada `generateMetadata`. O TypeScript passa a exigir título e descrição nos dois dicionários, e um teste exige o `page.tsx` nos dois idiomas.

### 2. Acrescentar um projeto ao showcase

Dois lugares, nesta ordem:

```ts
// src/data/projects.ts  (metadado neutro; a ordem daqui é a numeração 01..04)
import meuProjeto from "@/assets/projects/meu-projeto.webp";  // import, nunca string

{ slug: "meu-projeto", repo: "MeuProjeto", year: "2026",
  demoUrl: "https://…", image: meuProjeto },
```

```ts
// src/i18n/pt.ts e en.ts  →  projects.featured
{ slug: "meu-projeto", title: "…", tagline: "…", problem: "…",
  solution: "…", highlight: "…", stack: [...], category: "fullstack",
  learnings: ["…"] },
```

- A **ordem** de `projectMetas` é curadoria, não cronologia: o ano é apenas mais uma coluna.
- O `problem` aparece junto do preview: é ele que faz a lista argumentar em vez de só catalogar.
- Sem `image`, o preview cai no **mockup de janela em CSS**, que é o placeholder oficial. Preencher `image` depois não exige mudar componente nenhum.
- Para gerar a imagem: acrescente o alvo em `capture/previews.spec.ts` e rode `pnpm capture`. O script fotografa o site publicado em 16:10, converte para WebP pelo próprio Chromium (sem dependência de processamento de imagem) e salva em `src/assets/projects/` com 1000px de largura, de onde os dados o **importam**, nunca por caminho em string (lei 19 do CLAUDE.md). O arquivo versionado é o que chega ao navegador, porque `images.unoptimized` está ligado: ver §15.7 do plano antes de trocar tamanho ou qualidade. Projeto **mobile** não tem página web: aponte para uma print já existente na lista `imagens` do mesmo arquivo, e o preview a enquadra como tela de celular.
- A linha mostra as **3 primeiras** tecnologias da stack; a lista completa fica na página do case.

> **Trocar a foto do perfil.** Ela não sai de nenhum script: é a foto do GitHub, guardada à mão em `src/assets/avatar.webp` a **320x320** (o dobro dos 160px em que aparece, para cobrir densidade 2). Trocando, converta e redimensione antes de commitar, porque com `images.unoptimized` o arquivo versionado é o que a pessoa baixa. `src/assets/assets.test.ts` reprova o que passar do teto de peso ou de largura.

### 3. Acrescentar um trabalho de cliente

Em `src/i18n/*.ts` → `clients.projects`. Mesmo componente de lista dos projetos, com destino externo:

```ts
{
  name: "Dandarkness",
  description: "…",                 // aparece junto do preview
  responsibilities: ["Frontend", "UI", "Responsividade", "Deploy"],  // exibido no preview
  stack: ["Next.js", "Tailwind CSS", "Vercel"],  // colunas da linha
  year: "2026",
  url: "https://dandarkness.vercel.app/",
  image: dandarkness,   // import de @/assets/projects/, nos dois dicionários
}
```

### 4. Ajustar a paleta do fundo

O site inteiro usa **uma paleta só**, sem troca por rota nem no hover da lista (a troca saiu na V3.5). Ela mora em `src/components/background/background-config.ts`, e cada paleta tem dois ramps, um por tema:

```ts
export const palettes = {        // tema escuro, ramp do escuro ao claro
  praia: ["#0e1018", "#232838", "#454f6b"],
  // …
};
export const palettesLight = {   // tema claro, mesma ordem, topo em branco
  praia: ["#7ed4e0", "#f7dc9a", "#ffffff"],
  // …
};
export const DEFAULT_PALETTE: PalettePreset = "praia";  // trocar a do site é esta linha
```

As outras paletas (`graphite`, `cobalt`, `ember`, `moss`, `plum`, `sand`) ficam como vocabulário, cobertas pelo mesmo teste, para a troca ser de uma linha. `FIELD_MIX` é a dose do campo sobre a cor de fundo em cada tema: **mudou a dose do claro, recalcule as sete paletas claras**, porque a dose é uma só para todas (lei 11 do CLAUDE.md, §16.6 do plano).

> **Antes de inventar cores:** existe uma faixa de luminância proibida. Com texto branco, o `difference` devolve `1 − L`, então o contraste vai a zero em `L = 0.5` e o site vira cinza sobre cinza **sem acusar erro**. O teste em `background-config.test.ts` varre o ramp inteiro das paletas, nos dois temas, com vinheta e grain, e reprova qualquer uma que caia na faixa. Rode `pnpm test` depois de mexer.

### 5. Trajetória, habilidades e contato

`career.chapters`, `skills.blocks` e `contact` em `src/i18n/`. Os links sociais vivem em `contact.cards`, não no footer.

## 🌗 Tema e 🌐 Idioma

- **Tema:** o botão alterna a classe `.dark` do `<html>` e persiste em `localStorage["theme"]`. Um script nos layouts aplica o tema salvo antes do primeiro paint. A cor de fundo do shader é interpolada em JS durante os mesmos 900ms da transição do CSS, com a mesma curva, para os dois chegarem juntos.
- **Idioma:** cada idioma tem **root layout próprio**, então o `<html lang>` nasce correto no SSR sem depender de JS. O botão navega para a rota correspondente, preservando o contexto: de `/contato/` vai para `/en/contact/`, e de um case vai para o mesmo case.

## ♿ Acessibilidade e performance

Lighthouse 13.4.1 contra https://pedrolevi.com.br, na Cloudflare, mediana de 3 rodadas por rota, throttling `simulate`, todas as requisições em HTTP/2 e o domínio como único host na rede (15/10/2026, §17.15). As duas últimas colunas são a medição da §16.9 (13/10/2026), o mesmo site na Vercel, antes da migração:

| Rota | Perf desktop | Perf mobile | A11y | Best Practices | SEO | Desktop na Vercel | Mobile na Vercel |
|---|---|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 | 100 | 99 | 100 |
| `/clientes/` | 100 | 100 | 100 | 100 | 100 | 100 | 98 |
| `/projetos/` | 99 | 100 | 100 | 100 | 100 | 100 | 97 |
| `/info/` | 99 | 100 | 100 | 100 | 100 | 100 | 99 |
| `/contato/` | 99 | 100 | 100 | 100 | 100 | 100 | 99 |

Medido com a abertura no ar. No desktop, Acessibilidade, Best Practices e SEO deram 100 em todas as rodadas. O mobile tem TBT de 21 a 46 ms, e o detalhe por rota (LCP, TBT, FCP, Speed Index) está na §17.15 do plano. O elemento de LCP é o mesmo nas cinco rotas e **não é imagem**: é o link "Pedro Levi" do header. O ponto que falta no desktop é o Speed Index, que só fecha quando a cortina da abertura sai.

**A Cloudflare injetava no HTML um script que o site não tem:** o beacon de RUM (Web Analytics), que zona do plano Free já nasce com ligado. Ele não segurava a pintura de quem visita, mas o simulador do Lighthouse o contava como bloqueante e subia o FCP simulado do mobile em ~650 ms, o que custava 1 a 3 pontos por rota no mobile (§17.14). **Desde 15/10/2026 uma Configuration Rule da zona o desliga** (§17.15), e a tabela acima já é sem ele. Ao medir, confira no JSON que o único host na rede é o domínio: se `static.cloudflareinsights.com` voltar, a nota deixa de ser comparável.

Como rodar: a máquina de desenvolvimento não tem Chrome próprio, então aponte o `CHROME_PATH` para o Chromium do Playwright, e meça **produção**, nunca `localhost` (lei 18 do CLAUDE.md). O `vercel.app` agora só redireciona, então meça no domínio, e confira no JSON (audit `network-requests`) que o protocolo é `h2`. No `workers.dev` só se mede performance, porque ele leva `noindex` de propósito e o SEO reprova lá, e ele serve HTTP/3, que o simulador do Lighthouse trata como HTTP/1.1 (lei 18).

```bash
export CHROME_PATH="$HOME/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe"
npx lighthouse https://pedrolevi.com.br/ --only-categories=performance --chrome-flags="--headless=new"
npx lighthouse https://pedrolevi.com.br/ --preset=desktop --chrome-flags="--headless=new"
```

O primeiro é o mobile, que é o padrão do Lighthouse. Rode cada rota 3 vezes e use a mediana, e confira `configSettings.throttlingMethod` no JSON antes de comparar duas medições. **Nunca use `--preset=perf`:** ele troca o throttling para `devtools` sem avisar, e o número deixa de ser comparável com qualquer outro deste projeto.

Cuidados que o motor do fundo já respeita: teto de 30 quadros por segundo (`MAX_FPS`, ver §16.4 do plano), montagem que compila os shaders fora do main thread e nasce no degrau leve quando não há GPU (§16.5), DPR limitado a 1.5 (e 1 abaixo de 768px), rAF pausado com `document.hidden` e via `IntersectionObserver`, um único frame sob `prefers-reduced-motion`, fallback em gradiente CSS sem WebGL e no `webglcontextlost`.

O anel de foco usa `currentColor` de propósito: com uma cor fixa, ele ficaria invisível no tema claro dentro de seções `blend`.

## 🤖 CI (GitHub Actions)

[![CI](https://github.com/tavinholoco/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/tavinholoco/portfolio/actions/workflows/ci.yml)
[![Gitleaks](https://github.com/tavinholoco/portfolio/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/tavinholoco/portfolio/actions/workflows/gitleaks.yml)

| Workflow | O que faz |
|---|---|
| `ci.yml` | Lint, typecheck, testes unitários (Vitest), build de produção e E2E (Playwright) |
| `gitleaks.yml` | Varredura de segredos com Gitleaks, config em `.gitleaks.toml` |
| `rebuild-semanal.yml` | Toda segunda, um POST no deploy hook da Cloudflare (secret `CF_DEPLOY_HOOK`) rebuilda o site, para o dado do GitHub não envelhecer. Roda à mão pela aba Actions |

- **Unitários** (`pnpm test`): manifesto de rotas e os arquivos em disco, contraste das sete paletas nos dois temas, grain determinístico, aritmética do render target, o teto de quadros simulado de 60 a 240 Hz, os degraus de qualidade do fundo, as cores do ícone e da imagem de link, o teto de peso e de largura das imagens versionadas, o `_headers` e o `_redirects` da Cloudflare contra o caminho da imagem de link (e o HSTS em todo caminho, sem preload), a guarda da URL do site no build da Cloudflare, o momento do deslize da abertura, metadados, sitemap, GitHub com fallback e paridade dos dicionários.
- **E2E** (`pnpm test:e2e`): roda contra o `wrangler dev` servindo `out/`, com as mesmas regras de `_headers` e `_redirects` de produção. Cobre a lei de camadas nas 11 rotas com controle negativo, o fallback sem WebGL, DPR por tamanho de tela, o teto de quadros do fundo (contado no próprio WebGL), o degrau leve do fundo quando não há GPU, movimento reduzido, as regras do showcase em ponteiro, teclado e toque, as prévias sem `lazy` e com cache `immutable`, o HSTS somado às outras regras do `_headers`, a navegação nos dois idiomas, o `<html lang>` no SSR, a **hierarquia de cabeçalhos**, o **ícone de aba e a imagem de link em toda rota**, uma **auditoria de responsividade** em 6 rotas × 7 larguras, e a **abertura**: o nome pousa no pixel do header, o clique passa pela cortina, o nome do header (o LCP) nunca some, e sem JS a cortina sai sozinha.
- **Toda a suíte E2E roda sem a abertura**, porque cada contexto do Playwright nasce sem `sessionStorage` e ela cobriria o começo de todo teste. Teste novo importa `test` de `e2e/fixtures.ts`, que semeia a chave; os testes da própria abertura ligam com `test.use({ intro: true })`.
- Os testes de responsividade e de marca existem porque a V3.5 acumulou seis defeitos que só apareceram quando alguém olhou a tela: ondas correndo para o lado errado, email cortado com reticências no celular, palavra por cima da coluna vizinha, ícone de três versões atrás e ícone ausente em `/en/`. Cada um virou asserção.
- O `pnpm look` **não** roda no CI: tem config própria em `capture/`.

## 🔗 Integração com o GitHub

`src/lib/github.ts` busca os repositórios em Server Component, **no build**: com o export estático não há ISR, e o dado é o do último build. O `rebuild-semanal.yml` o renova toda segunda. O dado alimenta a linha `atualizado <data> · <linguagem>` na página de case, e os links de repositório e demo.

- **Rate limit:** 60 requisições/h **por IP** sem token, e a máquina de build da Cloudflare é compartilhada. Com o secret de build `GITHUB_TOKEN` (fine-grained, só leitura de repositório público, ligado na produção desde 15/10/2026), a chamada leva `Authorization` e o limite passa a ser da conta. Se o token vencer ou for revogado, a API responde 401, a busca se repete sem ele e o log do build avisa: o dado não some.
- **O `revalidate: 3600` continua, por outro motivo:** com o cache de build ligado, o Workers Builds guarda o `.next/cache` entre builds. Com `force-cache` o rebuild reaproveitaria a resposta velha para sempre; com `no-store` a rota deixa de ser estática e o export para.
- **Fallback:** se a API falhar, o site usa os dados curados. Nunca quebra.

## 🚀 Deploy na Cloudflare

O `next build` grava o site inteiro em `out/` (`output: "export"`), e um Worker só de assets o serve (`wrangler.jsonc`, sem código). Não há comando de deploy local: o **Workers Builds** da Cloudflare, ligado ao repositório, builda com `pnpm build` e publica com `npx wrangler deploy` a cada push na `main`. Os outros branches viram prévia com `npx wrangler preview`, numa URL pública no `workers.dev` que a Cloudflare comenta no PR (com `noindex`; o bloco `previews` do `wrangler.jsonc` é obrigatório para isso, mesmo vazio). O rebuild semanal entra pelo deploy hook.

O que o export troca, e onde cada coisa passou a morar (lei 22 do CLAUDE.md):

- **Cabeçalhos e reescritas** não vêm mais do Next: `public/_headers` devolve o HSTS que a Vercel mandava sozinha (em todo caminho, dois anos, `includeSubDomains`, sem `preload`), o `immutable` de `_next/static` e o `Content-Type` das imagens de link, e `public/_redirects` reescreve a URL da imagem com barra para o arquivo que o export grava. `src/lib/cloudflare-assets.test.ts` confere os dois contra `ogImageMeta`.
- **URL sem barra** vai para a com barra com **307** (a Vercel dava 308). Ninguém passa por esse salto: links, canonical e sitemap já levam barra.
- **Rota inexistente** responde 404 com a página `out/404.html`.
- **TLS:** a zona recusa conexão abaixo do TLS 1.2, como a Vercel (§17.16).

**Email do domínio** (§17.16): `contato@pedrolevi.com.br` existe pelo Email Routing da Cloudflare, que só recebe e repassa para o gmail do Pedro; a resposta sai do gmail. O DMARC da zona recusa email que se passe pelo domínio (`p=reject`), então enviar "como" `@pedrolevi.com.br` por um serviço que não esteja no SPF faz a mensagem voltar. O site continua mostrando o gmail.

Variáveis de build no painel do Worker (Settings, Build). A produção e as prévias têm configurações separadas, e a `NEXT_PUBLIC_SITE_URL` precisa estar nas duas:

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Obrigatória.** URL canônica, sem barra no fim. Sem ela o build falha de propósito, porque o fallback é localhost (lei 23) |
| `GITHUB_TOKEN` (secret) | Opcional, e basta na produção (ligado desde 15/10/2026). **Tipo Secret**: o seletor do painel vem em Text, e como Text o valor aparece em claro no painel e na API (§17.16). Tira o build do limite de 60 requisições por IP da API do GitHub; numa prévia, sem ele, o pior caso é o case sair sem linguagem e sem data |

As versões não precisam de variável: a imagem de build lê o Node do `.node-version` e o pnpm do `packageManager` (§17.10).

O roteiro completo da migração (Worker, domínio, DNS, DNSSEC, o redirecionamento da Vercel e a medição) está na §17 do plano.

## 📄 Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Dev server em `http://localhost:3000` |
| `pnpm build` | Export estático em `out/` (e, só no Windows, o conserto do prefetch da §17.4) |
| `pnpm start` | Serve `out/` com o `wrangler dev`, o servidor de assets da Cloudflare, na porta 3000 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm test:e2e` | Testes E2E (Playwright), requer `pnpm build` antes |
| `pnpm look` | Captura telas do site em `.captures/`, requer `pnpm build` antes |
| `pnpm capture` | Gera os previews do showcase em `src/assets/projects/`, sob demanda |
| `pnpm waves` | Mede para que lado as cristas do fundo viajam, compilando o GLSL real |
| `pnpm favicon` | Regrava o `favicon.ico` a partir do `icon.svg`, em 6 tamanhos |

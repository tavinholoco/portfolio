# 🚀 Portfólio · Pedro Levi

Portfólio minimalista com fundo WebGL próprio, tipografia fluida e navegação em 5 rotas por idioma. O texto branco das seções usa `mix-blend-mode: difference` e inverte contra o que estiver embaixo, então o contraste sai de graça sem escurecer o fundo.

**Live:** [pedrolevi.dev](https://pedrolevi.dev) _(definido via `NEXT_PUBLIC_SITE_URL` no deploy)_

> A referência estrutural foi [p5aholic.me](https://p5aholic.me), **sem reúso de código**: shader, paleta, composição e CSS foram escritos do zero. O plano completo, com as decisões e as duas auditorias, está em [PLANO-V3-PORTFOLIO.md](PLANO-V3-PORTFOLIO.md).

## ✨ Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + TypeScript |
| Estilo | **Tailwind CSS v4**, tema claro/escuro via classe `.dark` |
| Fundo | **OGL** (~20 KB gzip), campo de ondas de praia em dois passes |
| Rolagem | **Lenis** em modo de rolagem nativa da janela |
| Componentes | **Base UI** (Sheet do menu mobile). Não é Radix: a API é `render={<a/>}`, não `asChild` |
| Ícones | **Lucide React** |
| Dados | **GitHub API** em Server Component com ISR de 1h + fallback estático |
| i18n | Rotas por idioma, 5 de cada: `/` (pt-BR) e `/en/`, com dicionários em `src/i18n/` |
| Deploy | Vercel |

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
| `Section variant="solid"` | em fluxo | auto | Fundo opaco, cobre o canvas |
| `<ViewportMask>` | `fixed` | 30 | Cobre as faixas de `var(--pad)` no topo e na base |
| `<Frame>` | `fixed` | 40 | Moldura de 1px, em `difference` |
| `<SiteHeader>` / `<SiteFooter>` | `fixed` | 50 | Em `difference`, acima da máscara. Ambos em `pointer-events-none` |

Cinco detalhes decorrentes, todos descobertos na prática:

1. **O fundo da página vive no `:root`, nunca no `body`.** O fundo do elemento raiz é propagado para o canvas do documento e pintado abaixo de tudo, inclusive do canvas em z negativo. No `body`, ele seria o fundo de um bloco em fluxo e cobriria o canvas.
2. **O Lenis roda em rolagem nativa da janela.** Não configure `wrapper` nem `content`: nesse outro modo ele aplica `transform` num wrapper de conteúdo, o que mataria o blend de todas as seções de uma vez.
3. **Não dê fundo opaco a elemento `sticky`** na mesma página de uma seção `blend`. Sticky cria contexto de empilhamento, e a combinação pinta um retângulo da cor do fundo dentro da seção misturada, a centenas de pixels de distância.
4. **O `<SiteHeader>` é `pointer-events-none`, e cada elemento interativo dentro dele é `pointer-events-auto`.** Ele é `fixed` e de largura cheia, e com a nav vertical passou a ter umas 300px de altura. Sem isso essa faixa rouba clique e hover de todo o conteúdo que passa por baixo, inclusive o hover que troca o preview do showcase.
5. **A coluna da nav se reserva por `--nav-col`, no container do `<Section>`, nunca por padding no `<main>`.** Padding no `<main>` faria o fundo das seções `solid` parar antes da faixa e abriria uma tira do canvas na lateral esquerda. Padding é seguro para a lei principal, porque não cria contexto de empilhamento. O token é `0px` abaixo de `lg`, onde a nav vira `Sheet`.

Há teste E2E para tudo isso em `e2e/shell.spec.ts`, inclusive com controle negativo: um caso introduz a quebra de propósito e exige que a auditoria a enxergue.

## 🎨 As duas variantes de seção

```tsx
<Section id="contato" variant="blend">  {/* texto branco, mistura com o canvas */}
<Section id="clientes" variant="solid"> {/* fundo opaco, cobre o canvas */}
```

**Uma seção só pode ser `blend` se o conteúdo dela herdar a cor.** O `color: #fff` da seção alcança apenas texto que herda: classes como `text-muted-foreground`, `bg-card` e `bg-primary` mantêm a própria cor e cada uma inverte para um lado diferente, produzindo um resultado sujo.

Regra prática: qualquer seção com **imagem, foto ou screenshot** vai em `solid`, senão aparece em negativo.

### Regra de opacidade em texto

A hierarquia é feita por tamanho e opacidade, e é fácil exagerar. Duas regras, medidas e não estimadas:

1. **Texto nunca abaixo de `opacity-70`.** A 0.7 o contraste passa os 4.5:1 da WCAG AA nos dois temas e também dentro de uma seção `blend`.
2. **Nunca aninhe opacidade em texto.** Uma linha a 60% com um filho a 40% resulta em 24% efetivo. Os dois valores parecem razoáveis lidos separadamente, e é por isso que revisão de código não pega. Há teste que multiplica as opacidades ao longo da árvore.

Opacidade em elemento decorativo (moldura, máscara, ícone `aria-hidden`) não entra nesta regra.

## 🚦 Começando

**Pré-requisitos:** Node.js 20+ e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Para ver o site sem abrir o navegador (útil em revisão automatizada):

```bash
pnpm build && pnpm look
```

Captura as telas em `.captures/` (ignorada pelo git). Parametrizável por `LOOK_PATHS`, `LOOK_THEMES`, `LOOK_FULL`, `LOOK_SCROLL` e `LOOK_HOVER`. No Git Bash do Windows, prefixe com `MSYS_NO_PATHCONV=1`.

> ⚠️ Se houver servidor na porta 3000 iniciado **antes** do último `pnpm build`, ele continua servindo o `.next` antigo, e tanto a captura quanto os E2E veem o estado velho. Derrube a porta antes.

## 🗂 Estrutura do projeto

```
├── public/
│   ├── cv/                       # currículo PDF
│   ├── projects/                 # screenshots dos previews do showcase
│   └── avatar.jpg                # foto do perfil
├── src/
│   ├── app/
│   │   ├── globals.css           # tokens de shell, escala tipográfica e as leis em comentário
│   │   ├── robots.ts             # fora do route group de propósito (ver nota abaixo)
│   │   ├── (home)/               # árvore do português, com root layout próprio
│   │   │   ├── layout.tsx        # <html lang="pt"> + script anti-flash + <SiteShell>
│   │   │   ├── page.tsx  clientes/  projetos/  info/  contato/
│   │   │   ├── projetos/[slug]/  # páginas de case
│   │   │   └── sitemap.ts        # dentro do group, também de propósito
│   │   └── en/                   # espelho em inglês, mesma estrutura
│   ├── components/
│   │   ├── background/           # o motor do fundo
│   │   │   ├── renderer.ts       # BackgroundRenderer, sem React
│   │   │   ├── background-config.ts  # paletas, contraste, tweens e o singleton
│   │   │   ├── background-canvas.tsx # componente cliente, carrega o ogl no efeito
│   │   │   ├── background-palette.tsx # define a paleta da rota
│   │   │   ├── grain-texture.ts  # buffer puro + wrapper de Texture
│   │   │   └── shaders/          # vertex, campo de ondas e composição, em template literal
│   │   ├── shell/                # site-shell, frame, viewport-mask, smooth-scroll
│   │   ├── showcase/             # lista com preview trocando no hover, e a legenda fora da moldura
│   │   ├── pages/                # o conteúdo de cada rota, compartilhado pelos dois idiomas
│   │   ├── home/manifesto.tsx    # a home: só a tese, a bio e dois links
│   │   ├── process.tsx           # os 5 passos, hoje em /info/
│   │   ├── site-header.tsx       # identidade fixa no topo esquerdo + nav vertical
│   │   ├── section.tsx           # Section, com a lei F1 no topo
│   │   └── ui/sheet.tsx          # Base UI, usado pelo menu mobile
│   ├── data/                     # dados neutros (não dependem do idioma)
│   ├── i18n/                     # ⭐ TODOS os textos do site, em pt.ts e en.ts
│   └── lib/
│       ├── routes.ts             # ⭐ manifesto de rotas: nav, sitemap e hreflang derivam daqui
│       ├── github.ts             # fetch da GitHub API (ISR) + fallback
│       ├── metadata.ts           # metadados por rota e por idioma
│       ├── json-ld.ts            # dados estruturados
│       └── utils.ts              # helper cn()
├── e2e/                          # Playwright: shell, showcase, navegação e html lang
├── capture/                      # `pnpm look`, config própria fora do CI
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
{ slug: "meu-projeto", repo: "MeuProjeto", year: "2026",
  demoUrl: "https://…", image: "/projects/meu-projeto.webp" },
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
- Para gerar a imagem: acrescente o alvo em `capture/previews.spec.ts` e rode `pnpm capture`. O script fotografa o site publicado em 16:10, converte para WebP pelo próprio Chromium (sem dependência de processamento de imagem) e salva em `public/projects/`. Projeto **mobile** não tem página web: aponte para uma print já existente na lista `imagens` do mesmo arquivo, e o preview a enquadra como tela de celular.
- A linha mostra as **3 primeiras** tecnologias da stack; a lista completa fica na página do case.

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
  image: "/projects/dandarkness.webp",
}
```

### 4. Ajustar a paleta do fundo

Em `src/components/background/background-config.ts`:

```ts
export const palettes = {
  cobalt: ["#05101f", "#0e3560", "#2a6ea8"],  // ramp do escuro ao claro
  // …
};
export const paletteForRoute = { home: "graphite", projects: "cobalt", … };
```

Cada item do showcase também escolhe uma paleta, e passar o mouse na lista muda o humor do fundo inteiro.

> **Antes de inventar cores:** existe uma faixa de luminância proibida. Com texto branco, o `difference` devolve `1 − L`, então o contraste vai a zero em `L = 0.5` e o site vira cinza sobre cinza **sem acusar erro**. O teste em `background-config.test.ts` varre o ramp inteiro das paletas, nos dois temas, com vinheta e grain, e reprova qualquer uma que caia na faixa. Rode `pnpm test` depois de mexer.

### 5. Trajetória, habilidades e contato

`career.chapters`, `skills.blocks` e `contact` em `src/i18n/`. Os links sociais vivem em `contact.cards`, não no footer.

## 🌗 Tema e 🌐 Idioma

- **Tema:** o botão alterna a classe `.dark` do `<html>` e persiste em `localStorage["theme"]`. Um script nos layouts aplica o tema salvo antes do primeiro paint. A cor de fundo do shader é interpolada em JS durante os mesmos 900ms da transição do CSS, com a mesma curva, para os dois chegarem juntos.
- **Idioma:** cada idioma tem **root layout próprio**, então o `<html lang>` nasce correto no SSR sem depender de JS. O botão navega para a rota correspondente, preservando o contexto: de `/contato/` vai para `/en/contact/`, e de um case vai para o mesmo case.

## ♿ Acessibilidade e performance

Lighthouse no build de produção, preset desktop:

| Rota | Perf | A11y | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 |
| `/clientes/` | 98 | 100 | 100 | 100 |
| `/projetos/` | 98 | 100 | 100 | 100 |
| `/info/` | 100 | 100 | 100 | 100 |
| `/contato/` | 99 | 100 | 100 | 100 |

Como rodar: a máquina de desenvolvimento não tem Chrome próprio, então aponte o `CHROME_PATH` para o Chromium do Playwright.

```bash
CHROME_PATH="$HOME/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe" \
  npx lighthouse http://localhost:3000/ --preset=desktop --chrome-flags="--headless=new"
```

Cuidados que o motor do fundo já respeita: DPR limitado a 1.5 (e 1 abaixo de 768px), rAF pausado com `document.hidden` e via `IntersectionObserver`, um único frame sob `prefers-reduced-motion`, fallback em gradiente CSS sem WebGL e no `webglcontextlost`.

O anel de foco usa `currentColor` de propósito: com uma cor fixa, ele ficaria invisível no tema claro dentro de seções `blend`.

## 🤖 CI (GitHub Actions)

[![CI](https://github.com/tavinholoco/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/tavinholoco/portfolio/actions/workflows/ci.yml)
[![Gitleaks](https://github.com/tavinholoco/portfolio/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/tavinholoco/portfolio/actions/workflows/gitleaks.yml)

| Workflow | O que faz |
|---|---|
| `ci.yml` | Lint, typecheck, testes unitários (Vitest), build de produção e E2E (Playwright) |
| `gitleaks.yml` | Varredura de segredos com Gitleaks, config em `.gitleaks.toml` |

- **Unitários** (`pnpm test`): manifesto de rotas e os arquivos em disco, contraste das paletas, grain determinístico, aritmética do render target, metadados, sitemap, GitHub com fallback e paridade dos dicionários.
- **E2E** (`pnpm test:e2e`): a lei de camadas nas 11 rotas com controle negativo, o fallback sem WebGL, DPR por tamanho de tela, movimento reduzido, as regras do showcase em ponteiro, teclado e toque, a navegação nos dois idiomas e o `<html lang>` no SSR.
- O `pnpm look` **não** roda no CI: tem config própria em `capture/`.

## 🔗 Integração com o GitHub

`src/lib/github.ts` busca os repositórios em Server Component com `next: { revalidate: 3600 }`. O dado alimenta a linha `atualizado <data> · <linguagem>` na página de case, e os links de repositório e demo.

- **Rate limit:** 60 requisições/h sem token. Para folga, defina `GITHUB_TOKEN`.
- **Fallback:** se a API falhar, o site usa os dados curados. Nunca quebra.

## 🚀 Deploy na Vercel

```bash
pnpm exec vercel login
pnpm exec vercel link
pnpm exec vercel env add NEXT_PUBLIC_SITE_URL production   # ex.: https://pedrolevi.dev
pnpm deploy
```

> Sem `NEXT_PUBLIC_SITE_URL`, o site usa a URL do deploy para canonical, hreflang e sitemap. Com domínio próprio, defina a variável para fixar a canônica.

## 📄 Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Dev server em `http://localhost:3000` |
| `pnpm build` | Build de produção |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm test:e2e` | Testes E2E (Playwright), requer `pnpm build` antes |
| `pnpm look` | Captura telas do site em `.captures/`, requer `pnpm build` antes |
| `pnpm capture` | Gera os previews do showcase em `public/projects/`, sob demanda |
| `pnpm deploy` | Deploy de produção na Vercel |
| `pnpm deploy:preview` | Deploy de preview na Vercel |

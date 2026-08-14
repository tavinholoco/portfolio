# 🚀 Portfólio — Pedro Levi

Site de portfólio com seções por área e páginas individuais de projeto, projetos do GitHub, trajetória de carreira, habilidades e contato — inspirado no [kc1t.com](https://kc1t.com/pt-br), com identidade própria.

**Live:** [pedrolevi.dev](https://pedrolevi.dev) _(definido via `NEXT_PUBLIC_SITE_URL` no deploy)_

## ✨ Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + TypeScript |
| Estilo | **Tailwind CSS v4** (tema claro/escuro via classe `.dark`) |
| Componentes | **shadcn/ui** (Base UI) — Button, Sheet, Tooltip |
| Animação | **Framer Motion** (scroll reveals) + animações CSS puras no hero (LCP-friendly) |
| Ícones | **Lucide React** + ícones de marca próprios (`GitHubIcon`, `LinkedInIcon`) |
| Dados | **GitHub API** via Server Component com ISR de 1h + fallback estático |
| i18n | Rotas por idioma: `/` (pt-BR) e `/en/` — dicionários em `src/i18n/` + hreflang e sitemap bilíngue |
| Deploy | Vercel |

## 🤖 CI (GitHub Actions)

[![CI](https://github.com/tavinholoco/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/tavinholoco/portfolio/actions/workflows/ci.yml)
[![Gitleaks](https://github.com/tavinholoco/portfolio/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/tavinholoco/portfolio/actions/workflows/gitleaks.yml)

Dois workflows rodam em **push e pull request**:

| Workflow | O que faz |
|---|---|
| `.github/workflows/ci.yml` | Lint (ESLint), typecheck (`tsc --noEmit`), testes (Vitest), build de produção (Next.js) e **E2E com Playwright** (job `e2e`) |
| `.github/workflows/gitleaks.yml` | Varredura de segredos com **Gitleaks** (versão 8.24.2 fixada) usando `.gitleaks.toml` |

- **Testes unitários:** `src/**/*.test.ts` rodam com Vitest (`pnpm test`) — cobrem `cn()`, fetch do GitHub (com fallback), metadados/URL canônica e paridade dos dicionários pt/en.
- **Testes E2E:** `e2e/*.spec.ts` rodam com Playwright (`pnpm test:e2e`) contra o **servidor de produção** e validam que o `<html lang>` nasce correto no SSR em cada rota (`/` = pt, `/en/` = en, páginas de projeto) — sem depender de script no cliente. Localmente: `pnpm build` (uma vez) e depois `pnpm test:e2e`; o Playwright sobe o `pnpm start` sozinho ou reusa um servidor já rodando na porta 3000.
- **Gitleaks:** a config em `.gitleaks.toml` estende as regras padrão e tem um allowlist para os dados públicos do próprio site (e-mail, telefone, links) — contato de portfólio não é segredo. Para rodar localmente: `gitleaks git . --config .gitleaks.toml`.

## 🚦 Começando

**Pré-requisitos:** Node.js 20+ e [pnpm](https://pnpm.io).

```bash
# instalar dependências
pnpm install

# servidor de desenvolvimento (http://localhost:3000)
pnpm dev

# build de produção + verificação
pnpm build

# servidor do build (após pnpm build)
pnpm start

# lint
pnpm lint
```

## 🗂 Estrutura do projeto

```
├── public/
│   ├── cv/                      # currículo PDF (botão "Baixar CV")
│   ├── projects/                # screenshots dos sites de clientes (prévias dos cards)
│   └── avatar.jpg               # foto do perfil (avatar do GitHub)
├── src/
│   ├── app/
│   │   ├── globals.css          # tokens de tema (claro + escuro), utilitários e animações CSS
│   │   ├── robots.ts            # robots.txt com sitemap
│   │   ├── (home)/              # árvore do português (rota `/`) com root layout próprio
│   │   │   ├── layout.tsx       # root layout pt: <html lang="pt"> + script anti-flash de tema
│   │   │   ├── page.tsx         # rota `/` — portfólio em português
│   │   │   ├── portfolio-page.tsx # home compartilhada (recebe o idioma)
│   │   │   ├── opengraph-image.tsx # OG image gerada (1200×630 PNG, pt)
│   │   │   ├── sitemap.ts       # sitemap com as duas variantes de idioma
│   │   │   ├── icon.svg         # favicon com as iniciais PL
│   │   │   └── projetos/[slug]/ # páginas individuais de projeto (pt)
│   │   └── en/                  # rota `/en/` — portfólio em inglês (+ en/projects/[slug])
│   │       ├── layout.tsx       # root layout en: <html lang="en"> + script anti-flash de tema
│   │       ├── page.tsx         # metadados en + hreflang
│   │       └── opengraph-image.tsx # OG image em inglês
│   ├── components/
│   │   ├── ui/                  # componentes shadcn/ui (não edite)
│   │   ├── section.tsx          # Section, SectionHeading e FadeIn (padrão das seções)
│   │   ├── hero.tsx             # hero (server component, animação CSS)
│   │   ├── about.tsx            # sobre: avatar, fatos, resumo, interesses
│   │   ├── projects.tsx         # seção projetos (server wrapper: busca no GitHub)
│   │   ├── featured-project.tsx # destaque do projeto principal (Newra News)
│   │   ├── projects-grid.tsx    # grid de cards + filtro por categoria (client)
│   │   ├── project-detail.tsx   # página individual de projeto
│   │   ├── client-projects.tsx  # clientes (cases de cliente)
│   │   ├── process.tsx          # seção "Como trabalho" (5 passos)
│   │   ├── career.tsx           # trajetória: timeline de storytelling
│   │   ├── skills.tsx           # habilidades: 4 categorias sem nível
│   │   ├── contact.tsx          # contato com 2 CTAs + cards
│   │   ├── json-ld.tsx          # dados estruturados (Schema.org)
│   │   ├── site-header.tsx      # nav sticky + scrollspy + botões de tema/idioma + menu mobile
│   │   ├── site-footer.tsx      # footer
│   │   ├── theme-toggle.tsx     # botão claro/escuro (localStorage "theme")
│   │   ├── lang-toggle.tsx      # botão pt/en (navega entre / ↔ /en/, preservando a página de projeto)
│   │   └── icons.tsx            # ícones de marca (GitHub, LinkedIn)
│   ├── data/                    # dados neutros (não dependem do idioma) + tipos
│   │   ├── profile.ts           # contato, links, stack
│   │   ├── projects.ts          # curadoria neutra (slug + repo + demoUrl) + tipo
│   │   └── career.ts            # tipo dos capítulos da timeline
│   ├── i18n/                    # ⭐ TODOS os textos do site ficam aqui (editáveis)
│   │   ├── index.ts             # tipos e helpers de locale (pt | en)
│   │   ├── pt.ts                # textos em português (Brasil)
│   │   └── en.ts                # textos em inglês
│   └── lib/
│       ├── github.ts            # fetch da GitHub API (ISR) + fallback
│       ├── metadata.ts          # metadados por idioma (title, OG, canonical, hreflang)
│       └── utils.ts             # helper cn() (clsx + tailwind-merge)
├── .github/workflows/
│   ├── ci.yml                   # CI: lint, typecheck, testes e build
│   └── gitleaks.yml             # varredura de segredos (Gitleaks)
├── .gitleaks.toml               # config do Gitleaks (allowlist dos dados públicos)
├── vitest.config.ts             # config dos testes unitários (alias @ + include src/**/*.test.ts)
├── playwright.config.ts         # config dos testes E2E (servidor de produção na porta 3000)
├── e2e/                         # specs E2E (Playwright) — html lang por rota
└── PLANO-PORTFOLIO.md           # planejamento e plano de ação do projeto
```

## ✏️ Guia de edição de conteúdo

Todo o conteúdo do site é editável sem tocar em componentes. Os **textos traduzíveis** ficam em `src/i18n/` e os **dados neutros** (contato, links) em `src/data/`.

> Para alterar um texto, edite o **mesmo campo nos dois arquivos**: `src/i18n/pt.ts` (português) e `src/i18n/en.ts` (inglês).

### 1. Contato, links e stack — `src/data/profile.ts`

```ts
export const profile = {
  email: "pedrolevidiass@gmail.com",
  phone: "(18) 99626-0781",
  phoneRaw: "+5518996260781",          // formato internacional (tel:)
  github: "https://github.com/tavinholoco",
  linkedin: "https://www.linkedin.com/in/pedro-levi-dias-96720126a/",
  whatsapp: "https://wa.me/5518996260781",
  avatarUrl: "/avatar.jpg",            // foto do perfil (avatar do GitHub)
  cvUrl: "/cv/pedro-levi-curriculo.pdf",
  stack: ["React", "Next.js", "Node.js", "TypeScript"], // chips do hero
};
```

> **Trocar a foto do perfil:** substitua `public/avatar.jpg` pela nova imagem (quadrada, ~500px) — o `avatarUrl` já aponta para ela.

### 2. Textos do site — `src/i18n/pt.ts` e `src/i18n/en.ts`

Os dois arquivos têm a mesma estrutura (`Dict`). Exemplo do hero em `pt.ts`:

```ts
hero: {
  role: "Desenvolvedor Full Stack",
  name: "Pedro Levi",
  bio: "Construo aplicações web e mobile com foco em arquitetura, qualidade e experiências funcionais.",
  viewProjects: "Ver projetos",
  downloadCv: "Baixar CV",
  // …
},
```

Os principais blocos: `nav`, `hero`, `about` (fatos, resumo, métricas e interesses), `projects` (curadoria + labels), `clients`, `process` (Como trabalho), `career` (timeline em capítulos), `skills`, `contact` e `meta` (SEO/OG).

### 3. Projetos em destaque — `src/i18n/pt.ts` → `projects.featured`

A **curadoria** lista os projetos que aparecem no site. Os metadados (linguagem, data de atualização, link da demo) são buscados automaticamente do GitHub — o site nunca quebra se a API falhar.

```ts
{
  slug: "newra-news",                   // liga ao metadado em src/data/projects.ts (slug/repo/demoUrl)
  title: "Newra News",
  tagline: "…",
  problem: "…",
  solution: "…",
  highlight: "…",
  stack: ["Next.js", "Fastify", "Gemini", "Turborepo", "TypeScript"],
  category: "fullstack",                // "fullstack" | "mobile" | "landing"
},
```

- Os **metadados neutros** (slug, nome do repo e demoUrl) ficam em `src/data/projects.ts` — os dicionários só guardam texto traduzível.
- A **demo** usa a `homepage` do repo no GitHub e, na ausência dela, o `demoUrl` curado como fallback.
- Para trocar a ordem, reordene os itens do array.

### 4. Projetos de clientes — `src/i18n/pt.ts` → `clients.projects`

Cada card mostra a **prévia do site** (screenshot do topo da página) e leva direto a ele:

```ts
{
  name: "Dandarkness",
  client: "Dandarkness",                 // "Cliente:" do card
  type: "Portfólio artístico",           // "Tipo:" do card
  tech: ["Next.js", "TypeScript", "Tailwind CSS"], // "Tecnologias:"
  outcome: "…",                          // resultado/descrição do case
  url: "https://dandarkness.vercel.app/",  // link do site do projeto
  image: "/projects/dandarkness.jpg",      // screenshot do topo do site
},
```

> **Gerar/atualizar o screenshot de um cliente:** abra o site em um navegador (janela ~1440px), tire um print do topo da página e salve como JPEG em `public/projects/<nome>.jpg` (o card corta automaticamente em 16:10).

### 5. Trajetória e Habilidades — `src/i18n/` → `career` e `skills`

- `career.chapters`: capítulos da timeline por ano com `year`, `title`, `org`, `period`, `learnings` (o que aprendi) e `tags`.
- `skills.blocks`: 4 categorias sem nível — `id` (mapeia o ícone no componente), `title`, `description` e `skills`.

## 🌗 Tema claro/escuro e 🌐 Idioma

- **Tema:** o botão no header alterna a classe `.dark` do `<html>` e persiste em `localStorage["theme"]`. O script nos layouts aplica o tema salvo antes do primeiro paint (sem flash). As cores vivem em `src/app/globals.css` (`:root` = claro, `.dark` = escuro).
- **Idioma:** rotas separadas por idioma — `/` (pt-BR) e `/en/` (inglês), cada uma com **root layout próprio** (`(home)/layout.tsx` e `en/layout.tsx`), então o `<html lang>` já nasce correto no SSR, sem depender de JS. Ambas são estáticas (SSG + ISR) usando `src/i18n/`. O botão no header navega entre as rotas preservando a página (home ou projeto). Cada rota tem `hreflang` (pt-BR, en, x-default), canonical próprio e sitemap com as duas variantes (`/sitemap.xml`).

## 🔗 Integração com o GitHub

`src/lib/github.ts` busca os repositórios de `tavinholoco` na **GitHub API** dentro de um Server Component com `next: { revalidate: 3600 }` (**ISR de 1h** — os projetos refletem o GitHub sem JS no cliente).

- **Rate limit:** 60 requisições/h sem token — suficiente com revalidação de 1h. Para mais folga, defina `GITHUB_TOKEN` (fine-grained, escopo de leitura) no ambiente.
- **Fallback:** se a API falhar, o site usa os dados curados de `src/i18n` — nunca quebra.

## 🎨 Personalização visual

- **Cores do tema:** `src/app/globals.css` → variáveis `--background`, `--primary` (accent), `--border`, etc. (claro em `:root`, escuro em `.dark`).
- **Fontes:** `src/app/(home)/layout.tsx` e `src/app/en/layout.tsx` (Fira Code como principal + Open Sans como secundária, via `next/font`).
- **Favicon:** `src/app/icon.svg` (iniciais PL).
- **OG image:** `src/app/opengraph-image.tsx` (gera a imagem 1200×630 usada no compartilhamento).

## 🚀 Deploy na Vercel

O CLI do Vercel já está no projeto (`pnpm deploy`). Primeira vez:

```bash
# 1. login (abre o navegador) — apenas na primeira vez
pnpm exec vercel login

# 2. conectar o projeto à sua conta Vercel
pnpm exec vercel link

# 3. definir a URL do site (alimenta canonical, hreflang e sitemap)
pnpm exec vercel env add NEXT_PUBLIC_SITE_URL production
#    ex.: https://pedrolevi.dev  (ou a URL *.vercel.app gerada)

# 4. deploy de produção
pnpm deploy
```

> Alternativa sem CLI: importe `tavinholoco/portfolio` em [vercel.com/new](https://vercel.com/new) e configure as variáveis no dashboard (Settings → Environment Variables).

> **Sem `NEXT_PUBLIC_SITE_URL`**, o site usa automaticamente a URL do deploy (`VERCEL_URL`/`VERCEL_PROJECT_PRODUCTION_URL`) para canonical, hreflang e sitemap. Quando tiver domínio próprio, defina a variável para fixar a URL canônica.

- (Opcional) Adicione `GITHUB_TOKEN` para folga no rate limit da GitHub API.
- Veja `.env.example` para todas as variáveis disponíveis.
- As duas rotas (`/` e `/en/`) são estáticas com os dados do GitHub cacheados por ISR de 1h.

## 📄 Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Dev server (Turbopack) em `http://localhost:3000` |
| `pnpm build` | Build de produção |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm test:e2e` | Testes E2E (Playwright) — requer `pnpm build` antes |
| `pnpm deploy` | Deploy de produção na Vercel |
| `pnpm deploy:preview` | Deploy de preview (ambiente de teste) na Vercel |

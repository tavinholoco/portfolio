# 🚀 Portfólio — Pedro Levi

Site de portfólio em **página única** com projetos do GitHub, trajetória de carreira, habilidades e contato — inspirado no [kc1t.com](https://kc1t.com/pt-br), com identidade própria.

**Live:** [pedrolevi.dev](https://pedrolevi.dev) _(definido via `NEXT_PUBLIC_SITE_URL` no deploy)_

## ✨ Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + TypeScript |
| Estilo | **Tailwind CSS v4** (tema claro/escuro via classe `.dark`) |
| Componentes | **shadcn/ui** (Base UI) — Button, Card, Badge, Sheet, Accordion, Separator, Tooltip |
| Animação | **Framer Motion** (scroll reveals) + animações CSS puras no hero (LCP-friendly) |
| Ícones | **Lucide React** + ícones de marca próprios (`GitHubIcon`, `LinkedInIcon`) |
| Dados | **GitHub API** via Server Component com ISR de 1h + fallback estático |
| i18n | Rotas por idioma: `/` (pt-BR) e `/en/` — dicionários em `src/i18n/` + hreflang e sitemap bilíngue |
| Deploy | Vercel |

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
│   │   ├── icon.svg             # favicon com as iniciais PL
│   │   ├── layout.tsx           # layout raiz + metadados SEO por idioma + script anti-flash de tema
│   │   ├── opengraph-image.tsx  # OG image gerada (1200×630 PNG, pt)
│   │   ├── page.tsx             # rota `/` — portfólio em português
│   │   ├── sitemap.ts           # sitemap com as duas variantes de idioma
│   │   ├── portfolio-page.tsx   # página única compartilhada (recebe o idioma)
│   │   └── en/                  # rota `/en/` — portfólio em inglês
│   │       ├── page.tsx         # metadados en + hreflang
│   │       └── opengraph-image.tsx # OG image em inglês
│   ├── components/
│   │   ├── ui/                  # componentes shadcn/ui (não edite)
│   │   ├── section.tsx          # Section, SectionHeading e FadeIn (padrão das seções)
│   │   ├── hero.tsx             # hero (server component, animação CSS)
│   │   ├── about.tsx            # sobre: avatar, fatos, resumo, interesses
│   │   ├── projects.tsx         # seção projetos (server wrapper: busca no GitHub)
│   │   ├── projects-grid.tsx    # grid de cards + filtro por categoria (client)
│   │   ├── client-projects.tsx  # projetos para clientes (prévia do site)
│   │   ├── career.tsx           # trajetória: timeline + accordion
│   │   ├── skills.tsx           # habilidades: 4 blocos com níveis
│   │   ├── contact.tsx          # CTA de contato + cards
│   │   ├── site-header.tsx      # nav sticky + scrollspy + botões de tema/idioma + menu mobile
│   │   ├── site-footer.tsx      # footer
│   │   ├── theme-toggle.tsx     # botão claro/escuro (localStorage "theme")
│   │   ├── lang-toggle.tsx      # botão pt/en (cookie "lang" + reload)
│   │   └── icons.tsx            # ícones de marca (GitHub, LinkedIn)
│   ├── data/                    # dados neutros (não dependem do idioma) + tipos
│   │   ├── profile.ts           # contato, links, stack
│   │   ├── projects.ts          # tipo das categorias de projeto
│   │   └── career.ts            # tipo dos itens da trajetória
│   ├── i18n/                    # ⭐ TODOS os textos do site ficam aqui (editáveis)
│   │   ├── index.ts             # tipos e helpers de locale (pt | en)
│   │   ├── pt.ts                # textos em português (Brasil)
│   │   └── en.ts                # textos em inglês
│   └── lib/
│       ├── github.ts            # fetch da GitHub API (ISR) + fallback
│       ├── metadata.ts          # metadados por idioma (title, OG, canonical, hreflang)
│       └── utils.ts             # helper cn() (clsx + tailwind-merge)
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
  stack: ["React.js", "React Native", …], // chips do hero
};
```

> **Trocar a foto do perfil:** substitua `public/avatar.jpg` pela nova imagem (quadrada, ~500px) — o `avatarUrl` já aponta para ela.

### 2. Textos do site — `src/i18n/pt.ts` e `src/i18n/en.ts`

Os dois arquivos têm a mesma estrutura (`Dict`). Exemplo do hero em `pt.ts`:

```ts
hero: {
  role: "desenvolvedor fullstack",
  name: "Pedro Levi",
  bio: "…",
  viewProjects: "Ver projetos",
  downloadCv: "Baixar CV",
  // …
},
```

Os principais blocos: `nav` (links + labels do menu), `hero`, `about` (fatos, resumo, stats, interesses), `projects` (curadoria + labels do filtro), `clients`, `career` (formação + experiência), `skills`, `contact` e `meta` (SEO/OG).

### 3. Projetos em destaque — `src/i18n/pt.ts` → `projects.featured`

A **curadoria** lista os projetos que aparecem no site. Os metadados (linguagem, data de atualização, link da demo) são buscados automaticamente do GitHub — o site nunca quebra se a API falhar.

```ts
{
  repo: "newra-news",                   // nome EXATO do repositório no GitHub
  title: "Newra News",
  description: "…",
  category: "fullstack",                // "fullstack" | "mobile" | "landing"
  inDevelopment: true,                  // opcional: badge "Em desenvolvimento"
  tags: ["Next.js", "Fastify", "Gemini API"],
},
```

- A **demo** aparece sozinha quando o repo tem `homepage` configurada no GitHub (ex.: Vercel).
- Para trocar a ordem, reordene os itens do array.

### 4. Projetos de clientes — `src/i18n/pt.ts` → `clients.projects`

Cada card mostra a **prévia do site** (screenshot do topo da página) e leva direto a ele:

```ts
{
  name: "Dandarkness",
  description: "…",
  url: "https://dandarkness.vercel.app/",  // link do site do projeto
  image: "/projects/dandarkness.jpg",      // screenshot do topo do site
},
```

> **Gerar/atualizar o screenshot de um cliente:** abra o site em um navegador (janela ~1440px), tire um print do topo da página e salve como JPEG em `public/projects/<nome>.jpg` (o card corta automaticamente em 16:10).

### 5. Trajetória e Habilidades — `src/i18n/` → `career` e `skills`

- `career.education` / `career.experience`: itens com `id` único (chave do accordion), `title`, `org`, `period`, `status` (opcional), `details` (bullets) e `tags`.
- `skills.blocks`: blocos com `id` (mapeia o ícone no componente), `title`, `description`, `level` (label + valor 1–5) e `skills`.

## 🌗 Tema claro/escuro e 🌐 Idioma

- **Tema:** o botão no header alterna a classe `.dark` do `<html>` e persiste em `localStorage["theme"]`. O script em `layout.tsx` aplica o tema salvo antes do primeiro paint (sem flash). As cores vivem em `src/app/globals.css` (`:root` = claro, `.dark` = escuro).
- **Idioma:** rotas separadas por idioma — `/` (pt-BR) e `/en/` (inglês), ambas renderizadas no servidor (SSG + ISR) usando `src/i18n/`. O botão no header navega entre as rotas. Cada rota tem `hreflang` (pt-BR, en, x-default), canonical próprio e sitemap com as duas variantes (`/sitemap.xml`).

## 🔗 Integração com o GitHub

`src/lib/github.ts` busca os repositórios de `tavinholoco` na **GitHub API** dentro de um Server Component com `next: { revalidate: 3600 }` (**ISR de 1h** — os projetos refletem o GitHub sem JS no cliente).

- **Rate limit:** 60 requisições/h sem token — suficiente com revalidação de 1h. Para mais folga, defina `GITHUB_TOKEN` (fine-grained, escopo de leitura) no ambiente.
- **Fallback:** se a API falhar, o site usa os dados curados de `src/i18n` — nunca quebra.

## 🎨 Personalização visual

- **Cores do tema:** `src/app/globals.css` → variáveis `--background`, `--primary` (accent), `--border`, etc. (claro em `:root`, escuro em `.dark`).
- **Fontes:** `src/app/layout.tsx` (Geist Sans/Mono via `next/font`).
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

> Alternativa sem CLI: importe `tavinholoco/portfolio` em [vercel.com/new](https://vercel.com/new) e configure `NEXT_PUBLIC_SITE_URL` no dashboard.

- (Opcional) Adicione `GITHUB_TOKEN` para folga no rate limit da GitHub API.
- As duas rotas (`/` e `/en/`) são estáticas com os dados do GitHub cacheados por ISR de 1h.

## 📄 Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Dev server (Turbopack) em `http://localhost:3000` |
| `pnpm build` | Build de produção |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint |
| `pnpm deploy` | Deploy de produção na Vercel |
| `pnpm deploy:preview` | Deploy de preview (ambiente de teste) na Vercel |

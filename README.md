# 🚀 Portfólio — Pedro Levi

Site de portfólio em **página única** com projetos do GitHub, trajetória de carreira, habilidades e contato — inspirado no [kc1t.com](https://kc1t.com/pt-br), com identidade própria.

**Live:** [pedrolevi.dev](https://pedrolevi.dev) _(definido via `NEXT_PUBLIC_SITE_URL` no deploy)_

## ✨ Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + TypeScript |
| Estilo | **Tailwind CSS v4** |
| Componentes | **shadcn/ui** (Base UI) — Button, Card, Badge, Sheet, Accordion, Separator, Tooltip |
| Animação | **Framer Motion** (scroll reveals) + animações CSS puras no hero (LCP-friendly) |
| Ícones | **Lucide React** + ícones de marca próprios (`GitHubIcon`, `LinkedInIcon`) |
| Dados | **GitHub API** via Server Component com ISR de 1h + fallback estático |
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
│   │   ├── globals.css          # tema dark, tokens, utilitários e animações CSS
│   │   ├── icon.svg             # favicon com as iniciais PL
│   │   ├── layout.tsx           # layout raiz + metadados SEO (OG, Twitter, canonical)
│   │   ├── opengraph-image.tsx  # OG image gerada (1200×630 PNG)
│   │   └── page.tsx             # página única — compõe todas as seções
│   ├── components/
│   │   ├── ui/                  # componentes shadcn/ui (não edite)
│   │   ├── section.tsx          # Section, SectionHeading e FadeIn (padrão das seções)
│   │   ├── hero.tsx             # hero (server component, animação CSS)
│   │   ├── about.tsx            # sobre: avatar, fatos, resumo, interesses
│   │   ├── projects.tsx         # seção projetos (server wrapper: busca no GitHub)
│   │   ├── projects-grid.tsx    # grid de cards + filtro por categoria (client)
│   ├── client-projects.tsx  # projetos para clientes (repositórios privados)
│   │   ├── career.tsx           # trajetória: timeline + accordion
│   │   ├── skills.tsx           # habilidades: 4 blocos com níveis
│   │   ├── contact.tsx          # CTA de contato + cards
│   │   ├── site-header.tsx      # nav sticky + scrollspy + menu mobile
│   │   ├── site-footer.tsx      # footer
│   │   └── icons.tsx            # ícones de marca (GitHub, LinkedIn)
│   ├── data/                    # ⭐ TODOS os dados editáveis ficam aqui
│   │   ├── profile.ts           # perfil, links, stack, CTA
│   │   ├── projects.ts          # curadoria dos projetos em destaque
│   │   ├── career.ts            # formação acadêmica + experiência
│   │   └── skills.ts            # habilidades por bloco
│   └── lib/
│       ├── github.ts            # fetch da GitHub API (ISR) + fallback
│       └── utils.ts             # helper cn() (clsx + tailwind-merge)
└── PLANO-PORTFOLIO.md           # planejamento e plano de ação do projeto
```

## ✏️ Guia de edição de dados

Todo o conteúdo do site é editável sem tocar em componentes — basta alterar os arquivos em `src/data/`.

### 1. Perfil, links e stack — `src/data/profile.ts`

```ts
export const profile = {
  name: "Pedro Levi Dias Rosa Paula",
  email: "pedrolevidiass@gmail.com",
  phone: "(18) 99626-0781",
  phoneRaw: "+5518996260781",          // formato internacional (tel:)
  github: "https://github.com/tavinholoco",
  linkedin: "https://www.linkedin.com/in/pedro-levi-dias-96720126a/",
  whatsapp: "https://wa.me/5518996260781",
  avatarUrl: "/avatar.jpg",            // foto do perfil (avatar do GitHub)
  cvUrl: "/cv/pedro-levi-curriculo.pdf",
  bio: "…",                             // texto do hero
  stack: ["React.js", "React Native", …], // chips do hero
  cta: { title: "…", description: "…" }, // seção de contato
};
```

> **Trocar a foto do perfil:** substitua `public/avatar.jpg` pela nova imagem (quadrada, ~500px) — o `avatarUrl` já aponta para ela.

### 2. Projetos — `src/data/projects.ts`

A **curadoria** lista os projetos que aparecem no site. Os metadados (linguagem, data de atualização, link da demo) são buscados automaticamente do GitHub — o site nunca quebra se a API falhar.

```ts
{
  repo: "newra-news",                   // nome EXATO do repositório no GitHub
  title: "Newra News",
  description: "…",                     // descrição em pt-BR
  category: "fullstack",                // "fullstack" | "mobile" | "landing"
  inDevelopment: true,                  // opcional: badge "Em desenvolvimento"
  tags: ["Next.js", "Fastify", "Gemini API"],
}
```

- A **demo** aparece sozinha quando o repo tem `homepage` configurada no GitHub (ex.: Vercel).
- Para trocar a ordem, reordene os itens do array.

### 2b. Projetos de clientes — `src/data/projects.ts`

Projetos entregues para clientes, na seção "Projetos para clientes". Cada card mostra a **prévia do site** (screenshot do topo da página) e leva direto a ele:

```ts
export const clientProjects: ClientProject[] = [
  {
    name: "Dandarkness",
    description: "…",
    url: "https://dandarkness.vercel.app/",  // link do site do projeto
    image: "/projects/dandarkness.jpg",     // screenshot do topo do site
  },
];
```

> **Gerar/atualizar o screenshot de um cliente:** abra o site em um navegador (janela ~1440px), tire um print do topo da página e salve como JPEG em `public/projects/<nome>.jpg` (aprox. 1440×900, cortado automaticamente em 16:10 pelo card). Depois aponte o campo `image` para o arquivo.

### 3. Trajetória — `src/data/career.ts`

```ts
{
  id: "palmali",                        // único, usado pelo accordion
  title: "Aprendiz TI · Tecnologia da Informação",
  org: "Palmali",
  period: "mai 2025 · fev 2026",
  status: "Concluído",                  // opcional (badge, ex.: "Atual")
  details: ["…"],                       // bullets do painel expansível
  tags: ["Suporte", "Windows", "Redes"],
}
```

### 4. Habilidades — `src/data/skills.ts`

```ts
{
  id: "frontend",                       // mapeia o ícone no componente
  title: "Frontend & Mobile",
  description: "…",
  level: { label: "Intermediário", value: 3 }, // value 1–5 (dots)
  skills: ["React.js", "React Native", …],
}
```

## 🔗 Integração com o GitHub

`src/lib/github.ts` busca os repositórios de `tavinholoco` na **GitHub API** dentro de um Server Component com `next: { revalidate: 3600 }` (**ISR de 1h** — os projetos refletem o GitHub sem JS no cliente).

- **Rate limit:** 60 requisições/h sem token — suficiente com revalidação de 1h. Para mais folga, defina `GITHUB_TOKEN` (fine-grained, escopo de leitura) no ambiente.
- **Fallback:** se a API falhar, o site usa os dados curados de `src/data/projects.ts` — nunca quebra.

## 🎨 Personalização visual

- **Cores do tema:** `src/app/globals.css` → variáveis `--background`, `--primary` (accent), `--border`, etc.
- **Fontes:** `src/app/layout.tsx` (Geist Sans/Mono via `next/font`).
- **Favicon:** `src/app/icon.svg` (iniciais PL).
- **OG image:** `src/app/opengraph-image.tsx` (gera a imagem 1200×630 usada no compartilhamento).

## 🚀 Deploy na Vercel

1. Suba o repositório para o GitHub e importe-o na [Vercel](https://vercel.com/new).
2. Configure a variável de ambiente **`NEXT_PUBLIC_SITE_URL`** com o domínio real (ex.: `https://pedrolevi.dev`) — usada no canonical e no Open Graph.
3. (Opcional) Adicione `GITHUB_TOKEN` para folga no rate limit da GitHub API.
4. Deploy. O build já gera a página estática com ISR de 1h.

## 📄 Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Dev server (Turbopack) em `http://localhost:3000` |
| `pnpm build` | Build de produção (SSG + ISR) |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint |

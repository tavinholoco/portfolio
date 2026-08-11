# 🎯 Plano do Portfólio — Pedro Levi Dias Rosa Paula

> **Objetivo:** Site de portfólio em **página única** com projetos do GitHub e trajetória de carreira, inspirado no [kc1t.com/pt-br](https://kc1t.com/pt-br), com diferenciais próprios.
>
> **Status do documento:** Fases 0–4 ✅ + revisão pré-deploy ✅. Lighthouse: Perf 95–97 · A11y 100 · BP 100 · SEO 100.

---

## 1. Visão Geral

| Item | Definição |
|---|---|
| **Tipo de site** | Portfólio pessoal, landing page de página única (one-page) |
| **Público-alvo** | Recrutadores, empresas e clientes de tecnologia |
| **Referência visual** | kc1t.com (Kauã Miguel) — dark, premium, minimalista |
| **Conteúdo fonte** | Currículo (PDF) + GitHub real (@tavinholoco) |
| **Idioma** | Português (pt-BR) — mesma abordagem do site de referência |
| **Deploy alvo** | Vercel (recomendado) + domínio próprio |

### O que o site terá (vs. referência)

| Recurso | kc1t.com | Nosso site |
|---|---|---|
| Cursor personalizado | ✅ | ❌ **removido** (padrão do navegador) |
| Aba/Seção de Certificações | ✅ | ❌ **removido** |
| Dev Logs / Conteúdo recente | ✅ | ❌ **removido** |
| Playlist de música embutida | ✅ | ❌ **removido** |
| Projetos do GitHub | ✅ | ✅ manter |
| Trajetória (formação + experiência) | ✅ | ✅ manter |
| Habilidades / Stack | ✅ | ✅ manter |
| CTA de contato | ✅ | ✅ manter |
| **Estrutura** | Multi-seções em uma página | ✅ **uma única página com tudo** |

---

## 2. Análise do Site de Referência (kc1t.com)

**Estrutura real observada no site:** `hero → conteúdo → projetos → trajetória → skills → certificações → CTA`.

Elementos visuais e de UX que fazem o kc1t parecer premium e que **vamos copiar (com identidade própria)**:

1. **Hero forte** — badge de disponibilidade, nome grande, título de atuação ("Fullstack Developer"), links sociais + botão de download do CV, chips da stack.
2. **Tema escuro** com cor de destaque (accent) e hierarquia tipográfica clara.
3. **Cards de projeto** com tags de tecnologia, descrição objetiva e links (repo/demo).
4. **Trajetória em duas colunas**: Formação Acadêmica + Experiência Profissional, com cards expansíveis.
5. **CTA final** ("Vamos construir algo juntos?") com e-mail e redes sociais.
6. **Microanimações** discretas (entrada de seções, hover em cards).

**O que vamos fazer diferente:** sem cursor customizado, sem certificações, sem dev logs, sem playlist, tudo em uma única página com navegação por âncoras.

---

## 3. Decisão de Tecnologia

### Comparativo: Next.js vs Astro

| Critério | **Next.js 16 (App Router)** ⭐ | Astro 5 |
|---|---|---|
| **Curva de aprendizado** | Baixa — já está no stack do Pedro (CV + Trak-Acessoria) | Média — framework novo |
| **Performance** | Ótima (SSG + ISR + otimização automática) | Excelente — **zero JS por padrão** (islands) |
| **Bundle/JS no cliente** | Leve, mas há JS do framework | Menor possível |
| **shadcn/ui** | Suporte nativo e maduro | Possível via React islands, mais setup |
| **Framer Motion** | Nativo (React) | Requer islands de React |
| **Integração GitHub API** | Direta (Server Components/fetch) | Possível, mas sem SSR nativo sem adapter |
| **SEO & metadados** | `generateMetadata` / viewport — simples | Excelente, foco em conteúdo |
| **Ecosistema de aprendizado** | Alinha com os projetos do CV (Newra News, Trak-Acessoria) | Menos alinhado |
| **Quando escolher** | Portfólio + crescimento como dev Next.js | Máxima performance com o mínimo de JS |

### 🏆 Recomendação: **Next.js 16 (App Router)**

**Justificativa:** o Pedro já trabalha com Next.js (Newra News e Trak-Acessoria usam), é a stack do mercado brasileiro para esse tipo de site, tem integração perfeita com shadcn/ui + Framer Motion, e o App Router permite renderizar dados do GitHub no servidor com SSR/ISR — projetos sempre atualizados sem JS extra no cliente. Para um portfólio que precisa ser *rápido, bonito e demonstrar as habilidades do dono*, Next.js é a escolha certa.

**Astro fica como plano B** se, após o build, a prioridade for reduzir o JS ao mínimo absoluto — mas exigiria aprender o modelo de islands e integrar shadcn/ui de forma menos fluida.

### Stack final

| Camada | Tecnologia | Papel |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | Base, rotas, SSG/ISR, metadados |
| Estilo | **Tailwind CSS v4** | Design system, responsividade, dark theme |
| Componentes | **shadcn/ui** | Componentes acessíveis e consistentes (Button, Card, Badge, Sheet/Nav mobile, Accordion) |
| Animação | **Framer Motion** | Transições de seção, hover, scroll reveals (uso criterioso) |
| Ícones | **Lucide React** | Ícones consistentes (sociais, tech, UI) |
| Fonte | **Geist / Inter** (var) | Tipografia premium + mono para detalhes (`--code`) |
| Dados | **GitHub API v3** (fetch no servidor, com revalidação ISR) | Projetos sempre atualizados |
| Deploy | **Vercel** | Build, CDN global, HTTPS automático |

---

## 4. Estrutura da Página Única (Seções)

Navegação fixa no topo (desktop) + menu mobile (shadcn Sheet). Âncoras suaves via `scroll-behavior: smooth`.

```
┌─────────────────────────────────────────────────┐
│ NAV  [logo]  Início · Sobre · Projetos ·        │
│               Trajetória · Habilidades · Contato│
├─────────────────────────────────────────────────┤
│ 1. HERO  ── badge "Disponível para oportunidades"│
│    Nome grande · "Desenvolvedor Fullstack"       │
│    bio curta · CV PDF + GitHub + LinkedIn        │
│    chips da stack (React, React Native, Next.js, │
│    TypeScript, Node.js, Fastify)                 │
├─────────────────────────────────────────────────┤
│ 2. SOBRE ── resumo profissional (curto, 2-3      │
│    frases do currículo + interesses: IA, análise │
│    de sistemas, qualidade de dados)              │
├─────────────────────────────────────────────────┤
│ 3. PROJETOS ── grid de cards vindo do GitHub     │
│    (4 principais: NetsheetEngine, Newra News,    │
│    Repertório Progressivo, Trak-Acessoria)       │
│    tags tech · link repo + demo                  │
├─────────────────────────────────────────────────┤
│ 4. TRAJETÓRIA ── timeline em 2 colunas:          │
│    Formação (UNOESTE, CCAA) + Experiência        │
│    (Palmali, Prefeitura) · cards expansíveis     │
├─────────────────────────────────────────────────┤
│ 5. HABILIDADES ── 4 blocos: Frontend & Mobile ·  │
│    Backend · Dados & Versionamento · IA & Suporte│
├─────────────────────────────────────────────────┤
│ 6. CONTATO/CTA ── "Vamos construir algo juntos?" │
│    e-mail · GitHub · LinkedIn · telefone · CV     │
├─────────────────────────────────────────────────┤
│ FOOTER ── © 2026 · nome · links sociais          │
└─────────────────────────────────────────────────┘
```

### Conteúdo real de cada seção (fonte: currículo + GitHub)

**Projetos em destaque (dados reais do GitHub de @tavinholoco):**

| Projeto | Descrição | Stack | Destaque |
|---|---|---|---|
| **NetsheetEngine** | Cyberpunk 2020 Sheet Builder & PRD Suite | React 19, Express, Supabase | Projeto mais recente |
| **Newra News** | Portal de notícias com geração diária por IA | Next.js, Fastify, TypeScript, Gemini API | Fullstack monorepo (Turborepo) |
| **Repertório Progressivo** | App mobile de organização de estudos | React Native, Expo, TypeScript, Jest | 144 testes automatizados, push notifications |
| **Trak-Acessoria** | Landing page institucional | Next.js 16, Tailwind v4, Vitest + Playwright | Qualidade com testes E2E |

**Trajetória (do currículo):**
- 🎓 **UNOESTE** — Análise e Desenvolvimento de Sistemas (Tecnólogo), 06/2022 → 06/2025 (concluído)
- 🇬🇧 **CCAA Rancharia** — Inglês avançado, 06/2022 → 12/2025 (concluído)
- 💼 **Palmali** — Aprendiz TI, 05/2025 → 02/2026 (suporte, infraestrutura de rede, CFTV)
- 💼 **Prefeitura de Rancharia** — Estagiário, 07/2023 → 05/2025 (atendimento, estoque, inventário)

**Habilidades (4 blocos):**
1. Frontend & Mobile: React.js, React Native, Next.js, Expo
2. Backend: Node.js, Fastify, TypeScript
3. Dados & Versionamento: MySQL/SQL, Git/GitHub
4. IA & Suporte Técnico: IA generativa (Claude Code), diagnóstico de hardware/redes

---

## 5. Design & Frontend (Requisitos)

| Requisito | Como será atendido |
|---|---|
| **Tailwind** | Design system em CSS variables + `tailwindcss v4`; utility classes em tudo; tema escuro via `dark` class |
| **shadcn/ui** | `Button`, `Badge`, `Card`, `Sheet` (menu mobile), `Accordion` (trajetória), `Separator`, `Tooltip` |
| **Framer Motion** | Só onde faz sentido: fade/slide-up ao entrar em viewport (`whileInView`), micro-hover em cards, animação do hero na carga. Sem exageros — performance e elegância |
| **Ícones Lucide** | Ícones de UI, sociais (GitHub, Linkedin, Mail, Download, ExternalLink) |
| **Layout premium** | Dark theme com accent vibrante, espaçamento generoso (`section py-24+`), cantos arredondados, bordas sutis (`border-white/10`), glassmorphism discreto no nav |
| **Responsivo** | Mobile-first; grid de projetos 1 → 2 → 3 colunas; nav vira Sheet; tipografia fluida com `clamp()` |
| **Hierarquia visual** | 1 nível de destaque (hero) → seções com `h2` consistentes → cards. Contraste alto (WCAG AA) |
| **Excelente UX** | Nav sticky com blur, âncoras suaves, estado de hover/focus visível, `prefers-reduced-motion` respeitado, links externos com `aria-label` e `_blank` seguro |

**Paleta sugerida (dark premium):**
- Background: `#0a0a0a` / `#0d0d0f` (quase preto)
- Surface: `#141417` / `#1a1a1f`
- Texto: `#fafafa` (primário), `#a1a1aa` (secundário)
- Accent: verde-água ou ciano (`#22d3ee`/`#2dd4bf`) — destaca CTA e tags
- Fonte: Geist Sans (títulos/corpo) + Geist Mono (código, tags, label ">_")

---

## 6. Dados & Integração GitHub

**Estratégia: híbrida (melhor dos dois mundos).**

1. **Servidor:** `fetch` à GitHub API (`/users/tavinholoco/repos`) num Server Component com `revalidate = 3600` (ISR). Projetos sempre refletem o GitHub, sem JS no cliente.
2. **Curadoria:** um arquivo `src/data/projects.ts` lista os 4 projetos em destaque (id do repo + descrição curada + demo link). O código busca metadados reais (language, stars, updated) da API e faz merge com a curadoria.
3. **Filtro:** se houver mais de 4 projetos publicáveis, filtro por categoria (Fullstack / Mobile / Landing).
4. **Fallback:** se a API falhar (rate limit), os dados estáticos curados já são suficientes — o site nunca quebra.

> ⚠️ Rate limit da GitHub API: 60 req/h sem token. Para um site com ISR de 1h, é tranquilo. Se quiser garantir, usamos um token público (fine-grained, sem escopo de escrita) via env `GITHUB_TOKEN` na Vercel.

**Dados do currículo:** hardcoded em `src/data/` (perfil, experiência, formação, habilidades, projetos). Fácil de editar sem tocar em componente.

---

## 7. Plano de Ação (Fases)

> Estimativas para desenvolvimento solo. Total estimado: **3–5 dias úteis**.

### Fase 0 — Setup (½ dia) ✅
- [x] `create-next-app` (TypeScript, Tailwind v4, App Router, ESLint)
- [x] Instalar shadcn/ui (`components.json`) e adicionar componentes base
- [x] Configurar tema dark, fontes Geist, `globals.css` com design tokens
- [x] Instalar `framer-motion` e `lucide-react`
- **Entregável:** projeto roda com tema escuro e tokens prontos

### Fase 1 — Fundação & Layout (1 dia) ✅
- [x] Nav sticky com blur + menu mobile (Sheet)
- [x] Seção **Hero** (badge, nome, título, CTAs, chips de stack, links sociais)
- [x] Seção **Sobre** (avatar, resumo em destaque, fatos rápidos, interesses)
- [x] Layout de seções (`Section` wrapper reutilizável com `whileInView`)
- **Entregável:** página com nav + hero + sobre animados

### Fase 2 — Conteúdo principal (1–1,5 dias) ✅
- [x] Seção **Projetos** (grid de cards + integração GitHub API/ISR + curadoria + filtro por categoria)
- [x] Seção **Trajetória** (timeline 2 colunas + accordion de detalhes)
- [x] Seção **Habilidades** (4 blocos com ícones, níveis e badges)
- [x] **CTA/Contato** + **Footer**
- **Entregável:** página única completa com todo o conteúdo

### Fase 3 — Polimento & UX (1 dia) ✅
- [x] Microanimações Framer Motion (scroll reveals, hovers, stagger em cards) + lift consistente nos cards
- [x] `prefers-reduced-motion`, estados de foco (utilitário `focus-ring`), acessibilidade (aria)
- [x] Scrollspy na navegação (link ativo) + sombra do header ao rolar
- [x] Responsivo validado em 8 larguras (375→1440px) via Edge headless/CDP — grid correto em todos os breakpoints; corrigido overflow do accordion da Trajetória em 768/375px
- [x] Teste de contraste e legibilidade (Lighthouse A11y 100)
- **Entregável:** versão final visual

### Fase 4 — SEO, Performance & Qualidade (½–1 dia) ✅
- [x] Metadados completos: title/description, Open Graph + Twitter card, canonical, theme-color, keywords
- [x] Favicon personalizado (`icon.svg` com iniciais PL) + OG image 1200×630 gerada via `ImageResponse` (`opengraph-image.tsx`)
- [x] Lighthouse contra build de produção: **Perf 95–97 · A11y 100 · Best Practices 100 · SEO 100** (FCP 0.9s, TTI 2.8s, CLS 0)
- [x] Entrada do hero convertida para animação CSS pura (melhora LCP/TTI e remove FOUC do framer-motion)
- [x] `next build` + `next lint` + typecheck sem erros
- [ ] Teste manual em Chrome/Edge/Safari (mobile + desktop)
- **Entregável:** build de produção limpo

> 💡 No deploy, defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://pedrolevi.dev`) para o canonical/OG apontarem para o domínio real.

### Ajustes da revisão pré-deploy ✅
- [x] Removido o badge **"Disponível para oportunidades"** do hero (poluía o design)
- [x] Adicionado **LinkedIn** (ícone oficial em `icons.tsx`) no hero, cards de contato e footer
- [x] Avatar da seção Sobre agora usa a **foto do GitHub** (baixada para `public/avatar.jpg`)
- [x] Removidos **todos os travessões (—)** dos textos do site (substituídos por vírgulas, "·" e "|" em títulos)
- [x] Badge **"Em desenvolvimento"** nos cards de Newra News e Netsheet Engine
- [x] Nova seção **"Projetos para clientes"** (abaixo de Projetos, id `#clientes`, link na nav): card leva direto ao site do projeto (Dandarkness)
- [x] Cards de clientes redesenhados: **prévia do site** (screenshot do topo da página em `public/projects/`) com badge "No ar" sobreposto + informações abaixo da imagem; removida a menção a repositórios privados
- [x] Re-validado: build, lint, links (LinkedIn/Dandarkness OK) e responsividade em 6 larguras (375→1440px, zero overflow)

### Ajustes de navegação, tema e idioma ✅
- [x] Nome do hero reduzido para **"Pedro Levi"** (removido "Dias Rosa Paula")
- [x] Navbar: removido o botão **Contatar**; links (Início, Sobre, Projetos, Clientes, Trajetória, Habilidades, Contato) movidos para a **direita** da página; hamburger agora só abaixo de `lg`
- [x] **Tema claro/escuro**: variáveis de tema reestruturadas (`:root` = claro, `.dark` = escuro), script anti-flash no `layout.tsx`, botão no header (localStorage `theme`), cores e badges adaptados (contraste validado nos dois temas)
- [x] **Tradução pt-BR/EN**: dicionários em `src/i18n/` (pt.ts + en.ts), cookie `lang` com renderização SSR por idioma, metadados/OG por idioma, datas dos projetos no idioma correto, botão no header (alterna e recarrega)
- [x] Re-validado: build, lint, console limpo, responsividade em **2 temas × 5 larguras** (zero overflow), layout do header confirmado no desktop (nav à direita) e menu mobile OK

### SEO bilíngue (hreflang + sitemap) ✅
- [x] Rotas separadas por idioma: `/` (pt-BR) e `/en/` (inglês), ambas **estáticas com ISR 1h** (`trailingSlash` para URLs estáveis)
- [x] **hreflang** em cada rota via `alternates.languages` (pt-BR, en, x-default) + canonical próprio por idioma
- [x] **Sitemap** `/sitemap.xml` com as duas variantes e links alternates xhtml
- [x] **OG image em inglês** para `/en/` (texto "fullstack developer")
- [x] Botão de idioma agora navega entre as rotas (sem cookie); `metadata.ts` centraliza os metadados por idioma
- [x] Validado em produção (`pnpm build` + `pnpm start`): hreflang/canonical/sitemap/OG presentes, `/en/` 200 e `/en` redireciona para `/en/`

### Fase 5 — Deploy (½ dia)
- [ ] Repositório no GitHub, push, importar na Vercel
- [ ] Domínio próprio (opcional): DNS + HTTPS
- [ ] Variável `GITHUB_TOKEN` (opcional) e `revalidate` configurados
- [ ] Checklist pós-deploy (testar links, ISR, OG image)
- **Entregável:** site no ar 🚀

---

## 8. Checklist de Aceite (Definition of Done)

- [ ] Uma única página com: Hero, Sobre, Projetos, Trajetória, Habilidades, Contato, Footer
- [ ] Projetos vêm do GitHub real (ISR) com curadoria dos 4 destaques
- [ ] Sem cursor personalizado, sem certificações, sem dev logs, sem playlist
- [ ] Dark theme premium, responsivo em todas as breakpoints
- [ ] Animações Framer Motion discretas + `prefers-reduced-motion`
- [ ] Lighthouse: performance ≥ 95, acessibilidade ≥ 100
- [ ] Links externos corretos (CV, GitHub, LinkedIn, repos)
- [ ] Typecheck + lint + build limpos

---

## 9. Riscos & Mitigações

| Risco | Prob. | Mitigação |
|---|---|---|
| Rate limit da GitHub API | Média | ISR de 1h + fallback estático curado |
| Conteúdo do CV desatualizado | Alta | Dados centralizados em `src/data/`, edição sem tocar em componente |
| Animações pesadas no mobile | Baixa | Framer Motion com `viewport={{ once: true }}` e transforms (GPU) |
| Acessibilidade (contraste) | Baixa | Paleta com verificações AA; badges com texto legível |
| Conflito com tarefas (workspace compartilhado) | Baixa | Trabalhar em branch própria durante a implementação |

---

## 10. Próximos Passos

1. ✅ Aprovar este plano (ajustar o que quiser)
2. ▶️ **Iniciar Fase 0** (setup do projeto Next.js)
3. Iterar fase a fase com revisão visual após a Fase 1 e Fase 2

> ✍️ **Nota:** este documento pode ser atualizado conforme decisões forem tomadas (ex.: trocar accent, adicionar projeto, mudar domínio).

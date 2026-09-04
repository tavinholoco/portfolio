# 🚀 Plano V2 do Portfólio — Pedro Levi

> **Objetivo da v2:** reposicionar o site de "catálogo de tecnologias" para **"aqui está como eu penso, o que eu construí e por que consigo resolver problemas de software."**
>
> **Base:** v1 já publicada (Next.js 16 App Router, Tailwind v4, Framer Motion, shadcn/ui, pt-BR + en, ISR 1h, CI com 21 testes).
> **Status:** ✅ **v2 completa** — Fases 1–10 implementadas e commitadas (12 commits locais sobre a v1). ✅ **Revisão pós-v2 (13/08/2026)** — auditoria executada, correções aplicadas e documentadas na seção 7.4. ✅ **Deploy em produção (14/08/2026)** — Vercel + Lighthouse (seção 8). ✅ **Ajustes de conteúdo (14/08/2026)** — duas rodadas solicitadas pelo Pedro, implementadas e documentadas nas seções 7.5 e 7.6.

---

## 1. Princípios que guiam a v2

| Antes (v1) | Depois (v2) |
|---|---|
| "Eu conheço tecnologias" (lista + níveis) | "Eu resolvo problemas" (problema → solução → resultado) |
| Um CTA tentando falar com todo mundo | Dois públicos separados: **recrutador** e **cliente/freela** |
| Hero institucional ("Profissional de tecnologia formado em...") | Hero de posicionamento ("esse é o tipo de problema que eu resolvo") |
| Cards: nome → descrição → stack | Cards: **Problema → Solução → Destaque técnico → Stack** |
| Trajetória como lista de cargos | Timeline com narrativa: Suporte → Infraestrutura → Dev → Full Stack → IA |
| Habilidades com nível "Intermediário" | Habilidades por categoria, nível demonstrado pelos projetos |

**Restrições técnicas da v2 (herdadas da v1):**
- Todo texto continua em **pt.ts + en.ts** (paridade estrutural é testada — `i18n/index.test.ts`).
- Seções são componentes em `src/components/`; dados tipados em `src/i18n/index.ts` e `src/data/`.
- Projetos continuam vindo da curadoria + GitHub API (ISR) — `src/lib/github.ts`.
- Não virar "parede de certificados": as categorias de skills ficam em **4 blocos enxutos**, sem logos.
- Metas: build/lint/typecheck limpos, **36 testes unitários (Vitest) + 6 testes E2E (Playwright)** passando, Lighthouse A11y 100.

---

## 2. Arquitetura de dados nova (fundação de tudo)

Toda mudança de conteúdo passa por **novos tipos + novos dados nos dicionários**. Esta é a Fase 0 porque as demais fases consomem esses modelos.

### 2.1 Projetos — modelo `problema → solução → destaque`

Novo tipo `FeaturedProject` (em `src/i18n/index.ts`):

```ts
export type FeaturedProject = {
  slug: string;            // usado na página individual (/projetos/[slug])
  repo: string;            // nome do repo no GitHub (para merge com a API)
  title: string;
  tagline: string;         // frase curta de impacto (ex.: "Portal de notícias com IA")
  problem: string;         // "Problema:" — por que o projeto existe
  solution: string;        // "Solução:" — arquitetura / abordagem
  highlight: string;       // "Destaque técnico:" — o diferencial
  stack: string[];         // tags da stack
  category: ProjectCategory;
  inDevelopment?: boolean;
  demoUrl?: string;        // link de demo (Newra News ganha um)
  learnings?: string[];    // o que aprendi (usado na página individual)
};
```

Conteúdo proposto para os 4 projetos em destaque:

| Projeto | Problema | Solução | Destaque técnico | Stack |
|---|---|---|---|---|
| **Newra News** | Portal precisava gerar e organizar conteúdo de notícias diariamente | Arquitetura full stack com Next.js + Fastify + Gemini | Monorepo Turborepo e integração com IA generativa | Next.js · Fastify · Gemini · Turborepo · TypeScript |
| **Netsheet Engine** | Fichas de personagem de Cyberpunk 2020 dispersas e sem padrão | Suite com CRUD, PRD e documentação de produto | React 19 + Supabase, dados modelados como produto | React · Express · Supabase · TypeScript |
| **Repertório Progressivo** | Estudantes sem organização de repertório de estudos | App mobile com push notifications e rotinas | 144 testes automatizados (Jest) | React Native · Expo · TypeScript · Jest |
| **Trak-Acessória** (se mantida) | Landing institucional com presença profissional | Next.js 16 + Tailwind v4 | Qualidade com testes E2E (Vitest + Playwright) | Next.js · Tailwind · TypeScript |

### 2.2 Clientes — modelo de case comercial

Novo tipo `ClientProject` (substitui o atual):

```ts
export type ClientProject = {
  name: string;
  client: string;          // "Cliente:"
  type: string;            // "Tipo:" (ex.: Portfólio artístico)
  tech: string[];          // "Tecnologias:"
  outcome: string;         // resultado/descrição curta
  url: string;
  image: string;
};
```

Exemplo (Dandarkness): cliente `Dandarkness` · tipo `Portfólio artístico` · stack `Next.js · TypeScript · Tailwind CSS` · CTA `[Visitar projeto]`.

### 2.3 Trajetória — timeline com narrativa

Novo tipo `TimelineChapter` (substitui `CareerItem` em `src/data/career.ts`):

```ts
export type TimelineChapter = {
  year: string;            // 2023 / 2025 / 2026
  title: string;           // "Estágio", "Formação", ...
  org: string;             // "Prefeitura de Rancharia"
  learnings: string[];     // "O que aprendi nesta etapa"
  tags: string[];          // stack/assunto da etapa
};
```

Estrutura proposta (com aprendizado em cada etapa):

```
2023 — Estágio · Prefeitura de Rancharia
  Aprendizado: atendimento ao usuário, organização, paciência para diagnosticar antes de agir
2025 — Formação · ADS • UNOESTE        │  Aprendiz TI · Palmali
  Aprendizado: fundamentos de programação, modelagem de dados  │  suporte, infraestrutura de rede, CFTV
2026 — Desenvolvedor Full Stack · Projetos próprios + clientes
  Aprendizado: arquitetura, monorepo, IA aplicada, entrega para cliente
```

Narrativa: **Suporte → Infraestrutura → Desenvolvimento → Full Stack → IA**. O inglês (CCAA) entra como capítulo ou tag da etapa de formação.

### 2.4 Skills — 4 categorias sem nível

Novo modelo (remove `level` de `SkillBlock`):

| Categoria | Skills |
|---|---|
| **Desenvolvimento** | React · Next.js · Node.js · Fastify · TypeScript |
| **Dados** | MySQL · SQL · Supabase |
| **IA & Automação** | Gemini API · Claude Code · IA generativa · Automação |
| **Ferramentas** | Git · GitHub · Docker · VS Code |

- ❌ removido: `LevelDots` ("Intermediário") do componente `skills.tsx`.
- ➕ adicionado: **Docker** (principal + categoria Ferramentas), **Supabase** (já usado em Netsheet Engine).
- VS Code sai da categoria de IA e vai para Ferramentas. "Antigravity" e "Hardware & Redes" saem da seção de skills (Hardware/Redes fica citado na timeline da Palmali, onde faz sentido narrativo).
- O **nível é demonstrado pelos projetos** — a seção de skills fica visualmente enxuta (sem dots de nível).

### 2.5 "Como trabalho" — novo bloco

Novo dicionário `process` (5 passos):

```
01 · Entendo   — Entendo o problema e os requisitos antes de escolher a tecnologia.
02 · Planejo   — Estruturo arquitetura, dados e fluxo da aplicação.
03 · Desenvolvo— Construo com componentes reutilizáveis, boas práticas e testes.
04 · Valido    — Testo funcionalidades e comportamento antes da entrega.
05 · Entrego   — Deploy, documentação e manutenção.
```

### 2.6 Métricas ("Engenharia além da interface")

Novo bloco `metrics` na seção Sobre, reusando os números que já existem (`about.stats`):

| Métrica | Valor | Origem |
|---|---|---|
| Testes automatizados | 144+ | Repertório Progressivo (Jest) |
| Projetos full stack | 4+ | GitHub |
| Áreas de exploração em IA | 3 | análise, dados, automação |
| Anos de formação/experiência técnica | 3+ | ADS (2022→2025) + estágio/aprendiz |

> Interesse de IA muda de "Treinamento de IA" para **"IA aplicada ao desenvolvimento e automação"**.

---

## 3. Fases de implementação (ordem = prioridade do usuário)

> Estimativa total: **5–8 dias úteis**. Cada fase termina com build + typecheck + testes verdes (os 21 testes da v1 serão atualizados).
>
> **Estado:** todas as fases 0–10 foram implementadas e validadas — ver seção 7.4 (revisão pós-v2) e seção 8 (estado atual).

### 🔴 FASE 1 — Hero de posicionamento (Alta) · ~½ dia

**Arquivos:** `src/components/hero.tsx`, `src/i18n/pt.ts`, `src/i18n/en.ts`, `src/data/profile.ts`

1. Novo copy:
   - `role`: `Desenvolvedor Full Stack` (remover "fullstack" junto → "Full Stack" com espaço, alinhado ao SEO).
   - `bio`: **"Construo aplicações web e mobile com foco em arquitetura, qualidade e experiências funcionais."**
   - chips de stack abaixo: **React · Next.js · Node.js · TypeScript** (exatamente 4 — decisão 12: Docker entra só na seção de skills; `profile.stack` é reduzido para esses 4).
2. Resposta aos 4 "porquês" em 5 segundos:
   - Quem é você? → nome grande (mantém "Pedro Levi").
   - O que você faz? → `Desenvolvedor Full Stack` + bio curta.
   - Em que você é bom? → chips React/Next/Node/TS.
   - Por que continuar olhando? → CTAs "Ver projetos" (âncora #projetos) e "Baixar CV".
3. CTAs do hero passam a **4 ações**: `Ver projetos` (primário) · `Baixar CV` (outline) · `LinkedIn` · `GitHub` (ícones com rótulo ou tooltip, substituindo o conjunto atual de 4 ícones sociais que inclui email/telefone — estes migram para o Contato).

**Aceite:** o visitante entende quem/que/porquê sem rolar; 4 CTAs visíveis; LCP preservado (título continua primeiro elemento animado).

### 🔴 FASE 2 — Projetos: destaque Newra News + cards problema→solução (Alta) · 1,5–2 dias

**Arquivos:** `src/i18n/index.ts` (tipos), `pt.ts`/`en.ts` (dados), `src/components/projects.tsx`, `src/components/projects-grid.tsx`, **novo** `src/components/featured-project.tsx`, `src/lib/github.ts`

1. **Projeto principal (Newra News)** — novo componente `FeaturedProject` acima do grid:
   - Layout "hero de projeto": palavra `NEWRA NEWS` em destaque, tagline ("Portal de notícias full stack com geração automatizada de conteúdo utilizando IA."), stack `Next.js · Fastify · Gemini · Turborepo · TypeScript`, CTAs `[Ver projeto] [GitHub]`.
   - Visual: card largo (largura total, 2 colunas internas em desktop), badge "Projeto principal". A imagem do portal fica como **mockup em CSS puro** por enquanto (decisão 7 — sem screenshot real; `public/projects/newra-news.png` pode entrar depois quando o portal estiver no ar).
2. **Cards dos demais projetos** passam para a estrutura:
   - `Problema:` → `Solução:` → `Destaque técnico:` → `Stack:` → `[Ver projeto] [GitHub]`.
   - Layout: linhas rotuladas (label mono pequeno + texto), stack como chips, links no rodapé do card.
3. **Filtros** mantidos, mas valem **só para o grid** — o featured fica sempre visível acima (decisão 9; senão o filtro "mobile" esconderia o Newra News). Contagem de projetos mantida para o grid.
4. `github.ts`: o merge curadoria + API continua, mas o card usa o texto curado (problema/solução/destaque) e a API só enriquece (language, updatedAt, stars).
5. **Badges "Em desenvolvimento" removidos do site inteiro** (decisão 6): nenhum projeto renderiza badge de desenvolvimento — o campo `inDevelopment` deixa de ser exibido.

**Aceite:** Newra News domina a seção; nenhum card tem mais a estrutura antiga; recrutador entende "sistemas", não "sites".

### 🔴 FASE 3 — Páginas individuais dos projetos (Alta) · 1,5–2 dias

**Arquivos novos:** `src/app/projetos/[slug]/page.tsx`, `src/app/en/projects/[slug]/page.tsx`, `src/components/project-detail.tsx` (reuso de estilos)

1. Rotas por idioma: `/projetos/[slug]` (pt) e `/en/projects/[slug]` (en), estáticas via `generateStaticParams` (4 slugs) + `dynamicParams = false`. **Slugs curados** (`netsheet-engine`, etc.) em `src/data/projects.ts`, junto com `repo` e `demoUrl` (decisão 5 — mesmo padrão do `profile.ts`).
2. Página do projeto contém: hero do projeto (tagline + stack), **Problema / Solução / Destaque técnico** em bloco, **"O que aprendi"** (learnings), links GitHub/Demo, próximos projetos (prev/next), CTA final.
3. Cada página tem **metadados próprios**: title, description, canonical, OG (imagem do projeto ou OG genérica) e **JSON-LD `SoftwareApplication`** (nome, url, description, offers/authors, keywords).
4. **Sitemap** (`src/app/sitemap.ts`) passa a listar as 2 rotas principais + 8 rotas de projeto (com `alternates.languages`).
5. Cards da home e do featured project linkam para a página individual (`[Ver projeto]` → `/projetos/newra-news`).

**Aceite:** 10 URLs indexáveis; cada projeto com página própria; navegação prev/next funcional; `/projetos/[slug]` inexistente → 404.

### 🔴 FASE 4 — Clientes → "Projetos profissionais" (case de cliente) (Alta) · ~1 dia

**Arquivos:** `src/components/client-projects.tsx`, `src/i18n/*` (tipo `ClientProject` novo)

1. Renomear seção para **"Projetos profissionais"** (nav `#clientes` mantém id, rótulo muda).
2. Card no formato case:
   - Nome (Dandarkness)
   - `Cliente: Dandarkness` · `Tipo: Portfólio artístico` · `Tecnologias: Next.js · TypeScript · Tailwind CSS` (stack confirmada — decisão 11)
   - Descrição curta de resultado + CTA `[Visitar projeto]` (mantém screenshot + badge "No ar").
3. Se houver mais de um projeto de cliente, o grid suporta N cases.

**Aceite:** seção demonstra capacidade **comercial**; CTA claro para freelas.

### 🔴 FASE 5 — SEO completo + OG image (Alta) · 1–1,5 dia

**Arquivos:** `src/lib/metadata.ts` (buildMetadata), `src/app/page.tsx` + `src/app/en/page.tsx` (onde os metadados são exportados), `src/app/opengraph-image.tsx` + `src/app/en/opengraph-image.tsx`, **novo** `src/app/robots.ts`, `src/app/sitemap.ts` (atualizado), **novo** `src/components/json-ld.tsx`

1. **Title:** `Pedro Levi | Desenvolvedor Full Stack` (ambos idiomas, ajustado no en).
2. **Meta description (pt):** "Desenvolvedor Full Stack especializado em React, Next.js, Node.js e TypeScript. Confira meus projetos web, mobile e soluções com IA."
3. **JSON-LD (Schema.org):**
   - `Person` (nome, url, jobTitle, email, sameAs GitHub/LinkedIn, address).
   - `WebSite` (name, url, inLanguage, potentialAction/WebSite).
   - `ItemList`/`CreativeWork` com os projetos (name, url, description) — injetado via `<script type="application/ld+json">` no layout/home e nas páginas de projeto (`SoftwareApplication`).
4. **robots.txt** via `robots.ts`: permite tudo, aponta `Sitemap:`.
5. **OG image específica** (`opengraph-image.tsx` já existe — reformular): 1200×630 com identidade visual do site — fundo dark + accent, `Pedro Levi`, `Desenvolvedor Full Stack`, `React · Next.js · Node.js · TypeScript`. Manter variante em inglês para `/en/`.
6. **Canonical** já existe (mantém); garantir por página de projeto.
7. **favicon** `icon.svg` já existe — refinar no polimento (Fase 8) se necessário.

**Aceite:** preview de compartilhamento (WhatsApp/Discord/LinkedIn) mostra a identidade visual; validação em `rich results` sem erros; robots/sitemap/JSON-LD presentes no build de produção.

### 🟡 FASE 6 — Sobre reforçado + métricas + "Como trabalho" (Média) · ~1 dia

**Arquivos:** `src/components/about.tsx`, **novo** `src/components/process.tsx`, `src/app/portfolio-page.tsx`, `src/i18n/*`

1. **Sobre:** manter avatar/fatos; trocar `about.stats` pelo bloco **"Engenharia além da interface"** (título + 4 métricas: 144+ testes, 4+ projetos full stack, 3 áreas de IA, 3+ anos).
2. Interesse de IA → **"IA aplicada ao desenvolvimento e automação"** com **copy compacta** (automação de fluxos, geração de conteúdo, code assist). ⏸️ **GATE (decisão 10): ao escrever essa copy — e a métrica de "áreas de IA" —, pausar a implementação e aguardar a aprovação do Pedro antes de seguir adiante neste ponto.**
3. **Nova seção "Como trabalho"** (`process.tsx`): 5 passos numerados (01–05) em lista/grid horizontal no desktop, vertical no mobile. Posicionamento na página: **entre Projetos/Clientes e Trajetória** (conta a história de "como eu penso" antes do "onde estive").
4. **Não adicionar "Como trabalho" à nav** (decisão 8) — a nav mantém os 7 itens atuais; a seção fica acessível por scroll e pelos CTAs.

**Aceite:** visitante vê "engenheiro de software", não "montador de telas"; seção process autoexplicativa em 5 segundos.

### 🟡 FASE 7 — Trajetória em storytelling + Habilidades reorganizadas (Média) · 1–1,5 dia

**Arquivos:** `src/components/career.tsx`, `src/components/skills.tsx`, `src/data/career.ts`, `src/i18n/*`

1. **Career** vira timeline vertical única por ano (2023 → 2025 → 2026), com:
   - rail visual + dot por capítulo;
   - título + org + período;
   - bloco "O que aprendi" (learnings) em destaque;
   - tags da etapa;
   - narrativa implícita: Suporte → Infraestrutura → Dev → Full Stack → IA.
   - Remove `Accordion` (a timeline é contínua e legível sem expansão; detalhes ficam nos learnings).
2. **Skills** com o novo modelo de 4 categorias (2.4): sem `LevelDots`, sem "Intermediário"; ícones mantidos (MonitorSmartphone, Server, Database, Sparkles → trocar Sparkles por ícone de Ferramentas ex. Wrench/Cog para a categoria Ferramentas).

**Aceite:** timeline conta história em 1 scroll; seção de skills sem nenhuma classificação de nível; Docker e Supabase presentes.

### 🟡 FASE 8 — Contato com CTAs duplos (Média) · ~½ dia

**Arquivos:** `src/components/contact.tsx`, `src/i18n/*`

1. Substituir o bloco único por **duas CTAs lado a lado**:
   - **"Está contratando?"** → botão `[Ver currículo]` (abre `profile.cvUrl`).
   - **"Tem um projeto?"** → botão `[Falar comigo]` (WhatsApp ou mailto).
2. Manter abaixo os cards de contato (email, whatsapp, LinkedIn, GitHub) e o título de apoio discreto.
3. Hero: email/telefone saem dos ícones sociais (ficam só no Contato), dando espaço aos 4 CTAs da Fase 1.

**Aceite:** dois públicos → dois caminhos; nenhum CTA genérico "Vamos construir algo juntos?".

### 🟢 FASE 9 — Refinamento visual & acessibilidade (Baixa) · 1 dia

**Arquivos:** `globals.css`, componentes de seção (`section.tsx`, `projects-grid.tsx`, `featured-project.tsx`), `site-header.tsx`

1. **Scroll progress** — barra fina de progresso no topo (novo componente client, `useScroll` do framer-motion, respeitando `prefers-reduced-motion`).
2. **Microanimações:** transições entre seções (fade/slide mais suaves), stagger consistente, hover mais sofisticado nos cards (borda glow + seta/ícone que se move, sombra em camadas).
3. **Acessibilidade:** manter `focus-ring`, `aria` nos novos componentes, contraste AA nos novos rótulos (ex.: labels "Problema:"/"Solução:"), `prefers-reduced-motion` em tudo que animar.
4. **favicon** refinado se o atual destoar da nova OG.
5. Revalidar responsividade: 2 temas × 6 larguras (375 → 1440px), zero overflow.

**Aceite:** Lighthouse A11y ≥ 100, sem regressão de performance (LCP ≤ 1s), animações só com intenção.

### ✅ FASE 10 — Testes, validação e deploy (Todas) · ~1 dia

1. **Atualizar testes existentes** (`src/i18n/index.test.ts`, `src/lib/github.test.ts`, `src/lib/metadata.test.ts`): novos campos dos dicionários, paridade pt/en estendida (inclui `process`, `metrics`, novo `skills`, novo `career`), formato dos projetos.
2. **Novos testes:** páginas de projeto geram `generateStaticParams` corretos; JSON-LD presente; sitemap com 10 URLs.
3. `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` limpos.
4. Rodar `pnpm start` + validar: hreflang, canonical, robots, sitemap, OG image (pt/en), rotas de projeto 200, slugs inválidos 404.
5. Deploy na Vercel (preview → produção) e validação pós-deploy com Lighthouse.

---

## 4. Mapa de impacto por arquivo

| Área | Arquivos | Fase |
|---|---|---|
| Arquitetura de dados nova (tipos + curadoria neutra) | `src/i18n/index.ts` (tipos), `src/data/projects.ts`, `src/data/career.ts` | **0** |
| Dicionários pt/en | `src/i18n/pt.ts`, `en.ts`, `index.ts` (tipos) | 1–8 |
| Hero | `src/components/hero.tsx` | 1 |
| Projetos | `projects.tsx`, `projects-grid.tsx`, **`featured-project.tsx`** (novo), `src/lib/github.ts` | 2 |
| Páginas de projeto | **`src/app/projetos/[slug]/`**, **`src/app/en/projects/[slug]/`**, `src/components/project-detail.tsx` (novo) | 3 |
| Clientes | `src/components/client-projects.tsx` | 4 |
| SEO/OG | `src/lib/metadata.ts`, `src/app/opengraph-image.tsx`, **`robots.ts`** (novo), `src/app/sitemap.ts`, `src/components/json-ld.tsx` (novo) | 5 |
| Sobre + métricas + processo | `src/components/about.tsx`, **`process.tsx`** (novo), `src/app/portfolio-page.tsx` | 6 |
| Trajetória + skills | `src/components/career.tsx`, `skills.tsx`, `src/data/career.ts` | 7 |
| Contato | `src/components/contact.tsx` | 8 |
| Refinamento | `globals.css`, `section.tsx`, `site-header.tsx`, **scroll-progress.tsx** (novo) | 9 |
| Testes/CI | `src/i18n/index.test.ts`, `src/lib/*.test.ts`, novos testes | 10 |

---

## 5. Riscos & mitigações

| Risco | Mitigação |
|---|---|
| Copy nova "problema/solução" soa artificial | Escrever com dados reais de cada repo; revisar com o dono antes da Fase 2 |
| 10 URLs novas degradam performance | Todas estáticas (`generateStaticParams`), sem JS extra; OG por projeto é só se necessário |
| Seção "Como trabalho" estoura a nav | Avaliar rótulo curto ou acesso por scroll; nav já tem 7 itens |
| Testes de paridade pt/en quebram a cada campo novo | Atualizar o teste de paridade na mesma fase das mudanças de dicionário |
| GitHub API (demoUrl do Newra News) | `demoUrl` vem da curadoria (estático), não da API |
| Regressão de Lighthouse (mais animações) | Animações só com `whileInView`/CSS transform; reduzir motion respeitado |

---

## 6. Ordem de prioridade (resumo executivo)

0. 🔴 **Fase 0** Arquitetura de dados nova (tipos + dicionários — fundação das demais)
1. 🔴 **Fase 1** Hero (impacto imediato no primeiro scroll)
2. 🔴 **Fase 2** Projetos com problema→solução + destaque Newra News
3. 🔴 **Fase 3** Páginas individuais dos projetos
4. 🔴 **Fase 4** Clientes → Projetos profissionais (case)
5. 🔴 **Fase 5** SEO + OG + JSON-LD + robots + sitemap
6. 🟡 **Fase 6** Sobre + métricas + "Como trabalho"
7. 🟡 **Fase 7** Timeline storytelling + skills por categoria (sem nível)
8. 🟡 **Fase 8** Contato com 2 CTAs
9. 🟢 **Fase 9** Microanimações, scroll progress, acessibilidade
10. ✅ **Fase 10** Testes, validação e deploy

> Cada fase é um PR/commit revisável. Se quiser, a Fase 2 pode ser dividida em 2a (destaque Newra News) e 2b (cards), para revisão visual antes de tocar no grid inteiro.

---

## 7. Revisão pós-planejamento (confronto com o código real)

> Revisado contra o código da v1 em `main` (components, dicionários, `github.ts`, testes, config). Seções 7.1–7.3: correções, decisões em aberto e itens que faltavam. **Tudo abaixo deve ser incorporado antes ou durante a implementação.**

### 7.1 Correções (o plano divergia do código)

1. **Fase 5 listava arquivo inexistente.** `src/app/metadata.ts` não existe; os metadados ficam em `src/lib/metadata.ts` (`buildMetadata`) e são exportados em `src/app/page.tsx` e `src/app/en/page.tsx`. Lista corrigida acima.
2. **`github.ts` sobrescreve a curadoria.** Hoje o merge faz `demoUrl: gh?.homepage || null` — a homepage do GitHub vence. Para o plano (demo curada, ex.: Newra News) funcionar, trocar para `gh?.homepage ?? featured.demoUrl ?? null`. Além disso, `getFeaturedProjects` devolve `Project[]` espalhando `...featured` — o tipo `Project` em `src/lib/github.ts` precisa ganhar os campos novos (`problem`, `solution`, `highlight`, `tagline`, `slug`, `learnings`, `stack`), senão os componentes novos não tipam.
3. **Hero sem email/telefone quebra o header.** `src/components/site-header.tsx` (menu mobile) referencia `d.hero.socials.email` e `d.hero.socials.github`. Se o hero perder email/telefone, o tipo quebra. Decidir: manter `hero.socials` completo no dicionário e apenas não renderizar email/phone no hero, ou mover essas chaves para `contact` e atualizar o header/footer.
4. **Testes de paridade precisam crescer junto.** `src/i18n/index.test.ts` já valida mesmos repos e mesmas URLs de clientes em pt/en. Novos campos (slugs, `learnings`, `stack` de clientes, métricas) exigem asserts novos de paridade — incluir na Fase 10.

### 7.2 Decisões em aberto — ✅ resolvidas (13/08/2026)

5. **Slug das páginas de projeto.** ✅ Curados em `src/data/projects.ts` (`slug` + `repo` + `demoUrl` em arquivo neutro; só texto traduzível nos dicionários) → `netsheet-engine`. Refletido na Fase 3.
6. **Badge "Em desenvolvimento".** ✅ Removido do site inteiro — nenhum projeto renderiza badge de desenvolvimento (`inDevelopment` deixa de ser exibido). Refletido na Fase 2.
7. **Imagem do Newra News.** ✅ Mockup em CSS puro por enquanto, sem screenshot real; `public/projects/newra-news.png` entra depois quando o portal estiver no ar. Refletido na Fase 2.
8. **"Como trabalho" na nav.** ✅ Não entra na nav (7 itens atuais mantidos); seção acessível por scroll e CTAs. Refletido na Fase 6.
9. **Filtros com o featured.** ✅ Featured sempre visível acima do grid; filtros e contagem valem só para o grid. Refletido na Fase 2.
10. **Copy de IA (e métrica de áreas).** ✅ Copy compacta: "IA aplicada ao desenvolvimento e automação" — automação de fluxos, geração de conteúdo, code assist. ⏸️ **GATE: após escrever essa copy, pausar e aguardar a decisão do Pedro antes de prosseguir neste ponto.** Refletido na Fase 6.
11. **Stack do Dandarkness.** ✅ Confirmada: **Next.js · TypeScript · Tailwind CSS**. Refletido na Fase 4.
12. **Chips do hero.** ✅ Exatamente 4 chips (React · Next.js · Node.js · TypeScript); Docker entra só na seção de skills; `profile.stack` reduzido para esses 4. Refletido na Fase 1.

### 7.3 Itens que faltavam no plano

13. **Metadata por página de projeto.** `buildMetadata(lang)` só serve as raízes (`/` e `/en/`). Criar `buildProjectMetadata(project, lang)` (title, description, canonical, hreflang, OG) e `languageUrlsFor(path)` para sitemap/alternates. Com `trailingSlash: true`, o canonical deve ser `/projetos/newra-news/`.
14. **robots.ts** deve apontar o sitemap absoluto: `Sitemap: ${getSiteUrl()}/sitemap.xml`.
15. **Fase 0 fora do sumário.** Está descrita na seção 2 mas não aparecia na lista nem no mapa de impacto. ✅ Corrigido na revisão de 13/08/2026: adicionada como fase 0 na seção 6 e ao mapa de impacto (seção 4).
16. **OG por projeto: adiar.** Usar a OG genérica (reformulada na Fase 5) nas páginas de projeto — evita 8 arquivos de imagem por projeto. Registrar como refinamento futuro.
17. **Limpeza de assets legados.** `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` são sobras do create-next-app — remover.

### 7.4 Revisão pós-v2 (13/08/2026) — auditoria e correções aplicadas

> Auditoria dos 29 commits de `main` contra este plano, com validação ao vivo (SSR via `curl`, navegação no navegador e suites de teste). Todas as correções abaixo foram implementadas e validadas (typecheck, lint, 36 unit + 6 E2E, build).

1. **Botão de idioma perdia o contexto em páginas de projeto.** De `/projetos/[slug]`, o toggle levava para a home `/en/` em vez do par traduzido `/en/projects/[slug]`. ✅ Corrigido: helper `src/lib/lang-path.ts` + `usePathname()` mapeiam a rota correspondente nos dois sentidos (4 testes unitários novos).
2. **Nav e logo com âncoras mortas em páginas de projeto.** Os links `#inicio`, `#projetos` etc. não existem na página individual — o clique não fazia nada. ✅ Corrigido: em páginas de projeto, nav/logo apontam para a home do idioma (`/#projetos`, `/en/#projetos`).
3. **`<html lang>` errado no SSR das rotas en.** `/en/` e `/en/projects/...` eram servidas com `lang="pt"` (um script no cliente corrigia depois — falha para crawlers e leitores de tela sem JS). ✅ Corrigido com **root layouts por idioma** (route groups `(home)` → `/` e `en` → `/en/`), cada um com `<html lang>` próprio. Detalhe: `robots.ts` precisa ficar no nível raiz de `src/app/` — dentro do route group ele não gera `/robots.txt` no Next 16.3.0 (o `sitemap.ts`, curiosamente, gera).
4. **Aviso de `metadataBase` no build.** O `opengraph-image.tsx` é resolvido no segmento do **layout**, e os layouts não definiam `metadataBase` (só o `page.tsx`), então o merge intermediário caía em `http://localhost:0` e emitia o aviso. ✅ Corrigido exportando `metadataBase` nos dois root layouts — o aviso sumiu e toda rota (inclusive 404) herda a base. O problema já existia antes do refactor (o layout raiz antigo também não exportava `metadataBase`).
5. **Testes E2E do idioma.** ✅ Adicionado Playwright (`e2e/html-lang.spec.ts`, 6 testes) validando o `<html lang>` no HTML bruto servido (SSR) e no DOM, por rota — job `e2e` no CI (`.github/workflows/ci.yml`).
6. **README.** ✅ Atualizado: comentário do `lang-toggle` (descrevia "cookie + reload" da v1), estrutura com `(home)/` e `en/`, seção de idioma/tema e E2E/scripts.
7. **`theme-color` refletia só o padrão escuro.** O `viewport` exportava `#0a0a0b` mesmo com tema claro salvo. ✅ Corrigido: o script anti-flash agora também atualiza o `<meta name="theme-color">` antes do primeiro paint (`#0a0a0b` escuro / `#fafafa` claro).

**Pendências identificadas (não bloqueiam o deploy):**

- **Demo do Newra News:** `src/lib/github.ts` dá prioridade à `homepage` do repo na API; o `demoUrl` curado (`newra-news-web.vercel.app`) só vale se a homepage do repo estiver vazia. Conferir/cadastrar a homepage correta no repositório para o domínio canônico prevalecer.

### 7.5 Revisão de conteúdo (14/08/2026) — ajustes solicitados pelo Pedro

> Ajustes de conteúdo pós-deploy, implementados e validados (typecheck, lint, 36 testes unitários e build de produção limpos).

1. **Seção Sobre enxuta.** Removidos `about.description` ("Quem sou por trás do código e o que me move a cada projeto.") e o segundo parágrafo do `about.summary` (trajetória no suporte e na infraestrutura de TI) dos dicionários pt/en e do tipo `Dict`; o `SectionHeading` do Sobre deixa de receber descrição.
2. **Barra de progresso removida.** O `ScrollProgress` (Fase 9) saiu dos dois root layouts (`/` e `/en/`) e o componente `src/components/scroll-progress.tsx` foi excluído.
3. **Sem travessões (—) em lugar nenhum.** Substituídos por vírgulas, dois-pontos e ponto e vírgula em `clients.description` e `process.description` (pt/en), que voltaram a entrar na v2, em todos os comentários de código (`src/` e `e2e/`) e no README; completa a regra da v1.
4. **"Projetos profissionais" → "Clientes".** Renomeado em todo o código (pt: label `clientes`, título `Clientes`, nav `Clientes`; en: `clients`/`Clients`/`Clients`), revertendo o rótulo da Fase 4. O id da âncora `#clientes` foi mantido, então os links da nav continuam funcionando.

### 7.6 Revisão de conteúdo (14/08/2026) — IA e cases de cliente

> Segunda rodada de ajustes de conteúdo, implementada e validada (typecheck, lint, 36 testes unitários e build limpos; revisão visual no preview em larguras de mobile, tablet e desktop).

1. **Métrica de IA: "áreas de estudo".** `about.metrics` muda de "áreas de exploração em IA" para **"áreas de estudo em IA"** (pt) e de "AI exploration areas" para **"AI study areas"** (en).
2. **Interesse em IA com nova copy.** `about.interests[ai].description` vira **"Explorando modelos generativos, automação e aplicações de IA na prática."** (pt) e "Exploring generative models, automation and AI applications in practice." (en), substituindo "Automação de fluxos, geração de conteúdo e code assist.".
3. **Cards de Clientes viram case comercial.** Novo padrão no card: nome → tipo ("Projeto profissional" / "Professional project") → descrição do resultado → **Responsabilidades** (ex.: Frontend · UI · Responsividade · Deploy) → **Status** (Publicado / Published) → CTA [Visitar projeto]. O modelo `ClientProject` ganha `description`, `responsibilities` e `status`; saem `client`/`type`/`tech`/`outcome` e os rótulos Cliente/Tipo/Tecnologias, além do badge "No ar" na imagem (substituído pelo Status). Narrativa: de "tenho um cliente" para "já entreguei software para cliente".
4. **Código morto da v1 removido.** `profile.phone` em `src/data/profile.ts` não era usado (o telefone vive nos cards de contato do dicionário) e foi removido, junto com a linha correspondente do README.

---

## 8. Checklist de aceite e estado atual (13/08/2026)

> Referenciado no cabeçalho como "checklist na seção 8" — criado na revisão pós-v2.

### v2 — implementação ✅

- [x] Fases 0–10 implementadas e commitadas (12 commits locais sobre a v1: `87fe457` → `b279b07`)
- [x] 36 testes unitários (Vitest) + 6 testes E2E (Playwright) verdes; lint/typecheck/build limpos
- [x] `<html lang>` correto no SSR por rota (root layouts por idioma) + E2E no CI
- [x] Troca de idioma preserva o contexto (home e páginas de projeto); nav funcional nas páginas individuais
- [x] Aviso de `metadataBase` no build eliminado
- [x] `theme-color` reflete o tema salvo (script anti-flash atualiza o meta antes do primeiro paint)

### Deploy ✅ (14/08/2026)

- [x] `git push` da branch `main` (19 commits: `e70ff0e..216ab3f`) — CI e Gitleaks verdes no GitHub Actions
- [x] **Deploy de produção na Vercel** — URL: `https://pedrolevi.vercel.app/`
- [x] **Validar pós-deploy** (14/08/2026): `/` e `/en/` com `lang` correto (pt/en), canonical e hreflang por rota, sitemap com 10 URLs + alternates, robots com sitemap absoluto, OG image pt/en, rotas de projeto 200 e slug inválido 404
- [ ] Definir `NEXT_PUBLIC_SITE_URL` no ambiente de produção (ex.: `https://pedrolevi.dev` — domínio ainda não responde; confirmar registro DNS). Enquanto isso, canonical/hreflang/OG usam a URL do deploy (fallback `VERCEL_PROJECT_PRODUCTION_URL`)
- [x] Lighthouse pós-deploy (14/08/2026, cache quente): **Perf 95 · A11y 100 · BP 100 · SEO 100** em `/` e `/en/` — inclui fix de a11y (nome acessível do toggle de idioma + `<ol>` da trajetória com `<li>` direto). 1ª medição com cache frio da edge: Perf 88/A11y 93
- [ ] (Opcional) Domínio próprio: DNS + HTTPS

### Ajustes de conteúdo ✅ (14/08/2026)

- [x] Seção Sobre: removidos `about.description` e o 2º parágrafo do resumo (pt/en + tipo `Dict`)
- [x] Barra de progresso de scroll removida (componente `scroll-progress.tsx` excluído e layouts limpos)
- [x] Travessões (—) removidos dos textos visíveis (`clients.description` e `process.description`, pt/en), dos comentários de código e do README
- [x] Seção "Projetos profissionais" renomeada para **"Clientes"** em todo o código (pt/en, nav, comentários e README; âncora `#clientes` mantida)
- [x] Validado: typecheck, lint, 36 testes unitários e build de produção limpos

### Ajustes de conteúdo v2 ✅ (14/08/2026)

- [x] Métrica de IA: "áreas de exploração em IA" → "áreas de estudo em IA" (pt/en)
- [x] Interesse em IA: "Explorando modelos generativos, automação e aplicações de IA na prática." (pt/en)
- [x] Cards de Clientes redesenhados: nome → tipo → descrição → responsabilidades → status → CTA; removidos Cliente/Tipo/Tecnologias e badge "No ar"
- [x] Código morto da v1 removido (`profile.phone`)
- [x] Validado: typecheck, lint, 36 testes unitários, build e revisão visual (mobile/tablet/desktop)

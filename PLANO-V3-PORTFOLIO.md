# 🎨 Plano V3 do Portfólio, Pedro Levi

> **Objetivo da v3:** dar assinatura visual ao portfólio. A v2 resolveu o conteúdo ("eu resolvo problemas"); a v3 resolve a forma, com um fundo WebGL próprio, tipografia minimalista e navegação em 5 rotas.
>
> **Base:** v2 publicada (Next 16.3 + React 19, Tailwind v4, bilíngue com paridade testada, 36 unit + 6 E2E, Lighthouse 95/100/100/100).
> **Referência de inspiração:** [p5aholic.me](https://p5aholic.me) (Keita Yamada). Inspiração estrutural, **não cópia**. Ver seção 0.3.
> **Status:** ✅ **V3.5 no ar, com o passe de aperfeiçoamento fechado.** As 7 fases da v3 fechadas em 27/08/2026 (avaliação na seção 11), o refinamento **V3.5** mergeado pelo PR #4 em 6 rodadas de ajuste (avaliação na **§12.10**), e os **5 milestones da seção 13** mergeados pelo PR #7 em 31/08/2026 (fechamento na **§13.5**).
>
> **Produção:** https://pedrolevi.vercel.app
> **Versão do documento:** V3.5

---

## 0. Comece aqui

Esta seção existe para quem abre o repositório sem contexto nenhum. Leia ela inteira antes de escrever qualquer linha.

### 0.1 Estado atual

**Fases 0 e 1 concluídas em 26/08/2026.**

Da Fase 0 estão em pé: `ogl` e `lenis` instalados, os tokens de shell da v3 em `globals.css` (com o fundo no `:root`, não no `body`), a camada shadcn reneutralizada, a escala tipográfica fluida, e o manifesto de rotas em [src/lib/routes.ts](src/lib/routes.ts). A pré-condição de F1 foi verificada em runtime: com o CSS novo, uma seção `blend` dentro de um `<main>` estático não tem nenhum ancestral confinando o backdrop.

Da Fase 1 está em pé o motor inteiro em `src/components/background/`, verificado no navegador: os três shaders compilam, os dois programas linkam, todos os uniforms ficam ativos, `gl.getError` devolve zero e o campo produz variação real de luminância.

Da Fase 2 está em pé o `<SiteShell>` nos dois layouts, a moldura, a máscara e o `section.tsx` com as duas variantes. **O portão de saída foi aprovado** (evidência nas notas de execução da Fase 2).

Da Fase 3 estão em pé as 10 rotas (5 por idioma, todas estáticas), o header e o footer reescritos, o Lenis em rolagem nativa e o SEO por rota derivado do manifesto.

Da Fase 4 estão em pé a Home como manifesto tipográfico com os 5 passos, e o showcase com preview trocando no hover, servindo Projetos e Clientes.

Da Fase 5 estão em pé Info, Contato e as páginas de case redesenhadas, e o **Framer Motion foi removido do projeto** (F10 resolvido).

Da Fase 6 está em pé a auditoria inteira, agora automatizada, e da Fase 7 a limpeza final e a documentação.

**A v3 está no ar**, em https://pedrolevi.vercel.app, com 141 testes unitários e 68 E2E passando no CI. A avaliação pós-deploy está na seção 11.

O que resta está listado no fim daquela seção, e nada é código.

**A V3.5 veio depois.** O site rodando mostrou o que captura nenhuma mostra: a home ocupava altura demais, o `>_` repetido em 12 lugares destoava, a identidade não tinha âncora fixa e o campo de noise lia como líquido em vez de forma. A seção 12 registra esse passe, com as fases 8 a 13. Se você vai mexer no header, na home, no showcase ou no shader, **leia a seção 12 antes desta**: várias decisões aqui foram revogadas por ela.

**Depois dela vieram a seção 13**, o passe de aperfeiçoamento com os cinco milestones fechados em 31/08/2026, **e a seção 14**, que levou a entrada suave do bloco de introdução para a seção inteira. Antes de tentar otimizar performance, leia a §13.3: três hipóteses plausíveis foram medidas e duas pioraram o site.

### 0.2 As três coisas que mais quebram este plano

Se você só puder guardar três fatos antes de codar, guarde estes:

1. **F1 (seção 6.1): nenhum ancestral de uma seção `blend` pode criar contexto de empilhamento.** Se `<main>` receber `z-index`, o efeito principal do site não aparece e **não há erro no console**. Esse é o erro mais caro possível aqui.
2. **Todo texto do site vive em dobro**, em [src/i18n/pt.ts](src/i18n/pt.ts) e [src/i18n/en.ts](src/i18n/en.ts), tipado por `Dict` em [src/i18n/index.ts](src/i18n/index.ts). Campo novo em um só lugar quebra [src/i18n/index.test.ts](src/i18n/index.test.ts). Isso é rede de segurança, não obstáculo.
3. **Zero travessões (—)** em textos, comentários e docs. Regra ativa do projeto desde a v2 (§7.5 do [PLANO-V2-PORTFOLIO.md](PLANO-V2-PORTFOLIO.md)).

### 0.3 Fronteira ética com a referência

O FAQ do p5aholic.me proíbe reúso do código e o site mantém uma página pública "Copycats" documentando plágios. **Nenhuma linha do código deles é copiada.** O que absorvemos são técnicas genéricas e de domínio público: fullscreen quad, simplex noise, `mix-blend-mode: difference`, moldura recuada, lista tipográfica. Shader, paleta, composição e CSS são escritos do zero.

A v3 ganha três comportamentos que a referência não tem, justamente para ter identidade própria: o fundo reage ao **scroll**, reage ao **ponteiro**, e a lista de projetos tem **preview com troca no hover**.

### 0.4 Pendências externas (não travam nenhuma fase)

| Pendência | Situação em 25/08/2026 |
|---|---|
| Deploy do **Netsheet Engine** | 🔄 **Em andamento pelo Pedro.** Enquanto não existir URL pública, o item usa o placeholder de mockup CSS (seção 4.4). Quando o deploy subir, rodar `pnpm capture` e preencher `image` |
| Screenshots do **Repertório Progressivo** | ⏸️ Depende do Pedro exportar do Expo. É app React Native, **não existe página web para capturar**. Tratamento correto é frame de celular, não janela de browser |
| `NEXT_PUBLIC_SITE_URL` em produção | ⏸️ Herdada da v2. Domínio `pedrolevi.dev` ainda não responde, DNS a confirmar |

### 0.5 Ordem de trabalho

Fases 0 → 1 → 2 são caminho crítico e vão em sequência. A **Fase 2 tem portão de saída obrigatório**: confirmar visualmente que o blend mistura contra o canvas antes de converter qualquer outra seção.

Fase 3 destrava a Fase 4, que é a de maior valor percebido e vem antes da 5. Fases 6 e 7 fecham.

---

## 1. O que a referência realmente faz

Investigado em runtime (DOM, CSSOM e o bundle `main.js` deles).

### 1.1 As camadas em CSS

| Camada | z-index | Papel |
|---|---|---|
| `body` / `#Page` | base | Cor sólida `--c-bg`, transição de 0.9s `cubic-bezier(.1,.4,.2,1)` na troca de tema |
| `#Background` | 1 | Canvas WebGL2, `fixed`, **recuado** por `--pad: max(20px, 4vmin)`, `pointer-events: none` |
| `#Content` (`<main>`) | 2 | `mix-blend-mode: difference` |
| `#Mask` | 3 | Duas barras sólidas (`height: var(--pad)`, `opacity: .9`) cobrindo topo e base do canvas |
| `#Frame`, header, copyright, tema | 10 | `mix-blend-mode: difference`, brancos. Moldura: 4 divs de 1px com `opacity: .5` |

### 1.2 O motor

three.js com `OrthographicCamera` + `PlaneGeometry` + `RawShaderMaterial` (fullscreen quad), `WebGLRenderTarget` para um passe de blur, e `DataTexture` de grain. Os uniforms customizados do passe de fundo são exatamente `time`, `seed`, `style`, `param1`, `param2`, `param3`, `back`, `grainTex`, `blurTex`. No GLSL estão `mod289`, `permute`, `snoise` (simplex noise canônico do Ashima) e uma função `grain`.

Traduzindo: **campo de simplex noise animado, borrado num render target, composto com grain**, com `seed` randomizando a cada load e `style` alternando variantes. GSAP para animação, Alpine.js para interatividade.

### 1.3 A conclusão que importa

**A percepção de "premium" não vem do shader.** Vem do `mix-blend-mode: difference`: todo texto é branco e inverte automaticamente contra o que o shader estiver pintando. Contraste garantido de graça, sem escurecer o fundo. Custo: zero.

A lista de projetos deles é puro texto: `<h2>Título</h2>` + `<p>Mês.Ano / Papel / Créditos</p>`. Sem imagem, sem card, sem borda. A nav é `● Home ● Projects ● Info ● Contact ● FAQ`, com dot no item ativo.

### 1.4 Decisões fechadas com o Pedro

1. **Escopo:** reconstrução total do shell e das seções
2. **Lib WebGL: OGL** (~20 KB gzip) em vez de three.js (~150 KB), para preservar o Perf 95
3. **Scroll: nativo + Lenis.** Nada de scroll virtual. Acessibilidade, deep links, Ctrl+F e teclado continuam funcionando
4. **Identidade: neutra, com o accent vindo do shader.** A cor sai da UI e vai para o fundo
5. **Estilo minimalista** no nível da referência
6. **Navegação em 5 rotas:** Home, Clientes, Projetos, Info, Contato
7. **Listas com preview no topo**, trocando no hover, e tecnologias em cada linha

---

## 2. A tese da v2 sobrevive à estrutura de 5 rotas?

A tese da v2 é *"aqui está como eu penso, o que construí e por que resolvo problemas"*, materializada na seção "Como trabalho" (`Entendo → Planejo → Desenvolvo → Valido → Entrego`) e no modelo `problema → solução → destaque → o que aprendi` de cada projeto.

### 2.1 Mapeamento

| Seção V2 | Conteúdo | Rota V3 |
|---|---|---|
| Hero | papel, nome, bio, 2 CTAs, chips de stack, socials | **Home** |
| Sobre | 4 fatos, resumo, 4 métricas, 3 interesses | **Info** |
| Projetos | 4 projetos com problema/solução/destaque/aprendizados | **Projetos** |
| Clientes | case Dandarkness | **Clientes** |
| **Como trabalho** | **5 passos do processo** | **sem casa óbvia** |
| Trajetória | 4 capítulos com aprendizados e tags | **Info** |
| Habilidades | 4 blocos | **Info** |
| Contato | 2 CTAs + 4 cards | **Contato** |

### 2.2 Diagnóstico

Sete das oito seções migram sem atrito. **"Como trabalho" é a única órfã, e é exatamente a que carrega a tese.** Empurrá-la para o fim da rota Info seria o pior resultado possível: a ideia principal do projeto viraria rodapé de página secundária.

### 2.3 Resolução: a tese vira a espinha do site

**1. A Home é o manifesto do processo.** A referência abre com um manifesto. O equivalente do Pedro não é uma bio, é a tese: *"Entendo o problema antes de escolher a tecnologia."* Os 5 passos de `Dict.process.steps` deixam de ser cards numerados e viram o corpo tipográfico da Home. Quem entra lê a tese antes de qualquer outra coisa. É mais forte que a v2, onde a seção era a sexta e nem estava na nav.

**2. Cada linha da lista de projetos exibe o `problem`.** O campo já existe em `Dict.projects.featured[]` e hoje só aparece se a pessoa clicar. No preview da nova lista, o problema aparece junto do screenshot. A lista deixa de ser catálogo e passa a argumentar.

**3. As páginas de projeto continuam sendo a prova.** `problema → solução → destaque → aprendizados` já está em [src/components/project-detail.tsx](src/components/project-detail.tsx) e não muda de estrutura, só de apresentação.

> **Requisito de design, não sugestão:** se a Home virar apenas nome + bio + link, a tese morre e a v3 é um retrocesso em relação à v2.

### 2.4 Estrutura final das rotas

| Rota PT | Rota EN | Conteúdo |
|---|---|---|
| `/` | `/en/` | Manifesto + os 5 passos + atalho para Projetos |
| `/clientes/` | `/en/clients/` | Preview + lista de trabalhos de cliente |
| `/projetos/` | `/en/projects/` | Preview + lista de projetos próprios |
| `/projetos/[slug]/` | `/en/projects/[slug]/` | Case completo (já existe) |
| `/info/` | `/en/info/` | Sobre + métricas + interesses + trajetória + habilidades + CV |
| `/contato/` | `/en/contact/` | 2 caminhos + cards de contato |

Ordem da nav: Home, Clientes, Projetos, Info, Contato.

---

## 3. O componente de showcase (preview sobre a lista)

```
┌─ moldura em var(--pad) ─────────────────────────────────┐
│   ┌────────────────────────────────────────┐             │
│   │      PREVIEW 16:10  (sticky)           │             │
│   └────────────────────────────────────────┘             │
│   Portal precisava gerar conteúdo diariamente.           │
│                                                          │
│   01   Newra News          Next.js Fastify Gemini   2026 │
│   02   Netsheet Engine     React 19 Supabase        2025 │
│   03   Repertório Progr.   React Native Expo Jest   2025 │
│   04   Trak Assessoria     Next.js 16 Playwright    2025 │
└──────────────────────────────────────────────────────────┘
```

### 3.1 Regras de implementação

1. **`sticky`, não `fixed`.** `position: sticky; top: var(--pad)`. Acompanha a rolagem e sai naturalmente ao fim da seção. Com `fixed` seria preciso gerenciar entrada e saída na mão
2. **Todas as imagens montadas de uma vez**, empilhadas em `absolute`, alternando apenas `opacity`. Nunca desmontar e remontar o `<Image>`: causaria flash de carregamento no primeiro hover de cada projeto. Só `opacity` mantém tudo no compositor, sem layout nem paint
3. **Estado único no pai.** Um `useState<number>`. Cada linha dispara `onPointerEnter` **e** `onFocus` no mesmo handler
4. **Debounce de intenção de ~80ms.** `setTimeout` no enter, `clearTimeout` no leave. Sem isso, varrer o mouse pela lista faz o preview estroboscopar
5. **Não resetar no `mouseleave`.** Mantém o último item visto. Voltar ao índice 0 é o erro mais comum nesse padrão
6. **Touch e teclado são obrigatórios.** Sob `(hover: none)`, `IntersectionObserver` marca a linha mais próxima do centro da viewport. O teclado é resolvido pelo `onFocus` da regra 3
7. **`prefers-reduced-motion`:** troca instantânea, sem crossfade
8. **Estado inicial preenchido.** Projeto 01 no load, nunca placeholder vazio
9. **Um componente genérico para as duas rotas.** `<ShowcaseList items={ShowcaseItem[]} />` serve Clientes e Projetos
10. **Destinos mistos.** Projetos linkam para rota interna (`/projetos/[slug]/`); clientes linkam para site externo (`target="_blank"`, `rel="noopener noreferrer"`). Item recebe `external?: boolean`
11. **Numeração segue a curadoria, não o ano.** `01..04` é a ordem de `projectMetas`, que é curada. O ano é só uma coluna

### 3.2 Diferenciais aprovados

- **`problem` dentro do preview.** Uma linha abaixo do screenshot, trocando junto. É o que liga o componente à tese da v2
- **O shader reage ao hover.** Cada item tem um preset de paleta; passar o mouse interpola `uPalette`. O humor do site inteiro muda conforme a lista é percorrida. A referência não tem isso
- **Vídeo como evolução futura.** Webm mudo de 3 a 5s tocando só no item ativo. Entregar com imagem primeiro

---

## 4. Imagens de preview

### 4.1 Situação verificada em 25/08/2026

| Item | URL pública | Quem captura |
|---|---|---|
| Newra News | `https://newra-news-web.vercel.app` (200, redireciona para `/pt-BR`) | Automatizado |
| Trak Assessoria | `https://trak-acessoria.vercel.app` (200) | Automatizado |
| Dandarkness | `https://dandarkness.vercel.app` (200) | Automatizado (recaptura no padrão novo) |
| **Netsheet Engine** | 🔄 **deploy em andamento pelo Pedro** | Automatizado assim que a URL existir |
| Repertório Progressivo | nenhuma (app React Native) | Depende de screenshots do Expo |

### 4.2 O script de captura

`e2e/capture-previews.spec.ts`, rodando pelo runner do Playwright que já existe no projeto (evita adicionar `tsx` só para executar um script TS), com config própria para não entrar na suíte de CI:

- Viewport 1440x900, `deviceScaleFactor: 2`, `colorScheme: "dark"`
- `waitForLoadState("networkidle")` + espera fixa para animações de entrada assentarem
- Oculta banners e barras de dev via `page.addStyleTag`
- Salva em `src/assets/projects/<slug>.webp` (era `public/`, ver §15.4)
- Roda sob demanda (`pnpm capture`), **nunca no CI**, para não deixar o pipeline dependente de sites de terceiros

### 4.3 Correção de dados descoberta na investigação

`https://trak-acessoria.vercel.app` está cadastrado como `homepage` no GitHub mas **não existe como `demoUrl` em `projectMetas`** ([src/data/projects.ts](src/data/projects.ts)). Lacuna pré-existente, corrigir junto com a adição do campo `year`.

### 4.4 Placeholder: o mockup CSS que já existe

Uma versão anterior deste plano propunha gerar cards via `next/og`. **Descartado:** seria um route handler dinâmico em runtime, contradizendo a premissa de que todas as rotas são estáticas (seção 4.5), e adicionaria complexidade para nada.

A solução certa já está no repositório: o **mockup de janela de browser em CSS puro** dentro de [src/components/featured-project.tsx](src/components/featured-project.tsx). Generalizado para receber título e stack, ele vira o conteúdo do slot de preview quando `ShowcaseItem.image` é `undefined`. Zero dependências novas, zero rota nova, zero passo de build, e mais coerente com o minimalismo do que um screenshot seria.

Trocar por captura real depois não toca no componente: só preenche `image`. **É isso que destrava o Netsheet Engine enquanto o deploy não sobe.**

### 4.5 Por que as 5 rotas não custam caro

Todas as rotas da v3 são estáticas (`trailingSlash: true`, sem dados dinâmicos fora do ISR do GitHub):

- **Sitemap:** 24 URLs em vez de 10 são alguns KB de XML gerados **uma vez no build**. Sem custo por requisição
- **`generateMetadata` por rota:** roda no **build**, não a cada acesso
- **Bundle do cliente:** rotas não somam JS. Cada uma carrega seu chunk e o shell é compartilhado
- **Hreflang:** 2 tags por página

Dividir uma página em cinco **melhora** o SEO, desde que cada rota tenha título e descrição próprios: passam a existir 5 pontos de entrada em vez de 1.

**O custo real é a duplicação da árvore de rotas** (2 layouts e 10 páginas em vez de 2 e 2), e o risco é divergência, não performance. A solução é o manifesto de rotas da seção 7.1, do qual tudo deriva. Não migrar para `[lang]` dinâmico (forçaria prefixo `/pt/`, quebrando a canônica `/` já indexada) e não adicionar middleware (invocação de edge em toda requisição para resolver um problema de manutenção).

**Inglês apenas foi avaliado e descartado:** o público primário é recrutador brasileiro (CV em português, WhatsApp BR, Rancharia SP), os dois dicionários já estão escritos e testados, e o inglês é o que abre vaga remota internacional.

---

## 5. Primeira auditoria (15 achados, já incorporados às fases)

| # | Achado | Correção adotada |
|---|---|---|
| E1 | `ssr: false` é **inválido em Server Component** no Next 16 (`node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md:94`). Quebraria o build | Canvas é client component, renderiza `<canvas/>` no SSR, e o `ogl` entra com `await import("ogl")` dentro do `useEffect`. Sem `next/dynamic` |
| E2 | `json-ld.ts` aparecia como "não muda" e como "redistribuído" | Muda: ganha `itemListJsonLd()`. Teste ganha caso novo |
| E3 | "Os 36 testes são preservados" era falso | `lang-path.test.ts` e `sitemap.test.ts` são **reescritos**; `utils`, `metadata`, `github` e paridade i18n seguem intactos |
| E4 | O motivo `>_` conflita com a lei "cor só no shader" | `>_` **fica**, monocromático. É a identidade construída e é o que impede a v3 de virar cópia. O teal sai |
| E5 | `FadeIn` proibido em blend sem substituto definido | Em `blend`, entrada via `animate-fade-in` CSS (só opacity). Em `solid`, `FadeIn` continua. Não é removido, tem uso restrito documentado |
| E6 | Chaves órfãs: `filterAll`, `one`, `many`, `footer.socials.phone`. O teste de paridade não detecta chave morta | Limpeza explícita na Fase 7. `categories` **fica** como rótulo de tipo da linha |
| E7 | "Fundo contínuo entre as 5 rotas" é falso entre idiomas (root layouts distintos forçam document load) | Critério vira "contínuo dentro do mesmo idioma". Ao trocar idioma, `uSeed` é re-randomizado para parecer intencional |
| E8 | `grain-texture.ts` não é testável (Vitest em `environment: node`, `Texture` do OGL exige contexto GL) | Separar `createGrainBuffer(size): Uint8Array` (pura, testável) do wrapper que cria a `Texture` |
| E9 | Conteúdo passaria por baixo da moldura | Container com `padding-inline: calc(var(--pad) * 2)` como piso |
| E10 | Lenis não resetado na troca de rota | `lenis.scrollTo(0, { immediate: true })` + `lenis.resize()` no change de `usePathname()` |
| E11 | `trak-assessoria` sem `demoUrl` apesar de deploy vivo | Corrigir junto com o campo `year` (seção 4.3) |
| E12 | Destino do avatar indefinido | Fica, em bloco `solid` dentro de Info, escala pequena, sem borda arredondada |
| E13 | Footer fixo não comporta 4 links sociais | Footer fixo só copyright. Sociais migram para Contato, onde já existem como `contact.cards` |
| E14 | `process.tsx` aposentado podia levar as chaves junto | Componente sai, `Dict.process.steps` fica e é consumido pela Home |
| E15 | Máscara semitransparente vs header | Comportamento intencional; header precisa ficar acima da máscara |

---

## 6. Segunda auditoria (achados novos)

### 6.1 F1, CRÍTICO: contexto de empilhamento quebraria o blend por seção

Este é o achado mais grave das duas revisões, e invalidava a Fase 2 como estava escrita originalmente.

`mix-blend-mode` mistura o elemento com seu **backdrop**, definido como tudo que foi pintado abaixo dele **dentro do mesmo contexto de empilhamento**. Se um ancestral cria contexto de empilhamento, a mistura fica confinada ali.

A versão anterior previa `<main>` com `position: relative; z-index: 2` e as seções `blend` dentro dele. **Isso cria contexto de empilhamento no `<main>`**, e as seções passariam a misturar apenas contra o fundo do próprio `<main>` (transparente), **nunca contra o canvas**, que é irmão externo. O efeito simplesmente não apareceria, e o sintoma seria confuso: texto branco invisível sobre fundo claro, **sem erro nenhum no console**.

A referência não sofre disso porque o blend está no `#Content` inteiro, e `#Content` é filho direto de `#Page` (que é `fixed` e forma o contexto contendo também o `#Background`). Nosso modelo de seções mistas exige outra montagem.

**Arquitetura corrigida:**

```css
:root { background: var(--c-bg); }   /* no root, NÃO no body */
body  { /* sem background, sem isolation, sem transform, sem opacity, sem filter */ }
```

| Elemento | Posição | z-index | Observação |
|---|---|---|---|
| `<BackgroundCanvas>` | `fixed`, `inset: var(--pad)` | **-1** | pinta acima do fundo do root, abaixo de todo conteúdo em fluxo |
| `<main>` | **estático, sem z-index** | auto | **não pode** criar contexto de empilhamento |
| `Section variant="blend"` | em fluxo | auto | `mix-blend-mode: difference` mistura contra o canvas |
| `Section variant="solid"` | em fluxo | auto | `background: var(--c-bg)` opaco, cobre o canvas |
| `<ViewportMask>` | `fixed` | 30 | |
| `<Frame>` | `fixed` | 40 | `difference` |
| `<SiteHeader>` / `<SiteFooter>` | `fixed` | 50 | `difference`, acima da máscara |

**Por que funciona:** na ordem de pintura de um contexto de empilhamento, contextos filhos com z negativo pintam no passo 2, antes dos fundos (passo 3) e do conteúdo (passo 5) dos descendentes em fluxo. Uma seção em fluxo com `mix-blend-mode` no passo 3/5 mistura contra o backdrop acumulado, que **inclui o canvas**. Os elementos `fixed` com z positivo pintam no passo 7 e misturam contra tudo abaixo, inclusive `<main>` e canvas.

**Por que o fundo vai em `:root` e não em `body`:** o fundo do elemento raiz é propagado para o canvas do documento e pintado **abaixo de tudo**, inclusive dos z negativos. Se estivesse no `body`, seria o fundo de um bloco em fluxo (passo 3) e **cobriria o canvas de z -1**.

> **Lei resultante:** nenhum ancestral de uma seção `blend` pode ter `z-index`, `position` com z, `transform`, `opacity < 1`, `filter`, `isolation` ou `contain: paint`. Isso vira comentário fixo no topo de `section.tsx` e item obrigatório de review.

### 6.2 F2: o blend NÃO vai no `<main>`

Decorre de F1 e precisa estar escrito porque a tabela da seção 1.1 mostra `#Content (<main>) → difference`, o que induz ao erro. **Na v3 o blend é por seção.** Colocá-lo no `<main>` reintroduz exatamente o problema de imagens invertidas que as duas variantes existem para resolver.

### 6.3 F3: Lenis precisa ficar em modo de scroll nativo

Lenis pode operar em modo `wrapper`/`content`, no qual aplica `transform: translate3d()` num wrapper de conteúdo. **Isso criaria contexto de empilhamento e mataria todo blend da página** (F1), com o mesmo sintoma silencioso.

**Constraint dura:** usar o modo padrão (scroll de `window`, sem transform). Não configurar `wrapper` nem `content`. Deixar comentário no provider explicando o porquê, senão alguém "otimiza" isso depois e quebra o site inteiro sem entender.

### 6.4 F4: o gerador de cards via `next/og` foi descartado
Detalhado na seção 4.4.

### 6.5 F5: a transição de tema não cascateia para as seções `solid`

`transition: background-color` no `:root` anima só o fundo do root. Cada `Section variant="solid"` tem seu próprio `background: var(--c-bg)` e **saltaria** enquanto o resto faz crossfade de 900ms.

**Correção:** a variante `solid` carrega a mesma `transition: background-color var(--shell-fade) var(--shell-ease)`.

### 6.6 F6: `uBack` precisa de tween em JS

Ler `getComputedStyle(...).getPropertyValue('--c-bg')` a cada frame é caro e força layout. **Correção:** `setTheme(hex)` guarda a cor alvo e interpola `uBack` por rAF durante 900ms com a mesma curva do CSS. A cor é parseada uma vez, na troca.

### 6.7 F7: o Sheet do Base UI portaliza para o `body`

[src/components/ui/sheet.tsx](src/components/ui/sheet.tsx) usa `bg-popover` no painel e `backdrop-blur-xs` no overlay. Portalizado, ele fica no contexto raiz, fora do `<main>`. O `backdrop-blur` é inofensivo (não está numa subárvore de blend), mas o painel **precisa de fundo opaco**, senão flutua sobre o canvas. `bg-popover` resolve desde que o token seja reneutralizado na Fase 0.

### 6.8 F8 e F9
Destinos mistos e ordem de numeração. Incorporados nas regras 10 e 11 da seção 3.1.

### 6.9 F10: Framer Motion pode deixar de ser necessário

Depois de remover o `layoutId` do header e o `AnimatePresence` do `projects-grid`, sobra apenas o `FadeIn` em seções `solid`, reproduzível com `IntersectionObserver` + uma classe CSS em cerca de 15 linhas.

**Avaliar a remoção ao fim da Fase 5**, com o uso real visível. Cortar uma dependência inteira é o gesto mais coerente possível com uma reconstrução minimalista. Não é decisão de agora, é item de checklist com dado na mão.

### 6.10 F11
Script de captura roda pelo runner do Playwright. Incorporado na seção 4.2.

### 6.11 F12: `-webkit-font-smoothing: antialiased` é obrigatório, não estético

Navegadores desligam antialiasing de subpixel em camadas com blend. Sem suavização grayscale global, o **mesmo texto pesaria diferente** em seções `blend` e `solid`, e o site pareceria ter duas fontes. Já existe via o `antialiased` do Tailwind no `body`. Não remover achando que é enfeite.

### 6.12 F13: linhas da moldura sobre seções `solid`

Não é bug e é contraintuitivo, então fica registrado: branco em `difference` sobre `#0b0b0c` dá `#f4f4f3` (linha clara visível), e sobre `#f0f0f0` dá `#0f0f0f` (linha escura visível). A moldura funciona nos dois temas e sobre os dois tipos de seção sem tratamento especial.

### 6.13 F14: OG image por rota é opcional
As novas rotas herdam o `opengraph-image.tsx` do segmento de layout, e `metadataBase` já está no layout. Per-rota é refinamento posterior, não requisito.

### 6.14 F15: route groups no Next 16.3.0

A v2 registrou que `robots.ts` precisou ficar **fora** do route group enquanto `sitemap.ts` ficou dentro de `(home)`. Ao mexer no `sitemap.ts`, manter a localização atual e não "arrumar" a assimetria: ela existe por causa dessa versão.

---

## 7. As fases

### Fase 0: Fundação

```bash
pnpm add ogl lenis
```

`ogl` é ESM não transpilado. Se o build reclamar, adicionar `transpilePackages: ["ogl"]` em [next.config.ts](next.config.ts).

Tokens novos em [src/app/globals.css](src/app/globals.css):

```css
:root {
  --pad: max(20px, 4vmin);
  --c-bg: #f0f0f0;
  --c-ink: #0d0d0d;
  --shell-fade: 900ms;
  --shell-ease: cubic-bezier(0.1, 0.4, 0.2, 1);

  background: var(--c-bg);                        /* no root, não no body (F1) */
  transition: background-color var(--shell-fade) var(--shell-ease);
}
.dark { --c-bg: #0b0b0c; --c-ink: #fafafa; }
```

A camada shadcn (`--primary`, `--card`, `--popover`, `--border`, ...) **permanece**, porque `ui/button.tsx`, `ui/sheet.tsx` e `ui/tooltip.tsx` dependem dela. Tokens reneutralizados para acompanhar `--c-ink`/`--c-bg`, incluindo `--popover` (F7).

**Remover:** `bg-grid-pattern`, `mask-fade-hero`, o bloco de scrollbar customizada, e o `bg-background` do `<body>` nos dois layouts (F1).
**Manter:** `focus-ring`, `animate-fade-up`, `animate-fade-in`, o `antialiased` do body (F12) e o bloco `prefers-reduced-motion`.

Escala tipográfica fluida (`--text-display`, `--text-title`, `--text-lede`) em `@theme inline`. Famílias continuam Fira Code + Open Sans.

#### 7.1 O manifesto de rotas (fazer antes de qualquer rota nova)

Novo `src/lib/routes.ts`, fonte única de verdade:

```ts
export const routes = [
  { id: "home",     pt: "/",           en: "/en/",          navPt: "Home",     navEn: "Home" },
  { id: "clients",  pt: "/clientes/",  en: "/en/clients/",  navPt: "Clientes", navEn: "Clients" },
  { id: "projects", pt: "/projetos/",  en: "/en/projects/", navPt: "Projetos", navEn: "Projects" },
  { id: "info",     pt: "/info/",      en: "/en/info/",     navPt: "Info",     navEn: "Info" },
  { id: "contact",  pt: "/contato/",   en: "/en/contact/",  navPt: "Contato",  navEn: "Contact" },
] as const;
```

Dele derivam: nav do header, `translatedPath()`, `sitemap.ts`, `languageUrls` do hreflang e o `alternates` de cada `generateMetadata`. Adicionar rota vira uma linha. Teste novo valida que toda rota do manifesto tem `page.tsx` nos dois idiomas.

---

### Fase 1: O motor WebGL

Novo diretório `src/components/background/`.

**`renderer.ts`** (sem React, testável isolado). `BackgroundRenderer` com `mount(canvas)`, `resize()`, `setProgress(n)`, `setPointer(x,y)`, `setPalette(preset)`, `setTheme(hex)`, `destroy()`.

- `Renderer` do OGL: `dpr: Math.min(devicePixelRatio, 1.5)`, `alpha: false`, `antialias: false`, `powerPreference: "low-power"`
- Geometria `Triangle` do OGL (fullscreen triangle, mais barato que quad)
- **Um único passe.** Em vez do ping-pong de blur da referência, o campo é renderizado num `RenderTarget` de lado maior ~320px e esticado com filtro `LINEAR`. A interpolação bilinear faz o papel do blur de graça: mais de 10x menos fill-rate, resultado visualmente equivalente num campo suave
- rAF com guardas: pausa em `document.hidden`, pausa via `IntersectionObserver`, e **um frame só** sob `prefers-reduced-motion`
- `setTheme` faz tween de `uBack` durante `--shell-fade` com a mesma curva do CSS (F6)
- `webglcontextlost` tratado: para o loop, marca estado degradado

**`shaders/field.ts` e `shaders/composite.ts`.** Shaders como template literals de TypeScript, não arquivos `.glsl` (evita configurar loader no Turbopack).

*Campo:* simplex noise 3D (Ashima, domínio público, escrito por nós) + **domain warping** (a coordenada é deslocada por um segundo campo de noise, produzindo aspecto de fluido em vez de nuvem genérica) + 3 oitavas de fBm, indexando um ramp entre 3 cores. Uniforms: `uTime`, `uSeed`, `uResolution`, `uProgress`, `uPointer`, `uPalette[3]`, `uBack`.

*Composição:* amostra o campo, soma grain de textura 256x256 em coordenada de tela (grain fixo, look de filme, não cintila), vinheta sutil, mistura com `uBack` por `uMix`.

**`grain-texture.ts`.** `createGrainBuffer(size): Uint8Array` puro e testável (E8), mais o wrapper que devolve `Texture` com `REPEAT` e `NEAREST`.

**`background-canvas.tsx`** (client). Renderiza `<canvas />` no SSR normalmente, e no `useEffect` faz `await import("ogl")` seguido de `mount()`. **Sem `next/dynamic`, sem `ssr: false`** (E1). Estilo: `position: fixed; inset: var(--pad); z-index: -1; pointer-events: none` (F1). Fallback sem WebGL: `radial-gradient` CSS estático.

**Assinatura própria:** `uProgress` alimentado pelo Lenis, `uPointer` com lerp (desativado em touch), `setPalette` por rota e por item da lista.

---

#### Notas de execução da Fase 1 (26/08/2026)

Três coisas apareceram só na implementação e valem para quem mexer nisso depois:

1. **O canvas não pode ser a fonte do próprio tamanho.** O construtor do `Renderer` do OGL chama `setSize(300, 150)` por padrão, e esse `setSize` grava `style.width` e `style.height` inline no elemento. A partir daí o `clientWidth` do canvas devolve o que o OGL escreveu, não o que o CSS pediu, e o fundo fica preso em 300x150. O motor mede o **contêiner** (`canvas.parentElement`), no mount e no `ResizeObserver`. **A Fase 2 precisa manter o canvas dentro de um wrapper dimensionado por CSS.**

2. **A vinheta virou temática.** Escurecer as bordas sempre, como uma vinheta normal faz, empurraria o backdrop do tema claro na direção de L = 0.5, que é exatamente onde o texto em `difference` some. A vinheta puxa para o extremo do próprio tema: branco no claro, preto no escuro. O alvo é uniform e é interpolado junto com o tema, senão viraria no meio do crossfade.

3. **A dose de campo é assimétrica entre os temas** (`FIELD_MIX`: 0.08 no claro, 0.55 no escuro), e o motivo é aritmético. Partindo de `#f0f0f0`, puxar para qualquer cor mais escura atravessa a faixa proibida de luminância; só uma dose pequena mantém o resultado acima dela. Partindo de `#0b0b0c` sobra folga para o campo inteiro. Na prática: tinta no tema claro, campo cheio no escuro. O item de contraste da Fase 6 está coberto por teste, que varre o ramp inteiro incluindo vinheta e amplitude de grain, em vez de checar só as pontas.

---

### Fase 2: Shell, blend e moldura

**`src/components/shell/site-shell.tsx`.** Existem dois root layouts (`(home)` e `en`) e tudo do `<body>` precisa entrar nos dois. Um `<SiteShell lang>` compartilhado evita a divergência. Montagem exatamente conforme a tabela de F1. O `<body>` **não** recebe background nem `isolation`, e o `<main>` **não** recebe `z-index` nem `position`.

**Duas variantes de seção.** [src/components/section.tsx](src/components/section.tsx) reescrito, com o comentário-lei de F1 no topo:

- **`variant="blend"`**: `mix-blend-mode: difference`, `color: #fff`, sem fundo. Entrada via `animate-fade-in` CSS (E5)
- **`variant="solid"`**: `background: var(--c-bg)` opaco + `transition: background-color` própria (F5), blend normal. `FadeIn` permitido aqui

Container com `padding-inline: calc(var(--pad) * 2)` como piso (E9). `SectionHeading` perde o `text-primary` e mantém o `>_` monocromático (E4).

**`frame.tsx` e `viewport-mask.tsx`.** Presentacionais, sem estado. Moldura: 4 divs absolutos de 1px em branco, `opacity: .5`, em container `difference` (F13).

> ⚠️ **Portão de saída obrigatório desta fase:** montar uma seção `blend` e uma `solid` na mesma página, com o shader rodando, e confirmar que o texto da `blend` inverte de verdade contra o canvas. Se não inverter, é F1 e a montagem está errada. **Não avançar antes disso.**

---

#### Notas de execução da Fase 2 (26/08/2026)

**O portão de saída passou, e a prova é aritmética, não impressão.** Com o tema claro e a seção de Contato em `blend`, o card interno (`bg-card`, que vale `#f0f0f0`, ou 240) apareceu **preto**, e o botão de fundo `#0d0d0d` (13) apareceu **branco**. O backdrop composto no tema claro fica em torno de 220, então `|220 - 240| = 20` e `|220 - 13| = 207`: exatamente o que o `difference` produz. Se F1 estivesse quebrado, a seção misturaria contra o fundo transparente do `<main>` e o card teria aparecido claro, com o texto branco sumindo em cima dele. A montagem de camadas está correta.

Duas coisas para as fases seguintes:

1. **A variante `blend` exige conteúdo que herde a cor.** O `color: #fff` da seção só alcança texto que herda. Classes como `text-muted-foreground`, `text-foreground`, `bg-card` e `bg-primary` mantêm a própria cor e cada uma inverte para um lado diferente, produzindo um resultado sujo. **Uma seção só deve virar `blend` no mesmo passo em que perde as cores e caixas explícitas.** Isso liga as leis da seção 8 diretamente à variante: não são duas tarefas, são a mesma.

2. **Por isso as 7 seções da home estão em `solid` agora.** As três que serviram ao portão (Como trabalho, Habilidades, Contato) voltaram para `solid` depois dele. A Fase 4 liga o `blend` na Home e a Fase 5 nas seções de Info e Contato, cada uma junto do redesenho que remove as cores explícitas. A prop `variant` está escrita explicitamente em todas as seções, mesmo valendo o padrão, para que essa virada seja uma palavra só e fique visível no diff.

3. **O header e o footer ainda são os da v2** dentro do shell novo. O header é o pill com `backdrop-blur` e o footer está no fluxo, transparente sobre o canvas. Os dois são reescritos na Fase 3.

---

### Fase 3: Rotas, navegação e scroll

**Novas rotas.** `/clientes/`, `/projetos/`, `/info/`, `/contato/` e os pares em `/en/`, como shims de 5 linhas delegando a um componente compartilhado, seguindo o padrão de [src/app/(home)/portfolio-page.tsx](src/app/(home)/portfolio-page.tsx). `sitemap.ts` permanece dentro de `(home)` (F15).

**`lang-path.ts` e `sitemap.ts`** passam a derivar de `src/lib/routes.ts`. Os testes correspondentes são **reescritos** (E3).

**`site-header.tsx` reescrito.** Sai o pill com `backdrop-blur` (incompatível com difference). Entra header fixo alinhado a `var(--pad)`, em `difference`: nome à esquerda, nav com dot no item ativo, toggles de tema e idioma. Item ativo vem de `usePathname()` contra o manifesto. Sai o `layoutId` do Framer (`transform` quebra o blend).

**`smooth-scroll.tsx`.** Lenis em **modo padrão de scroll nativo, sem `wrapper` nem `content`** (F3, com comentário explicando o motivo). `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false`.
- Remover `scroll-behavior: smooth` de `globals.css`
- Desligado sob `prefers-reduced-motion`
- `data-lenis-prevent` no `ui/sheet.tsx`
- Reset na troca de rota (E10)
- Alimenta `renderer.setProgress()` via singleton em `background-config.ts`, **não** via estado React

**SEO por rota.** `buildMetadata()` de [src/lib/metadata.ts](src/lib/metadata.ts) ganha variante por rota, com `alternates` do manifesto. JSON-LD: `WebSite` na Home, `Person` no Info, novo `itemListJsonLd()` em Projetos e Clientes (E2).

---

#### Notas de execução da Fase 3 (26/08/2026)

1. **O `<main>` não leva padding vertical.** A primeira tentativa colocou `padding-block: calc(var(--pad) * 3)` para o conteúdo não passar por baixo do header e do footer fixos. O resultado, visível na captura, foi uma faixa do canvas entre o header e a primeira seção, com borda dura, parecendo acidente. O desenho correto é o oposto: o conteúdo **passa** por baixo do header e do footer, que estão em `difference` e invertem contra o que estiver ali. O respiro vem do padding vertical das próprias seções, e as faixas de `var(--pad)` são cobertas pela `ViewportMask`.

2. **`Dict.nav.links` e `Dict.footer` foram removidos.** O primeiro virou derivação do manifesto (`navRoutes(lang)`), e o segundo ficou vazio quando os sociais saíram do footer (E13). A limpeza de E6 que estava marcada para a Fase 7 aconteceu aqui, porque as chaves morreram nesta fase e deixá-las seria exatamente o problema que E6 aponta. Sobrou de E6 para a Fase 7: `filterAll`, `one` e `many`, que ainda são usadas pelo `projects-grid` da v2.

3. **Os toggles de tema e idioma precisaram ser neutralizados** antes de entrar no header em `difference`, pelo motivo registrado na Fase 2: `text-muted-foreground` e `hover:bg-muted` não herdam cor e inverteriam por conta própria. Agora usam opacidade. O `ThemeToggle` também tinha `theme-color` desatualizado (`#0a0a0b`/`#fafafa`, da v2), corrigido para os tokens da v3.

4. **`activeRouteId()` é diferente de `routeIdFromPath()`.** A segunda casa exatamente; a primeira casa sub-rotas, para `/projetos/newra-news/` manter "Projetos" ativo na nav. O casamento mais longo vence, senão `/en/` reivindicaria tudo que vive sob o inglês.

---

### Fase 4: A Home e o showcase

**Home.** Manifesto tipográfico + os 5 passos de `Dict.process.steps` (E14), em `variant="blend"`, escala display, sem cards. Nome, papel e 2 CTAs. Fecha com atalho para Projetos. É o LCP e continua em CSS puro.

**`src/components/showcase/showcase-list.tsx`.** Implementa a seção 3 integralmente.

```ts
type ShowcaseItem = {
  slug: string; title: string; problem: string;
  stack: string[]; category: string; year: string;
  image?: string;                     /* ausente = mockup CSS (4.4) */
  href: string; external?: boolean;   /* F8 */
  palette: PalettePreset;
};
```

Client component, `variant="solid"`. Subcomponentes: `showcase-preview.tsx` (pilha de `<Image>` em crossfade por opacity, com fallback para o mockup) e `showcase-row.tsx`.

**Adaptação dos dados:**
- `year` novo e `demoUrl` do Trak em `projectMetas` (E11, seção 4.3)
- `ClientProject` ganha `stack` e `year` em [src/i18n/index.ts](src/i18n/index.ts)
- `nav.links` deriva do manifesto
- Limpeza das órfãs (E6): saem `filterAll`, `one`, `many`, `footer.socials`; fica `categories`

---

#### Notas de execução da Fase 4 (26/08/2026)

1. **O showcase ficou lado a lado, não empilhado.** O diagrama da seção 3 desenha o preview sobre a lista, mas empilhado a regra 1 se volta contra si mesma: `sticky` fixa o preview no topo e a lista rola **por baixo** dele, sobrepondo os dois. Verificado em captura, não é artefato. Em coluna própria o `sticky` faz exatamente o que a regra 1 pede, e a lista inteira fica visível junto do preview, que é o ponto do componente. Abaixo de `lg` o layout empilha e o `sticky` é desligado.

2. **Achado novo, e vale como lei: fundo opaco em elemento `sticky` vaza para o composite de uma seção `blend` vizinha.** A tentativa de dar `background: var(--c-bg)` ao preview `sticky` (para o modo empilhado) pintou um retângulo preto dentro da seção `blend` do cabeçalho, a centenas de pixels de distância, com a largura exata da coluna do preview. Nenhum elemento do DOM tinha esse fundo: `elementFromPoint` no lugar devolvia a própria `<section>` transparente. `position: sticky` cria contexto de empilhamento, e a combinação com `mix-blend-mode` no irmão produz isso. **Não dê fundo opaco a elemento `sticky` na mesma página de uma seção `blend`.**

3. **A `Section` ganhou a prop `wide`.** Na largura padrão (`max-w-5xl`), preview e lista lado a lado espremem a coluna do título a ponto de quebrar "Repertório Progressivo" em duas linhas. O showcase usa `max-w-7xl`; o padding continua o mesmo, então o alinhamento com a moldura não muda.

4. **A linha mostra 3 tecnologias, não a stack inteira**, como o diagrama da seção 3 mostra. A lista completa vive na página do case. Sem isso a coluna de stack empurra o título para duas linhas.

5. **Dados verificados, não inventados.** O `stack` e o `year` do case de cliente foram conferidos no site publicado (assets em `/_next/` com Turbopack, utilitárias do Tailwind, copyright de 2026), em vez de deduzidos. Os anos dos projetos próprios saíram do diagrama da seção 3 deste plano. **Confirmar com o Pedro.**

6. **Aposentados:** `hero.tsx`, `process.tsx`, `projects.tsx`, `projects-grid.tsx` e `featured-project.tsx`, cujo mockup de janela virou `showcase/window-mockup.tsx`. As chaves órfãs `filterAll`, `one` e `many` de E6 saíram junto, fechando E6 por completo.

7. **Armadilha do `pnpm look`:** se houver servidor na porta 3000 iniciado antes do último `pnpm build`, ele serve o build velho e a captura sai sem CSS nenhum. Documentado em `capture/playwright.config.ts`.

---

### Fase 5: Info, Contato e páginas de projeto

**Info.** Funde `about`, `career` e `skills`. Sobre e habilidades em `blend`; trajetória e o bloco do avatar em `solid` (E12).

**Contato.** Os 2 caminhos em escala grande, em `blend`. Sai o glow. Recebe os sociais que saíram do footer (E13).

**Páginas de projeto.** [src/components/project-detail.tsx](src/components/project-detail.tsx) mantém `problema → solução → destaque → aprendizados`. Hero em `blend`, corpo em `solid`, preset de paleta por slug. `generateStaticParams` e `dynamicParams = false` intactos.

**Aposentados:** [src/components/projects-grid.tsx](src/components/projects-grid.tsx), [src/components/process.tsx](src/components/process.tsx), [src/components/featured-project.tsx](src/components/featured-project.tsx) (o mockup CSS dele vira o placeholder do preview).

**Ao fim da fase:** avaliar a remoção de `framer-motion` (F10).

---

#### Notas de execução da Fase 5 (26/08/2026)

1. **F10 resolvido: o Framer Motion saiu do projeto.** Depois do redesenho, `FadeIn` ficou sem nenhum consumidor e `SectionHeading` só era usado dentro de seções `blend`, onde a entrada já era CSS. Com uma implementação só, a regra E5 ("em blend, só opacity") deixa de ser regra a lembrar e passa a ser verdade por construção. Isso permitiu remover também o contexto de variante e, com ele, o `"use client"` de `section.tsx`, que voltou a ser server component.

2. **`identity.tsx` é novo** e resolve E12: a foto e os fatos rápidos saíram de `about.tsx` para um bloco `solid`, porque foto em `difference` apareceria em negativo. A foto é pequena e quadrada, sem halo e sem gradiente.

3. **`BackgroundPalette` liga o que estava solto.** `paletteForRoute` existia desde a Fase 1 e não tinha consumidor nenhum: o `<SiteShell>` vive nos layouts e não sabe a rota. Um componente que só dispara um efeito resolve isso. Rotas com showcase não o usam, porque lá quem manda na paleta é o item ativo da lista.

4. **Regressão minha, achada e corrigida:** ao reescrever a página de case, parei de renderizar `updatedAt` e `language`, que são os únicos campos que vêm do GitHub. O ISR de 1h em `lib/github.ts` continuava buscando dados que nada exibia. A página de case voltou a mostrar `atualizado <data> · <linguagem>`, verificado no HTML gerado. **`projects.updatedAt` não era chave órfã, eu é que tinha parado de usá-la.**

5. **Oito rótulos ficaram realmente órfãos** com o redesenho e foram removidos dos dois dicionários: `stackLabel` (em `hero` e em `projects`), `scrollLabel`, `viewProject`, `featuredBadge`, `allOnGithub`, `visit`, `responsibilitiesLabel` e `statusLabel`.

6. **Pendência de conteúdo para a Fase 7:** `clients.projects[].responsibilities` e `.status` continuam nos dicionários mas não são renderizados por nenhuma tela. São conteúdo, não rótulo, então não foram removidos sem decisão do Pedro: ou ganham lugar no showcase, ou saem.

---

### Fase 6: Performance, acessibilidade e fallbacks

- [x] Canvas em SSR normal, `ogl` via `await import()` no efeito. Sem `ssr: false` (E1)
- [x] Nenhum ancestral de seção `blend` cria contexto de empilhamento (F1). Auditar em DevTools > Layers
- [x] Lenis sem transform de conteúdo (F3)
- [x] `prefers-reduced-motion`: 1 frame e para, Lenis desligado, preview sem crossfade
- [x] rAF pausado com `document.hidden` e via `IntersectionObserver`
- [x] DPR limitado a 1.5; render target ~320px no lado maior
- [x] Telas < 768px: DPR 1 e render target menor
- [x] Fallback CSS sem WebGL e em `webglcontextlost`
- [x] Showcase funcional em touch e teclado
- [x] Contraste verificado **com o shader rodando**, nos dois temas, no pior frame. O `difference` garante inversão, mas paletas de luminância média produzem cinza sobre cinza. A paleta precisa ser restringida a faixas seguras
- [x] Foco visível em toda a UI em difference
- [x] `user-select` **não** desativado globalmente (a referência desativa; nós não, porque recrutador copia email)
- [x] Lighthouse Perf >= 90 e A11y 100 nas 5 rotas

---

#### Notas de execução da Fase 6 (27/08/2026)

A fase encontrou **quatro problemas reais**. Nenhum apareceria em revisão de código, e três só apareceram porque a auditoria virou medição em vez de leitura.

1. **O anel de foco era invisível no tema claro dentro de seções `blend`.** `focus-ring` usava `outline: 2px solid var(--ring)`, e `--ring` vale `--c-ink`, ou `#0d0d0d` no claro. Dentro de uma seção misturada isso resulta em `|220 - 13| = 207`, quase branco sobre fundo claro. Quem navega por teclado não via onde estava. Corrigido para `currentColor`, que acompanha o texto e inverte junto com ele. Em seções `solid` os dois valores coincidem, então nada mudou lá.

2. **O canvas ficava preso em 1x1 quando a aba nascia em segundo plano.** Página oculta não faz layout, então o contêiner media 0 no mount. O `ResizeObserver` não salvava, porque ele entrega nas etapas de renderização, que uma página oculta não executa. Ao voltar, o site pintaria um único pixel esticado na tela inteira, ou seja, uma cor chapada. O motor passou a remedir no `visibilitychange`, e há teste para isso.

3. **Contraste real abaixo da WCAG AA, por opacidade aninhada.** O pior caso media 2.0:1 em texto de 12px. A causa não era um valor exagerado isolado: era uma linha da lista a 60% com um número a 40% dentro dela, dando **24% efetivo**. Separadamente os dois valores parecem razoáveis, e é por isso que ler o código não pega. **Regra nova, documentada no `globals.css` e verificada por teste E2E que multiplica as opacidades ao longo da árvore: texto nunca abaixo de `opacity-70`, e nunca aninhado.**

4. **Alvos de toque abaixo de 24x24** nos links da nav e no logo (17px de altura). Resolvido com `min-h-6` e padding próprio.

**Lighthouse, preset desktop, build de produção:**

| Rota | Perf | A11y | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 0.6s | 0 |
| `/clientes/` | 96 | 100 | 100 | 100 | 0.9s | 0 |
| `/projetos/` | 99 | 100 | 100 | 100 | 0.6s | 0 |
| `/info/` | 99 | 100 | 100 | 100 | 0.6s | 0 |
| `/contato/` | 99 | 100 | 100 | 100 | 0.6s | 0 |

O baseline da v2 era 95/100/100/100 numa rota só. O Lighthouse não vem instalado: rode com `CHROME_PATH` apontando para o Chromium do Playwright, porque a máquina não tem Chrome próprio.

**Armadilha que custou tempo duas vezes, agora documentada nas duas configs do Playwright:** `reuseExistingServer` aproveita qualquer servidor na porta 3000, inclusive um iniciado antes do último build. O sintoma é teste falhando por uma correção que já está no código, ou captura de tela sem CSS nenhum.

**Sobra para a Fase 7:** `ui/button.tsx` e `ui/tooltip.tsx` ficaram sem nenhum consumidor depois da Fase 5. E as capturas de `/projects/dandarkness.jpg` têm proporção e resolução que o Lighthouse aponta como inadequadas para o slot 16:10 do preview, o que a recaptura já prevista resolve.

---

### Fase 7: Testes, documentação e deploy

- ✅ **Testes novos:** manifesto de rotas contra arquivos em disco, `background-config` (interpolação de paleta), `createGrainBuffer` (E8), `itemListJsonLd`
- ✅ **Reescritos:** `lang-path.test.ts`, `sitemap.test.ts` (E3)
- ✅ **Intactos:** `utils`, `metadata`, `github`, paridade i18n
- ✅ **E2E:** canvas com dimensões > 0; navegação pelas 5 rotas nos dois idiomas; hover troca o preview; `prefers-reduced-motion` sem erro de console; `html-lang.spec.ts` ampliado
- ✅ **Limpeza:** chaves órfãs (E6) e as sobras de `create-next-app` em `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`), pendência aberta desde a v2
- Atualizar [README.md](README.md): árvore nova, **a montagem de camadas de F1 com o porquê**, como ajustar paleta, como adicionar projeto ao showcase, e corrigir a seção "4. Projetos de clientes" que ainda documenta o modelo antigo
- Marcar este documento como concluído e registrar o Lighthouse pós-deploy

---

#### Notas de execução da Fase 7 (27/08/2026)

**Limpeza.** Saíram `ui/button.tsx`, `ui/tooltip.tsx` e `icons.tsx`, todos sem consumidor depois da Fase 5, mais as cinco sobras do `create-next-app` em `public/`. O botão de fechar do Sheet, único consumidor do `<Button>`, virou um `<button>` próprio, o que permitiu remover também as dependências **class-variance-authority** e **tw-animate-css**. Da camada de tokens shadcn sobraram apenas `--popover`, `--popover-foreground`, `--border`, `--ring`, `--muted-foreground` e `--primary`: nove tokens mortos foram removidos do `globals.css`.

**Somando com a Fase 5, a v3 cortou três dependências inteiras** (framer-motion, class-variance-authority, tw-animate-css) e acrescentou duas (ogl, lenis).

**Testes.** O teste do manifesto contra os arquivos em disco, adiado desde a Fase 0, finalmente entrou: ele pega a única falha que o manifesto sozinho não pega, que é acrescentar uma rota e esquecer o arquivo de um dos idiomas. A nav mostraria o link, o sitemap anunciaria a URL, o hreflang apontaria para ela, e a rota daria 404, sem nada quebrar em compilação. O `html-lang.spec.ts` foi ampliado das 2 rotas originais para as 10 do manifesto mais os cases.

**README reescrito.** A montagem de camadas está lá com o porquê, junto das três consequências descobertas na prática (fundo no `:root`, Lenis sem transform, nada de fundo opaco em `sticky`), da regra de opacidade em texto, e dos guias de acrescentar rota, projeto, cliente e paleta. A seção de clientes, que ainda documentava campos que nunca existiram (`client`, `type`, `tech`, `outcome`), foi corrigida para os campos reais.

**Confirmado pelo Pedro em 27/08/2026:** só o Repertório Progressivo é de 2025; os outros três são de 2026. Clientes, por ora, é só o Dandarkness.

**Resolvida a pendência de `responsibilities` e `status`.** Os dois campos ficaram sem tela depois do redesenho, e a decisão não foi remover ambos porque eles não dizem a mesma coisa. `status: "Publicado"` é redundante com a seta de link externo que leva ao site no ar, e saiu. `responsibilities` responde uma pergunta que a stack não responde: a stack diz **qual tecnologia**, as responsabilidades dizem **até onde foi o envolvimento**, que para trabalho de cliente é possivelmente o dado mais relevante para quem recruta. Passou a ser exibido no preview, abaixo da descrição.

**Pendências que não são código, e dependem do Pedro:**

- Deploy e registro do Lighthouse contra a URL de produção
- Capturas de tela dos projetos (`pnpm capture` para os que têm URL pública; o Repertório Progressivo é app React Native e depende de export do Expo)
- `NEXT_PUBLIC_SITE_URL` em produção e o DNS de `pedrolevi.dev`

---

## 8. Leis do design minimalista

**Sai:** cards com borda e `rounded-2xl`, blobs `blur-3xl`, glow no contato, badges e pills, chips em caixinha, sombras, gradientes decorativos, ícones ilustrativos, grid de fundo, scrollbar customizada, header em pill com `backdrop-blur`, filtro por categoria.

**Entra:** linhas de 1px como único separador, tipografia fluida com `clamp()`, hierarquia por tamanho e opacidade em vez de cor ou caixa, espaço em branco generoso, alinhamento rigoroso a `var(--pad)`, nav numerada com dot no item ativo.

**Regras duras:**
- No máximo **dois pesos tipográficos** por página
- Cor só no shader. A UI é branco, preto e opacidade (E4). ~~O `>_` sobrevive monocromático~~, **revogado na V3.5**, seção 12
- Todo espaçamento deriva de `var(--pad)` ou da escala do Tailwind
- Nenhum `border-radius` acima de 2px, exceto na janela do preview
- **Nenhum ancestral de seção `blend` pode criar contexto de empilhamento** (F1)
- **Zero travessões (—)** em textos, comentários e docs

### O que NÃO muda

`src/data/*` (exceto `year` e `demoUrl` novos), `src/lib/utils.ts`, `src/lib/github.ts`, `robots.ts`, `opengraph-image.tsx`, `next.config.ts`, e todo o **conteúdo** de `src/i18n/*` (a estrutura muda: nav, footer e as chaves órfãs de E6).

---

## 9. Verificação

```bash
pnpm lint && pnpm typecheck && pnpm test
```

```bash
pnpm build && pnpm test:e2e
```

```bash
pnpm dev
```

### 9.1 Ver o site sem abrir o navegador

```bash
pnpm look
```

Captura a home nos dois temas em `.captures/` (ignorada pelo git), usando o
Playwright que já existe no projeto, com config própria em `capture/` para não
entrar na suíte de CI. Existe porque as duas coisas centrais da v3 não são
observáveis por DOM nem por `getComputedStyle`: o resultado de
`mix-blend-mode` é um efeito de composição, e o shader é pixel.

Parametrizada por variáveis de ambiente:

| Variável | Padrão | Efeito |
|---|---|---|
| `LOOK_PATHS` | `/` | Lista separada por vírgula. Aceita âncora, ex.: `/#contato` |
| `LOOK_THEMES` | `dark,light` | Temas a capturar |
| `LOOK_FULL` | vazio | `1` captura a página inteira, não só a viewport |
| `LOOK_SETTLE` | `1400` | Milissegundos de espera para o campo do shader assentar |

No Git Bash do Windows, prefixe com `MSYS_NO_PATHCONV=1`, senão o shell
converte `/` em caminho do Windows antes de a variável chegar ao script.

Roteiro manual, nos dois temas e nos dois idiomas:

1. **Seções `blend` invertem de verdade contra o canvas** (o teste de F1). Se o texto sumir ou não inverter, a montagem de camadas está errada
2. Fundo anima suave, sem banding e sem cintilação do grain
3. Seções `solid` cobrem o canvas por completo, sem vazamento nas bordas
4. Avatar e screenshots em cores corretas, não em negativo
5. Moldura alinhada a `var(--pad)` em 375px, 768px, 1440px e 2560px, sem texto passando por baixo das linhas
6. Troca de tema faz crossfade de 900ms no root, nas seções `solid` e no shader **juntos** (F5, F6)
7. Hover na lista troca o preview sem flash e sem estroboscopia ao varrer rápido
8. No mobile, rolar a lista troca o preview pela linha mais próxima do centro
9. Só teclado: `Tab` percorre a lista, o preview acompanha o foco, foco visível sobre o shader
10. Navegação entre rotas **do mesmo idioma** mantém o fundo contínuo; trocar de idioma reinicializa com `uSeed` novo, e isso é esperado (E7)
11. Trocar idioma em cada rota leva ao par correto, não à home
12. Rolar até o fim de `/projetos/` e navegar para `/info/` abre no topo (E10)
13. Abrir o menu mobile: o painel é opaco, não deixa o canvas aparecer através (F7)
14. Mesmo peso visual de texto entre seções `blend` e `solid` (F12)
15. Com `prefers-reduced-motion`: fundo estático, sem Lenis, preview instantâneo, tudo navegável
16. DevTools com WebGL desabilitado: fallback de gradiente aparece

**Performance:** gravar 10s no Performance panel em `/projetos/` com hover ativo, confirmando 60fps com o rAF do canvas abaixo de 3ms por frame num laptop mediano. Lighthouse nas 5 rotas do build de produção, contra o baseline de 95/100/100/100.

---

## 10. Checklist de progresso

- [x] Fase 0: Fundação (deps, tokens, manifesto de rotas), concluída em 26/08/2026
- [x] Fase 1: Motor WebGL, concluída em 26/08/2026
- [x] Fase 2: Shell, blend e moldura, concluída em 26/08/2026, portão de saída aprovado
- [x] Fase 3: Rotas, navegação e scroll, concluída em 26/08/2026
- [x] Fase 4: Home e showcase, concluída em 26/08/2026
- [x] Fase 5: Info, Contato e páginas de projeto, concluída em 26/08/2026
- [x] Fase 6: Performance, acessibilidade e fallbacks, concluída em 27/08/2026
- [x] Fase 7: Testes, documentação e deploy, concluída em 27/08/2026 (deploy pendente com o Pedro)
- [x] Capturas: Newra News, Trak, Dandarkness, geradas em 27/08/2026 por `pnpm capture`
- [ ] 🔄 Captura do Netsheet Engine (aguardando deploy do Pedro; o preview usa o mockup em CSS enquanto isso)
- [x] Preview do Repertório Progressivo, resolvido em 27/08/2026 com as prints da V2 no repositório do app, enquadradas como tela de celular
- [ ] `NEXT_PUBLIC_SITE_URL` em produção e DNS de `pedrolevi.dev` (herdado da v2)
- [x] Fase 8: Identidade fixa e nav vertical, V3.5
- [x] Fase 9: Fim do `>_` nas 12 ocorrências, V3.5
- [x] Fase 10: Home enxuta, cabeçalhos removidos, 5 passos em `/info/`, V3.5
- [x] Fase 11: Textos do showcase fora da moldura, V3.5
- [x] Fase 12: Fundo em ondas de praia, V3.5
- [x] Fase 13: Testes e documentação da V3.5
- [x] Lighthouse da V3.5 medido em A/B local contra a `main`, seção 12.2

---

## 11. Avaliação pós-deploy (27/08/2026)

A v3 foi mergeada na `main` (commit `7d45443`) e publicada. CI verde: lint, typecheck, 141 unitários, build e 68 E2E no Ubuntu do GitHub.

### SSR e SEO, verificados contra produção

As 12 rotas (5 por idioma mais os cases) respondem 200, com `<html lang>` correto no SSR e **canonical próprio em cada uma**. O hreflang de `/contato/` aponta para `/en/contact/`, não para a home, que era o risco real da divisão em cinco rotas. Sitemap com 18 URLs, robots liberando e apontando para ele, JSON-LD presente.

**O `getSiteUrl()` resolveu sozinho para a URL pública**, via `VERCEL_PROJECT_PRODUCTION_URL`, sem `NEXT_PUBLIC_SITE_URL` definida. Confirma o que a seção 7 previa: a variável só passa a importar quando houver domínio próprio.

O ISR do GitHub chegou vivo: a página de case mostra `atualizado ago. de 2026 · TypeScript`.

### Runtime, com navegador real contra produção

WebGL2 ativo, canvas dimensionado, fallback não acionado, **zero erros de console**, **zero quebras da lei F1** (nenhum ancestral confinando o blend), `<main>` com `z-index: auto`, Lenis rodando. Verificado nos dois temas.

### Lighthouse

| Rota | Desktop | Mobile |
|---|---|---|
| `/` | 96 | 92 |
| `/clientes/` | 99 | não medido |
| `/projetos/` | 99 | 89 |
| `/info/` | 99 | 96 |
| `/contato/` | 100 | não medido |

Acessibilidade, Best Practices e SEO em **100 em todas**, nos dois presets. CLS **zero** em todas.

### O que a avaliação encontrou

O `/projetos/` em mobile ficou logo abaixo de 90, e o Lighthouse apontou excesso de bytes na imagem de LCP. O `sizes` do preview dizia `60vw` no desktop quando o real é **31vw**, e `100vw` no mobile quando o real é **90vw**.

Corrigido e **medido**, não estimado: a variante servida no desktop caiu de `w=1080` para `w=640`. Em mobile o ganho foi de 1 ponto, dentro do ruído, porque o DPR emulado já pedia variante pequena; o ganho real está no desktop, que é onde o Lighthouse mobile não olha. Foi no **PR [#2](https://github.com/tavinholoco/portfolio/pull/2)**, já mergeado.

### O que continua aberto

| Item | Situação |
|---|---|
| Netsheet Engine | Sem deploy público. O preview usa o mockup em CSS, por decisão. Quando a URL existir: alvo em `capture/previews.spec.ts`, `pnpm capture`, e preencher `image` em `src/data/projects.ts` |
| Domínio próprio | `pedrolevi.dev` ainda não responde. **Nada a fazer hoje.** No dia em que responder: `vercel env add NEXT_PUBLIC_SITE_URL production`, redeploy, e marcar o domínio como primário na Vercel para o `.vercel.app` redirecionar em vez de duplicar conteúdo |

> ⚠️ Existe uma segunda URL de produção, no escopo do time (`portfolio-*-tavinholocos-projects.vercel.app`), que está **atrás do SSO da Vercel** e responde 302 com `X-Robots-Tag: noindex`. Ela não é a URL pública e não deve ser usada para medir nada. A URL boa é a do topo deste documento.

---

## 12. Refinamento V3.5 (27/08/2026)

A v3 no ar mostrou o que captura nenhuma mostra. Quatro incômodos, todos de forma e nenhum de conteúdo: a Home gastava altura demais com a lista dos 5 passos, o `>_` repetido em 12 lugares destoava do resto, a identidade não tinha âncora fixa, e o campo de fBm com domain warping lia como líquido em vez de forma definida.

Isto é um passe de refinamento sobre a v3, não uma reconstrução. A referência continua sendo o [p5aholic.me](https://p5aholic.me) e a fronteira ética da §0.3 continua valendo integralmente: nenhuma linha do código deles, shader escrito do zero.

### 12.1 Decisões fechadas com o Pedro

| Pergunta | Decisão |
|---|---|
| Layout da nav | **Coluna vertical** sob o nome, alinhada à mesma margem esquerda |
| Fundo em ondas | **Ondas estilizadas passando pela paleta atual.** O `difference`, o tema e o teste de luminância continuam de pé |
| Topo das páginas | **Sai o bloco inteiro** (`>_ clientes`, título e descrição). Entra `h1` em `sr-only` |
| Os 5 passos | **Vão para `/info/`.** A Home fica minimalista |

O caminho descartado no fundo era ondas realistas em cores, como o GIF de referência que o Pedro mandou. Custaria o `mix-blend-mode: difference` do site inteiro, que é a assinatura da v3 e a origem do contraste de graça (§1.3). Seria reescrita do shell, não refinamento.

> O GIF de praia é **referência visual, não asset**. É material de banco de imagens de terceiros e não entra no repositório, nem como vídeo nem como textura.

### Fase 8: Identidade fixa e nav vertical

Saiu a barra horizontal com `>_ pedrolevi` à esquerda e a nav ao centro. Entrou um bloco ancorado no topo esquerdo, presente em todas as rotas: nome, cargo e, de `lg` para cima, a nav empilhada na vertical na mesma margem. Tema e idioma foram para o topo direito. Abaixo de `lg` a nav volta a ser o `Sheet`, porque cinco itens empilhados comeriam um 375px.

Nenhuma chave nova: `hero.name` e `hero.role` já existiam e já diziam exatamente "Pedro Levi" e "Desenvolvedor Full Stack".

**Duas descobertas de execução, e as duas quebram em silêncio:**

1. **`pointer-events-none` no header virou obrigatório.** Ele é `fixed` e de largura cheia, e passou de tira fina a bloco de umas 300px de altura. Sem isso essa faixa rouba todo clique e todo hover do conteúdo que passa por baixo, inclusive o hover que troca o preview do showcase. Cada elemento interativo reabilita com `pointer-events-auto`. Mesmo esquema que o `<SiteFooter>` já usava.
2. **A reserva da coluna não pode ser padding no `<main>`.** O fundo das seções `solid` deixaria de alcançar a faixa e apareceria uma tira do canvas na lateral esquerda, com borda dura. É o mesmo motivo pelo qual o `<main>` já não tinha padding vertical. O offset foi para o container interno do `<Section>`, via `--nav-col`, que é `0px` abaixo de `lg` e `15rem` acima. **Padding é seguro para a F1: não cria contexto de empilhamento.**

**O `mx-auto` teve que sair em `lg`.** A nav é `fixed` em relação à viewport e o container é centrado em relação a ela, então o offset da coluna somava à margem do centramento: em 1440px o conteúdo começava em x=528 com a nav terminando em 150, e o vazio parecia acidente. Com `lg:[margin-inline-start:0]` o conteúdo passa a começar em x=312, logo depois da coluna. Medido, não estimado.

### Fase 9: Fim do `>_`

As 12 ocorrências saíram. Não era componente nem pseudo-elemento, era a string literal `&gt;_ ` repetida em JSX, com o rótulo vindo do dicionário depois dela.

**O que a remoção expôs:** sem o prefixo, o rótulo virou duplicata literal do título logo abaixo. `about` era "sobre mim" sobre "Sobre mim", `skills` "habilidades" sobre "Habilidades", `process` "como trabalho" sobre "Como trabalho", `career` "trajetória" sobre "Trajetória profissional". O `>_` era o que fazia aquilo ler como prompt de terminal em vez de repetição. Os quatro rótulos saíram junto. **`contact` ficou**, porque "contato" não duplica "Vamos conversar?", e a categoria em `project-detail` ficou pelo mesmo motivo.

As chaves `label` dessas seções continuam nos dicionários, órfãs, como já estavam `clients.label` e `projects.label`. Removê-las é limpeza para outro dia, e teria que sair dos dois dicionários no mesmo commit.

### Fase 10: Home enxuta e cabeçalhos de página

A Home perdeu a linha do cargo, o `<h1>` com o nome, a `<ol>` dos 5 passos e o CTA de baixo. Ficou o `h1` com a tese, a bio e os dois links do topo, que não estavam no pedido de remoção.

**O `h1` da Home é a tese, não o nome.** O nome virou âncora fixa no header e repeti-lo seria ruído, mas deixar a rota sem `h1` seria pior. Entrou `hero.thesis` nos dois dicionários: *"Entendo o problema antes de escolher a tecnologia."* É o que impede esta fase de cumprir o alerta da §2.3, que diz em texto que uma Home reduzida a nome mais bio mais link mata a tese do portfólio.

Os 5 passos foram para `/info/`, em `<Process>`, entre Identidade e Trajetória. Reusam `Dict.process.steps` inteiro, e as chaves `process.label`, `process.title` e `process.description`, que estavam órfãs desde a v3, passaram a ser usadas.

Clientes e Projetos perderam o `<SectionHeading>` e abrem direto no showcase. Como eram os dois únicos consumidores, **`SectionHeading` foi deletado**.

**Correção de acessibilidade que a fase destravou.** O `SectionHeading` renderizava `h2`, então Clientes e Projetos estavam no ar **sem `h1` nenhum**. Ganharam um em `sr-only`. Auditando as outras rotas apareceu o mesmo defeito, pré-existente, em `/info/` e `/contato/`: o `h2` de topo de cada uma virou `h1`. **As 5 rotas agora têm exatamente um `h1`, nos dois idiomas.**

### Fase 11: Textos do showcase fora da moldura

O problema e as responsabilidades viviam dentro do wrapper `lg:sticky` do `<ShowcasePreview>`. Tecnicamente já estavam fora do quadro, mas grudados nele e acompanhando a rolagem, então liam como conteúdo de dentro. Saíram para `<ShowcaseCaption>`, fora do grid, na largura cheia do conteúdo e separados por linha de 1px. Só a moldura ficou `sticky`. Não foi preciso estado novo: o `activeIndex` sempre viveu no pai (regra 3 da §3.1).

O `<WindowMockup>` perdeu o título que desenhava dentro do quadro, que era o único texto de conteúdo ali. O host na barra de endereço ficou, porque é parte do mock da janela. O componente inteiro é `aria-hidden`, então nada disso era anunciado a leitor de tela.

### Fase 12: O fundo em ondas de praia

**Só a função que gera o escalar `v` mudou.** Os dois passes, o `RenderTarget`, o grain em `gl_FragCoord`, a vinheta, o tween de tema de 900ms, as 6 paletas, o fallback CSS, o `prefers-reduced-motion` e o cap de DPR continuam iguais. E, principalmente, **o ramp de 3 cores no fim do `main` não mudou**.

É isso que torna a troca segura. O teste de contraste em `background-config.test.ts` varre 6 paletas x 2 temas x 41 pontos do ramp x 3 vinhetas x 3 amostras de grain, provando que nada cai em `UNSAFE_LUMINANCE`. Ele testa **o ramp, não o campo**. Trocando só o gerador de `v`, e mantendo o contradomínio em `[0,1]`, a garantia continua valendo por construção. O teste passou sem uma linha de alteração.

O campo novo tem quatro camadas: céu com gradiente e halo do sol, mar em perspectiva (`z = 1/d`, com **z pequeno perto do observador e z grande no horizonte**), espuma de crista por `smoothstep` de faixa curta, e a linha de arrebentação presa à linha d'água, que sobe e desce com o vaivém e deixa resíduo do lado da areia. O `uProgress` deixou de atravessar um volume de noise e move o horizonte e a fase das cristas; o `uPointer` move a coluna do rastro do sol.

**Detalhe que custa caro se esquecido:** perto do horizonte um período inteiro de onda cabe em menos de um pixel e o resultado cintila. O `w *= 1.0 - smoothstep(7.0, 22.0, z)` é o que troca esse moiré por uma faixa calma de mar distante.

**A única mudança fora do shader** foi a resolução: `FIELD_TARGET_MAX` de 320 para **640** e `FIELD_TARGET_MAX_SMALL` de 200 para **256**. O borrão bilinear de graça era virtude enquanto o campo era suave; ele derretia justamente a aresta de espuma que dá a forma sólida. O guarda de `renderer.test.ts` acompanhou, e os dois valores esperados de `fieldTargetSize` eram derivados dos tetos antigos e viraram 360 e 118.

**Os dois tetos saíram de medição, e a medição rendeu a descoberta mais útil da fase.** A primeira tentativa foi 640 e 384, e o Lighthouse mobile de `/` caiu de 93 para 85. Um teste de controle, com o shader novo e a resolução antiga, deu 93 de novo, com LCP e TBT idênticos ao baseline: **o campo de ondas custa praticamente nada, e a regressão inteira era resolução.** Como o desktop usa `FIELD_TARGET_MAX` e o mobile usa `FIELD_TARGET_MAX_SMALL`, só o teto pequeno precisava baixar. Em 256 o mobile volta ao baseline exato, e ainda são 28% mais campo do que os 200 da v3. Em 288 já cai para 91.

O que sai é contínuo e sem emenda, como o fundo da referência, não um loop de N segundos. Loop estrito exigiria noise 4D amostrado num círculo no eixo do tempo, e não paga o custo.

> ⚠️ **Crase dentro do shader quebra o build.** Os shaders são template literals em `.ts`. Uma crase num comentário GLSL fecha a string do JS, e o erro que aparece é de parse do TypeScript apontando para o meio de um comentário. Nos comentários GLSL a convenção é aspas simples.

### Fase 13: Testes e documentação

Duas suítes E2E precisaram acompanhar, e as duas por regressão real, não por fragilidade de seletor:

1. **A troca de idioma** era localizada por `locator("header a", { hasText: "EN" }).first()`. O `hasText` casa substring sem diferenciar maiúsculas, e "Clientes" contém "en". Funcionava só porque a nav vinha depois do toggle no DOM. Com a nav antes, o `.first()` mudou de alvo. O `<LangToggle>` ganhou `data-testid="lang-toggle"`.
2. **O teste de rolagem (E10)** descia até o fim de `/projetos/` e navegava. Sem o cabeçalho, `/projetos/` passou a caber inteira numa viewport de 720px e parou de rolar. A rota longa virou `/info/`, que ganhou os 5 passos no mesmo passe.

O `capture/playwright.config.ts` ganhou `LOOK_WIDTH` e `LOOK_HEIGHT`, porque o roteiro visual pede 375, 768 e 1440 e a viewport era fixa em 1440x900.

### 12.2 Estado da verificação

| Verificação | Resultado |
|---|---|
| `pnpm lint`, `pnpm typecheck` | Limpos |
| `pnpm test` | **141 unitários passando** |
| `pnpm test:e2e` | **68 E2E passando**, incluindo o controle negativo da F1 |
| `h1` por rota | Exatamente 1 nas 5 rotas, nos dois idiomas |
| Nenhum `>_` restante em `src/` | Confirmado |
| Shader em runtime | Canvas dimensionado, fallback não acionado, zero erros de console |
| Visual, 1440 e 390, tema escuro | Conferido por `pnpm look` |
| **Lighthouse** | Medido, ver abaixo |

Lighthouse com o Chromium do Playwright, comparando **na mesma máquina** a `main` (v3) e a V3.5. Os números da §11 vieram de outro ambiente e não são comparáveis linha a linha; o que vale é o A/B local.

| Rota e preset | v3 (`main`) | V3.5 | |
|---|---|---|---|
| `/` desktop | 96 (§11) | **100** | Acima |
| `/` mobile | 93 | **93** | Empate exato, LCP 2.8s e TBT 180ms nos dois |
| `/projetos/` mobile | 75 | **82** | Acima, a rota perdeu o cabeçalho |

CLS **zero** em todas.

> ⚠️ Durante a execução, 8 E2E falharam por servidor velho na porta 3000, exatamente a armadilha do topo do `playwright.config.ts`. Nenhuma das 8 era defeito de código. **Derrube a porta 3000 depois de todo build, antes de testar.**

### 12.3 O que continua aberto

| Item | Situação |
|---|---|
| **Lighthouse das outras 3 rotas** | Só `/` e `/projetos/` foram medidas. `/clientes/`, `/info/` e `/contato/` ficaram de fora, e `/info/` é a que mais cresceu nesta versão, porque recebeu os 5 passos |
| Tema claro | O campo entra a `FIELD_MIX.light` de 0.08 e as ondas ficam quase invisíveis. É o comportamento de projeto desde a v3, não regressão, mas vale decidir se a praia merece exceção |
| Paleta da Home | Continua `graphite`. A `sand` já existe e combinaria com o tema de praia. É uma linha em `paletteForRoute` |
| Chaves `label` órfãs | `about`, `skills`, `career`, `process`, `clients` e `projects` têm `label` sem consumidor. Limpeza para outro dia, nos dois dicionários no mesmo commit |
| **Lighthouse depois da 12.4** | Os números da 12.2 são de antes de tirar o Lenis e as trocas de paleta. Devem ter melhorado, mas não foram remedidos |
| Herdados da v3 | Netsheet Engine sem deploy e domínio próprio. Ver §11 |

### 12.4 Segunda rodada, depois de ver o site rodando

A primeira rodada da V3.5 foi conferida por captura. Ver o site de verdade rendeu seis correções, e **duas delas eram defeito meu, não mudança de escopo**.

**1. O rodapé estava dentro da moldura, e eu tinha lido o pedido errado.** Quando o Pedro escreveu "os textos que estão dentro do quadrado, desça eles para fora", eu entendi a legenda do showcase e mexi nela. O que ele apontava era o rodapé: ano, nome e cidade viviam com `padding-block: var(--pad)`, logo **acima** da linha inferior da moldura. Agora ocupam a faixa de `var(--pad)` que sobra abaixo dela, alinhados a `var(--pad)` na horizontal para começar na quina, em 10px. É onde a referência põe o dela. A mudança na legenda do showcase foi mantida, porque melhorou de qualquer jeito.

**2. As ondas corriam para o horizonte.** O Pedro viu antes da suíte. Com `sin(z * k - t * w)`, fase constante exige z crescente, e como z cresce em direção ao horizonte, a crista fugia mar adentro em vez de quebrar na praia. O conserto é o sinal: `+ t`. **Isto não gera erro nenhum**, o fundo continua animado e bonito, e por isso ganhou teste próprio, `pnpm waves`, que compila o GLSL real num contexto próprio e mede o deslocamento por correlação cruzada entre dois instantes. Com o sinal certo dá `-3px` de deslocamento e erro 1.65; com o sinal errado o teste reprova. Controle negativo conferido.

**3. A localidade saiu do projeto.** "Rancharia, São Paulo" saiu do rodapé, de `profile.location`, do fato de `/info/` nos dois dicionários (com o `id` fora do union de `Fact`) e do `PostalAddress` do JSON-LD. **Ficou** "Prefeitura de Rancharia" na trajetória, que é nome de empregador e não localidade.

**4. O menu desceu.** Estava em `var(--pad)`, encostado na linha de cima da moldura. Foi para `calc(var(--pad)*2)` em `lg`, que é onde a referência põe o dela. No mobile ficou em `1.5x`, porque lá o conteúdo passa por baixo do bloco de identidade sem a coluna da nav para afastar, e `2x` encostava o `h1` no cargo. A primeira seção ganhou `pt-28` no mobile pelo mesmo motivo.

**5. Saíram as trocas de cor e a rolagem suave.** A paleta por rota, a troca de paleta no hover da lista e a reação do fundo ao scroll foram removidas; o site inteiro usa `DEFAULT_PALETTE`. O **Lenis saiu do projeto**, dependência inclusive, e a rolagem voltou a ser a nativa do navegador.

O efeito cascata foi maior que o pedido e vale registrar, porque o que sumiu era estrutura: `<BackgroundPalette>` e `<SmoothScroll>` deletados; `setPalette`, `setProgress`, `paletteTween` e `PALETTE_FADE_MS` fora do motor; o uniform `uProgress` fora do shader; e o **singleton `activeBackground` inteiro**, que existia só para o scroll e a lista alcançarem o fundo sem passar pelo React. Sem esses dois consumidores ele não tinha mais razão de existir. O `palette` saiu de `ShowcaseItem`, junto com `paletteForSlug` e as listas de presets.

**A lei F3 deixou de existir**, e com ela a razão original do teste que a guardava. O teste ficou, com outro nome: `transform` em `html`, `body` ou `main` mata o blend venha de onde vier, e a próxima lib de rolagem suave que alguém instalar vai esbarrar nisso de novo.

**6. Duas paletas do vocabulário continuam sem uso.** As seis seguem definidas e cobertas pelo teste de contraste, para trocar a do site inteiro numa linha. Trocar `DEFAULT_PALETTE` para `sand` é o caminho se um dia a praia pedir cor de areia.

Verificação desta rodada: lint e typecheck limpos, **139 unitários** (dois a menos, os que provavam a paleta por rota e por item), **68 E2E**, `pnpm waves` passando com controle negativo conferido, e captura em 1440 e 390 nos dois casos.

### 12.5 Terceira rodada: fora o bloco opaco, a home vazia e o tema claro

**1. As seções `solid` pintavam um retângulo que cobria o site.** Era a variante de qualquer seção com imagem, porque foto em `difference` aparece em negativo. O efeito colateral só ficou óbvio no site rodando: em `/projetos/` a 768px o bloco preto ocupava a viewport inteira e o campo de ondas simplesmente não existia, com emenda dura onde a seção acabava.

Entrou a variante **`plain`**: sem fundo e sem blend, com a cor de texto normal. Resolve o mesmo problema que a `solid` resolvia, imagem em cores certas, sem cobrir nada. O contraste não vem do blend, vem da distância entre `--c-ink` e o campo, e o teste desta pasta já mantém a composição fora da faixa de 0.35 a 0.65: no escuro ela fica bem abaixo, no claro bem acima, e texto normal contrasta com folga nos dois. As quatro seções que eram `solid` (showcase, identidade, trajetória e o case) viraram `plain`. A `solid` continua existindo e **hoje não tem consumidor**.

**2. A home ficou sem conteúdo.** Saiu tudo: tese, bio e os dois CTAs. A rota é só o campo de ondas, com a identidade fixa no header e o copyright no rodapé. Isso **revoga em definitivo a §2.3**, que exigia a tese como corpo da home; ela sobrevive em `/info/`, na seção de processo. O `h1` continua, em `sr-only`: rota sem `h1` é falha de acessibilidade e de SEO, e a home é a raiz do site.

O "Baixar CV" era o único CTA que precisava sobreviver, e foi para o canto direito do header, junto de idioma e tema.

**3. O tema claro era um cinza chapado, e a causa era aritmética.** O fundo claro é `#f0f0f0`, luminância 0.87, e a faixa proibida começa em 0.65: são 0.22 de curso, contra a faixa inteira que o escuro tem. Com as paletas escuras, cujo ponto mais baixo é quase preto, esse orçamento acabava em `FIELD_MIX.light` de 0.12, e por isso a dose era 0.08 e as ondas não apareciam.

A saída foi dar ao tema claro **o seu próprio conjunto de paletas**, `palettesLight`, pálidas o bastante para o ponto mais escuro do ramp não afundar a composição. Medido pelo mesmo método do teste: com elas o teto sobe para 0.25. Ficou em **0.20**, que deixa 0.046 de margem contra o limite em vez dos 0.014 de 0.25. É 2.5x mais campo que antes, e as ondas passam a ser visíveis no claro.

**A paleta viaja no tween de tema**, não num paralelo: cada tema tem o seu conjunto, e dois tweens independentes chegariam em instantes diferentes, passando por combinações que ninguém mediu. O teste de contraste passou a varrer **cada tema contra o seu próprio set**, porque varrer o escuro contra o fundo claro provaria uma composição que o site nunca faz.

**4. Auditoria de responsividade, agora automatizada.** Entrou `e2e/responsivo.spec.ts`: 5 rotas × 4 larguras (390, 768, 1024, 1440) × 3 asserções. Ela encontrou e trava um defeito real: **em 768px o `h1` encostava no cargo**. A causa é que `--pad` cresce com a viewport, então o recuo do header cresce junto, enquanto o padding da seção era fixo. A folga passou a ser calculada, `calc(var(--pad) * 1.5 + 6rem)`, e vai **só na primeira seção** de cada rota, via `[&>section:first-of-type]` no `<main>`; no padding de todas, o espaço entre seções dobraria no mobile.

> ⚠️ Escrever a auditoria rendeu uma lição sobre auditoria. A primeira versão media o **container** da seção em vez do texto, e acusava colisão em todo desktop: falso positivo. A segunda usava `getPropertyValue("--pad")`, que devolve a expressão literal `max(20px, 4vmin)` e não o valor resolvido, então `parseFloat` dava `NaN`, toda comparação virava falsa e **o teste passava sem testar nada**. A régua tem que ser medida num elemento de verdade.

**5. Efeito cascata nos testes existentes.** O controle negativo da F1 rodava na home, que agora não tem seção `blend` nenhuma: passou a rodar em `/info/`, senão provaria vazio. E três seletores de E2E travavam `[data-variant="solid"]`.

Verificação: lint e typecheck limpos, **140 unitários**, **124 E2E** (4 pulados, o teste de colisão na home, que não tem seção), `pnpm waves` passando.

### 12.6 O que a terceira rodada deixou aberto

| Item | Situação |
|---|---|
| Lighthouse | Continua sem remedir. Três rodadas de mudança desde a última medição |
| Fantasma atrás do copyright | A `<ViewportMask>` cobre a faixa de baixo a `opacity: .9`, por decisão da E15, e o conteúdo que rola por baixo transparece atrás do copyright. Ficou visível agora que o rodapé mora nessa faixa. Subir a barra de baixo para opacidade 1 resolve, ao custo de uma faixa chapada |
| Variante `solid` sem consumidor | Continua no `Section`, para o caso de alguma seção futura precisar mesmo esconder o fundo. Se não aparecer, é código morto para remover |
| Chaves órfãs | `hero.bio` e `hero.viewProjects` perderam o consumidor quando a home esvaziou, e somam-se aos `label` já órfãos |

### 12.7 Quarta rodada: foto redonda, barra escondida e os ativos de marca

**1. A foto do perfil voltou a ser redonda.** O quadrado com canto de 2px era a leitura literal da §8, que proíbe `border-radius` acima de 2px. Virou exceção explícita, ao lado da janela do preview. O que a E12 proíbe é o halo e o gradiente da v2, não o círculo.

**2. A barra de rolagem some.** `scrollbar-width: none` mais `::-webkit-scrollbar { display: none }` no `html`. **Some a barra, não a rolagem:** roda, teclado, touch e a barra de espaço continuam iguais, e o `overflow` segue `auto`.

O custo é real e é escolha, não descuido: quem chega numa página longa perde a pista visual de que há mais coisa abaixo, e perde a noção de posição. Num site de cinco rotas curtas isso é aceitável; numa página de documentação não seria.

**3. Os ativos de marca estavam três versões atrasados.** O `icon.svg`, o `favicon.ico` e as duas imagens de OG continuavam no verde-água `#2dd4bf` da v2, e as OG ainda tinham os dois blobs borrados que a §8 tirou do site. Sobreviveram porque **nada olha para eles**: ícone de aba não aparece em captura, nem em teste de DOM, nem no Lighthouse. Quem viu foi o Pedro, olhando a aba do navegador.

O ícone virou fundo `--c-bg` escuro, "PL" em `--c-ink` e uma crista de onda na paleta graphite, ecoando o campo do site. As OG perderam os blobs e ganharam as mesmas cristas, feitas com raio elíptico em `<div>` e não com `<path>`, porque o satori renderiza um subconjunto de CSS e curva por `border-radius` é o caminho seguro.

Duas ferramentas novas fecham o buraco:

- **`pnpm favicon`** regrava o `favicon.ico` a partir do `icon.svg`, renderizando em 6 tamanhos e embrulhando os PNGs no container ICO. Antes os dois eram editados à mão, separados, e por isso divergiam.
- **`src/app/brand-assets.test.ts`** exige que todo hexadecimal do ícone e das OG saia da paleta do site. Controle negativo conferido: injetando `#2dd4bf` de volta, reprova apontando a cor.

Verificação: lint e typecheck limpos, **144 unitários**, **124 E2E**, `pnpm waves` passando.

### 12.8 Quinta rodada: o estouro que passou por três asserções

**1. Saiu o rótulo "contato" acima de "Vamos conversar?".** Era o último sobrevivente dos rótulos que o `>_` sustentava. Sem o prefixo, ele não estava duplicando o título, mas também não estava dizendo nada que a nav já não diga.

**2. "PROJETO PROFISSIONAL" saiu da legenda de `/clientes/`.** Dizer "projeto profissional" numa rota chamada Clientes é redundância. O `problemLabel` virou opcional e a rota de clientes deixou de passá-lo; `/projetos/` continua com "PROBLEMA", que informa. `clients.projectKind` ficou órfão.

**3. Duas palavras estouravam a própria caixa, e a auditoria não via.** Em `/contato/`, "contratando" em `text-title` passava por cima da coluna vizinha. A causa é que item de grid nasce com `min-width: auto`: a trilha não encolhe, e sem oportunidade de quebra a palavra transborda. **`min-w-0` e `break-words` sozinhos não resolvem, precisam dos dois**, e a divisão em duas colunas subiu de `sm` para `md`, onde a largura comporta.

> ⚠️ As três asserções de responsividade **passavam** com esse defeito na tela. A página não rolava de lado, o texto continuava dentro da moldura e nada colidia com o bloco de identidade: o estouro era de um elemento sobre o irmão, e nenhuma das três olhava para isso. Entrou a quarta, `scrollWidth > clientWidth`, que é a única que enxerga.

Ela achou na primeira execução um segundo caso, mais grave: em 390px o `<dd>` do email tinha `truncate`, e **"pedrolevidiass@gmail.com" aparecia cortado com reticências**. Email cortado não serve para nada. A lista de fatos passou a empilhar rótulo e valor abaixo de `sm`, e o `truncate` virou `break-words`.

Verificação: lint e typecheck limpos, **144 unitários**, **144 E2E**, `pnpm waves` passando.

### 12.9 O ícone que existia só em metade do site

Trocando o idioma, a aba do navegador voltava ao ícone padrão. A causa é que `icon.svg` e `favicon.ico` moravam em `src/app/(home)/`, e **convenção de metadado do App Router vale para o segmento e os descendentes dele**. Como `(home)` e `en` são grupos irmãos, nada em `(home)` alcança `/en/`.

Medido antes de mexer, e era pior do que parecia:

| | `/` | `/en/` | `/favicon.ico` |
|---|---|---|---|
| Antes | 1 link | **0 links** | **404** |
| Depois | 2 links | 2 links | 200 |

O `.ico` nunca chegou a ser servido: o Next só trata `favicon.ico` como especial na **raiz** de `app/`, e dentro de um grupo ele não vira rota. Ou seja, a regravação do ícone da rodada anterior estava correta e simplesmente não chegava ao navegador.

Os dois arquivos subiram para `src/app/`, que é pai dos dois grupos, e passaram a valer nas 12 rotas.

Entrou `e2e/marca.spec.ts`, que exige `link[rel="icon"]` em toda rota dos dois idiomas e confere que os dois arquivos respondem 200, checando o cabeçalho ICONDIR do `.ico` para não passar com um HTML de 404 no lugar. Ele faz par com o `brand-assets.test.ts`: um cuida da cor, o outro da entrega, e de nada adianta a cor certa num ícone que a rota não declara.

Verificação: lint e typecheck limpos, **144 unitários**, **157 E2E**, `pnpm waves` passando.

### 12.10 Fechamento: a medição que faltava

A V3.5 foi mergeada na `main` pelo PR [#4](https://github.com/tavinholoco/portfolio/pull/4), com 8 commits. Esta seção é a avaliação completa depois do merge, que ficou pendente desde a 12.2 porque cada rodada mudava o que havia para medir.

#### Lighthouse, as 5 rotas, os dois presets

| Rota | Perf desktop | Perf mobile | A11y | Best Practices | SEO | CLS |
|---|---|---|---|---|---|---|
| `/` | 99 | 85 | 100 | 100 | 100 | 0 |
| `/clientes/` | 100 | **74** | 100 | 100 | 100 | 0 |
| `/projetos/` | 100 | 89 | 100 | 100 | 100 | 0 |
| `/info/` | 100 | 89 | 100 | 100 | 100 | 0 |
| `/contato/` | 100 | 89 | 100 | 100 | 100 | 0 |

**No desktop o site é praticamente perfeito**, com LCP entre 0.6s e 0.8s e TBT entre 30ms e 100ms. A limpeza da V3.5 aparece aqui: `/clientes/` e `/projetos/`, que eram 99, chegaram a 100 depois de perderem o Lenis, a troca de paleta e o cabeçalho.

**No mobile o número honesto é 74 a 89**, e vale dizer com todas as letras que **isso é pior do que os 89 a 96 que a §11 registrou para a V3**. Parte é ambiente (aqueles números vieram de outra máquina), mas parte é real: o campo do shader subiu de 200 para 256 no alvo pequeno, e o mobile do Lighthouse roda com 4x de throttle de CPU.

O gargalo não é o shader. Os audits que reprovam em todas as rotas são `legacy-javascript-insight` (13 KiB), `render-blocking-insight` (~110ms) e `network-dependency-tree-insight`, todos do framework, não do código do site.

**`/clientes/` em 74 é o pior número e o único que merece investigação**, com TBT de 560ms e LCP de 3.9s, contra 250ms e 3.0s de `/projetos/`. As duas rotas usam o mesmo componente e os mesmos dados; a diferença é o screenshot do Dandarkness, e o `lcp-discovery-insight` reprova, sugerindo que a imagem de LCP não é descoberta cedo. Fica registrado, não resolvido.

#### Um defeito de acessibilidade que a medição pegou, e que eu tinha causado

`/info/` e `/contato/` estavam em **A11y 98**, reprovando `heading-order`. A causa foi a correção da 12.5: promover o `h2` de topo a `h1` resolveu as rotas sem `h1`, e criou o defeito seguinte, porque os `h3` que viviam sob aquele `h2` passaram a pendurar direto no `h1`.

O conserto respeita a semântica em vez de renumerar por conveniência: em `<About>`, "Engenharia além da interface" e "Interesses ativos" eram `<p>` e **são cabeçalhos de verdade**, então viraram `h2`; em `<Contact>`, os dois caminhos são o nível logo abaixo do título da página, então os `h3` viraram `h2`. Nada mudou na tela. As duas rotas voltaram a **100**.

> ⚠️ Isso quebrou **duas vezes seguidas** nesta versão, e nas duas a tela ficou idêntica. Entrou `hierarquia de cabeçalhos` em `e2e/shell.spec.ts`, exigindo exatamente um `h1`, que ele seja o primeiro cabeçalho da página, e nenhum pulo de nível, nas 11 rotas.

#### O que a V3.5 acrescentou de rede de segurança

Seis defeitos desta versão só apareceram porque alguém olhou a tela, nunca porque um teste falhou: as ondas correndo para o horizonte, o rodapé dentro da moldura, o email cortado com reticências, "contratando" por cima da coluna vizinha, o ícone verde-água de três versões atrás e o ícone ausente em `/en/`. Cada um virou teste:

| Teste | Pega |
|---|---|
| `pnpm waves` | Direção das cristas, com controle negativo |
| `e2e/responsivo.spec.ts` | 5 rotas × 4 larguras: rolagem lateral, colisão com a identidade, texto fora da moldura, palavra estourando a caixa |
| `e2e/marca.spec.ts` | Ícone declarado em toda rota dos dois idiomas, e os arquivos servidos |
| `src/app/brand-assets.test.ts` | Cores do ícone e das OG saem da paleta, com controle negativo |
| `hierarquia de cabeçalhos` | Um `h1` por rota, sem pulo de nível |

Total: **144 unitários e 168 E2E**.

#### O que continua aberto

| Item | Situação |
|---|---|
| `/clientes/` mobile em 74 | O pior número do site. TBT 560ms e LCP 3.9s, com `lcp-discovery-insight` reprovando. Não investigado |
| Fantasma atrás do copyright | A `<ViewportMask>` é `opacity: .9` por decisão da E15, e o conteúdo transparece na faixa de baixo. Subir para 1 resolve, ao custo de uma faixa chapada |
| Variante `solid` | Sem consumidor desde a 12.5. Se não aparecer uso, é código morto |
| Chaves órfãs | `hero.bio`, `hero.viewProjects`, `clients.projectKind` e vários `label` perderam consumidor ao longo das rodadas |
| Netsheet Engine e domínio próprio | Herdados da v3, sem mudança. Ver §11 |

### 12.11 Os dois itens abertos, medidos e fechados

#### `/clientes/` no mobile não tinha defeito próprio

O 74 registrado na 12.10 era **o pior de uma amostra só**. Rodando três vezes cada rota, as medianas ficaram em 83 para `/clientes/` e 84 para `/projetos/`: as duas na mesma faixa. A conclusão da 12.10 de que aquela rota merecia investigação especial estava errada, e sai.

O que existe de verdade vale para todas as rotas. O custo de JS na CPU emulada, por chunk:

| Chunk | Custo |
|---|---|
| framework | 651 ms |
| **`ogl`, 108 KB** | **622 ms** |
| aplicação | 279 ms |

O motor do fundo custava 622ms **dentro da janela que o TBT e o LCP medem**, porque o `await import("ogl")` acontecia no efeito de montagem, competindo com a hidratação. O fundo é decorativo: nada na página depende dele para ser lido ou clicado, e por isso é o candidato certo a sair do caminho.

O import passou a esperar a primeira ociosidade (`requestIdleCallback`, `timeout: 2000`, com `setTimeout` de fallback), e o canvas ganhou fade de 700ms, para a entrada ser intencional em vez de pipoco. Sob movimento reduzido a transição some.

Medianas de 3 rodadas, mobile:

| | `/clientes/` antes | depois | `/projetos/` antes | depois |
|---|---|---|---|---|
| Bootup de JS | 1303 ms | **955 ms** | 1432 ms | 1344 ms |
| TBT | 326 ms | **134 ms** | 231 ms | 229 ms |
| LCP | 3646 ms | **3020 ms** | 3877 ms | 3992 ms |

**O ganho é assimétrico, e vale registrar por quê.** Onde o JS domina, ele é grande: `/clientes/` perdeu 59% do TBT. Onde as imagens dominam, some: `/projetos/` monta quatro previews de uma vez, e o custo delas absorve o que a espera economizou. Não houve regressão em lugar nenhum.

#### O fantasma atrás do copyright era um comentário errado

As barras da `<ViewportMask>` eram `opacity: .9`, justificadas como *deixa o canvas transparecer de leve na borda*. Medindo a geometria numa viewport de 720px:

| Elemento | Posição |
|---|---|
| Canvas | 29 a **691** |
| Barra de baixo | **691** a 720 |

**O canvas termina exatamente onde a barra começa.** Ele é recuado em `var(--pad)` e nunca entra na faixa, então não havia canvas nenhum ali para transparecer. O que estava atrás era o fundo do `:root`, da **mesma cor da barra**, e compor uma cor sobre ela mesma a 90% devolve a mesma cor.

Ou seja, a translucidez não produzia o efeito que a justificava, e a única coisa que ela deixava passar era o conteúdo rolando por baixo, que aparecia como fantasma atrás do copyright. As barras viraram opacas: **a cor da faixa não mudou um pixel** e o fantasma sumiu.

O teste em `e2e/shell.spec.ts` trava as duas coisas juntas, porque uma sustenta a outra: as barras opacas **e** o canvas contido dentro delas. Se um dia o canvas deixar de ser recuado, a barra opaca passa a cobrir fundo de verdade, e o teste avisa.

Verificação: lint e typecheck limpos, **144 unitários**, **169 E2E**.

---

## 13. Plano de aperfeiçoamento (28/08/2026)

Auditoria da `main` depois da V3.5 fechada, e o plano de milestones que sai dela. **Tudo abaixo é medido**, com o número e o método ao lado; nada aqui é impressão.

### 13.1 Linha de base

Lighthouse mobile, **mediana de 3 rodadas por rota**, contra o build de produção. Rodada única não serve: o spread de `/clientes/` foi de 79 a 93 na mesma configuração, e foi uma amostra azarada dessas que produziu o "74" da §12.10.

| Rota | Perf | Spread | LCP | TBT | Bootup de JS |
|---|---|---|---|---|---|
| `/` | 90 | 90 a 92 | 2847 ms | 261 ms | 1410 ms |
| `/clientes/` | 92 | 79 a 93 | 3030 ms | 190 ms | 1182 ms |
| `/projetos/` | 91 | 91 a 92 | 3292 ms | 137 ms | 1468 ms |
| `/info/` | 90 | 90 a 92 | 2891 ms | 262 ms | 1465 ms |
| `/contato/` | 88 | 86 a 90 | 2834 ms | 319 ms | 1345 ms |

Desktop entre 99 e 100. **A11y, Best Practices e SEO em 100**, CLS zero em todas. O adiamento do `ogl` da §12.11 tirou o site da faixa de 74 a 89 e colocou em 88 a 92.

JS servido ao cliente, **270 KB gzip no total**:

| Chunk | Bruto | Gzip | Conteúdo |
|---|---|---|---|
| `2opyvl7` | 223 KB | 70 KB | framework |
| `2h64m1u` | 156 KB | 42 KB | framework |
| `0cz1d0m` | 110 KB | 39 KB | framework |
| `09ketmo` | 128 KB | 38 KB | `ogl` e shaders (já adiado) |
| **`2vrc77u`** | **107 KB** | **36 KB** | **os dois dicionários de i18n** |
| `1hlzxtx` | 27 KB | 9 KB | ícones lucide |

### 13.2 O que a auditoria encontrou

**A. Os dois dicionários vão inteiros para o cliente.** 36 KB gzip, **13% de todo o JS**, e o visitante brasileiro baixa o dicionário em inglês junto. A causa é única: `site-header.tsx` é o único client component que importa `dictionaries`, e faz `dictionaries[lang]`, o que impede o bundler de descartar qualquer um dos dois. O header precisa de **umas dez strings curtas**.

**B. `text-display` estoura a caixa nas duas pontas.** A auditoria atual cobre 390, 768, 1024 e 1440, e passa. Fora dessa faixa:

| Viewport | Fonte | Precisa | Cabe | Resultado |
|---|---|---|---|---|
| 320 px | 44 px (piso do clamp) | 251 px | 240 px | **estoura 11 px** |
| 844 px paisagem | 74 px | 764 px | 764 px | passa raspando |
| 2560 px | 112 px (teto do clamp) | 638 px | 611 px | **estoura 27 px** |

O piso de `2.75rem` é grande demais para 320px, e o teto de `7rem` não cabe no container, que é `max-w-5xl` e ainda perde `--nav-col` para a coluna da nav. As duas pontas do `clamp()` discordam da largura real disponível.

**C. O showcase carrega todas as imagens de uma vez.** As quatro previews de `/projetos/` são empilhadas em `absolute inset-0`, então **estão todas na viewport** e o `loading="lazy"` do Next não as adia. Só a primeira tem `priority`, mas as outras três competem pela banda na mesma janela do LCP, que ali é o pior do site: 3292 ms.

**D. Duplicação nos pares espelhados por idioma.** `layout.tsx` difere em 4 linhas entre `(home)` e `en`, e `opengraph-image.tsx` também. São cerca de 180 linhas duplicadas, e é exatamente o risco que a regra 4 do `CLAUDE.md` descreve: mexer num e esquecer o outro não gera erro.

**E. O markup de cabeçalho de seção voltou a ser copiado.** Título mais descrição aparece igual em `about`, `career`, `process`, `skills` e `project-detail`. O `<SectionHeading>` foi deletado na §12.5 porque seus dois consumidores sumiram, mas o padrão continuou vivo em outros cinco lugares.

**F. 15 chaves de dicionário sem consumidor**, de 75 declaradas: o `label` de todas as seções, `clients.description`, `projects.description`, `hero.bio`, `hero.viewProjects`, `hero.socials`, `meta.title`, `meta.description`, `meta.ogDescription`. Resíduo das rodadas da V3.5.

**G. Código morto de baixo impacto.** `composedLuminance` e `lerpPalette` são exportados e usados **só pelos próprios testes**, e a variante `Section variant="solid"` está sem consumidor desde a §12.5.

### 13.3 Milestones

Ordenados por retorno sobre risco. **Cada um fecha sozinho**, com critério de aceite medível, e nenhum depende do seguinte.

#### M1. Os extremos de viewport (achado B) ✅

**Concluído. Encontrou quatro defeitos, e três estavam no ar sem ninguém ver.**

**1. A escala tipográfica nunca foi retunada depois da V3.5.** O teto de `--text-display` era `7rem`, dimensionado na v3 quando o container tinha a largura toda. A V3.5 reservou `--nav-col` e comeu 15rem dele, mas a escala não acompanhou: "Progressivo" pedia 702px numa caixa de 640, ou seja, **estourava em todo desktop de 1440 para cima**, e também em 320px. Teto para `6rem`, mais `break-words` e `hyphens-auto` como rede.

**2. A auditoria não visitava as páginas de case,** que é justamente onde vive o título mais longo do site. Rota que não é visitada não é testada. `/projetos/repertorio-progressivo/` entrou na lista.

**3. A coluna de tecnologias esmagava o título do showcase.** Ela é `auto` e não encolhe, e em 1024px, com `--nav-col` já cobrando 15rem, sobravam uns 30px para o título: os nomes saíam **por cima** das tecnologias. A coluna passou de `lg` para `xl`, onde há largura para as duas.

**4. O `truncate` do card de contato cortava o email com reticências** em 320 e 390px, o mesmo defeito que a lista de fatos teve na §12.5. Os cards passaram a empilhar abaixo de `sm`.

**E um quinto, que era regressão minha e o mais grave de todos.** Com o "Baixar CV" no header, identidade mais controles pedem 368px, e sobram 310 num celular de 390px: os controles saíam da tela e **o botão do menu ficava inalcançável em 320, 360 e 390px**, que é a maioria dos celulares. O header ganhou `flex-wrap`.

> ⚠️ **Nenhuma auditoria pegou isso, e a razão é estrutural:** o header é `fixed`, e o que transborda de um elemento `fixed` **não entra no `scrollWidth` do documento**. A asserção de rolagem horizontal não tinha como ver. Entrou uma quinta asserção que mede o header contra a viewport.

A auditoria foi reescrita: **6 rotas × 7 larguras** (320, 390, 844 em paisagem, 768, 1024, 1440, 2560), com as cinco asserções rodando **num carregamento só**. Antes eram quatro `goto` por combinação, o que fazia cada largura nova custar 4x e desestimulava exatamente o que faltava. O E2E caiu de 169 para 135 testes **com mais cobertura**.

**6. E o CI achou a causa raiz de tudo isso, que eu tinha tratado só nos sintomas.**

A auditoria passou aqui e **reprovou no CI**: a métrica "144+" pedia 116px numa célula de 114px em 2560x1440. Dois pixels, e a diferença entre passar e falhar era a renderização de fonte do Linux contra a do Windows.

Investigando, a célula mais estreita **não acontecia na tela mais estreita, e sim na mais larga**. `--pad` era `max(20px, 4vmin)`, sem teto, e o conteúdo paga o dobro dele de cada lado, mais `--nav-col`:

| Viewport | `--pad` | Coluna de conteúdo |
|---|---|---|
| 1440x900 | 36 px | 640 px |
| 2560x1440 | 57.6 px | 554 px |
| 2560x1600 | 64 px | 528 px |

**Tela maior entregava conteúdo mais estreito**, que é o oposto do esperado, e é a mesma causa do estouro do título de case do achado 1. Tratar cada estouro com `break-words` teria escondido isso indefinidamente.

`--pad` virou `clamp(20px, 4vmin, 40px)`. A coluna de conteúdo passou a ser **estável em 1024px** de 1440 até 3840, e a folga da métrica foi de -1px para 22px. O `pr-6` de cada célula virou `gap-x-6` no grid, porque com padding a última coluna desperdiçava 24px que ninguém usava.

> **Aceite atingido:** 42 combinações verdes, 144 unitários e 135 E2E.

#### M2. Tirar os dicionários do cliente (achado A) ✅

**Concluído**, com uma correção importante ao número que eu mesmo tinha estimado.

`SiteHeader` continua client component, porque depende de `usePathname()` para o item ativo, mas **parou de importar `dictionaries`**: as nove strings que ele usa (`hero.name`, `hero.role`, `hero.downloadCv`, o bloco `nav` e o `controls`) chegam por prop, montadas no `<SiteShell>`, que roda no servidor. `Dict` passou a ser exportado como tipo, e import de tipo é apagado no build.

> ⚠️ **O ganho real é 7 KB gzip, não os 36 KB que a §13.1 previa.** O erro foi meu e vale registrar: eu atribuí ao dicionário o **gzip do chunk inteiro**, quando aquele chunk de 107 KB carregava o dicionário **e mais código**. Texto natural repetido comprime muito bem, então 19 KB brutos de dicionário viram uns 6 a 7 KB depois do gzip. A lição é medir o delta entre dois builds, e não o tamanho do chunk que contém a coisa.

| | Antes | Depois |
|---|---|---|
| JS do cliente, gzip | 270 KB | **263 KB** |
| JS do cliente, bruto | 860 KB | **841 KB** |
| Chunks com texto de dicionário | 1 | **0** |

O que continua valendo, e não é pouco: **cada página passou a carregar só o idioma dela**. Antes, o visitante brasileiro baixava o dicionário inglês inteiro para ler uma página em português, e isso é defeito de correção antes de ser de peso.

**Descoberta paralela:** o `ogl` aparece em dois chunks, e isso **já era assim antes do M2**. Não é regressão desta mudança, e fica anotado como candidato do M3.

> **Aceite atingido:** `e2e/bundle.spec.ts` varre os chunks e o HTML das duas rotas, lendo a maior string literal de cada dicionário em vez de fixar texto que envelhece. Controle negativo conferido: reinstalando o `dictionaries[lang]` no header, o teste reprova nomeando o chunk e os dois idiomas.

#### M3. Imagens do showcase fora do caminho crítico (achado C) ⚠️

**A premissa estava errada, e o aceite não foi atingido.** Fica registrado porque saber o que não funciona vale tanto quanto saber o que funciona, e porque duas das tentativas são ideias que qualquer pessoa teria de novo.

**As imagens nunca estiveram no caminho crítico.** O achado C dizia que as quatro previews competiam pela banda na janela do LCP. Medindo o breakdown, elas carregam em **15 ms** e o que domina é `Element render delay`, de 169 ms:

| Fase do LCP em `/projetos/` | Mediana |
|---|---|
| Time to first byte | 7 ms |
| Resource load delay | 8 ms |
| Resource load duration | **15 ms** |
| Element render delay | **209 ms** |

Três hipóteses testadas, **na mesma sessão de medição**, porque comparar entre sessões é ruído:

| Tentativa | `/projetos/` | Decisão |
|---|---|---|
| Base (com M1 e M2) | 92 / 3250 ms | |
| Adiar imagens inativas para a ociosidade | **81 / 4133 ms** | revertida |
| `experimental.inlineCss` | 90 / 3493 ms | revertida |
| `fetchPriority="high"` na imagem de LCP | 91 / 3340 ms | **mantida** |

**Por que o adiamento piorou:** as três imagens continuam sendo baixadas, porque a ociosidade chega antes de o Lighthouse terminar o traço. Não se economizou byte nenhum, e o re-render que monta as outras duas empurrou o `Element render delay` de 169 para 231 ms. A ideia gastava trabalho de main thread para não economizar rede.

**Por que o `inlineCss` piorou:** ele resolve o que promete, e o audit `render-blocking` passou a marcar zero (eram 156 ms de bloqueio por um CSS de 9.8 KB, custo de round trip e não de tamanho). Só que inlinar 9.8 KB em **cada** resposta engorda o HTML, e sob a simulação de rede do Lighthouse isso custa mais do que o round trip economizado. Piorou o LCP nas cinco rotas.

**O que ficou:** `fetchPriority="high"` na imagem de LCP. O `priority` do Next gera o `<link rel="preload">` mas **não** põe `fetchpriority` nele, e o `lcp-discovery-insight` cobrava isso em `priorityHinted`. O audit passou a marcar `true`. No LCP o efeito é neutro dentro do ruído, mas é correção real, de um atributo, sem risco.

> **Aceite não atingido, e por um motivo estrutural:** o LCP deste site é dominado por `Element render delay`, que é trabalho de main thread durante a hidratação. Os três chunks de framework somam 151 KB gzip, e é ali que está a alavanca. Não há ganho grande em imagens, CSS ou atributos: isso já foi medido, e está tudo aqui para não ser remedido.

#### M4. Fim da duplicação por idioma (achado D) ✅

**Concluído.** O corpo do documento foi para `<RootDocument lang>` e o desenho da imagem de link para `ogImage(lang)`. Os arquivos por idioma ficaram só com o que o Next exige no módulo do segmento.

| | Antes | Depois |
|---|---|---|
| `layout.tsx`, cada um | 60 linhas | **17 linhas** |
| `opengraph-image.tsx`, cada um | 109 linhas | **10 linhas** |
| Total dos quatro | 338 linhas | 54, mais 207 de código compartilhado |
| Superfície duplicada | ~330 linhas | **~27 linhas de boilerplate** |

**`metadata` e `viewport` são reexportados**, e isso é o único ponto que exigiu cuidado: o Next lê os dois no módulo do segmento, não no componente. `export { metadata, viewport }` funciona, e foi verificado no HTML servido, não só no build: `<html lang>`, `theme-color`, `og:image` e `og:image:alt` continuam corretos e **diferentes** nos dois idiomas, e as duas imagens renderizam em 200 com o texto do idioma certo.

> ⚠️ **O `diff` entre os pares não desapareceu por completo, e não deveria.** Sobraram 6 linhas nos layouts e 4 nas OG, e são exatamente as que precisam diferir: o `lang`, o nome da função e o `alt`. O que sumiu foi a cópia de fontes, script de tema, `<html>`, `<body>` e o desenho inteiro da imagem, que é onde o risco morava.

**Um efeito colateral de mover código para fora de `app/`:** o `@next/next/no-head-element` passou a avisar sobre o `<head>` do documento. A regra é do Pages Router, onde `<head>` competia com o `next/head`, e o plugin isenta por caminho, não por conteúdo. O aviso está silenciado com a justificativa no lugar; o script de tema precisa rodar antes do primeiro paint e por isso não pode virar `<Script>`.

O `brand-assets.test.ts` passou a varrer `src/components/og-image.tsx`, que é onde as cores agora vivem. São 143 unitários em vez de 144 porque o teste itera dois arquivos em vez de três.

> **Aceite atingido:** 17 e 10 linhas por idioma, `html-lang.spec.ts` e `brand-assets.test.ts` verdes, e 137 E2E.

#### M5. Limpeza (achados E, F, G) ✅

**Concluído.**

**As 15 chaves órfãs saíram**, dos dois dicionários e do tipo `Dict`, no mesmo commit: `meta.title`, `meta.description`, `meta.ogDescription`, `hero.bio`, `hero.viewProjects`, `hero.socials` e o `label` de sete seções, mais `clients.description` e `projects.description`. O `Dict` foi de 75 para 60 folhas.

> ⚠️ **A varredura volta 8, e os 8 são falso positivo.** São os campos de `nav` e `controls`, que desde o M2 viajam como **objeto inteiro** na prop `labels` do header, e o script procura acesso `dictionaries[lang].grupo.campo`. Conferido no HTML servido: os seis textos de `nav` e `controls` aparecem no DOM. Órfãos reais: **zero**.

**O `<SectionIntro>` voltou, com escopo menor que o do antigo `<SectionHeading>`.** Aquele carregava rótulo, título, descrição e alinhamento, e morreu na §12.5 quando seus dois consumidores perderam o cabeçalho. Este é só o par título mais descrição, usado por `career`, `process` e `skills`. **`About` e a página de case ficaram de fora de propósito:** lá o título é `h1` e a escala é outra, e forçar os cinco no mesmo componente foi exatamente o que inchou o anterior.

Ele também unificou uma divergência que já existia: `career` pintava a descrição com `text-muted-foreground` enquanto os outros dois usavam `opacity-70`. A lei 6 pede hierarquia por opacidade, e cor que não herda ainda inverteria sozinha se a seção virasse `blend`. Ficou `opacity-70` nos três.

**O código morto saiu:**

| Item | Destino |
|---|---|
| `lerpPalette` | Removido. Servia ao crossfade de paleta, que saiu na V3.5 |
| `composedLuminance` | Removido. Não dava para reaproveitar no teste de contraste, que aplica vinheta e grão entre a mistura e a luminância |
| `Section variant="solid"` | Removido. A `plain` resolveu o mesmo problema sem cobrir o fundo, e a `solid` ficou sem consumidor desde a §12.5 |

Os dois helpers eram exportados e testados **só pelos próprios testes**, que saíram junto: 143 unitários viraram 141, sem perder cobertura de nada real. `CLAUDE.md` e `README.md` acompanharam a saída da variante.

> **Aceite atingido:** paridade dos dicionários verde, órfãos reais em zero, e `pnpm look` sem regressão na seção que mudou de cor.

### 13.4 O que ficou de fora, e por quê

- **`legacy-javascript` (13 KiB) e `render-blocking` (~110 ms)** reprovam em todas as rotas, mas são do framework, não do código do site. Sem alavanca sem trocar de versão do Next.
- **Subir o mobile de 90 para 95+** exigiria atacar os 3 chunks de framework, que somam 151 KB gzip. Não há ganho fácil ali.
- **O tema claro** continua com o campo a `FIELD_MIX.light` de 0.20, que é o teto medido com margem. Melhorar exige repensar a faixa proibida, não ajustar uma constante.


### 13.5 Fechamento (31/08/2026)

O PR #7 foi mergeado na `main` pelo commit `b3ce36a`, com os 6 commits dos milestones. CI e Vercel verdes na `main`, e o site republicado.

**Verificação depois do merge**, na `main` sincronizada:

| Passo | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo |
| `pnpm test` | **141 unitários**, 15 arquivos |
| `pnpm build` | 24 rotas na árvore, **26 páginas prerenderizadas**, nenhuma dinâmica |
| `pnpm test:e2e` | **137 E2E**, 7 arquivos |
| `pnpm waves` | cristas vêm para a praia, erro 1.65 |
| 10 rotas em produção | 200 |
| `favicon.ico` e `icon.svg` | 200, tipo correto |

**A contagem de E2E caiu de 169 para 137, e isso não é perda de cobertura.** O M1 juntou cinco asserções num carregamento só e ao mesmo tempo subiu a auditoria responsiva de 5 rotas × 4 larguras para **6 × 7**. As combinações passaram de 20 para 42, e as asserções de 60 para 210. O número de `test()` caiu porque a unidade mudou, não o que é verificado.

Os unitários foram de 144 para 141 pelo mesmo tipo de motivo: o M4 fez `brand-assets.test.ts` iterar 2 arquivos em vez de 3, e o M5 levou junto os testes de `lerpPalette` e `composedLuminance`, que só existiam para os próprios helpers removidos.

#### O que foi conferido no site publicado, e não só no build

Build verde prova que compila, não que o efeito chegou ao visitante. Três coisas foram medidas contra a URL de produção:

**M2, a separação dos dicionários.** Baixando os 10 chunks que a home em português referencia: **nenhum contém texto de nenhum dos dois dicionários**, nem o inglês nem o próprio português. As dez strings do header viajam no payload RSC embutido no HTML, por página e já no idioma certo. Contaminação cruzada em zero nos dois sentidos: `"Full Stack Developer"` não aparece na home PT, `"Desenvolvedor Full Stack"` não aparece na EN. O chunk de 107 KB que carregava os dois dicionários deixou de existir no conjunto servido, e a home PT fica em **212 KB gzip** em 10 chunks.

**M4, os metadados por idioma.** É o ponto de maior risco do M4, porque `metadata` e `viewport` são reexportados e o Next os lê no módulo do segmento, não no componente. No HTML servido, os dois idiomas diferem corretamente: `lang="pt"` contra `lang="en"`, `/opengraph-image-12gd74` contra `/en/opengraph-image`, e o `og:image:alt` em `"Pedro Levi | Desenvolvedor Full Stack"` contra `"Pedro Levi | Full Stack Developer"`. O `theme-color` é o mesmo nos dois, e deve ser.

**As 10 rotas e os assets de marca.** Todas em 200, com `favicon.ico` em `image/vnd.microsoft.icon` e `icon.svg` em `image/svg+xml`. Vale a lei 13 do `CLAUDE.md`: esses dois envelhecem sem aparecer em captura, em teste de DOM nem no Lighthouse.

#### O placar do plano de aperfeiçoamento

| Milestone | Aceite | Observação |
|---|---|---|
| M1. Extremos de viewport | ✅ | 5 defeitos, **3 já estavam no ar** |
| M2. Dicionários fora do cliente | ✅ | verificado no bundle de produção |
| M3. Imagens fora do caminho crítico | ❌ | **premissa refutada**, ver §13.3 |
| M4. Fim da duplicação por idioma | ✅ | ~330 linhas duplicadas viraram ~27 |
| M5. Limpeza | ✅ | 15 chaves órfãs, órfãos reais em zero |

**Quatro de cinco aceites atingidos.** O M3 é o único em aberto, e continua aberto de propósito: a §13.3 registra que o gargalo do LCP é `Element render delay`, trabalho de main thread na hidratação, e que as duas otimizações plausíveis foram medidas e **pioraram** o site. Reabrir o M3 sem antes atacar os 151 KB gzip de framework é repetir um caminho já andado.

**Três dos cinco milestones corrigiram defeito real que estava em produção**, não fizeram melhoria cosmética: o menu inalcançável em 320, 360 e 390px (que foi regressão introduzida por mim ao pôr o Baixar CV no header), o título de case estourando a caixa em todo desktop de 1440 para cima, e o email com reticências nos cards de contato.

#### Uma lacuna encontrada na própria verificação, e o defeito que ela escondia

Conferir os metadados à mão em produção revelou que **nenhum teste cobria `theme-color` nem `og:image`**. Escrever esse teste **encontrou um defeito de produto que estava no ar**, e está registrado na §13.7.

#### O que sobra, e a recomendação

Com a §13.7 fechada, nada do plano de aperfeiçoamento está pendente de execução. O que resta é escolha de escopo novo, e está na §13.4: os 151 KB de framework, o `legacy-javascript` do Next e o teto do tema claro. **Nenhum dos três é ajuste de constante**, e os três já foram medidos o bastante para se saber que não têm ganho fácil.

A recomendação é **não abrir M6 por enquanto**, e a §13.6 reforça isso: o site está em **96 a 98 no mobile em produção** e 99 a 100 no desktop, com A11y, Best Practices e SEO em 100 e CLS zero. O próximo ganho real de performance depende de uma versão do Next que reduza o custo de hidratação, o que é espera e não trabalho. Se for para investir esforço agora, ele rende mais em conteúdo (o deploy do Netsheet Engine da §0.4, que ainda usa o mockup de janela) do que em performance.


### 13.6 A medição estava sendo feita no lugar errado (31/08/2026)

Ao fechar a verificação pós-merge, a medição contra a URL de produção deu números muito acima dos documentados. Investigando, **o site sempre foi melhor do que este plano registrou**, e o erro é de método, não de código.

#### O primeiro erro: `--preset=perf`

A primeira rodada usou `--preset=perf`. Esse preset **troca o `throttlingMethod` de `simulate` para `devtools` sem avisar**, e os números deixam de ser comparáveis com qualquer coisa medida antes. Foi pego conferindo o `configSettings` do JSON, não pelo resultado parecer estranho.

> **Regra:** nunca usar `--preset=perf` neste projeto. Use `--only-categories=performance`, que preserva o padrão `simulate`. E confira `configSettings.throttlingMethod` no JSON antes de comparar duas medições.

#### O erro de fundo: `localhost` não é o site

Refeita com `simulate` nos dois ambientes, mediana de 3 rodadas por rota, mesma máquina e mesma sessão:

| Rota | Produção (Vercel) | Spread | LCP | Build local | Spread | LCP |
|---|---|---|---|---|---|---|
| `/` | **96** | 95 a 96 | 1818 ms | 88 | 86 a 88 | 3406 ms |
| `/clientes/` | **98** | 96 a 99 | 1658 ms | 80 | 80 a 94 | 3711 ms |
| `/projetos/` | **97** | 96 a 98 | 2421 ms | 91 | 80 a 92 | 3328 ms |
| `/info/` | **97** | 95 a 97 | 2260 ms | 94 | 93 a 94 | 2878 ms |
| `/contato/` | **96** | 96 a 96 | 1664 ms | 88 | 88 a 94 | 3387 ms |

CLS zero em produção nas cinco rotas.

**A coluna local reproduz a linha de base da §13.1 dentro do ruído**, o que confirma que aquela tabela foi medida no `next start` e não em produção. O plano então descreveu como "o estado do site" um número que nenhum visitante jamais viu.

**A diferença é infraestrutura, não código:** a Vercel serve com CDN na borda, HTTP/2 e Brotli; o `next start` local serve de um processo Node no Windows, sem compressão e com um round trip por recurso. O LCP cai quase pela metade.

**O spread também é outro.** Em produção os cinco spreads somam 7 pontos no total (o maior é 96 a 99). Localmente, `/clientes/` varia **80 a 94** e `/projetos/` **80 a 92**. Ou seja: a instabilidade que a §13.1 tratou como característica do site é característica do **ambiente de medição**. Aquele "74" que assombrou a §12.10 e o `CLAUDE.md` era ruído de localhost.

#### O que isso muda, e o que não muda

**Não muda as conclusões do M3.** As três hipóteses da §13.3 foram comparadas entre si **na mesma sessão e no mesmo ambiente**, que é o método correto para um A/B. O que dizia qual opção era melhor continua valendo, e as duas revertidas continuam revertidas. O que não vale são os **valores absolutos** de LCP daquela tabela: eles descrevem o build local.

**Não muda a §13.4.** Os 151 KB gzip de framework e o `legacy-javascript` continuam sendo os itens sem alavanca fácil.

**Muda a prioridade.** Com o site real em 96 a 98, **não existe problema de performance para resolver**. A recomendação de não abrir M6 deixa de ser "o custo não compensa" e passa a ser "não há o que consertar". O esforço rende mais em conteúdo.

> **A lição que fica, e que virou lei no `CLAUDE.md`:** medir performance contra `localhost` mede a máquina de desenvolvimento, não o produto. Este plano gastou uma auditoria inteira, uma linha de base e um milestone (o M3) perseguindo um LCP que a CDN já resolvia.


### 13.7 As oito rotas sem imagem de link (31/08/2026)

**Escrever o teste que faltava encontrou um defeito de produto**, e ele estava em produção havia meses. É o melhor argumento possível a favor de fechar lacunas de teste em vez de conferir à mão.

#### O sintoma

Das 12 rotas do site, **só `/` e `/en/` tinham `og:image` e `twitter:image`**. As outras dez, incluindo as quatro páginas de case nos dois idiomas, não tinham imagem nenhuma. Compartilhar `/projetos/` ou `/contato/` no WhatsApp, no LinkedIn ou no Slack não gerava preview.

Conferido em produção antes de mexer em qualquer linha:

| Rota | Antes | Depois |
|---|---|---|
| `/` e `/en/` | ✅ | ✅ |
| `/clientes/`, `/projetos/`, `/info/`, `/contato/` | ❌ | ✅ |
| os espelhos em `/en/` | ❌ | ✅ |
| as 4 páginas de case, nos 2 idiomas | ❌ | ✅ |

#### A causa, que está na documentação do Next

O merge de metadados é **raso**. Quando um segmento exporta `openGraph`, ele **substitui o objeto inteiro** do ancestral, e não faz merge campo a campo. A documentação do Next diz isso com todas as letras e prescreve o remédio: extrair o campo compartilhado para uma variável e espalhá-la.

Todas as rotas passam por `buildRouteMetadata` ou `buildProjectMetadata`, e as duas definem `openGraph`. O `opengraph-image.tsx` injeta as imagens no segmento onde mora, que é a raiz de cada idioma. Resultado: em `/` e `/en/` a convenção de arquivo e a página são **o mesmo segmento** e a imagem sobrevive; em qualquer descendente, o `openGraph` da página apaga a imagem herdada.

**Não foi regressão do M4.** O layout anterior tinha a mesma estrutura de `metadata`, conferido no git. O defeito é anterior, e nasceu junto com a divisão em cinco rotas.

#### A correção

`ogImageMeta(lang)` em `src/lib/metadata.ts`, espalhado em `openGraph` e `twitter` das duas fábricas. O `alt` passou a viver em `src/components/og-image.tsx` como fonte única, consumido tanto pelo `alt` que o Next exige no segmento quanto pelo bloco de imagem, para não haver duas verdades divergindo em silêncio.

#### O literal deixou de ser um ponto cego

O caminho em português é `/opengraph-image-12gd74`, e no primeiro passe isto ficou registrado como "não derivável do código". **Estava errado, e a fonte estava a um arquivo de distância.** Em `next/dist/lib/metadata/get-metadata-route.js`:

```js
suffix = djb2Hash(parentPathname).toString(36).slice(0, 6);
```

O Next só acrescenta hash quando o **caminho pai contém grupo de rota** `(...)` ou rota paralela `@...`. Daí a assimetria que parecia arbitrária: o pai do português é `/(home)` e ganha sufixo; o do inglês é `/en` e não ganha.

Há uma sutileza que erra fácil, e que errei na primeira tentativa: o **hash é calculado sobre o caminho pai com o grupo**, e a **URL é montada sem ele**. Trocar a ordem dá o hash certo no lugar errado.

`src/lib/metadata.test.ts` reimplementa a regra de propósito e confere o literal contra ela, em vez de contra si mesmo. **Controle negativo executado:** adulterando o literal, o teste falha. São duas guardas independentes, em camadas diferentes: o unitário prova que o valor obedece à regra do Next, o E2E prova que a URL responde 200 com `image/png`. Se o Next mudar o esquema, o unitário falha primeiro, barato e cedo.

#### Os testes, com controle negativo

Entraram em `e2e/marca.spec.ts`, contra o **HTML bruto servido** e não contra o DOM: o script de tema reescreve o `theme-color` no primeiro paint e mascararia a ausência do `viewport`.

Por rota (12): `theme-color` correto, `og:image` presente, apontando para o idioma certo, sem cair em `localhost:0` (que é o sintoma de `metadataBase` ausente), e `twitter:image` presente. Mais dois testes: o `alt` difere entre os idiomas, e as duas imagens respondem 200 com `image/png`.

**Controle negativo executado:** removendo a correção de `src/lib/metadata.ts` e reconstruindo, **10 dos 27 testes de `marca.spec.ts` falham**. A suíte pega o defeito, não apenas acompanha a correção.

E2E foram de 137 para **151**, e os unitários de 141 para **146**.

#### Um salto que a própria verificação pós-merge encontrou

Conferindo em produção depois do merge, as duas imagens respondiam **308 antes do 200**. O projeto roda com `trailingSlash: true` e a URL anunciada não tinha barra final.

**Não era regressão:** antes do PR a URL vinha gerada pelo próprio Next, também sem barra, e já saltava igual. O que faltava era enxergar, e o motivo de não se enxergar é instrutivo: **Playwright, `curl -L` e os scrapers seguem redirecionamento por padrão**, então o 200 aparecia e o salto ficava invisível. Um teste que só pergunta "responde 200?" nunca pegaria.

Funcionava, porque todo scraper segue 308. Mas anunciava URL não canônica e cobrava um salto a mais de quem tem timeout curto.

Corrigido com barra final nos dois caminhos, e a guarda passou a exigir **200 com `maxRedirects: 0`**. Controle negativo executado: removendo a barra, o teste falha.

> **A lição, que é a mesma da §13.6 noutra roupa:** a ferramenta de verificação tinha um padrão conveniente que escondia o defeito. Lá era o `--preset=perf` trocando o throttling; aqui é o "seguir redirecionamento" ligado por toda parte. Vale desconfiar do default quando ele é o que torna o teste fácil de passar.

> **O que fica de lição:** a §13.5 tratou "nenhum teste cobre `og:image`" como dívida de teste, de prioridade baixa, e a recomendação era "poucas linhas na suíte". Eram poucas linhas mesmo, e elas revelaram que **dez de doze rotas estavam quebradas para compartilhamento**. Lacuna de teste não é risco futuro: costuma ser defeito presente que ninguém olhou.
---

## 14. A entrada suave em toda a seção (03/09/2026)

O Pedro reparou, com o site rodando, que em Info e Contato a entrada suave só
valia para o título. Está certo, e a causa é maior do que parecia.

### 14.1 O que estava acontecendo

O `animate-fade-in` não estava no título: estava num `<div>` de introdução colado
à mão em quatro arquivos (`about.tsx`, `contact.tsx`, `project-detail.tsx` e
`section-intro.tsx`), e cada um desses divs envolvia só o `h1` e o parágrafo de
abertura. O corpo das seções nunca teve entrada nenhuma.

Medido no navegador contra o build de produção, viewport 1440x900, contando
elementos de texto acima da dobra no carregamento:

| Rota | Animavam antes | Animam depois |
|---|---|---|
| `/info/` | 2 de 16 | 16 de 16 |
| `/contato/` | 2 de 8 | 8 de 8 |
| `/clientes/` e `/projetos/` | nenhum: as duas rotas não tinham fade | tudo |
| `/projetos/[slug]/` | só o cabeçalho do case | 8 de 8 |

Em `/info/` isso era visível de longe: "Sobre mim" e o primeiro parágrafo entravam
suaves enquanto as quatro métricas e os interesses apareciam secos, na mesma tela.

A home continua sem entrada, e está certo: ela não tem `<Section>`, só o campo.

### 14.2 A correção

O fade subiu para o container do `<Section>` ([src/components/section.tsx](src/components/section.tsx)),
e os quatro wrappers manuais saíram. Toda seção do site passa por esse container,
então Clientes, Projetos e o bloco `<Identity>` ganharam o efeito de graça, sem
nenhuma linha por rota.

O `<SectionIntro>` perdeu o fade próprio. Não era só redundância: duas opacidades
aninhadas se multiplicam, e o intro chegaria ao fim da animação mais apagado que o
resto do conteúdo, que é exatamente o descompasso que este passe corrige.

**Onde o fade não pode ficar:** no `<main>` ou em qualquer wrapper acima da seção.
Opacidade menor que 1 num ancestral de seção `blend` cria contexto de empilhamento
e mata a mistura sem erro no console, que é a F1 da §6.1. O container é filho da
seção, e o `<About>` já provava esse padrão em produção desde a V3.5.

### 14.3 Por que isso não custa performance

O pedido foi explícito: o efeito não podia cobrar nada. Não cobra.

- **Nenhum byte novo.** O utilitário `animate-fade-in` e o keyframe já existiam em
  `globals.css` desde a V3. O efeito mudou de elemento, não de tamanho. Zero JS,
  zero dependência, e nada disso toca hidratação, que é onde a §13.3 localizou o
  LCP deste projeto.
- **Anima só `opacity`**, resolvido no compositor, sem layout nem repaint. CLS
  medido em `/info/`, `/clientes/`, `/contato/` e na página de case: **zero nas
  quatro**.
- **Nenhum `animation-delay`.** O escalonamento entre blocos foi considerado e
  descartado: atrasar o primeiro bloco seguraria o candidato a LCP, que foi medido
  e é o próprio `h1` que já animava antes. Ganho estético pequeno, risco numa
  métrica que a §13 gastou um milestone inteiro perseguindo.
- **Nenhum `will-change`.** Manteria a camada de composição viva depois do fim da
  animação, sem ganho nenhum, e ainda é um dos criadores de contexto de
  empilhamento que o teste da F1 procura.
- **O número de elementos animados praticamente não subiu**, porque o efeito subiu
  de nível em vez de se multiplicar: `/info/` foi de 4 para 5, `/contato/` continua
  em 1, `/clientes/` foi de 0 para 1.

Lighthouse não foi rodado, e de propósito: pela §13.6 e pela lei 18 do
[CLAUDE.md](CLAUDE.md), número de `localhost` mede a máquina e não o site. Como a
mudança não acrescenta byte nem JS, não há hipótese a medir. Se alguém quiser o
número, ele sai contra a URL de produção, com `--only-categories=performance` e
mediana de 3.

### 14.4 Verificação

`pnpm typecheck` e `pnpm lint` limpos, **146 unitários** e **151 E2E** passando,
sem mudança de contagem: a suíte que já existia é que cobre isto.

Três guardas antigas eram as que importavam aqui, e passaram:

1. O controle negativo da F1 em `e2e/shell.spec.ts`, que sobe a árvore de cada
   seção `blend` procurando ancestral que crie contexto. Conferido também no
   navegador: `#sobre` e `#contato` seguem em `mix-blend-difference` e a lista de
   ancestrais culpados está vazia.
2. O teste de opacidade efetiva mínima de 0.7 nas 4 rotas. Ele emula
   `reduced-motion` de propósito, porque no meio do fade a opacidade está a caminho
   do valor final e qualquer limiar acusaria falso positivo. A WCAG cobra o estado
   assentado, e é ele que o teste mede.
3. A auditoria responsiva de 6 rotas × 7 larguras, que é o que prova que remover os
   quatro `<div>` de wrapper não mexeu em geometria nenhuma.

Movimento reduzido continua coberto pelo `@media (prefers-reduced-motion)` global,
mais o `motion-reduce:animate-none` que subiu junto com o fade.

---

## 15. As prévias que não carregavam na primeira visita (03/09/2026)

Relato do Pedro: entrando pela primeira vez, as imagens dos projetos não
carregavam, e depois de recarregar voltavam. É o tipo de defeito que custa caro,
porque quem avalia o portfólio vê a primeira visita e não a segunda.

### 15.1 O que não reproduz

Contra a URL de produção, em Chromium de verdade e sempre com cache frio:

| Cenário | Resultado |
|---|---|
| `/projetos/` por carregamento direto, desktop | 3 de 3, prioritária pedida aos 158ms |
| Navegação interna clicando "Projetos" | 3 de 3 |
| Mobile 390x844 | 3 de 3, moldura vazia por 65ms |
| Mobile em **Slow 4G + CPU 4x** | 3 de 3, moldura vazia por 506ms |
| `/clientes/` em Slow 4G | 1 de 1 |

Duas medições minhas se mostraram erradas no caminho, e ficam registradas porque
são armadilhas repetíveis. O `X-Vercel-Cache: MISS` inicial era artefato de
`curl` sem `Accept: image/webp`, pedindo uma variante JPEG que navegador nenhum
pede; com o header certo é HIT de 7 dias. E um "+3140ms" era relógio de parede
incluindo a subida do browser, não tempo de página.

### 15.2 Defeito 1: as prévias inativas ficavam em `lazy`

Reproduzido por acidente, medindo com o pane do navegador **oculto**: a primeira
imagem carregava e as outras duas ficavam com `currentSrc` vazio, sem pedir nada,
mesmo depois de 3s. Chrome não busca imagem `lazy` em aba de segundo plano, e
abrir link em aba de fundo é exatamente o que alguém faz ao comparar vários
candidatos. Mesmo efeito com Memory Saver e Data Saver.

O que torna isto um defeito, e não uma escolha, é que a **regra 2** do próprio
componente diz montar tudo de uma vez para não haver "flash de carregamento no
primeiro hover de cada item". A montagem era adiantada; a **busca** continuava
preguiçosa, porque `lazy` é o padrão do `next/image` sem `priority`. A regra
estava metade implementada.

### 15.3 Defeito 2: toda imagem revalidava na rede a cada visita

| Origem | `Cache-Control` da imagem otimizada |
|---|---|
| `next start` local, mesmo build | `public, max-age=14400, must-revalidate` |
| **Produção na Vercel** | `public, max-age=0, must-revalidate` |

Medido o efeito: ao recarregar, **três respostas 304**, uma por imagem. O
navegador tinha os bytes no disco e ainda assim perguntava ao servidor antes de
usar. São três round trips antes de qualquer prévia pintar.

A causa está na doc do Next em `node_modules`: o max-age da imagem otimizada é o
maior entre `minimumCacheTTL` e o `Cache-Control` do upstream. Arquivo em
`public/` é servido pela URL literal, não tem como ser versionado por conteúdo, e
sai com `max-age=0`. A mesma doc prescreve a saída, que é o Static Image Import.

**A Vercel não zera tudo, e isso foi conferido antes de escolher o caminho:**
asset com hash em `/_next/static/` volta de produção com
`max-age=31536000, immutable`. O problema é do que não tem hash.

### 15.4 As correções

1. **As prévias inativas passam a ser buscadas.** Só a primeira leva `priority`,
   que é o que gera o `<link rel="preload">`: dar preload a todas colocaria
   concorrentes na frente do candidato a LCP, que é justamente a primeira. As
   demais vão em `loading="eager"` com `fetchPriority="low"`, buscadas sem
   disputar banda. São 3 imagens de 14 a 27KB, todas dentro da viewport.
2. **Os arquivos saíram de `public/` para `src/assets/projects/`** e passaram a
   ser importados. A URL vira `/_next/static/media/<hash>.webp` e o
   `Cache-Control` da imagem otimizada vira `max-age=315360000, immutable`,
   medido no build local. Acaba a revalidação por visita. O `pnpm capture`
   grava no caminho novo, e a URL antiga em `/projects/` passou a devolver 404,
   o que confirma que não sobrou cópia sendo servida sem hash.

O `image` deixou de ser string e virou `StaticImageData` em `ProjectMeta`, no
`ShowcaseItem` e no `Dict`, então os dois dicionários importam o mesmo arquivo.

### 15.5 Verificação

146 unitários e **154 E2E**, com três guardas novas em `e2e/showcase.spec.ts`:
nenhuma prévia em `lazy` nas duas rotas, todas terminando carregadas, e a imagem
otimizada respondendo com `immutable` a partir de um upstream com hash.

**Controle negativo executado**, e ele revelou o alcance real de cada rota:
devolvendo o `lazy`, `/projetos/` falha e `/clientes/` não, porque hoje aquela
rota tem uma prévia só e ela é justamente a `priority`. A guarda de `/clientes/`
fica latente, valendo a partir do segundo cliente com imagem. Isso está escrito
no teste, para ninguém ler o verde dele como prova.

> ⚠️ A primeira tentativa de controle negativo deu falso verde, e vale o
> registro: o `reuseExistingServer` do Playwright pegou o servidor que eu tinha
> subido **antes** do rebuild, exatamente a armadilha que o `CLAUDE.md` já
> documenta. O sintoma foi o teste passar com o defeito de volta, mais quatro
> falhas sem relação. Derrubar a porta 3000 antes resolveu.

O que não deu para verificar daqui é o header em produção, que só muda depois do
deploy. A previsão é `immutable`, e ela é falseável: basta repetir o `curl` do
§15.3 contra a URL de produção depois que subir.

### 15.6 O que a validação pós-merge encontrou (03/09/2026)

A previsão da §15.5 se confirmou em produção: a prévia otimizada saiu de
`max-age=0, must-revalidate` para `public, max-age=31536000, immutable`, o
upstream virou `/_next/static/immutable/media/<hash>.webp` e a URL antiga em
`/projects/` passou a devolver 404. O efeito, medido por `transferSize` em
Chromium real:

| Momento | Imagens buscadas na rede |
|---|---|
| Primeira visita, cache frio | 3 de 3 |
| Voltando por navegação normal | **0 de 3** |
| Reload explícito (F5) | **0 de 3** |

Antes eram três 304 por carregamento.

> Uma armadilha de leitura, que quase virou um relato errado: no primeiro teste
> o reload mostrou `200, 200, 200` e isso parecia piora. Eram respostas servidas
> do cache, que o Playwright reporta como 200 do mesmo jeito. Quem separa rede
> de cache é o `transferSize`, não o status. O 304 do estado anterior era rede
> de verdade; estes 200 não são.

A varredura das 11 rotas confirmou blend intacto, zero ancestrais violando a F1,
nenhuma prévia em `lazy` e nenhum erro de console. E achou duas coisas.

#### O avatar tinha o mesmo defeito, e ficou de fora

`public/avatar.jpg` continuou em `public/` quando as prévias saíram, e produção
o servia com `max-age=0, must-revalidate`: revalidação na rede a cada visita a
`/info/`. Mesma causa, mesma correção, agora em `src/assets/avatar.jpg`
importado por `profile.ts`. (Ele virou `avatar.webp`, e 320x320, na §15.7.) O `loading="lazy"` dele **está certo** e fica: é
abaixo da dobra e não participa da troca no hover, então não é o caso da §15.2.

**O currículo continua em `public/`, e de propósito.** É URL estável, que as
pessoas guardam e compartilham. Dar hash a ela quebraria os links a cada troca
do arquivo, e o ganho de cache não paga isso.

#### A guarda de `immutable` estava presa ao caminho local

A asserção exigia `/_next/static/media/`, que é o que o `next start` serve. A
Vercel serve `/_next/static/immutable/media/`, com um segmento a mais. Como a
suíte só roda contra `localhost`, ela passava e continuaria passando, mas quem
apontasse o E2E para produção levaria uma falha que não é defeito. Virou regex
com o segmento opcional, exigindo nome com hash sob `/_next/static/`, conferido
nas duas formas.

De quebra a guarda passou a varrer **todas** as imagens de `/projetos/`,
`/clientes/` e `/info/`, e não só a primeira de uma rota. É o que faz o avatar
entrar na rede de segurança. E2E foram de 154 para **156**.

**Controle negativo executado:** devolvendo o avatar para `public/`, só `/info/`
falha, e as outras duas rotas seguem verdes, que é exatamente o alcance
esperado.

### 15.7 A cota do otimizador, e a saída dela (03/09/2026)

A validação pós-merge da §15.6 encontrou o avatar de `/info/` e `/en/info/`
respondendo **`402 Payment Required`** em produção, com
`X-Vercel-Error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`. A cota de otimização
de imagem da conta tinha acabado.

O padrão era nítido: variante já transformada servia 200, variante nova voltava
402.

| Imagem | w=256 | w=384 | w=640 | w=828 | w=1080 | w=3840 |
|---|---|---|---|---|---|---|
| avatar | **402** | **402** | **402** | | | 200 |
| newra-news | 200 | **402** | 200 | **402** | **402** | 200 |

O avatar aparece em 160px e pede `w=256`, justamente uma das que faltavam.

#### A causa foi a própria correção da §15

Trocar `public/` por import muda a URL, porque ela passa a carregar hash. **Toda
transformação em cache foi invalidada de uma vez**, para cada largura e cada
formato das cinco imagens, e a regeneração esgotou o que restava da cota. O
raciocínio de cache continua certo e as prévias seguiram funcionando; o que não
foi avaliado foi o custo de migração num plano com cota.

#### A saída, e por que ela é boa e não um remendo

As cinco imagens são do projeto e aparecem em **tamanho conhecido e fixo**. O
otimizador existia para adivinhar tamanho, e não havia o que adivinhar. Então a
origem foi reduzida para o que a tela usa e o `/_next/image` saiu do caminho com
`images.unoptimized`.

| Arquivo | Antes | Depois |
|---|---|---|
| `newra-news.webp` | 1440x900, 96.3 KB | 1000x625, **47.9 KB** |
| `dandarkness.webp` | 1440x900, 51.5 KB | 1000x625, **23.9 KB** |
| `trak-assessoria.webp` | 1440x900, 44.2 KB | 1000x625, **23.3 KB** |
| `repertorio-progressivo.webp` | 385x814, 16.4 KB | inalterado, já menor que o alvo |
| `avatar` | 460x460 JPEG, 49.3 KB | 320x320 **WebP**, **20.5 KB** |

Mil pixels cobrem os cerca de 500px de CSS que a prévia ocupa em 1440 e os cerca
de 350px num celular de 390, com densidade 2 nos dois casos. A qualidade do WebP
caiu de 0.82 para 0.75, medido em `newra-news`: 57.2 KB contra 47.9 KB, mesma
dimensão.

#### O trade-off, dito com número e não com adjetivo

Em `/projetos/` são **87.7 KB** de imagem agora, contra **49 KB** que o
otimizador entregava numa tela de densidade 1 e cerca de **109 KB** numa de
densidade 2. Ou seja: **tela 1x paga quase o dobro, tela 2x sai na frente**, e
não existe mais o modo de falha por cota nem o salto extra pelo `/_next/image`.
Foi escolha deliberada, e é reversível: basta desligar `unoptimized`, aceitando
a cota de volta.

O que se perde de fato é AVIF automático e variante por largura. Reconstruir
isso à mão, com `<picture>` e vários arquivos, seria refazer o otimizador dentro
do repositório, e não paga.

#### Efeito colateral: `sizes` virou prop morta

Sem otimizador o Next não gera `srcset`, e **descarta o `sizes` calado**. Ele
saiu dos três `<Image>`, e a razão que ele documentava (a largura de exibição)
mudou de casa para `LARGURA_MAXIMA` em `capture/previews.spec.ts`, que é onde
ela agora decide de fato, porque o arquivo versionado é o que chega ao
navegador.

#### As guardas

As três da §15.6 foram reescritas em torno da nova invariante, e a principal é
contraintuitiva: a imagem **não pode** passar pelo otimizador. É o que impede
alguém de religar `images.unoptimized` por parecer otimização e trazer o 402 de
volta.

**Controle negativo executado:** com `unoptimized: false`, as três rotas falham.
E2E seguem em **156**.

### 15.8 A medição depois de tudo, e a otimização que não se faz (03/09/2026)

Lighthouse mobile contra a **URL de produção**, `--only-categories=performance`,
throttling `simulate` (o padrão, nunca `--preset=perf`), **mediana de 3 rodadas
por rota**.

| Rota | Perf | Spread | LCP | TBT | CLS | FCP | Speed Index |
|---|---|---|---|---|---|---|---|
| `/` | **100** | 100 a 100 | 1361 ms | 45 ms | 0 | 911 ms | 911 ms |
| `/clientes/` | **100** | 99 a 100 | 1812 ms | 22 ms | 0 | 912 ms | 912 ms |
| `/projetos/` | **98** | 97 a 99 | 2412 ms | 51 ms | 0 | 912 ms | 912 ms |
| `/info/` | **100** | 99 a 100 | 1811 ms | 49 ms | 0 | 918 ms | 918 ms |
| `/contato/` | **100** | 100 a 100 | 1367 ms | 51 ms | 0 | 911 ms | 911 ms |

Contra a linha de base da §13.1, que era de 88 a 92, e contra os 96 a 98 que a
documentação registrava depois do aperfeiçoamento. **Nada do que foi feito nas
§15.1 a §15.7 custou performance**, e o spread de 3 pontos em `/projetos/` é
menor que o ruído que a §13.1 mediu.

#### O elemento de LCP é o mesmo nas cinco rotas, e não é imagem

```
header.pointer-events-none > div.flex > div.flex > a.focus-ring
```

É o link de identidade do header. Em todas as rotas o LCP se decompõe em
`Time to first byte` (93 a 97 ms) mais `Element render delay` (102 a 143 ms), e
**não há fase de carregamento de imagem na conta**. Isso confirma e generaliza a
§13.3: o gargalo é trabalho de main thread, não byte de imagem. Em `/projetos/`,
que é a rota com três prévias, o LCP continua sendo um texto do header.

#### A otimização que a medição mostra, e que mesmo assim não se faz

O `image-delivery-insight` aponta **79 KiB** de economia possível: em mobile a
prévia é exibida em 330x206 e o arquivo tem 1000x625, e o print de celular é
exibido em 81x172 com 376x814 no arquivo.

A economia é real, e mesmo assim não vale:

- **Ela não move o número.** O LCP é texto do header, e as rotas já estão em 98
  a 100 com CLS zero. Cortar byte de imagem não mexe em `Element render delay`.
- **Os 1000px não são desperdício, são a outra ponta do trade-off da §15.7.** A
  prévia ocupa cerca de 500px de CSS num desktop de 1440, e uma tela de
  densidade 2 precisa exatamente de 1000. O que o Lighthouse mede é o celular,
  onde sobra; no laptop retina do recrutador, falta se cortar.
- **A saída correta seria `srcset` com dois tamanhos**, que é precisamente o que
  o otimizador fazia e que a §15.7 tirou por causa da cota. Refazer aquilo à mão
  significa `<img>` cru no lugar do `next/image`, perdendo o `width`/`height`
  automático que hoje segura o CLS em zero, mais o dobro de arquivos versionados
  e uma guarda nova para cada um. É muito risco para uma métrica que já está no
  teto.

Fica registrado como **decisão medida, não como esquecimento**. Se um dia o
plano da Vercel mudar, o caminho é religar o otimizador (uma linha em
`next.config.ts`), não construir um à mão.

#### A brecha que o `unoptimized` abriu, e que foi fechada

Enquanto o `/_next/image` existia, arquivo grande demais era aparado antes de
chegar ao navegador. Sem ele, **o arquivo versionado é exatamente o que a pessoa
baixa**: um preview exportado sem querer em 4000px passaria no build, no E2E, na
captura e num Lighthouse rodado no desktop de quem fez a mudança.

`src/assets/assets.test.ts` fecha isso com teto de peso por arquivo (80 KB),
teto da soma (200 KB) e teto de largura (1000px), lendo a largura do cabeçalho
WebP e JPEG sem acrescentar dependência, que é a mesma regra que o `pnpm
capture` segue.

**Controle negativo executado:** baixando o teto de largura para 319px, os cinco
arquivos falham com as larguras reais (avatar 320, prévias 1000, print de
celular 385), o que prova que o leitor lê o cabeçalho em vez de passar por
vacuidade. Unitários de 146 para **158**.

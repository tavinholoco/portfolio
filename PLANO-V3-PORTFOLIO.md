# 🎨 Plano V3 do Portfólio, Pedro Levi

> **Objetivo da v3:** dar assinatura visual ao portfólio. A v2 resolveu o conteúdo ("eu resolvo problemas"); a v3 resolve a forma, com um fundo WebGL próprio, tipografia minimalista e navegação em 5 rotas.
>
> **Base:** v2 publicada (Next 16.3 + React 19, Tailwind v4, bilíngue com paridade testada, 36 unit + 6 E2E, Lighthouse 95/100/100/100).
> **Referência de inspiração:** [p5aholic.me](https://p5aholic.me) (Keita Yamada). Inspiração estrutural, **não cópia**. Ver seção 0.3.
> **Status:** 🚧 **Em desenvolvimento. Fase 0 concluída em 26/08/2026.** Duas auditorias completas realizadas (seções 5 e 6, 30 achados já incorporados às fases). Próxima: Fase 1 (motor WebGL).
> **Versão do documento:** V3.2

---

## 0. Comece aqui

Esta seção existe para quem abre o repositório sem contexto nenhum. Leia ela inteira antes de escrever qualquer linha.

### 0.1 Estado atual

**Fase 0 concluída em 26/08/2026.** Estão em pé: `ogl` e `lenis` instalados, os tokens de shell da v3 em `globals.css` (com o fundo no `:root`, não no `body`), a camada shadcn reneutralizada, a escala tipográfica fluida, e o manifesto de rotas em [src/lib/routes.ts](src/lib/routes.ts) com 19 testes. A pré-condição de F1 foi verificada em runtime: com o CSS novo, uma seção `blend` dentro de um `<main>` estático não tem nenhum ancestral confinando o backdrop.

O site em produção continua sendo a v2, e as páginas ainda são as da v2: a Fase 0 mexeu em fundação, não em telas. O trabalho continua na **Fase 1** (seção 7).

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
- Salva em `public/projects/<slug>.webp`
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

### Fase 2: Shell, blend e moldura

**`src/components/shell/site-shell.tsx`.** Existem dois root layouts (`(home)` e `en`) e tudo do `<body>` precisa entrar nos dois. Um `<SiteShell lang>` compartilhado evita a divergência. Montagem exatamente conforme a tabela de F1. O `<body>` **não** recebe background nem `isolation`, e o `<main>` **não** recebe `z-index` nem `position`.

**Duas variantes de seção.** [src/components/section.tsx](src/components/section.tsx) reescrito, com o comentário-lei de F1 no topo:

- **`variant="blend"`**: `mix-blend-mode: difference`, `color: #fff`, sem fundo. Entrada via `animate-fade-in` CSS (E5)
- **`variant="solid"`**: `background: var(--c-bg)` opaco + `transition: background-color` própria (F5), blend normal. `FadeIn` permitido aqui

Container com `padding-inline: calc(var(--pad) * 2)` como piso (E9). `SectionHeading` perde o `text-primary` e mantém o `>_` monocromático (E4).

**`frame.tsx` e `viewport-mask.tsx`.** Presentacionais, sem estado. Moldura: 4 divs absolutos de 1px em branco, `opacity: .5`, em container `difference` (F13).

> ⚠️ **Portão de saída obrigatório desta fase:** montar uma seção `blend` e uma `solid` na mesma página, com o shader rodando, e confirmar que o texto da `blend` inverte de verdade contra o canvas. Se não inverter, é F1 e a montagem está errada. **Não avançar antes disso.**

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

### Fase 5: Info, Contato e páginas de projeto

**Info.** Funde `about`, `career` e `skills`. Sobre e habilidades em `blend`; trajetória e o bloco do avatar em `solid` (E12).

**Contato.** Os 2 caminhos em escala grande, em `blend`. Sai o glow. Recebe os sociais que saíram do footer (E13).

**Páginas de projeto.** [src/components/project-detail.tsx](src/components/project-detail.tsx) mantém `problema → solução → destaque → aprendizados`. Hero em `blend`, corpo em `solid`, preset de paleta por slug. `generateStaticParams` e `dynamicParams = false` intactos.

**Aposentados:** [src/components/projects-grid.tsx](src/components/projects-grid.tsx), [src/components/process.tsx](src/components/process.tsx), [src/components/featured-project.tsx](src/components/featured-project.tsx) (o mockup CSS dele vira o placeholder do preview).

**Ao fim da fase:** avaliar a remoção de `framer-motion` (F10).

---

### Fase 6: Performance, acessibilidade e fallbacks

- [ ] Canvas em SSR normal, `ogl` via `await import()` no efeito. Sem `ssr: false` (E1)
- [ ] Nenhum ancestral de seção `blend` cria contexto de empilhamento (F1). Auditar em DevTools > Layers
- [ ] Lenis sem transform de conteúdo (F3)
- [ ] `prefers-reduced-motion`: 1 frame e para, Lenis desligado, preview sem crossfade
- [ ] rAF pausado com `document.hidden` e via `IntersectionObserver`
- [ ] DPR limitado a 1.5; render target ~320px no lado maior
- [ ] Telas < 768px: DPR 1 e render target menor
- [ ] Fallback CSS sem WebGL e em `webglcontextlost`
- [ ] Showcase funcional em touch e teclado
- [ ] Contraste verificado **com o shader rodando**, nos dois temas, no pior frame. O `difference` garante inversão, mas paletas de luminância média produzem cinza sobre cinza. A paleta precisa ser restringida a faixas seguras
- [ ] Foco visível em toda a UI em difference
- [ ] `user-select` **não** desativado globalmente (a referência desativa; nós não, porque recrutador copia email)
- [ ] Lighthouse Perf >= 90 e A11y 100 nas 5 rotas

---

### Fase 7: Testes, documentação e deploy

- **Testes novos:** manifesto de rotas contra arquivos em disco, `background-config` (interpolação de paleta), `createGrainBuffer` (E8), `itemListJsonLd`
- **Reescritos:** `lang-path.test.ts`, `sitemap.test.ts` (E3)
- **Intactos:** `utils`, `metadata`, `github`, paridade i18n
- **E2E:** canvas com dimensões > 0; navegação pelas 5 rotas nos dois idiomas; hover troca o preview; `prefers-reduced-motion` sem erro de console; `html-lang.spec.ts` ampliado
- **Limpeza:** chaves órfãs (E6) e as sobras de `create-next-app` em `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`), pendência aberta desde a v2
- Atualizar [README.md](README.md): árvore nova, **a montagem de camadas de F1 com o porquê**, como ajustar paleta, como adicionar projeto ao showcase, e corrigir a seção "4. Projetos de clientes" que ainda documenta o modelo antigo
- Marcar este documento como concluído e registrar o Lighthouse pós-deploy

---

## 8. Leis do design minimalista

**Sai:** cards com borda e `rounded-2xl`, blobs `blur-3xl`, glow no contato, badges e pills, chips em caixinha, sombras, gradientes decorativos, ícones ilustrativos, grid de fundo, scrollbar customizada, header em pill com `backdrop-blur`, filtro por categoria.

**Entra:** linhas de 1px como único separador, tipografia fluida com `clamp()`, hierarquia por tamanho e opacidade em vez de cor ou caixa, espaço em branco generoso, alinhamento rigoroso a `var(--pad)`, nav numerada com dot no item ativo.

**Regras duras:**
- No máximo **dois pesos tipográficos** por página
- Cor só no shader. A UI é branco, preto e opacidade. O `>_` sobrevive monocromático (E4)
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
- [ ] Fase 1: Motor WebGL
- [ ] Fase 2: Shell, blend e moldura ⚠️ portão de saída obrigatório
- [ ] Fase 3: Rotas, navegação e scroll
- [ ] Fase 4: Home e showcase
- [ ] Fase 5: Info, Contato e páginas de projeto
- [ ] Fase 6: Performance, acessibilidade e fallbacks
- [ ] Fase 7: Testes, documentação e deploy
- [ ] Capturas: Newra News, Trak, Dandarkness
- [ ] 🔄 Captura do Netsheet Engine (aguardando deploy do Pedro)
- [ ] ⏸️ Preview do Repertório Progressivo (aguardando screenshots do Expo)
- [ ] `NEXT_PUBLIC_SITE_URL` em produção e DNS de `pedrolevi.dev` (herdado da v2)

# 🎨 Plano V3 do Portfólio, Pedro Levi

> **Objetivo da v3:** dar assinatura visual ao portfólio. A v2 resolveu o conteúdo ("eu resolvo problemas"); a v3 resolve a forma, com um fundo WebGL próprio, tipografia minimalista e navegação em 5 rotas.
>
> **Base:** v2 publicada (Next 16.3 + React 19, Tailwind v4, bilíngue com paridade testada, 36 unit + 6 E2E, Lighthouse 95/100/100/100).
> **Referência de inspiração:** [p5aholic.me](https://p5aholic.me) (Keita Yamada). Inspiração estrutural, **não cópia**. Ver seção 0.3.
> **Status:** ✅ **No ar desde 27/08/2026.** As 7 fases da v3 fechadas e publicadas (avaliação na seção 11). O **refinamento V3.5**, na seção 12, está implementado e verificado.
>
> **Produção:** https://portfolio-tau-five-f86nc5khr8.vercel.app
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

**A v3 está no ar**, em https://portfolio-tau-five-f86nc5khr8.vercel.app, com 141 testes unitários e 68 E2E passando no CI. A avaliação pós-deploy está na seção 11.

O que resta está listado no fim daquela seção, e nada é código.

**A V3.5 veio depois.** O site rodando mostrou o que captura nenhuma mostra: a home ocupava altura demais, o `>_` repetido em 12 lugares destoava, a identidade não tinha âncora fixa e o campo de noise lia como líquido em vez de forma. A seção 12 registra esse passe, com as fases 8 a 13. Se você vai mexer no header, na home, no showcase ou no shader, **leia a seção 12 antes desta**: várias decisões aqui foram revogadas por ela.

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

Corrigido e **medido**, não estimado: a variante servida no desktop caiu de `w=1080` para `w=640`. Em mobile o ganho foi de 1 ponto, dentro do ruído, porque o DPR emulado já pedia variante pequena; o ganho real está no desktop, que é onde o Lighthouse mobile não olha. Está no **PR [#2](https://github.com/tavinholoco/portfolio/pull/2)**, aberto e aguardando revisão.

### O que continua aberto

| Item | Situação |
|---|---|
| **PR #2** | Aberto, com a correção do `sizes`. Não é urgente |
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
| Herdados da v3 | PR #2, Netsheet Engine sem deploy, domínio próprio. Ver §11 |

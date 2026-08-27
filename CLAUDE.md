@AGENTS.md

# Estado do projeto

Este portfólio está na **V3** (visual minimalista + fundo WebGL), concluída em 27/08/2026 e **no ar** em https://portfolio-tau-five-f86nc5khr8.vercel.app.

Antes de mexer no frontend, leia a **seção 0 do `PLANO-V3-PORTFOLIO.md`** (decisões, auditorias e notas de execução de cada fase) e o `README.md`, que documenta a arquitetura de camadas. Os dois estão em dia. Os planos V1 e V2 na raiz são histórico.

## Regras que valem sempre

1. **Zero travessões (—)** em textos do site, comentários de código e documentação. Use vírgula, dois pontos ou parênteses.
2. **Todo texto do site vive em dobro:** `src/i18n/pt.ts` e `src/i18n/en.ts`, tipados por `Dict` em `src/i18n/index.ts`. Campo novo em um só lugar quebra `src/i18n/index.test.ts`.
3. **`src/components/ui/` usa Base UI, não Radix.** A API é `render={<a/>}` e `nativeButton={false}`, não `asChild`. Snippets de shadcn/Radix copiados da internet vão quebrar. Só resta o `sheet.tsx`, usado pelo menu mobile.
4. **Existem dois root layouts**, um por idioma (`src/app/(home)/layout.tsx` e `src/app/en/layout.tsx`). Qualquer coisa no `<html>` ou `<body>` precisa entrar nos dois. O que é comum já vive no `<SiteShell>`.
5. **Acrescentar rota é uma linha** em `src/lib/routes.ts`. Nav, sitemap, hreflang e `alternates` derivam dali, e o TypeScript passa a exigir os textos nos dois dicionários.

## As leis que quebram em silêncio

Estas não geram erro no console. Se forem violadas, o site parece funcionar e o efeito principal some.

1. **Nenhum ancestral de uma seção `blend` pode criar contexto de empilhamento** (`z-index`, `position` com z, `transform`, `opacity < 1`, `filter`, `isolation`, `contain: paint`). Nem o `<body>`, nem o `<main>`, nem wrapper nenhum. Detalhes na seção 6.1 do plano, e teste com controle negativo em `e2e/shell.spec.ts`.
2. **O fundo da página vive no `:root`, nunca no `body`.**
3. **O Lenis roda em rolagem nativa da janela.** Não configure `wrapper` nem `content`: nesse modo ele aplica `transform` num wrapper de conteúdo e mata o blend de todas as seções.
4. **Não dê fundo opaco a elemento `sticky`** na mesma página de uma seção `blend`: pinta um retângulo dentro da seção misturada, longe dali.
5. **Uma seção só pode ser `blend` se o conteúdo herdar a cor.** `text-muted-foreground` e `bg-card` não herdam e cada um inverte para um lado. Seção com imagem vai em `solid`.
6. **Texto nunca abaixo de `opacity-70`, e nunca com opacidade aninhada.** Uma linha a 60% com filho a 40% dá 24% efetivo e reprova a WCAG AA.

## Ferramentas do projeto

- **`pnpm look`** captura telas do site em `.captures/`, para inspecionar o resultado visual. Parametrizado por `LOOK_PATHS`, `LOOK_THEMES`, `LOOK_FULL`, `LOOK_SCROLL`, `LOOK_HOVER`. No Git Bash do Windows, prefixe com `MSYS_NO_PATHCONV=1`.
- **`pnpm capture`** gera os previews do showcase em `public/projects/`. Sob demanda, nunca no CI.
- **Lighthouse** precisa de `CHROME_PATH` apontando para o Chromium do Playwright: a máquina não tem Chrome instalado.

> ⚠️ O `reuseExistingServer` do Playwright aproveita qualquer servidor na porta 3000, **inclusive um iniciado antes do último build**. O sintoma é teste falhando por uma correção que já está no código, ou captura sem CSS nenhum. Derrube a porta 3000 antes de testar ou capturar depois de um `pnpm build`.

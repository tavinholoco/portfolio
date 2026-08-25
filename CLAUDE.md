@AGENTS.md

# Estado do projeto

Este portfólio está na **reconstrução V3** (visual minimalista + fundo WebGL). O plano completo e aprovado está em `PLANO-V3-PORTFOLIO.md`. **Leia a seção 0 dele antes de mexer no frontend.** Os planos V1 e V2 na raiz são histórico de versões já concluídas.

## Regras que valem sempre

1. **Zero travessões (—)** em textos do site, comentários de código e documentação. Use vírgula, dois pontos ou parênteses.
2. **Todo texto do site vive em dobro:** `src/i18n/pt.ts` e `src/i18n/en.ts`, tipados por `Dict` em `src/i18n/index.ts`. Campo novo em um só lugar quebra `src/i18n/index.test.ts`.
3. **Os componentes `ui/` usam Base UI, não Radix.** A API é `render={<a/>}` e `nativeButton={false}`, não `asChild`. Snippets de shadcn/Radix copiados da internet vão quebrar.
4. **Existem dois root layouts**, um por idioma (`src/app/(home)/layout.tsx` e `src/app/en/layout.tsx`). Qualquer coisa adicionada ao `<html>` ou `<body>` precisa entrar nos dois.

## Regra crítica da V3

Nenhum ancestral de uma seção com `mix-blend-mode: difference` pode criar contexto de empilhamento (`z-index`, `transform`, `opacity < 1`, `filter`, `isolation`, `contain: paint`). Se isso acontecer, o efeito principal do site não aparece e **não há erro no console**. Detalhes na seção 6.1 do `PLANO-V3-PORTFOLIO.md`.

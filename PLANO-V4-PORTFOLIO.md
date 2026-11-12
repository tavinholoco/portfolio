# Plano V4 do Portfólio: ser encontrado e convencer

Escrito em 11/11/2026. Junta duas coisas num plano só:

- **O plano anterior**, a §18 do `PLANO-V3-PORTFOLIO.md` (busca por serviço e localidade: a página `/criacao-de-sites/`, Rancharia de volta, Brasil todo), com os PRs #37 e #38 prontos e guardados sem merge.
- **A análise de 11/11/2026**, feita sobre o branch do #38 e sobre a produção: leitura do código de SEO, i18n, páginas, componentes, configuração e CI, 16 URLs de produção baixadas, e pesquisa externa sobre o estado do Google em 2026.

O `PLANO-V3-PORTFOLIO.md` continua valendo como histórico e como fonte das leis. **Este arquivo substitui a §18.6 ("O que falta")** e passa a ser o roteiro. As decisões da §18.2 continuam de pé, salvo onde a fase 0 abaixo pede para revisar.

> As regras e as 24 leis do `CLAUDE.md` valem para tudo aqui. Em especial: zero travessões, todo texto em dobro (`pt.ts` e `en.ts`), `openGraph` só pelas fábricas (lei 17), JSON-LD só pelo `<JsonLd>` (lei 24), medir em produção com mediana de 3 (lei 18), e ler `node_modules/next/dist/docs/` antes de usar API do Next.

---

## 1. Diagnóstico em uma página

**A engenharia está acima da média. O que falta é conteúdo, estratégia de palavra-chave e links de fora.**

### 1.1 O que está bom (não mexer sem motivo)

- Canonical, hreflang com `x-default`, sitemap com alternates, `robots.txt`, `www` em 301 e `vercel.app` em 308, conferidos em produção.
- Manifesto de rotas (`src/lib/routes.ts`) e fábricas de metadados (`src/lib/metadata.ts`) como fonte única.
- `@context` do JSON-LD num ponto só (`src/lib/json-ld.ts`), com teste no HTML bruto.
- Assets com `immutable`, HSTS, HTTP/2, imagem de link com 200, `image/png` e 39 KB.
- Hierarquia de headings correta, `alt` nas imagens, `aria-current` na nav.
- Lighthouse 100 no mobile e 99 a 100 no desktop (§17.15).
- A página de serviço não inventa cliente, preço nem prazo.

### 1.2 Os oito problemas, em ordem de impacto

| # | Problema | Evidência |
|---|---|---|
| 1 | A produção ainda é o site antigo | `/criacao-de-sites/` dá 404, JSON-LD sem `@context`, título da home "Desenvolvedor Full Stack" |
| 2 | A home não tem conteúdo visível | Só um `h1` em `sr-only` (`src/components/pages/home-page.tsx`); a raiz do domínio tem menos de 50 palavras, todas de menu |
| 3 | A palavra-chave é a mais disputada possível | "Criação de sites" nacional, num domínio de um mês e sem link de fora; ninguém digita "em todo o Brasil" |
| 4 | A página de serviço é rasa | Cerca de 230 palavras, sem imagem, sem depoimento, sem preço nem prazo, FAQ de 3 respostas de uma linha |
| 5 | Os exemplos enfraquecem a venda | Três demos em `vercel.app`, uma com erro de grafia na URL (`trak-acessoria`); um cliente só numa página "Clientes" |
| 6 | A 404 é a padrão do Next | Em inglês, sem `lang`, sem estilo, sem link de volta; não existe `not-found` no projeto |
| 7 | Não há medição de visita nem de contato | RUM desligado (§17.15), link do WhatsApp sem mensagem pronta |
| 8 | O LinkedIn está inconsistente | Link para `in/pedrolevidias` (`src/data/profile.ts`), texto `in/pedro-levi-dias` (`src/i18n/pt.ts` e `en.ts`) |

### 1.3 O que a pesquisa mudou em relação à §18

- **FAQ:** o Google encerrou o resultado enriquecido de FAQ para todos os sites em maio de 2026, mas diz que continua lendo a marcação para entender a página. A §18 acertou em não contar com ele; marcar `FAQPage` passa a ser opcional e barato, nunca prioridade.
- **Nome do site:** o Google lê o `WebSite.name` da home e o `og:site_name` para o nome que aparece no resultado, e pede nome curto. Hoje os dois dizem "Pedro Levi | Portfólio".
- **`ProfilePage`:** é tipo suportado pelo Google, com `mainEntity` apontando para a `Person`. Cabe em `/info/`.
- **Sitemap:** o Google ignora `priority` e `changefreq`, e ignora `lastmod` quando todas as datas mudam juntas. O sitemap grava a data do build, que muda toda segunda com o rebuild semanal.
- **Busca com IA:** o guia do Google de maio de 2026 diz que AI Overviews e AI Mode usam o mesmo índice e os mesmos sinais, e que `llms.txt` não dá vantagem na busca dele. Não é prioridade.
- **Texto oculto:** `sr-only` de acessibilidade não é punido, mas pesa pouco. Não sustenta sozinho o tema da home.
- **Perfil da Empresa:** desde junho de 2025 o Google não aceita país nem estado como área de atendimento. Confirma a §18.5: sem perfil enquanto o atendimento for só online.
- **Favicon:** a regra antiga de múltiplo de 48px caiu. O `icon.svg` e o `.ico` de 256px estão dentro da regra atual.

### 1.4 O que não foi verificado

Search Console (indexação e consultas), volume de busca das palavras-chave, Lighthouse e a suíte de testes nesta rodada, o conteúdo do PDF do currículo, e qual dos dois endereços do LinkedIn é o certo.

---

## 2. Fase 0: decisões do Pedro

Nada aqui é código. Cada item tem a minha recomendação e o que acontece se ficar sem resposta. **Só D1, D2 e D6 travam alguma coisa.**

> **Respondidas pelo Pedro em 12/11/2026.** A tabela de baixo fica como registro do que foi perguntado; o que vale é esta:
>
> | Id | Resposta | O que muda no plano |
> |---|---|---|
> | **D1** | Brasil todo **mais** a região no texto | F2 cita Rancharia, Presidente Prudente e Oeste Paulista e o tipo de cliente, sem página por cidade e sem lista de cidades (§5) |
> | **D2** | Uma linha e um link na home | F2.6 entra; captura para o Pedro antes do PR |
> | **D3** | Preço e prazo continuam de fora | O teste que trava isso continua como está |
> | **D4** | Cliente na frente | Home e serviço falam com cliente; `/info/` e o CV com recrutador |
> | **D5** | `contato@pedrolevi.com.br` | F4.3 entra |
> | **D6** | O certo é `https://www.linkedin.com/in/pedrolevidias/` | O `profile.ts` e o `sameAs` já estão certos; F4.2 corrige o texto `in/pedro-levi-dias` nos dois dicionários |
> | **D7** | `trak.pedrolevi.com.br` para a Trak | Tarefa de DNS com o Pedro, na fase 5; a Dandarkness fica onde está |
> | **D8** | WhatsApp com mensagem por página | F4.1 entra; o beacon continua desligado |
> | **D9** | Só o crédito com link no site da Dandarkness | Sem depoimento: o item de prova social sai, e o pedido do crédito é do Pedro (fase 5) |
> | **D10** | "Sobre" no título de `/info/` | Só o título; a URL e o item do menu não mudam |
>
> No mesmo dia ele **liberou a fase 1**: o push do registro da §18 e deste plano (um commit a mais no branch do #38) e a preparação dos dois PRs. O merge continua sendo dele.

| Id | Decisão | Recomendação | Sem resposta |
|---|---|---|---|
| **D1** | Palavra-chave: manter só "Brasil todo" ou citar a região e um nicho no texto | Manter o atendimento no Brasil todo e **acrescentar** a região no texto (Rancharia, Presidente Prudente, Oeste Paulista) e o tipo de cliente, sem página por cidade | Fase 2 fica só com o que não depende disso |
| **D2** | A home ganha conteúdo visível? | Uma linha e um link para o serviço, no canto de baixo, sem cobrir o fundo. Mostrar em captura antes | A home fica como está, e o item F2.6 não entra |
| **D3** | Preço e prazo (o P1 da §18) | Faixa ("a partir de") e prazo típico. É a pergunta que mais trava contato | Continuam de fora, e o teste que trava isso continua |
| **D4** | Público principal: cliente ou recrutador | Cliente na home e no serviço; recrutador em `/info/` e no CV | Os dois continuam misturados |
| **D5** | Email mostrado no site | `contato@pedrolevi.com.br`, que já entrega | Fica o gmail |
| **D6** | Qual LinkedIn é o certo | Só o Pedro sabe | F4.2 não entra, e o `sameAs` pode estar apontando para o lugar errado |
| **D7** | Domínio dos exemplos | Subdomínio próprio para a Trak (`trak.pedrolevi.com.br`); para a Dandarkness, depende do cliente | Ficam em `vercel.app` |
| **D8** | Medição | WhatsApp com mensagem por página (sem script) e os números de requisição do painel da Cloudflare. Beacon continua desligado | Sem medição |
| **D9** | Depoimento e crédito da Dandarkness | Pedir os dois, com autorização por escrito | A página segue sem prova social |
| **D10** | Títulos de `/info/` e `/clientes/` | "Sobre" no lugar de "Info" no título (a URL não muda) | Ficam como estão |

---

## 3. As fases

Cada item tem um id para a sessão nova citar. **G** marca a guarda de teste que acompanha o item, no padrão do projeto (HTML bruto, com controle negativo quando a quebra é calada).

### Fase 1: pôr no ar o que está pronto

Nenhum código novo. É a §18.6 antiga.

> **Mudança de recomendação:** na análise eu disse para decidir a palavra-chave antes do merge. Revendo: a URL `/criacao-de-sites/` não muda com D1, e trocar título e texto depois é barato. Cada semana sem merge é uma semana sem a página no índice. **O merge vem primeiro.**

- **F1.1** Push do commit `1c76fed` (o registro da §18), que só existe nesta máquina.
- **F1.2** Rodar de novo o E2E do CI do #38, que reprovou por DNS do runner ao instalar o navegador, sem rodar teste.
- **F1.3** Merge do #37 (do Pedro). Depois `gh pr edit 38 --base main`, e merge do #38 (do Pedro).
- **F1.4** Medir em produção: `@context` em toda rota, sitemap com 20 páginas, `/criacao-de-sites/` com 200 sem salto, Lighthouse de performance com mediana de 3 incluindo a rota nova.
- **F1.5** Validador de schema e Teste de pesquisa aprimorada.
- **F1.6** Search Console: inspecionar a URL nova e pedir indexação. Anotar quantas páginas constam como indexadas (é a régua da fase 7).

**Pronto quando:** as 20 páginas respondem 200 em produção e a régua está anotada.

### Fase 2: o conteúdo que convence

Depende de D1, D2, D3, D9 e D10. Um PR. **Mostrar em captura (`pnpm look`) antes de pedir aprovação**, como na §18.

- **F2.1** Título e `h1` da página de serviço conforme D1. O título de hoje mira uma busca que ninguém faz.
- **F2.2** Texto de abertura com a região e o tipo de cliente, em frase corrida. Nunca lista de cidades (§18.5).
- **F2.3** FAQ com as perguntas reais: quanto custa e quanto demora (se D3), domínio e hospedagem, o que o cliente precisa mandar, manutenção depois da entrega, como é o pagamento. Respostas de duas a três frases.
- **F2.4** Imagem dos exemplos na página. Hoje ela é `blend` e por isso não tem imagem (lei 5): os exemplos saem para uma seção `plain` própria, reaproveitando as prévias de `src/assets/projects/` (lei 19, com `loading` explícito).
- **F2.5** Depoimento da Dandarkness (se D9), em texto, sem marcação `Review`.
- **F2.6** Conteúdo visível mínimo na home (se D2). Atenção à lei 21: o LCP é o link do header, e nada novo pode virar LCP nem ficar por cima do fundo de forma que mude o desenho.
- **F2.7** Títulos e descrições de `/info/` e `/clientes/` (se D10), e descrição própria para cada case, que hoje reusa a `tagline` de uma linha.
- **F2.8** Um parágrafo de contexto em cada case (o que era, para quem, o que resolveu) e a prévia do projeto na página.

**G:** `e2e/servico.spec.ts` cobre o texto novo no HTML bruto; o unitário que trava preço e prazo muda junto com D3, nunca antes; `e2e/responsivo.spec.ts` já varre a rota.

**Pronto quando:** o Pedro aprova texto e capturas, e a suíte passa.

### Fase 3: SEO técnico

Não depende de decisão. Um PR.

- **F3.1 Nome do site.** `ogSiteName` vira "Pedro Levi" nos dois dicionários, e o `WebSite` ganha `@id` e `alternateName`. O `WebSite` só importa na raiz: confirmar que `/` o serve.
- **F3.2 `Person` completa.** `image` (o avatar, URL absoluta), `description`, `alumniOf` (UNOESTE). A URL do avatar tem hash: ler de `profile.avatar.src`, nunca escrever à mão.
- **F3.3 `ProfilePage` em `/info/`**, com `mainEntity` apontando para o `@id` da pessoa.
- **F3.4 Cases.** Trocar `SoftwareApplication` por `CreativeWork` (ou `SoftwareSourceCode` com `codeRepository`), com `author: { "@id" }`. Acrescentar `BreadcrumbList` nos cases.
- **F3.5 Sitemap.** Tirar `priority` e `changefreq`. `lastmod` sai, ou vira data real por rota guardada no manifesto. Atualizar `src/app/(home)/sitemap.test.ts`.
- **F3.6 Imagem de link do serviço.** Hoje toda rota compartilha a imagem que diz "Desenvolvedor Full Stack". O link do serviço, colado no WhatsApp, deveria mostrar o serviço. **É o item mais arriscado da fase:** mexe na lei 17 e na lei 22 (caminho com hash, barra final, `_headers` e `_redirects` escritos à mão). Fazer por último, com `src/lib/cloudflare-assets.test.ts` e `e2e/marca.spec.ts` ampliados antes do código.
- **F3.7 Tirar `meta keywords`** de `buildRouteMetadata` e dos dicionários.
- **F3.8 Página 404 própria.** Com dois root layouts, o caminho é o `global-not-found` do Next 16 (`experimental.globalNotFound` em `next.config.ts`). Ele **não passa pelo layout**: precisa importar `globals.css` e as fontes, aplicar o tema e ter `<html lang>` próprio. Ler `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md` antes, e conferir que o export ainda grava `out/404.html`, que é o que o `wrangler.jsonc` serve.
- **F3.9 `og:locale:alternate`** nas fábricas. Barato, junto com o resto.
- **F3.10 `FAQPage`** na página de serviço, opcional, só depois de F2.3. Não gera resultado enriquecido; serve de leitura.

**G:** `e2e/json-ld.spec.ts` sobe o mínimo de blocos por rota; um E2E novo busca uma URL inexistente e exige 404, `lang` e link para a home; o teste do sitemap passa a reprovar `priority`.

**Pronto quando:** validador de schema sem erro nas rotas tocadas, e Lighthouse igual ao da fase 1.

### Fase 4: confiança e medição

Depende de D5, D6 e D8. Um PR pequeno.

- **F4.1 WhatsApp com mensagem pronta** (`?text=`), diferente por página de origem. É a única medição de contato sem script. O texto entra nos dois dicionários.
- **F4.2 LinkedIn** corrigido conforme D6, num lugar só: o texto do cartão deriva de `profile.linkedin`.
- **F4.3 Email** conforme D5, em `profile.email`, nos fatos de `/info/` e no cartão de contato. O valor mostrado também deriva de `profile`, para não existir duas verdades.
- **F4.4 Cabeçalhos de segurança** na regra `/*` de `public/_headers`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` mínimo. **CSP fica de fora**: os scripts inline de tema e de abertura pedem hash, e isso é um trabalho próprio.
- **F4.5 Link de "pular para o conteúdo"**, primeiro elemento focável. Vive dentro do header ou como irmão do `<main>`, nunca como wrapper (leis 1 e 3).

**G:** `e2e/cabecalhos.spec.ts` ganha os quatro cabeçalhos; um E2E confere que o primeiro Tab cai no link de pular.

### Fase 5: fora do site (é do Pedro)

Sem link de fora, um domínio de um mês não sobe, por melhor que seja a página. **Esta fase vale mais que a 3 e a 6 juntas** e não depende de código.

- **F5.1** O domínio no LinkedIn e no README do perfil do GitHub (pendente desde a §17.13).
- **F5.2** Crédito com link no rodapé do site da Dandarkness (D9) e no da Trak.
- **F5.3** Bing Webmaster Tools, importando do Search Console. O índice do Bing alimenta outras buscas com IA.
- **F5.4** Domínio próprio para os exemplos (D7).
- **F5.5** Planejador de Palavras-chave do Google Ads, para ter volume. Realimenta D1.
- **F5.6** Usar o link da página de serviço na abordagem pelo WhatsApp.
- **F5.7** Segundo e terceiro clientes. É o que mais muda a página "Clientes" e a prova social.

### Fase 6: limpeza e manutenção

Não muda o que o visitante vê. Dois PRs, para o diff de código não se misturar com o de infraestrutura.

**PR de código:**

- **F6.1** Comentários desatualizados: os que citam a variante `solid`, o ISR e a Vercel como hospedagem atual.
- **F6.2** Código morto: `data-lenis-prevent` em `site-header.tsx`, `next: { revalidate }` e `REVALIDATE_SECONDS` em `github.ts`, campos de `GitHubRepo` sem uso.
- **F6.3** Dois componentes para o que está copiado: o link de ação (cinco cópias da mesma classe) e a linha de lista (seis). Dentro de seção `blend`, sem cor própria (lei 5).
- **F6.4** `ContactPage` é um fragmento em volta de um componente: achatar.

**PR de infraestrutura:**

- **F6.5** Dependências: Next 16.3.0 para a 16.4.x, React 19.3, e o resto. **Next e React num commit separado**, com a suíte inteira e uma medição de produção depois, porque o caminho da imagem de link (lei 17) depende de detalhe interno do Next.
- **F6.6** Dependabot ou Renovate, agrupado e semanal.
- **F6.7** CI: cache do navegador do Playwright (resolve a falha de DNS da §18.6) e um build só, compartilhado entre os dois jobs por artefato.
- **F6.8** Documentação: o `CLAUDE.md` fica com estado, regras e leis; o histórico de contagem de testes e de medições sai dele e fica no plano.

**Não entra:** reduzir os cerca de 215 KB de JS da home. A nota é 100, e a §13.3 mediu três hipóteses de performance das quais duas pioraram o site. Só com medição nova que justifique.

### Fase 7: acompanhar

- **F7.1** Quinzenal, no Search Console: páginas indexadas, e consultas com "site" contra a régua da §18.1 (5 impressões, só pelo nome).
- **F7.2** Contatos pelo WhatsApp por mensagem de origem (F4.1).
- **F7.3** Em 8 semanas, revisar D1 com os dados: se a região trouxer impressão e o nacional não, o título segue a região.

**Sucesso inicial:** página de serviço indexada, primeiras impressões em busca de serviço, primeiro contato com origem identificada. Ninguém garante primeiro lugar, e mudança leva semanas para aparecer.

---

## 4. A melhor forma de implementar

### 4.1 A ordem, e por quê

```
Fase 0 (decisões) ─┐
Fase 1 (merge) ────┼─> Fase 2 (conteúdo) ─> Fase 3 (técnico) ─> Fase 4 (confiança) ─> Fase 6 (limpeza)
Fase 5 (fora do site, do Pedro) corre em paralelo desde o primeiro dia
Fase 7 começa quando a fase 1 termina
```

1. **Fase 1 primeiro**, porque é trabalho pronto e aprovado que não conta enquanto não estiver no ar.
2. **Fase 5 em paralelo desde já**, porque é a de maior efeito e a que mais demora a refletir.
3. **Fase 2 antes da 3**: dado estruturado perfeito sobre página rasa não muda nada; conteúdo bom com dado estruturado mediano já muda.
4. **Fase 6 por último**: é a única sem efeito para o visitante, e fazê-la antes criaria conflito com os PRs das outras.

### 4.2 Um PR por fase

| PR | Fase | Base | Tamanho |
|---|---|---|---|
| #37 e #38 | 1 | já abertos | prontos |
| A | 2 | `main` depois do #38 | médio, só texto, uma seção e capturas |
| B | 3 | `main` | médio; F3.6 e F3.8 em commits separados |
| C | 4 | `main` | pequeno |
| D | 6, código | `main` | pequeno |
| E | 6, infraestrutura | `main` | pequeno; Next e React num commit só deles |

Nada empilhado depois do #38: PR com base em outro PR foi o que obrigou a trocar a base na §18.6.

### 4.3 O ritual de cada PR

1. Branch novo a partir da `main` atualizada.
2. **A guarda antes do código** nos itens marcados com G: escrever o teste, ver reprovar, e só então implementar. É o que pegou o rodapé de 320px na §18.4.
3. Local, nesta ordem: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`. **Derrubar a porta 3000 antes do E2E** (no Windows: primeiro o `node` do wrangler, depois os `workerd.exe`).
4. Se mudou o que se vê: `pnpm look` e mostrar as capturas ao Pedro antes de abrir o PR.
5. **Um push só por PR, quando estiver pronto.** Cada push em PR aberto dispara build de prévia na Cloudflare.
6. O merge é do Pedro. Depois do "fiz o merge": medir em produção (lei 18) e registrar o resultado aqui.
7. Apagar o branch local e o remoto depois do merge.

### 4.4 Os riscos, e como cada um é contido

| Risco | Onde | Contenção |
|---|---|---|
| Imagem de link some ou dá 404 sem erro | F3.6, F6.5 | Testes de `cloudflare-assets` e `marca` antes do código; conferir a URL em produção com `maxRedirects: 0` |
| Blend das seções morre sem erro | F2.4, F2.6, F4.5 | Nada novo como ancestral do `<main>`; `e2e/shell.spec.ts` |
| LCP muda de elemento | F2.6 | Conferir o elemento de LCP no JSON do Lighthouse, não só a nota |
| 404 nova não sai no export | F3.8 | Conferir `out/404.html` e o status 404 no `wrangler dev` |
| Atualização do Next quebra o export no Windows | F6.5 | O `achata-prefetch-windows.mjs` roda no build; E2E de movimento reduzido acusa |
| Texto novo promete o que não existe | F2.x | Todo texto passa pelo Pedro; o teste de preço e prazo só muda com D3 |

### 4.5 Como começar a sessão nova

Abrir a sessão com: **"Leia o `PLANO-V4-PORTFOLIO.md` e comece pela fase 1"**. As dez decisões já estão respondidas na §2, e a fase 1 está liberada.

---

## 5. O que não fazer

Da §18.5, que continua valendo:

- Página por cidade (doorway abuse) ou bloco com lista de cidades (keyword stuffing).
- `LocalBusiness`, endereço falso ou escritório virtual para criar Perfil da Empresa.
- Comprar avaliação ou link; marcar `Review` ou `aggregateRating` sobre o próprio serviço.
- Prometer serviço, preço ou prazo que o Pedro não decidiu.

Novos, desta análise:

- **Encher o `h1` invisível da home** para compensar a falta de conteúdo. A saída é conteúdo visível (D2) ou aceitar a home como vitrine.
- **Religar o beacon de RUM** sem decisão: ele custa pontos simulados do Lighthouse (§17.15), e D8 resolve a medição sem ele.
- **Investir em `llms.txt`** ou em "otimização para IA": o Google diz que usa os mesmos sinais da busca comum.
- **Otimizar JS ou imagem "porque parece pesado"**: §13.3 e §15.7.
- **CSP junto com os outros cabeçalhos:** é trabalho próprio, por causa dos scripts inline.
- **Reconectar o Git da Vercel ou apagar o projeto de lá** (§17.13), e apagar o TXT do Google ou os registros de email da zona.

---

## 6. Registro de andamento

| Fase | Estado | Data | Observação |
|---|---|---|---|
| 0 | fechada | 12/11/2026 | D1 a D10 respondidas (§2) |
| 1 | feita, com F1.6 do Pedro | 12/11/2026 | #37 e #38 mesclados pelo Pedro; produção medida (§6.1); falta a régua do Search Console |
| 2 | feita e no ar | 12/11/2026 | PR #40 mesclado pelo Pedro; F2.1 a F2.8 menos F2.5 (sem depoimento, D9); conferida em produção, com o Lighthouse inconclusivo (§6.2) |
| 3 | feita e no ar | 12/11/2026 | PR #41 mesclado pelo Pedro; conferida e medida em produção (§6.4): 98 a 99 no mobile, 97 a 98 no desktop |
| 4 | no PR, aguardando merge | 12/11/2026 | F4.1 a F4.5; 225 unitários e 269 E2E (§6.5) |
| 5 | não iniciada | | do Pedro |
| 6 | não iniciada | | |
| 7 | não iniciada | | régua: §18.1 |

### 6.1 Fase 1: a medição de produção (12/11/2026)

O Pedro fez o merge do #37 e do #38 em 12/11/2026 (14:07 UTC), antes de a sessão da fase 1 começar: o push previsto em F1.1 e a troca de base de F1.3 não foram necessários, e F1.2 perdeu o objeto. O registro da §18 e este plano, que estavam só locais, entraram na `main` por um PR próprio, só de documentação.

**O que foi conferido em `https://pedrolevi.com.br`:**

- **Sitemap com 20 páginas**, e as 20 respondem **200 sem salto**. `/criacao-de-sites/` sem a barra responde 307 para a URL com barra.
- **`@context` em toda rota com JSON-LD** (18 das 20; o contato não tem JSON-LD, de propósito). A página de serviço serve `Service` e `Person`, e a home `WebSite` e `Person`.
- Rota nova: canonical próprio, hreflang (`pt-BR`, `en`, `x-default`), HSTS, e a imagem de link com 200, `image/png`, 39 KB, sem salto.
- O `confere-producao.mjs` do laboratório: tudo certo.
- **Validador de schema (F1.5):** 0 erros e 0 avisos em `/`, `/criacao-de-sites/` e `/projetos/newra-news/`. O Teste de pesquisa aprimorada não foi rodado: nenhum dos tipos servidos gera resultado enriquecido.

**Lighthouse**, só performance, `simulate`, `--disable-quic` (`h2` em todas as requisições, o domínio como único host na rede), mediana de 3, Lighthouse 13.6.0:

| Rota | Mobile | Desktop | TBT mobile | Speed Index mobile |
|---|---|---|---|---|
| `/` | 99 | 97 | 90 ms | 3.5 s |
| `/criacao-de-sites/` | 98 | 97 | 122 ms | 3.3 s |
| `/clientes/` | 99 | 98 | 102 ms | 3.4 s |
| `/projetos/` | 99 | 98 | 62 ms | 3.3 s |
| `/info/` | 99 | 98 | 84 ms | 3.2 s |
| `/contato/` | 99 | 98 | 82 ms | 3.2 s |

CLS zero no mobile e até 0.002 no desktop. A rota nova empata com as outras.

**Fica 1 a 2 pontos abaixo da referência da §17.15** (100 no mobile, 99 a 100 no desktop), **e a causa não foi isolada.** O que se sabe:

- A diferença está toda no **Speed Index**: 3.2 a 3.5 s no mobile contra ~1.85 s, e ~1.7 s no desktop contra ~1.13 s. FCP e LCP estão iguais ou melhores.
- **Não é a versão do Lighthouse:** um controle com a 13.4.1, a da referência, deu 99 no mobile nas seis rotas, com o mesmo Speed Index de 3.2 a 3.5 s.
- **Não é a página nova:** `/contato/`, que a §18 não tocou no conteúdo, tem o mesmo Speed Index.
- A máquina estava mais lenta: `benchmarkIndex` de 2000 a 2700 nesta rodada contra 3000 a 3500 na referência, com outras sessões rodando. O Speed Index sai do que o Chrome pintou de verdade, e sem GPU o fundo é trabalho de processador (lei 20). É a hipótese mais provável, mas não foi provada.
- Houve rodadas soltas de 89 a 95 (primeira rodada de `/info/` e de `/contato/`), que a mediana absorve.

**O elemento de LCP deixou de ser o mesmo em todas as rotas.** Em `/` e `/criacao-de-sites/` segue o link do header; em `/clientes/` e `/projetos/` passou a ser a primeira prévia do showcase, em `/info/` o parágrafo de abertura, e em `/contato/` alterna entre o `h1` e o link. Isso aparece nas duas versões do Lighthouse, então é do site ou do Chromium desta rodada, não da ferramenta. O LCP em si não piorou (1.0 a 1.7 s no mobile). **Antes de F2.6, medir de novo com a máquina parada** e decidir se a frase do `CLAUDE.md` ("o LCP é o link do header nas cinco rotas") ainda vale.

> O Chromium do Playwright precisou ser instalado de novo, desta vez pelo Terminal do painel do app. A instalação de 06/11 tinha ido para a pasta virtualizada do app (o `%LOCALAPPDATA%` que as ferramentas da sessão enxergam não é o do Windows), e de lá o `chrome.exe` não abre: erro de "configuração lado a lado". **Lighthouse se roda pelo Terminal do painel**, com o script `lh-v4-fase1.cjs` do laboratório; os JSON estão em `lh-v4-fase1/` e `lh-v4-fase1-controle-1341/`.

**O que é do Pedro (F1.6 e fase 5):**

- **Search Console:** inspecionar `https://pedrolevi.com.br/criacao-de-sites/` e `/en/websites/`, pedir a indexação, e anotar aqui quantas páginas constam em Indexação > Páginas. É a régua da fase 7.
- **Fase 5**, que corre em paralelo desde já: o domínio no LinkedIn e no README do perfil do GitHub (F5.1), o pedido de crédito com link no site da Dandarkness e o crédito no da Trak (F5.2), o Bing Webmaster Tools importando do Search Console (F5.3), o DNS de `trak.pedrolevi.com.br` (F5.4, a combinar), o Planejador de Palavras-chave (F5.5), e usar o link da página de serviço na abordagem pelo WhatsApp (F5.6).

### 6.2 Fase 2: a conferência de produção (12/11/2026)

O PR #40 entrou em 12/11/2026 (15:43 UTC). Em `https://pedrolevi.com.br`: as 20 páginas com 200, o `confere-producao.mjs` certo, o h1 novo da página de serviço, a linha da home no HTML bruto, "Sobre | Pedro Levi" em `/info/` e a descrição própria nos cases.

**O Lighthouse desta rodada não serve de régua.** Mesmo método da §6.1, com a máquina sem build rodando, e ainda assim as três rodadas de uma mesma rota variaram demais: `/clientes/` deu 62, 94 e 99 no mobile, e é uma rota que a fase 2 não tocou. As medianas ficaram em 93 a 99 no mobile e 90 a 97 no desktop, com o Speed Index de algumas rotas em 5 a 7 s. Isso é ruído desta máquina neste dia (o `benchmarkIndex` seguiu em 2250 a 2800, contra 3000 a 3500 da referência), e não dá para separar dele o efeito da fase 2. Uma primeira tentativa, que rodou junto com builds locais, deu 70 a 94 e foi descartada.

**O que a rodada prova, porque não depende de nota:**

- **Na home o LCP é igual ao FCP** nas seis rodadas (1.06 s no mobile, 0.29 s no desktop). O elemento de LCP passou a ser a frase nova, como previsto no F2.6, e ela pinta no mesmo quadro do header porque não entra com fade. Não houve custo de LCP.
- CLS zero em todas as rotas, `h2` em todas as requisições e o domínio como único host na rede.

**Fica devendo:** uma medição de régua, com a máquina parada e sem outras sessões, depois do merge da fase 3. Sem ela, a frase do `CLAUDE.md` sobre a nota em produção continua sendo a da §17.15.

### 6.3 Fase 3: o que entrou (12/11/2026)

- **F3.1** `og:site_name` e `WebSite.name` viram "Pedro Levi"; o `WebSite` ganha `@id` e o nome longo como `alternateName`.
- **F3.2** A `Person` ganha `image` (o avatar, lido de `profile.avatar.src`), `description` e `alumniOf` (UNOESTE).
- **F3.3** `ProfilePage` em `/info/`, com `mainEntity` apontando para a `Person`.
- **F3.4** Os cases trocam `SoftwareApplication` por `SoftwareSourceCode`, com `codeRepository` e `author` por `@id`, e ganham `BreadcrumbList`.
- **F3.5** O sitemap fica só com URL e hreflang: saem `priority`, `changefreq` e o `lastmod`, que era a data do build semanal.
- **F3.6** A página de serviço tem a própria imagem de link, em `/criacao-de-sites/opengraph-image-1gx3em/` e `/en/websites/opengraph-image/`. O hash segue a regra da lei 17 e foi conferido contra o build; as duas entraram no `_headers` e no `_redirects` (lei 22).
- **F3.7** Sai o `meta keywords`, do código e dos dicionários.
- **F3.8** A 404 própria, por `global-not-found` (lei 25): em português e inglês, com o tema e as fontes do site. O export continua gravando `out/404.html`.
- **F3.9** `og:locale:alternate` nas fábricas.
- **F3.10** `FAQPage` na página de serviço, do mesmo texto da tela.

Guardas: `e2e/json-ld.spec.ts` cobra os tipos de cada rota e que toda referência por `@id` aponte para um nó da mesma página; `e2e/nao-encontrada.spec.ts` é novo; `e2e/marca.spec.ts` e `src/lib/cloudflare-assets.test.ts` passaram a cobrir as quatro imagens de link. **Depois do merge:** validador de schema nas rotas tocadas e as duas URLs de imagem novas com 200 sem salto, em produção.

### 6.4 Fase 3: a medição de produção, e a régua (12/11/2026)

O PR #41 entrou em 12/11/2026. Em `https://pedrolevi.com.br`:

- As quatro imagens de link com **200, `image/png` e sem salto**, as duas novas inclusive (`/criacao-de-sites/opengraph-image-1gx3em/` e `/en/websites/opengraph-image/`).
- Uma URL que não existe responde **404 com a página do site**, em `pt-BR`.
- Sitemap com 20 páginas e sem `lastmod` nem `priority`; `og:site_name` "Pedro Levi"; `og:locale:alternate` presente; sem `meta keywords`.
- **Validador de schema: 0 erros e 0 avisos** em `/`, `/criacao-de-sites/`, `/info/` e `/projetos/newra-news/`, com os tipos novos (`ProfilePage`, `FAQPage`, `SoftwareSourceCode`, `BreadcrumbList`).

**Lighthouse, desta vez com a máquina parada** (nada rodando além dele; mesmo método da §6.1, Lighthouse 13.6.0, `h2`, o domínio como único host):

| Rota | Mobile | Desktop | TBT mobile |
|---|---|---|---|
| `/` | 99 | 97 | 70 ms |
| `/criacao-de-sites/` | 99 | 98 | 78 ms |
| `/clientes/` | 99 | 97 | 49 ms |
| `/projetos/` | 98 | 97 | 44 ms |
| `/info/` | 99 | 98 | 71 ms |
| `/contato/` | 99 | 98 | 65 ms |

CLS zero no mobile. **É a mesma faixa da §6.1** (98 a 99 e 97 a 98), então as fases 2 e 3 não custaram nota, e o ruído da §6.2 era mesmo da máquina. As rodadas foram estáveis: a maior diferença entre três rodadas de uma rota foi de um ponto, fora uma rodada solta de 93 em `/projetos/`.

**Esta passa a ser a régua do plano V4.** Ela não é comparável com o 100 da §17.15: o Speed Index segue em 3.1 a 3.5 s no mobile contra ~1.85 s de lá, com o `benchmarkIndex` desta máquina mais baixo hoje, e essa diferença já existia antes de qualquer código deste plano (§6.1). Quem for comparar, compare com esta tabela e meça com a máquina parada.

**O elemento de LCP varia por rota e por rodada**, e isso não é defeito: na home é a frase nova (LCP igual ao FCP), em `/projetos/` a primeira prévia, e nas outras alterna entre o link do header, o `h1` e o parágrafo de abertura, todos pintados no mesmo quadro ou quase. A frase do `CLAUDE.md` que dizia "o mesmo elemento nas cinco rotas" foi corrigida.

### 6.5 Fase 4: o que entrou (12/11/2026)

- **F4.1** Todo link de WhatsApp do conteúdo leva mensagem pronta (`?text=`), diferente por página (serviço e contato) e por idioma. É a única medição de contato, sem script. `whatsappLink` em `src/lib/contact.ts`.
- **F4.2** O texto do LinkedIn deixou de ser digitado: sai de `profile.linkedin` (`in/pedrolevidias`, D6). O mesmo para o GitHub, o telefone e o email, por `contactDisplay`. Os dicionários não digitam mais contato nenhum, e um teste cobra isso.
- **F4.3** O email é `contato@pedrolevi.com.br` (D5), em `profile.email`: cartão de contato, fatos de `/info/` e `Person` do JSON-LD. O PDF do currículo é arquivo do Pedro e não foi tocado.
- **F4.4** `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` e `Permissions-Policy` na regra `/*` do `public/_headers`. Sem CSP, de propósito (§5).
- **F4.5** Link de pular para o conteúdo, o primeiro foco de toda página, dentro do header (leis 1, 3 e 7), apontando para `main#conteudo`.

Guardas: `src/lib/contact.test.ts` (novo), `e2e/cabecalhos.spec.ts` (os quatro cabeçalhos, com valor exato, também na 404 e na imagem de link) e `e2e/servico.spec.ts` (mensagens, contatos e o primeiro Tab). **Depois do merge:** os quatro cabeçalhos em produção, e um teste de mão no WhatsApp, que é do Pedro: abrir um botão de cada página e ver a mensagem certa.

## 7. Fontes da pesquisa

- [Provide a site name to Google Search](https://developers.google.com/structured-data/site-name)
- [An update on site names](https://developers.google.com/search/blog/2023/07/sitenames)
- [Profile page (ProfilePage) structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=pt-br)
- [Google Ends FAQ Rich Results for All Sites](https://www.techwyse.com/news/ai-search/google-faq-rich-results-deprecated-2026)
- [Google's new AI search guide calls AEO and GEO still SEO](https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/)
- [Sitemaps ping endpoint is going away](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)
- [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google now recommends higher-resolution favicons](https://www.searchenginejournal.com/google-now-recommends-higher-resolution-favicons/530793/)
- [Google bans countries and states from Business Profile service areas](https://ppc.land/google-bans-countries-and-states-from-business-profile-service-areas/)

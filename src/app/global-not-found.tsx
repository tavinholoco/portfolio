import type { Metadata, Viewport } from "next";

import {
  fontVariables,
  themeScript,
  viewport as rootViewport,
} from "@/components/shell/root-document";
import { dictionaries, type Locale } from "@/i18n";
import { getSiteUrl } from "@/lib/metadata";
import { pathFor } from "@/lib/routes";
import "@/app/globals.css";

/**
 * A página 404 do site inteiro (F3.8 do plano V4).
 *
 * **Por que `global-not-found` e não `not-found`.** O site tem dois root
 * layouts, um por idioma, e por isso não existe um layout único de onde montar
 * a 404: sem este arquivo o Next servia a página padrão dele, em inglês, sem
 * `lang`, sem estilo e sem link de volta. Esta convenção responde a toda URL
 * que não casa com rota nenhuma, e no export estático vira o `out/404.html`
 * que o `wrangler.jsonc` serve (`not_found_handling: "404-page"`).
 *
 * **Ela não passa por layout nenhum**, então tudo o que o `<RootDocument>` dá
 * de graça precisa vir para cá à mão: o `globals.css`, as fontes, o `<html
 * lang>` e o script que aplica o tema salvo antes do primeiro paint. As fontes
 * e o script são importados de lá, para não existirem duas cópias.
 *
 * O que fica de fora, de propósito: o fundo de ondas, o header e a abertura.
 * A página não sabe em que idioma o visitante estava, então mostra os dois, em
 * português primeiro (o `x-default` do site), e manda cada um para a sua home.
 * O Next já põe `noindex` em toda resposta 404.
 */

export const viewport: Viewport = rootViewport;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: `${dictionaries.pt.notFound.title} | ${dictionaries.pt.meta.name}`,
  description: dictionaries.pt.notFound.description,
};

function Bloco({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].notFound;
  const Titulo = lang === "pt" ? "h1" : "h2";

  return (
    <div lang={lang === "pt" ? "pt-BR" : "en"}>
      <Titulo className="text-title font-semibold tracking-tight text-balance">
        {d.title}
      </Titulo>
      <p className="font-body mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
        {d.description}
      </p>
      {/* `<a>` e não `<Link>`: a página não tem o roteador de nenhum dos dois
          layouts, e a navegação daqui é sempre um carregamento inteiro. */}
      <a
        href={pathFor("home", lang)}
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70"
      >
        {d.back}
      </a>
    </div>
  );
}

export default function GlobalNotFound() {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* O fundo vem do `:root`, como no resto do site (lei 2). */}
      <body className="min-h-full font-sans text-foreground">
        <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-12 [padding:calc(var(--pad)*2)]">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <Bloco lang="pt" />
          <Bloco lang="en" />
        </main>
      </body>
    </html>
  );
}

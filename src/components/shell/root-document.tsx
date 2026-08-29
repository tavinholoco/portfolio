import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Fira_Code, Open_Sans } from "next/font/google";

import { SiteShell } from "@/components/shell/site-shell";
import type { Locale } from "@/i18n";
import { getSiteUrl } from "@/lib/metadata";
import "@/app/globals.css";

/**
 * O documento inteiro, compartilhado pelos dois idiomas.
 *
 * Existem dois root layouts, um por idioma, porque cada um precisa do próprio
 * `<html lang>`. Eram duas cópias de 60 linhas que diferiam em **quatro**: o
 * `lang`, o nome da função e o comentário. Mexer numa e esquecer a outra não
 * gera erro nenhum, e é exatamente o risco que a regra 4 do `CLAUDE.md`
 * descreve. Agora a diferença é o argumento `lang`, e mais nada.
 *
 * As fontes ficam aqui, em escopo de módulo, que é onde o `next/font` exige.
 * Uma instância só passa a servir os dois idiomas.
 */

/* Fira Code: fonte principal (títulos, labels, brand, código). */
const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

/* Open Sans: fonte secundária (texto corrido, descrições e parágrafos). */
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

/**
 * metadataBase no layout (não só no page): o opengraph-image.tsx deste segmento é
 * resolvido no merge do layout, e sem metadataBase o build emite o aviso e cai em
 * localhost:0. Toda rota herda daqui, inclusive 404 e futuras rotas.
 */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

/**
 * Aplica o tema salvo antes do primeiro paint (sem flash): classe .dark e
 * theme-color do meta (o viewport exporta o padrão escuro; aqui o meta é
 * atualizado para o tema real salvo, que já existe no DOM nesta ordem).
 */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":true;document.documentElement.classList.toggle("dark",dark);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",dark?"#0b0b0c":"#f0f0f0");}catch(e){document.documentElement.classList.add("dark");}})();`;

export function RootDocument({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${firaCode.variable} ${openSans.variable} h-full antialiased`}
    >
      {/*
        A regra `no-head-element` é do Pages Router, onde `<head>` competia com
        o `<Head />` do `next/head`. No App Router o `<head>` do root layout é
        a forma suportada, e era assim que os dois layouts já faziam: o aviso só
        apareceu porque o documento saiu de `app/`, que o plugin isenta por
        caminho. O script tem que rodar antes do primeiro paint, então não pode
        virar `<Script>`.
      */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Sem background e sem isolation no body: o fundo da página vive no
          :root, e qualquer contexto de empilhamento aqui mataria o blend das
          seções (F1). */}
      <body className="min-h-full font-sans text-foreground">
        <SiteShell lang={lang}>{children}</SiteShell>
      </body>
    </html>
  );
}

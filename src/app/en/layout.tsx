import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Fira_Code, Open_Sans } from "next/font/google";

import { getSiteUrl } from "@/lib/metadata";
import "../globals.css";

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
  themeColor: "#0a0a0b",
};

/**
 * metadataBase no layout (não só no page): o opengraph-image.tsx deste segmento é
 * resolvido no merge do layout, e sem metadataBase o build emite o aviso e cai em
 * localhost:0. Toda rota herda daqui — inclusive 404 e futuras rotas.
 */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

/**
 * Aplica o tema salvo antes do primeiro paint (sem flash) — classe .dark e
 * theme-color do meta (o viewport exporta o padrão escuro; aqui o meta é
 * atualizado para o tema real salvo, que já existe no DOM nesta ordem).
 */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":true;document.documentElement.classList.toggle("dark",dark);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",dark?"#0a0a0b":"#fafafa");}catch(e){document.documentElement.classList.add("dark");}})();`;

/** Root layout do inglês (rota /en/) — cada idioma tem o próprio <html lang>. */
export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${firaCode.variable} ${openSans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}

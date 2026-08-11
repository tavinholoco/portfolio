import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Defina NEXT_PUBLIC_SITE_URL no deploy (ex.: https://pedrolevi.dev). */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrolevi.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pedro Levi | Desenvolvedor Fullstack",
    template: "%s | Pedro Levi",
  },
  description:
    "Portfólio de Pedro Levi Dias Rosa Paula. Desenvolvedor Fullstack com foco em React, Next.js, React Native e TypeScript. Projetos, trajetória e contato.",
  keywords: [
    "Pedro Levi",
    "Desenvolvedor Fullstack",
    "React",
    "React Native",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfólio",
  ],
  authors: [{ name: "Pedro Levi Dias Rosa Paula", url: siteUrl }],
  creator: "Pedro Levi Dias Rosa Paula",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Pedro Levi | Portfólio",
    title: "Pedro Levi | Desenvolvedor Fullstack",
    description:
      "Projetos, trajetória e contato. Desenvolvedor Fullstack com foco em React, Next.js, React Native e TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedro Levi | Desenvolvedor Fullstack",
    description:
      "Projetos, trajetória e contato. Desenvolvedor Fullstack com foco em React, Next.js, React Native e TypeScript.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}

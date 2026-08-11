import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            // Aplica o tema salvo antes do primeiro paint e ajusta o lang por rota.
            __html: `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":true;document.documentElement.classList.toggle("dark",dark);}catch(e){document.documentElement.classList.add("dark");}var p=location.pathname;if(p==="/en"||p.indexOf("/en/")===0){document.documentElement.lang="en";}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Viewport } from "next";
import { Fira_Code, Open_Sans } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${firaCode.variable} ${openSans.variable} h-full antialiased`}
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
      </body>
    </html>
  );
}

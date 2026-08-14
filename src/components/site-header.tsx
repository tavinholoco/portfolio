"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Menu } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { GitHubIcon } from "@/components/icons";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader({ lang }: { lang: Locale }) {
  const d = dictionaries[lang];
  const pathname = usePathname();
  // Em páginas de projeto não existem as seções da home; os links apontam para a home do idioma.
  const isProjectPage =
    pathname.startsWith("/projetos") || pathname.startsWith("/en/projects");
  const home = lang === "pt" ? "/" : "/en/";
  const navHref = (href: string) => (isProjectPage ? `${home}${href}` : href);
  const logoHref = isProjectPage ? home : "#inicio";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  // Sombra e compactação sutis quando a página é rolada
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: destaca a seção visível na navegação
  useEffect(() => {
    const sections = d.nav.links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [d.nav.links]);

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4"
    >
      {/* Pill flutuante */}
      <div
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-2xl border px-4 transition-all duration-300 sm:h-16 sm:px-5",
          scrolled
            ? "border-border/80 bg-background/85 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 dark:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.75)]"
            : "border-border/50 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
        )}
      >
        {/* Logo + controles (idioma e tema) */}
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={logoHref}
            className="focus-ring rounded-md font-mono text-sm font-medium tracking-tight text-foreground"
          >
            <span className="text-primary">&gt;_</span> pedrolevi
          </a>
          <LangToggle lang={lang} labels={d.controls} />
          <ThemeToggle label={d.controls.theme} />
        </div>

        {/* Navegação principal (desktop, à direita) com indicador deslizante */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={d.nav.mainAria}
        >
          {d.nav.links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={navHref(link.href)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "focus-ring relative rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    className="absolute inset-0 rounded-md bg-muted"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Menu mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={d.nav.openMenu}
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>{d.nav.sheetTitle}</SheetTitle>
              <SheetDescription className="sr-only">
                {d.nav.sheetDescription}
              </SheetDescription>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 px-4 pt-2"
              aria-label={d.nav.mobileAria}
            >
              {d.nav.links.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={
                    <a
                      href={navHref(link.href)}
                      role="link"
                      className="focus-ring rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-2 px-6 pb-6">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={d.hero.socials.github}
                className="focus-ring rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label={d.hero.socials.email}
                className="focus-ring rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}

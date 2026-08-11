"use client";

import { useEffect, useState } from "react";
import { Mail, Menu } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const [scrolled, setScrolled] = useState(false);

  // Sombra sutil quando a página é rolada
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl transition-shadow supports-[backdrop-filter]:bg-background/70",
        scrolled &&
          "shadow-[0_12px_40px_-20px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.8)]"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo + controles (tema e idioma) */}
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href="#inicio"
            className="focus-ring rounded-md font-mono text-sm font-medium tracking-tight text-foreground"
          >
            <span className="text-primary">&gt;_</span> pedrolevi
          </a>
          <LangToggle lang={lang} labels={d.controls} />
          <ThemeToggle label={d.controls.theme} />
        </div>

        {/* Navegação principal (desktop, à direita) */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label={d.nav.mainAria}
        >
          {d.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "true" : undefined}
              className={cn(
                "focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                active === link.href
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
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
                      href={link.href}
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
    </header>
  );
}

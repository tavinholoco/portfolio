"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { dictionaries, type Locale } from "@/i18n";
import { activeRouteId, navRoutes, pathFor } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * O header da v3.
 *
 * Saiu o pill com `backdrop-blur` da v2: `backdrop-filter` é incompatível com o
 * resto do shell, e o pill era exatamente o tipo de caixa que a seção 8 do
 * plano manda remover. Entrou um header alinhado a `var(--pad)`, em
 * `mix-blend-difference`, que inverte contra o que estiver embaixo e por isso
 * fica legível sobre o canvas, sobre uma seção clara e sobre uma escura, sem
 * tratamento condicional.
 *
 * Duas consequências disso que não são óbvias:
 *
 * 1. Nada aqui dentro pode ter cor ou fundo próprios. `text-muted-foreground` e
 *    `hover:bg-muted` não herdam, então inverteriam por conta própria e cada
 *    elemento apareceria de uma cor diferente. A hierarquia é por opacidade.
 * 2. Saiu o `layoutId` do Framer Motion, que animava o indicador do item ativo
 *    com `transform`. O indicador agora é um dot que aparece e some por
 *    opacidade.
 *
 * O header é irmão do `<main>`, nunca ancestral, então o blend daqui não
 * interfere no blend das seções (F1).
 */
export function SiteHeader({ lang }: { lang: Locale }) {
  const d = dictionaries[lang];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = navRoutes(lang);
  const active = activeRouteId(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-white">
      <div className="flex items-center justify-between gap-6 [padding-block:var(--pad)] [padding-inline:calc(var(--pad)*2)]">
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={pathFor("home", lang)}
            className="focus-ring inline-flex min-h-6 items-center py-1 font-mono text-sm font-medium tracking-tight"
          >
            &gt;_ pedrolevi
          </Link>
          <LangToggle lang={lang} labels={d.controls} />
          <ThemeToggle label={d.controls.theme} />
        </div>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label={d.nav.mainAria}
        >
          {items.map((item) => (
            <NavLink
              key={item.id}
              href={item.href}
              label={item.label}
              active={item.id === active}
            />
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label={d.nav.openMenu}
                className="focus-ring inline-flex size-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 md:hidden"
              />
            }
          >
            <Menu className="size-5" aria-hidden />
          </SheetTrigger>

          {/* data-lenis-prevent: sem isso a rolagem dentro do painel seria
              capturada pelo Lenis e moveria a página atrás dele. */}
          <SheetContent side="right" className="w-72" data-lenis-prevent>
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
              {items.map((item) => (
                <SheetClose
                  key={item.id}
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      aria-current={item.id === active ? "page" : undefined}
                      className={cn(
                        "focus-ring rounded-md px-3 py-2.5 text-sm transition-opacity",
                        item.id === active
                          ? "opacity-100"
                          : "opacity-70 hover:opacity-100"
                      )}
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

/** Item da nav: dot no ativo, opacidade no resto. */
function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-ring inline-flex min-h-6 items-center gap-2 py-1 text-sm whitespace-nowrap transition-opacity",
        active ? "opacity-100" : "opacity-70 hover:opacity-100"
      )}
    >
      {/* Reserva o espaço mesmo inativo, para a nav não pular ao navegar. */}
      <span
        aria-hidden
        className={cn(
          "size-1 rounded-full bg-current transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      {label}
    </Link>
  );
}

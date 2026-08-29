"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu } from "lucide-react";

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
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { activeRouteId, navRoutes, pathFor } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * O header da v3.5: identidade fixa no topo esquerdo.
 *
 * Saiu a barra horizontal com a marca em `>_ pedrolevi` e a nav ao centro.
 * Entrou um bloco ancorado no canto esquerdo, presente em todas as rotas, com
 * nome, cargo e, de `lg` para cima, a nav empilhada na vertical alinhada à
 * mesma margem. O nome deixou de ser conteúdo da home e virou âncora do site.
 *
 * Tudo em `mix-blend-difference`, que inverte contra o que estiver embaixo e
 * por isso fica legível sobre o canvas, sobre uma seção clara e sobre uma
 * escura, sem tratamento condicional.
 *
 * Três consequências que não são óbvias:
 *
 * 1. Nada aqui dentro pode ter cor ou fundo próprios. `text-muted-foreground` e
 *    `hover:bg-muted` não herdam, então inverteriam por conta própria e cada
 *    elemento apareceria de uma cor diferente. A hierarquia é por opacidade.
 * 2. **`pointer-events-none` no contêiner é obrigatório.** O header é `fixed`
 *    e de largura cheia, e com a nav vertical ele passou de uma tira fina para
 *    um bloco de umas 300px de altura. Sem isso, essa faixa inteira roubaria
 *    todo clique e todo hover do conteúdo que passa por baixo, incluindo o
 *    hover que troca o preview do showcase. Cada elemento interativo
 *    reabilita com `pointer-events-auto`. Mesmo esquema do `<SiteFooter>`.
 * 3. O espaço que a coluna ocupa é reservado pelo `--nav-col` no container do
 *    `<Section>`, não por padding aqui: o header é `fixed` e não empurra nada.
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference text-white">
      {/*
        `flex-wrap` e `ms-auto` nos controles, e isso conserta um defeito que
        estava no ar: com o "Baixar CV" no header, identidade mais controles
        pedem 368px, e sobram 310 num celular de 390px. Os controles saíam da
        tela, e o botão do menu ficava **inalcançável** em 320, 360 e 390px,
        que é a maioria dos celulares.

        Nenhuma auditoria pegou porque o header é `fixed`: o que transborda
        dele não entra no `scrollWidth` do documento, então não existe rolagem
        horizontal para acusar. Agora existe asserção própria em
        `e2e/responsivo.spec.ts`.

        Com wrap, os controles descem para a segunda linha quando não cabem, e
        o `ms-auto` os mantém à direita nos dois casos.
      */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 [padding-block:calc(var(--pad)*1.5)] lg:[padding-block:calc(var(--pad)*2)] [padding-inline:calc(var(--pad)*2)]">
        <div className="flex shrink-0 flex-col">
          <Link
            href={pathFor("home", lang)}
            className="focus-ring pointer-events-auto self-start text-2xl font-medium tracking-tight lg:text-3xl"
          >
            {d.hero.name}
          </Link>
          <p className="mt-1 font-mono text-xs opacity-70">{d.hero.role}</p>

          <nav
            className="mt-8 hidden flex-col items-start gap-3.5 lg:flex"
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
        </div>

        <div className="pointer-events-auto ms-auto flex shrink-0 items-center gap-1">
          {/*
            O CV mora aqui desde a V3.5, junto de idioma e tema, porque a home
            ficou sem conteúdo e ele era o único CTA que precisava sobreviver.
            Sem fundo próprio, como todo o resto do header em `difference`.
          */}
          <a
            href={profile.cvUrl}
            download
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">{d.hero.downloadCv}</span>
            <span className="sr-only sm:hidden">{d.hero.downloadCv}</span>
          </a>
          <LangToggle lang={lang} labels={d.controls} />
          <ThemeToggle label={d.controls.theme} />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label={d.nav.openMenu}
                  className="focus-ring pointer-events-auto inline-flex size-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 lg:hidden"
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
        "focus-ring pointer-events-auto inline-flex min-h-5 items-center gap-2 text-sm whitespace-nowrap transition-opacity",
        active ? "opacity-100" : "opacity-70 hover:opacity-100"
      )}
    >
      {/* Reserva o espaço mesmo inativo, para os rótulos alinharem na coluna. */}
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

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Section } from "@/components/section";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { pathFor } from "@/lib/routes";

/**
 * A Home: a tese, e nada mais.
 *
 * A v3 usava esta rota como manifesto do processo, com os 5 passos de
 * `Dict.process.steps` desdobrados em lista tipográfica. Ocupava altura demais
 * para o que a v3.5 quer, então a lista migrou para `/info/` e aqui ficou só a
 * frase que carrega o argumento: `hero.thesis`.
 *
 * Isso é o que impede a mudança de virar regressão. A seção 2.3 do plano avisa
 * que uma home reduzida a nome mais bio mais link mata a tese do portfólio. O
 * `h1` desta página é justamente a tese, e não o nome: o nome virou âncora fixa
 * no `<SiteHeader>` e repeti-lo aqui seria ruído.
 *
 * Tudo em `variant="blend"`, e por isso nada aqui pode ter cor ou fundo
 * próprios: o que não herda cor inverte por conta própria contra o canvas e
 * aparece de uma cor diferente do resto. Os CTAs são links com borda em
 * `currentColor`, não botões preenchidos, pelo mesmo motivo.
 *
 * Continua em CSS puro, sem JS de animação: é o elemento de LCP da rota.
 */
export function Manifesto({ lang }: { lang: Locale }) {
  const d = dictionaries[lang];

  return (
    <Section id="inicio" variant="blend">
      <div className="animate-fade-in motion-reduce:animate-none">
        {/* Elemento de LCP da rota: sem delay de animação. */}
        <h1 className="max-w-4xl text-title font-semibold tracking-tight text-balance">
          {d.hero.thesis}
        </h1>

        <p className="font-body mt-8 max-w-2xl text-lede opacity-80 text-pretty">
          {d.hero.bio}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={pathFor("projects", lang)}
            className="focus-ring inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70"
          >
            {d.hero.viewProjects}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href={profile.cvUrl}
            download
            className="focus-ring inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <Download className="size-4" aria-hidden />
            {d.hero.downloadCv}
          </a>
        </div>
      </div>
    </Section>
  );
}

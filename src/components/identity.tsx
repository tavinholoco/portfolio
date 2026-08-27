import Image from "next/image";

import { Section } from "@/components/section";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";

/**
 * O bloco de identidade: foto e fatos rápidos.
 *
 * Em `variant="plain"` porque contém foto, e foto em `mix-blend-difference`
 * apareceria em negativo. É a mesma razão pela qual as rotas com screenshot
 * usam `plain`. Sem fundo próprio: o canvas aparece atrás, e a foto continua
 * nas cores certas porque a seção não mistura.
 *
 * A foto é pequena e quadrada, sem borda arredondada, sem glow e sem gradiente
 * (E12 mais a seção 8 do plano). O avatar circular com halo era o visual da v2.
 */
export function Identity({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].about;

  return (
    <Section id="identidade" variant="plain">
      <div className="grid gap-10 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-14">
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          width={160}
          height={160}
          sizes="160px"
          className="size-32 rounded-sm object-cover sm:size-40"
        />

        <dl className="border-t border-border">
          {d.facts.map((fact) => (
            <div
              key={fact.id}
              className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-4"
            >
              <dt className="font-mono text-xs text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="truncate text-sm">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

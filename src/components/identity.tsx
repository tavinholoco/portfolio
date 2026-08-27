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
 * A foto é redonda, pequena, sem glow e sem gradiente. O quadrado com canto de
 * 2px era a leitura literal da seção 8 do plano, que proíbe `border-radius`
 * acima de 2px; virou exceção explícita a pedido do Pedro, ao lado da janela do
 * preview. O que a E12 proíbe é o halo e o gradiente da v2, não o círculo.
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
          className="size-32 rounded-full object-cover sm:size-40"
        />

        <dl className="border-t border-border">
          {d.facts.map((fact) => (
            <div
              key={fact.id}
              /*
                Empilhado no mobile, em duas colunas a partir de sm. Em 390px a
                coluna do valor fica com 182px e o email pede 202: com as duas
                colunas fixas ele era cortado com reticências, e email cortado
                não serve para nada.
              */
              className="grid gap-1 border-b border-border py-4 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] sm:items-baseline sm:gap-4"
            >
              <dt className="font-mono text-xs text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="text-sm break-words">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

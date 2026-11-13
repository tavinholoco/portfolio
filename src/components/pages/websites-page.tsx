import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";

import { actionLinkClass, listRowClass } from "@/components/estilos";
import dandarkness from "@/assets/projects/dandarkness.webp";
import trakAssessoria from "@/assets/projects/trak-assessoria.webp";
import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { SectionIntro } from "@/components/section-intro";
import { dictionaries, type Locale, type WebsiteExample } from "@/i18n";
import { whatsappLink } from "@/lib/contact";
import { faqJsonLd, personJsonLd, serviceJsonLd } from "@/lib/json-ld";

/**
 * A prévia de cada exemplo. Mesmos arquivos do showcase, importados de
 * `@/assets/` (lei 19): saem com hash e `immutable`, sem passar por otimizador.
 */
const examplePreview: Record<WebsiteExample["id"], StaticImageData> = {
  trak: trakAssessoria,
  dandarkness,
};

function WhatsAppLink({
  lang,
  label,
  className,
}: {
  lang: Locale;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(lang, "service")}
      target="_blank"
      rel="noopener noreferrer"
      className={`${actionLinkClass} ${className ?? ""}`}
    >
      {label}
      <ArrowUpRight className="size-4" aria-hidden />
    </a>
  );
}

/**
 * A página de serviço: é ela que responde a "criação de sites".
 *
 * **Uma página só, para o Brasil todo.** Uma página por cidade é o que o Google
 * chama de doorway abuse, e um bloco com lista de cidades, de keyword stuffing.
 * Só promete o que o Pedro faz hoje: landing pages e portfólios, para clientes
 * de todo o Brasil, pelo WhatsApp. Rancharia aparece como a cidade dele, não
 * como limite de atendimento. Valor e prazo ficam de fora enquanto ele não
 * decidir (P1 do plano).
 *
 * A Trak é projeto próprio, e nada aqui pode sugerir que foi encomenda.
 *
 * **Três seções, por causa da lei 5.** O texto vai em `blend`, onde nada tem cor
 * própria: a hierarquia é tamanho, opacidade e linha de 1px. Os exemplos têm
 * imagem, e imagem em `difference` sai em negativo, então eles ficam numa seção
 * `plain` no meio. As três são irmãs dentro do `<main>`, sem wrapper (lei 1).
 *
 * A região (Rancharia, Presidente Prudente, Oeste Paulista) aparece em frase
 * corrida, na abertura e em "Onde atendo". Nunca em lista de cidades.
 */
export function WebsitesPage({ lang }: { lang: Locale }) {
  const { websites: d } = dictionaries[lang];

  return (
    <>
      {/* A Person entra junto para o `provider` do Service apontar para ela. */}
      <JsonLd
        data={[personJsonLd(lang), serviceJsonLd(lang), faqJsonLd(lang)]}
      />

      <Section id="criacao-de-sites" variant="blend" className="pb-0 sm:pb-0">
        <h1 className="text-display font-semibold text-balance break-words hyphens-auto">
          {d.heading}
        </h1>
        <p className="font-body mt-8 max-w-2xl text-lede opacity-80 text-pretty">
          {d.intro.join(" ")}
        </p>
        <WhatsAppLink lang={lang} label={d.cta} className="mt-10" />

        <div className="mt-20">
          <SectionIntro title={d.servicesTitle} />
          <ul className="mt-8 border-t border-current/15">
            {d.services.map((service) => (
              <li
                key={service.id}
                className={listRowClass.simples}
              >
                <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                  {service.title}
                </h3>
                <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </Section>

      {/*
        Em `plain` por causa das prévias. Aqui a cor é a normal do tema, então
        `text-muted-foreground` e `border-border` valem, como no corpo do case.
      */}
      <Section id="exemplos" variant="plain" className="py-20 sm:py-20">
        <SectionIntro title={d.examplesTitle} />
        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {d.examples.map((example) => (
            <li key={example.id}>
              {/*
                `lazy` de propósito, e escrito: a lei 19 pede `eager` nas
                prévias do showcase porque lá elas trocam no hover, empilhadas e
                invisíveis. Estas ficam no fluxo, abaixo da dobra, e não podem
                disputar banda com o primeiro paint.
              */}
              <div className="relative aspect-16/10 overflow-hidden rounded-md border border-border">
                <Image
                  src={examplePreview[example.id]}
                  alt={`${d.examplePreviewAlt}: ${example.name}`}
                  fill
                  loading="lazy"
                  className="object-cover object-top"
                />
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-tight sm:text-2xl">
                {example.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {example.kind}
              </p>
              <p className="font-body mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {example.description}
              </p>
              <a
                href={example.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${d.openExample}: ${example.name}`}
                className="focus-ring mt-4 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
              >
                {d.openExample}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="como-funciona" variant="blend" className="pt-0 sm:pt-0">
        <div>
          <SectionIntro title={d.stepsTitle} />
          <ol className="mt-8 border-t border-current/15">
            {d.steps.map((step, index) => (
              <li
                key={step.title}
                className={listRowClass.numerada}
              >
                <span className="font-mono text-xs opacity-70 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <SectionIntro className="mt-20" title={d.areaTitle} description={d.area.join(" ")} />

        {/*
          O mesmo texto vai no `FAQPage` do JSON-LD (`faqJsonLd`). Não gera
          resultado enriquecido, que o Google encerrou: serve de leitura.
        */}
        <div className="mt-20">
          <SectionIntro title={d.faqTitle} />
          <ul className="mt-8 border-t border-current/15">
            {d.faq.map((item) => (
              <li
                key={item.question}
                className={listRowClass.simples}
              >
                <h3 className="text-lg font-medium tracking-tight">
                  {item.question}
                </h3>
                <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
                  {item.answer.join(" ")}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <WhatsAppLink lang={lang} label={d.cta} className="mt-16" />
      </Section>
    </>
  );
}

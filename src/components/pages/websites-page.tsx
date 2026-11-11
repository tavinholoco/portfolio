import { ArrowUpRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { SectionIntro } from "@/components/section-intro";
import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";
import { personJsonLd, serviceJsonLd } from "@/lib/json-ld";

/** Mesmo botão do contato: borda em `currentColor`, para inverter no blend. */
const ctaClass =
  "focus-ring inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70";

function WhatsAppLink({ label, className }: { label: string; className?: string }) {
  return (
    <a
      href={profile.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`${ctaClass} ${className ?? ""}`}
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
 * Em `blend` porque é só texto, sem imagem (lei 5). Por isso nada aqui tem cor
 * própria: a hierarquia é tamanho, opacidade e linha de 1px.
 */
export function WebsitesPage({ lang }: { lang: Locale }) {
  const { websites: d, routes } = dictionaries[lang];

  return (
    <>
      {/* A Person entra junto para o `provider` do Service apontar para ela. */}
      <JsonLd data={[personJsonLd(lang), serviceJsonLd(lang)]} />

      <Section id="criacao-de-sites" variant="blend">
        <h1 className="text-display font-semibold text-balance break-words hyphens-auto">
          {routes.websites.title}
        </h1>
        <p className="font-body mt-8 max-w-2xl text-lede opacity-80 text-pretty">
          {d.intro.join(" ")}
        </p>
        <WhatsAppLink label={d.cta} className="mt-10" />

        <div className="mt-20">
          <SectionIntro title={d.servicesTitle} />
          <ul className="mt-8 border-t border-current/15">
            {d.services.map((service) => (
              <li
                key={service.id}
                className="grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
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

        <div className="mt-20">
          <SectionIntro title={d.examplesTitle} />
          <ul className="mt-8 border-t border-current/15">
            {d.examples.map((example) => (
              <li
                key={example.id}
                className="grid gap-3 border-b border-current/15 py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
              >
                <div>
                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                    {example.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs opacity-70">{example.kind}</p>
                </div>
                <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
                  {example.description}
                </p>
                <a
                  href={example.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${d.openExample}: ${example.name}`}
                  className="focus-ring inline-flex items-center gap-2 justify-self-start text-sm transition-opacity hover:opacity-70"
                >
                  {d.openExample}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20">
          <SectionIntro title={d.stepsTitle} />
          <ol className="mt-8 border-t border-current/15">
            {d.steps.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
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

        <SectionIntro className="mt-20" title={d.areaTitle} description={d.area} />

        {/*
          Conteúdo para quem lê, sem marcação `FAQPage`: o Google restringiu esse
          resultado enriquecido, então não vale contar com ele.
        */}
        <div className="mt-20">
          <SectionIntro title={d.faqTitle} />
          <ul className="mt-8 border-t border-current/15">
            {d.faq.map((item) => (
              <li
                key={item.question}
                className="grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
              >
                <h3 className="text-lg font-medium tracking-tight">
                  {item.question}
                </h3>
                <p className="font-body text-sm leading-relaxed opacity-70 text-pretty">
                  {item.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <WhatsAppLink label={d.cta} className="mt-16" />
      </Section>
    </>
  );
}

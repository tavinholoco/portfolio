import { FadeIn, Section, SectionHeading } from "@/components/section";
import { dictionaries, type Locale } from "@/i18n";

/** Seção "Como trabalho": 5 passos numerados, do entendimento ao deploy. */
export function ProcessSection({ lang }: { lang: Locale }) {
  const d = dictionaries[lang].process;

  return (
    <Section id="como-trabalho" variant="blend">
      <SectionHeading
        label={d.label}
        title={d.title}
        description={d.description}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {d.steps.map((step, index) => (
          <FadeIn key={step.title} delay={index * 0.05} className="h-full">
            <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
              <span className="font-mono text-2xl font-semibold text-primary/50 transition-colors group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="font-body mt-1.5 text-xs leading-relaxed text-muted-foreground text-pretty">
                {step.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

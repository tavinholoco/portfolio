import { ClientProjectsSection } from "@/components/client-projects";
import { JsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n";
import { clientListJsonLd } from "@/lib/json-ld";

/** A rota de clientes: trabalhos entregues para terceiros. */
export function ClientsPage({ lang }: { lang: Locale }) {
  return (
    <>
      <JsonLd data={clientListJsonLd(lang)} />
      <ClientProjectsSection lang={lang} />
    </>
  );
}

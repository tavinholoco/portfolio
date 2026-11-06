import { serializeJsonLd, type JsonLdNode } from "@/lib/json-ld";

type JsonLdData = JsonLdNode | JsonLdNode[] | null;

/**
 * Renderiza dados estruturados (Schema.org) como JSON-LD.
 *
 * É o único lugar que escreve `application/ld+json`, e o `@context` entra na
 * serialização: nenhuma rota consegue esquecer dele. `e2e/json-ld.spec.ts` lê o
 * HTML servido e cobra o campo.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

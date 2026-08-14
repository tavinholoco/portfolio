type JsonLdData = Record<string, unknown> | Record<string, unknown>[] | null;

/** Renderiza dados estruturados (Schema.org) como JSON-LD. */
export function JsonLd({ data }: { data: JsonLdData }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

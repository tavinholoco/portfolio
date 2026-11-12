import {
  ogImage,
  ogImageAltFor,
  contentType,
  size,
} from "@/components/og-image";

/* A imagem de link própria da página de serviço (F3.6 do plano V4). O desenho
   vive em `@/components/og-image`; aqui ficam só os metadados que o Next exige
   no segmento. O caminho que isto gera está escrito à mão em `ogImageMeta`,
   no `public/_headers` e no `public/_redirects` (leis 17 e 22). */
export const alt = ogImageAltFor("en", "service");
export { size, contentType };

/* O export estático exige que rota de metadado declare que é estática. */
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return ogImage("en", "service");
}

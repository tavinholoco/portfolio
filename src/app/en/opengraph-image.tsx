import {
  ogImage,
  ogImageAlt,
  contentType,
  size,
} from "@/components/og-image";

/* O desenho vive em `@/components/og-image`, compartilhado pelos dois
   idiomas. Aqui ficam só os metadados que o Next exige no segmento. */
export const alt = ogImageAlt.en;
export { size, contentType };

/* O export estático (`output: "export"`) exige que rota de metadado declare
   que é estática; sem isto o build para. O arquivo sai sem extensão em
   `out/`, e é o `public/_headers` que lhe dá o tipo (lei 22). */
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return ogImage("en");
}

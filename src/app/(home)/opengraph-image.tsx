import { ogImage, contentType, size } from "@/components/og-image";

/* O desenho vive em `@/components/og-image`, compartilhado pelos dois
   idiomas. Aqui ficam só os metadados que o Next exige no segmento. */
export const alt = "Pedro Levi | Desenvolvedor Full Stack";
export { size, contentType };

export default function OpenGraphImage() {
  return ogImage("pt");
}

import avatar from "@/assets/avatar.webp";

/**
 * Dados neutros (não dependem do idioma): contato, links e stack.
 * Textos traduzíveis ficam em `src/i18n/` (pt.ts e en.ts).
 */
export const profile = {
  name: "Pedro Levi Dias Rosa Paula",
  email: "pedrolevidiass@gmail.com",
  phoneRaw: "+5518996260781",
  github: "https://github.com/tavinholoco",
  linkedin: "https://www.linkedin.com/in/pedro-levi-dias-96720126a/",
  whatsapp: "https://wa.me/5518996260781",
  /**
   * Foto do perfil, o avatar do GitHub salvo no repositório.
   *
   * Import, e não caminho em string: é a lei 19. Em `public/` o arquivo era
   * servido pela URL literal, sem como versionar por conteúdo, e a Vercel o
   * entregava com `max-age=0, must-revalidate`, revalidando na rede a cada
   * visita a `/info/`. Importado, vira `/_next/static/media/<hash>.webp` e
   * ganha `immutable`.
   *
   * Guardado em 320x320, que é o dobro dos 160px em que ele aparece, para
   * cobrir tela de densidade 2. Os 460x460 originais viraram desperdício
   * quando o otimizador saiu do caminho (§15.7).
   */
  avatar,
  /*
   * O currículo continua em `public/`, e de propósito: é URL estável, que as
   * pessoas guardam e compartilham. Dar hash a ela quebraria os links a cada
   * troca do arquivo, e o ganho de cache não paga isso.
   */
  cvUrl: "/cv/pedro-levi-curriculo.pdf",
  stack: ["React", "Next.js", "Node.js", "TypeScript"],
} as const;

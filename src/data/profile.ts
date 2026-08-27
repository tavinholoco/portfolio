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
  /** Foto do perfil (avatar do GitHub, salvo localmente em public/avatar.jpg). */
  avatarUrl: "/avatar.jpg",
  cvUrl: "/cv/pedro-levi-curriculo.pdf",
  stack: ["React", "Next.js", "Node.js", "TypeScript"],
} as const;

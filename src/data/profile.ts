import avatar from "@/assets/avatar.webp";

/**
 * Dados neutros (não dependem do idioma): contato, links e stack.
 * Textos traduzíveis ficam em `src/i18n/` (pt.ts e en.ts).
 */
export const profile = {
  name: "Pedro Levi Dias Rosa Paula",
  /* O endereço do domínio (D5 do plano V4), que o Email Routing repassa. */
  email: "contato@pedrolevi.com.br",
  phoneRaw: "+5518996260781",
  /* O mesmo número, como aparece escrito no contato. */
  phoneDisplay: "(18) 99626-0781",
  github: "https://github.com/tavinholoco",
  linkedin: "https://www.linkedin.com/in/pedrolevidias/",
  whatsapp: "https://wa.me/5518996260781",
  /**
   * Cidade e estado, e nunca a rua: o atendimento é só pelo WhatsApp, e o
   * endereço dele não é público. Voltou para o site por causa da busca local,
   * revogando a §12.4 do plano.
   */
  location: { city: "Rancharia", region: "SP", country: "BR" },
  /* Onde ele se formou, para o `alumniOf` da `Person` no JSON-LD. */
  education: { name: "Universidade do Oeste Paulista", alternateName: "UNOESTE" },
  /**
   * Onde ele atende: o Brasil todo, decidido pelo Pedro em 11/11/2026 (antes
   * eram Rancharia e Presidente Prudente). O atendimento é só pelo WhatsApp, e
   * por isso a área não depende da cidade dele. Vale para o `areaServed` do
   * JSON-LD.
   */
  serviceArea: { name: "Brasil", code: "BR" },
  /**
   * Foto do perfil, o avatar do GitHub salvo no repositório.
   *
   * Import, e não caminho em string: é a lei 19. Em `public/` o arquivo era
   * servido pela URL literal, sem como versionar por conteúdo, e o servidor
   * o entrega com `max-age=0, must-revalidate` (a Vercel antes, a Cloudflare
   * hoje), revalidando na rede a cada visita a `/info/`. Importado, vira `/_next/static/media/<hash>.webp` e
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

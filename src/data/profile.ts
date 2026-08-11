export const profile = {
  name: "Pedro Levi Dias Rosa Paula",
  displayName: "Pedro Levi",
  surname: "Dias Rosa Paula",
  role: "Desenvolvedor Fullstack",
  location: "Rancharia, São Paulo",
  email: "pedrolevidiass@gmail.com",
  phone: "(18) 99626-0781",
  phoneRaw: "+5518996260781",
  github: "https://github.com/tavinholoco",
  linkedin: "https://www.linkedin.com/in/pedro-levi-dias-96720126a/",
  whatsapp: "https://wa.me/5518996260781",
  /** Foto do perfil (avatar do GitHub, salvo localmente em public/avatar.jpg). */
  avatarUrl: "/avatar.jpg",
  cvUrl: "/cv/pedro-levi-curriculo.pdf",
  cta: {
    title: "Vamos construir algo juntos?",
    description:
      "Aberto a projetos, freelas e colaborações. Se você tem uma ideia ou precisa de velocidade sem abrir mão de qualidade, vamos conversar.",
  },
  bio: "Profissional de tecnologia formado em Análise e Desenvolvimento de Sistemas pela UNOESTE, com experiência prática em soluções web e mobile, de portais de notícias fullstack a aplicativos com testes automatizados. Interesse ativo em análise de sistemas, qualidade de dados e IA.",
  stack: [
    "React.js",
    "React Native",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Fastify",
    "Expo",
    "Tailwind CSS",
  ],
} as const;

/** Interesses ativos (da seção Sobre). */
export const interests = [
  {
    title: "Análise de Sistemas",
    description:
      "Modelagem e arquitetura de soluções que resolvem o problema real do usuário.",
  },
  {
    title: "Qualidade de Dados",
    description:
      "Confiabilidade, consistência e governança de dados em cada etapa do fluxo.",
  },
  {
    title: "Treinamento de IA",
    description:
      "Explorando modelos generativos, fine-tuning e automação com IA na prática.",
  },
] as const;

export const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Clientes", href: "#clientes" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Contato", href: "#contato" },
] as const;

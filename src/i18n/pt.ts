import type { Dict } from "./index";

/** Textos do site em português (Brasil). */
export const pt: Dict = {
  meta: {
    title: "Pedro Levi | Desenvolvedor Fullstack",
    name: "Pedro Levi",
    description:
      "Portfólio de Pedro Levi Dias Rosa Paula. Desenvolvedor Fullstack com foco em React, Next.js, React Native e TypeScript. Projetos, trajetória e contato.",
    keywords: [
      "Pedro Levi",
      "Desenvolvedor Fullstack",
      "React",
      "React Native",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Portfólio",
    ],
    ogSiteName: "Pedro Levi | Portfólio",
    ogDescription:
      "Projetos, trajetória e contato. Desenvolvedor Fullstack com foco em React, Next.js, React Native e TypeScript.",
  },
  nav: {
    links: [
      { label: "Início", href: "#inicio" },
      { label: "Sobre", href: "#sobre" },
      { label: "Projetos", href: "#projetos" },
      { label: "Clientes", href: "#clientes" },
      { label: "Trajetória", href: "#trajetoria" },
      { label: "Habilidades", href: "#habilidades" },
      { label: "Contato", href: "#contato" },
    ],
    openMenu: "Abrir menu",
    sheetTitle: "Menu",
    sheetDescription: "Navegação do portfólio",
    mainAria: "Navegação principal",
    mobileAria: "Navegação mobile",
  },
  hero: {
    role: "Desenvolvedor Full Stack",
    name: "Pedro Levi",
    bio: "Construo aplicações web e mobile com foco em arquitetura, qualidade e experiências funcionais.",
    stackLabel: "Tecnologias",
    viewProjects: "Ver projetos",
    downloadCv: "Baixar CV",
    scrollLabel: "Rolar para a seção sobre",
    socials: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
      phone: "Telefone",
    },
  },
  about: {
    label: "sobre mim",
    title: "Sobre mim",
    description: "Quem sou por trás do código e o que me move a cada projeto.",
    facts: [
      { id: "formation", label: "Formação", value: "ADS · UNOESTE" },
      { id: "location", label: "Localização", value: "Rancharia, São Paulo" },
      { id: "email", label: "Email", value: "pedrolevidiass@gmail.com" },
      { id: "languages", label: "Idiomas", value: "Inglês avançado (CCAA)" },
    ],
    summary: [
      "Formado em Análise e Desenvolvimento de Sistemas pela UNOESTE, construo soluções web e mobile, do back-end com Node.js e Fastify ao app em React Native.",
      "Minha trajetória começou no suporte e na infraestrutura de TI, o que me ensinou a diagnosticar a causa raiz antes de agir. Hoje desenvolvo projetos completos, como um portal de notícias com geração de conteúdo por IA e um app de estudos com 144 testes automatizados, sempre buscando qualidade, boas práticas e aprendizado contínuo.",
    ],
    stats: [
      { value: "144+", label: "testes automatizados" },
      { value: "4+", label: "projetos no GitHub" },
      { value: "3", label: "áreas de interesse em IA" },
    ],
    interestsHeading: "Interesses ativos",
    interests: [
      {
        id: "analysis",
        title: "Análise de Sistemas",
        description:
          "Modelagem e arquitetura de soluções que resolvem o problema real do usuário.",
      },
      {
        id: "data",
        title: "Qualidade de Dados",
        description:
          "Confiabilidade, consistência e governança de dados em cada etapa do fluxo.",
      },
      {
        id: "ai",
        title: "Treinamento de IA",
        description:
          "Explorando modelos generativos, fine-tuning e automação com IA na prática.",
      },
    ],
  },
  projects: {
    label: "projetos",
    title: "Projetos em destaque",
    description:
      "Seleção dos meus trabalhos no GitHub, do app mobile ao portal com IA. Metadados sincronizados automaticamente com os repositórios.",
    filterAll: "Todos",
    one: "projeto",
    many: "projetos",
    updatedAt: "atualizado",
    repo: "Repo",
    demo: "Demo",
    allOnGithub: "Ver todos os projetos no GitHub",
    inDevelopment: "Em desenvolvimento",
    categories: {
      fullstack: "Fullstack",
      mobile: "Mobile",
      landing: "Landing",
    },
    featured: [
      {
        repo: "newra-news",
        title: "Newra News",
        description:
          "Portal de notícias com geração diária de conteúdo por IA. Monorepo Turborepo com API Fastify e frontend Next.js integrados ao Google Gemini.",
        category: "fullstack",
        inDevelopment: true,
        tags: ["Next.js", "Fastify", "Gemini API", "Turborepo"],
      },
      {
        repo: "NetsheetEngine",
        title: "Netsheet Engine",
        description:
          "Suite de ficha de personagem e PRD para Cyberpunk 2020, com React 19, Express e Supabase, do CRUD à documentação de produto.",
        category: "fullstack",
        inDevelopment: true,
        tags: ["React 19", "Express", "Supabase"],
      },
      {
        repo: "repertorio-progressivo",
        title: "Repertório Progressivo",
        description:
          "App mobile de organização de estudos com notificações push e suíte de 144 testes automatizados (Jest), construído com React Native, Expo e TypeScript.",
        category: "mobile",
        tags: ["React Native", "Expo", "Jest", "Push notifications"],
      },
      {
        repo: "Trak-Acessoria",
        title: "Trak Assessoria",
        description:
          "Landing page institucional para assessoria contábil, com Next.js 16, Tailwind v4, Vitest e Playwright, testes E2E e design responsivo.",
        category: "landing",
        tags: ["Next.js 16", "Tailwind v4", "Vitest", "Playwright"],
      },
    ],
  },
  clients: {
    label: "clientes",
    title: "Projetos para clientes",
    description:
      "Trabalhos entregues e publicados para clientes. Cada card leva direto ao site do projeto.",
    live: "No ar",
    visit: "Visitar site",
    previewAlt: "Prévia do site",
    projects: [
      {
        name: "Dandarkness",
        description:
          "Portfólio do projeto Dandarkness, publicado e no ar. Acesso direto ao site do projeto.",
        url: "https://dandarkness.vercel.app/",
        image: "/projects/dandarkness.jpg",
      },
    ],
  },
  career: {
    label: "trajetória",
    title: "Trajetória profissional",
    description:
      "Formação acadêmica e experiências que construíram meu caminho até aqui.",
    educationTitle: "Formação Acadêmica",
    experienceTitle: "Experiência Profissional",
    education: [
      {
        id: "unoeste",
        title: "Análise e Desenvolvimento de Sistemas",
        org: "UNOESTE · Tecnólogo",
        period: "jun 2022 · jun 2025",
        status: "Concluído",
        details: [
          "Formação completa em desenvolvimento de software, banco de dados e engenharia de requisitos.",
          "Base sólida em lógica de programação, estruturas de dados e desenvolvimento web e mobile.",
        ],
        tags: ["Lógica", "Banco de Dados", "Web", "Mobile"],
      },
      {
        id: "ccaa",
        title: "Inglês Avançado",
        org: "CCAA Rancharia",
        period: "jun 2022 · dez 2025",
        status: "Concluído",
        details: [
          "Curso concluído com foco em leitura técnica, conversação e comunicação profissional.",
          "Capacidade de consumir documentação e colaborar em ambientes internacionais.",
        ],
        tags: ["Leitura técnica", "Conversação"],
      },
    ],
    experience: [
      {
        id: "palmali",
        title: "Aprendiz TI · Tecnologia da Informação",
        org: "Palmali",
        period: "mai 2025 · fev 2026",
        details: [
          "Diagnóstico e solução de problemas em computadores e impressoras (manutenção preventiva e corretiva), identificando a causa raiz antes de agir.",
          "Configuração e instalação de sistemas operacionais Windows, preparando máquinas para uso imediato pelos setores.",
          "Apoio à infraestrutura de rede (cabos, switches e Wi-Fi) e manutenção de sistemas de monitoramento (CFTV).",
        ],
        tags: ["Suporte", "Windows", "Redes", "Hardware"],
      },
      {
        id: "prefeitura",
        title: "Estagiário · Secretaria",
        org: "Prefeitura Municipal de Rancharia",
        period: "jul 2023 · mai 2025",
        details: [
          "Organização de documentos administrativos e apoio à gestão de estoque e materiais, com conferência e controle de inventário.",
          "Atendimento presencial ao público, com comunicação clara e resolução ágil de solicitações.",
        ],
        tags: ["Documentação", "Atendimento", "Inventário"],
      },
    ],
  },
  skills: {
    label: "habilidades",
    title: "Habilidades",
    description:
      "Tecnologias e competências que uso no dia a dia para transformar problemas em soluções.",
    blocks: [
      {
        id: "frontend",
        title: "Frontend & Mobile",
        description:
          "Interfaces responsivas, componentes reutilizáveis e apps mobile com React.",
        level: { label: "Intermediário", value: 3 },
        skills: ["React.js", "React Native", "Next.js", "Expo"],
      },
      {
        id: "backend",
        title: "Backend",
        description:
          "APIs escaláveis e arquitetura de servidores com foco em performance.",
        level: { label: "Intermediário", value: 3 },
        skills: ["Node.js", "Fastify", "TypeScript"],
      },
      {
        id: "dados",
        title: "Dados & Versionamento",
        description:
          "Persistência de dados relacionais e controle de versão no dia a dia.",
        level: { label: "Intermediário", value: 3 },
        skills: ["MySQL", "SQL", "Git", "GitHub"],
      },
      {
        id: "ia",
        title: "IA & Suporte Técnico",
        description:
          "Automação com IA generativa e diagnóstico de hardware, redes e infraestrutura.",
        level: { label: "Intermediário", value: 3 },
        skills: ["Claude Code", "VS Code", "Antigravity", "Hardware & Redes"],
      },
    ],
  },
  contact: {
    label: "contato",
    title: "Vamos construir algo juntos?",
    description:
      "Aberto a projetos, freelas e colaborações. Se você tem uma ideia ou precisa de velocidade sem abrir mão de qualidade, vamos conversar.",
    emailButton: "Enviar email",
    whatsappButton: "WhatsApp",
    cards: [
      { id: "email", label: "Email", value: "pedrolevidiass@gmail.com" },
      { id: "whatsapp", label: "WhatsApp", value: "(18) 99626-0781" },
      { id: "linkedin", label: "LinkedIn", value: "in/pedro-levi-dias" },
      { id: "github", label: "GitHub", value: "@tavinholoco" },
    ],
  },
  footer: {
    socials: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
      phone: "Telefone",
    },
  },
  controls: {
    theme: "Alternar tema",
    toEnglish: "Traduzir para inglês",
    toPortuguese: "Traduzir para português",
  },
};

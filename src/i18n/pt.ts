import type { Dict } from "./index";

/** Textos do site em português (Brasil). */
export const pt: Dict = {
  meta: {
    title: "Pedro Levi | Desenvolvedor Full Stack",
    name: "Pedro Levi",
    description:
      "Desenvolvedor Full Stack especializado em React, Next.js, Node.js e TypeScript. Confira meus projetos web, mobile e soluções com IA.",
    keywords: [
      "Pedro Levi",
      "Desenvolvedor Full Stack",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "IA",
      "Portfólio",
    ],
    ogSiteName: "Pedro Levi | Portfólio",
    ogDescription:
      "Desenvolvedor Full Stack especializado em React, Next.js, Node.js e TypeScript. Projetos web, mobile e soluções com IA.",
  },
  nav: {
    links: [
      { label: "Início", href: "#inicio" },
      { label: "Sobre", href: "#sobre" },
      { label: "Projetos", href: "#projetos" },
      { label: "Projetos profissionais", href: "#clientes" },
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
    metricsTitle: "Engenharia além da interface",
    metrics: [
      { value: "144+", label: "testes automatizados" },
      { value: "4+", label: "projetos full stack" },
      { value: "3", label: "áreas de exploração em IA" },
      { value: "3+", label: "anos de formação e experiência técnica" },
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
        title: "IA aplicada ao desenvolvimento e automação",
        description:
          "Automação de fluxos, geração de conteúdo e code assist.",
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
    github: "GitHub",
    viewProject: "Ver projeto",
    featuredBadge: "Projeto principal",
    problemLabel: "Problema",
    solutionLabel: "Solução",
    highlightLabel: "Destaque técnico",
    stackLabel: "Stack",
    backToProjects: "Voltar aos projetos",
    learningsTitle: "O que aprendi",
    previous: "Anterior",
    next: "Próximo",
    demoLabel: "Demo",
    allOnGithub: "Ver todos os projetos no GitHub",
    categories: {
      fullstack: "Fullstack",
      mobile: "Mobile",
      landing: "Landing",
    },
    featured: [
      {
        slug: "newra-news",
        title: "Newra News",
        tagline:
          "Portal de notícias full stack com geração automatizada de conteúdo utilizando IA.",
        problem:
          "Portal precisava gerar e organizar conteúdo de notícias diariamente.",
        solution: "Arquitetura full stack com Next.js + Fastify + Gemini.",
        highlight: "Monorepo Turborepo e integração com IA generativa.",
        stack: ["Next.js", "Fastify", "Gemini", "Turborepo", "TypeScript"],
        category: "fullstack",
        learnings: [
          "Orquestrar um monorepo Turborepo com frontend e API no mesmo repositório.",
          "Integrar IA generativa (Gemini) num fluxo real de produção de conteúdo.",
          "Estruturar um portal completo: da modelagem de dados à publicação diária.",
        ],
      },
      {
        slug: "netsheet-engine",
        title: "Netsheet Engine",
        tagline:
          "Suite de fichas de personagem e documentação de produto para Cyberpunk 2020.",
        problem:
          "Fichas de personagem de Cyberpunk 2020 dispersas, sem padrão e difíceis de manter.",
        solution: "Suite com CRUD completo, PRD e documentação de produto.",
        highlight: "React 19 + Supabase com dados modelados como produto.",
        stack: ["React 19", "Express", "Supabase", "TypeScript"],
        category: "fullstack",
        learnings: [
          "Modelar dados como produto: schema relacional pensado para o domínio.",
          "Documentar o produto (PRD) junto com o código, não depois.",
          "Compor React 19 + Express + Supabase de ponta a ponta.",
        ],
      },
      {
        slug: "repertorio-progressivo",
        title: "Repertório Progressivo",
        tagline:
          "App mobile de organização de estudos com notificações e rotinas.",
        problem:
          "Estudantes sem organização do repertório de estudos e sem constância.",
        solution: "App mobile com notificações push e rotinas de estudo.",
        highlight: "144 testes automatizados com Jest.",
        stack: ["React Native", "Expo", "TypeScript", "Jest"],
        category: "mobile",
        learnings: [
          "Escrever 144 testes automatizados que protegem o comportamento real do app.",
          "Planejar notificações push e rotinas no React Native/Expo.",
          "Pensar em produto mobile: o ciclo de estudo como feature central.",
        ],
      },
      {
        slug: "trak-assessoria",
        title: "Trak Assessoria",
        tagline:
          "Landing institucional para assessoria contábil, com testes E2E.",
        problem: "Assessoria contábil sem presença digital profissional.",
        solution: "Landing institucional com Next.js 16 e Tailwind v4.",
        highlight: "Testes E2E com Vitest e Playwright.",
        stack: ["Next.js 16", "Tailwind v4", "Vitest", "Playwright"],
        category: "landing",
        learnings: [
          "Entregar uma landing institucional com testes E2E (Vitest + Playwright).",
          "Traduzir os requisitos de um cliente real em design, conteúdo e código.",
          "Publicar com Next.js 16 e Tailwind v4 mantendo performance e acessibilidade.",
        ],
      },
    ],
  },
  clients: {
    label: "projetos profissionais",
    title: "Projetos profissionais",
    description:
      "Trabalhos entregues e publicados para clientes — da ideia ao site no ar.",
    live: "No ar",
    visit: "Visitar projeto",
    previewAlt: "Prévia do site",
    clientLabel: "Cliente",
    typeLabel: "Tipo",
    techLabel: "Tecnologias",
    projects: [
      {
        name: "Dandarkness",
        client: "Dandarkness",
        type: "Portfólio artístico",
        tech: ["Next.js", "TypeScript", "Tailwind CSS"],
        outcome:
          "Portfólio artístico publicado, com identidade visual própria e navegação fluida em qualquer dispositivo.",
        url: "https://dandarkness.vercel.app/",
        image: "/projects/dandarkness.jpg",
      },
    ],
  },
  process: {
    label: "como trabalho",
    title: "Como trabalho",
    description:
      "Como transformo um problema em software — do primeiro contato ao deploy.",
    steps: [
      {
        title: "Entendo",
        description:
          "Entendo o problema e os requisitos antes de escolher a tecnologia.",
      },
      {
        title: "Planejo",
        description: "Estruturo arquitetura, dados e fluxo da aplicação.",
      },
      {
        title: "Desenvolvo",
        description:
          "Construo com componentes reutilizáveis, boas práticas e testes.",
      },
      {
        title: "Valido",
        description:
          "Testo funcionalidades e comportamento antes da entrega.",
      },
      {
        title: "Entrego",
        description: "Deploy, documentação e manutenção.",
      },
    ],
  },
  career: {
    label: "trajetória",
    title: "Trajetória profissional",
    description:
      "Do suporte ao full stack: a jornada que me trouxe até aqui.",
    learningsTitle: "O que aprendi",
    chapters: [
      {
        year: "2023",
        title: "Estágio",
        org: "Prefeitura de Rancharia",
        period: "jul 2023 · mai 2025",
        learnings: [
          "Atendimento ao usuário e comunicação clara no dia a dia.",
          "Organização de documentos e controle de inventário.",
          "Paciência para diagnosticar antes de agir.",
        ],
        tags: ["Atendimento", "Organização", "Documentação"],
      },
      {
        year: "2025",
        title: "Formação",
        org: "ADS • UNOESTE",
        period: "jun 2022 · jun 2025",
        learnings: [
          "Fundamentos de programação e modelagem de dados.",
          "Engenharia de requisitos e desenvolvimento web e mobile.",
        ],
        tags: ["Lógica", "Banco de Dados", "Web", "Mobile", "Inglês (CCAA)"],
      },
      {
        year: "2025",
        title: "Aprendiz TI",
        org: "Palmali",
        period: "mai 2025 · fev 2026",
        learnings: [
          "Diagnóstico de causa raiz antes de agir (suporte).",
          "Infraestrutura de rede e sistemas de monitoramento (CFTV).",
        ],
        tags: ["Suporte", "Redes", "Hardware", "Windows"],
      },
      {
        year: "2026",
        title: "Desenvolvedor Full Stack",
        org: "Projetos próprios + clientes",
        period: "2026",
        learnings: [
          "Arquitetura de sistemas e monorepo (Turborepo).",
          "IA aplicada ao desenvolvimento e automação.",
          "Entrega para cliente: da ideia ao deploy.",
        ],
        tags: ["Full Stack", "Arquitetura", "IA", "Clientes"],
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
        id: "dev",
        title: "Desenvolvimento",
        description:
          "Aplicações web e mobile com React, Next.js e Node.js.",
        skills: ["React", "Next.js", "Node.js", "Fastify", "TypeScript"],
      },
      {
        id: "data",
        title: "Dados",
        description: "Modelagem e persistência de dados relacionais.",
        skills: ["MySQL", "SQL", "Supabase"],
      },
      {
        id: "ai",
        title: "IA & Automação",
        description:
          "IA generativa aplicada ao desenvolvimento e automação de fluxos.",
        skills: ["Gemini API", "Claude Code", "IA generativa", "Automação"],
      },
      {
        id: "tools",
        title: "Ferramentas",
        description:
          "Versionamento, containers e o dia a dia de desenvolvimento.",
        skills: ["Git", "GitHub", "Docker", "VS Code"],
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
    goToSection: "Ir para o contato",
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

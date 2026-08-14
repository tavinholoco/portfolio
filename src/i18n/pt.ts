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

import type { Dict } from "./index";

/** Website copy in English. */
export const en: Dict = {
  meta: {
    title: "Pedro Levi | Full Stack Developer",
    name: "Pedro Levi",
    description:
      "Full Stack Developer specialized in React, Next.js, Node.js and TypeScript. Check out my web, mobile and AI-powered projects.",
    keywords: [
      "Pedro Levi",
      "Full Stack Developer",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "AI",
      "Portfolio",
    ],
    ogSiteName: "Pedro Levi | Portfolio",
    ogDescription:
      "Full Stack Developer specialized in React, Next.js, Node.js and TypeScript. Web, mobile and AI-powered projects.",
  },
  nav: {
    links: [
      { label: "Home", href: "#inicio" },
      { label: "About", href: "#sobre" },
      { label: "Projects", href: "#projetos" },
      { label: "Professional projects", href: "#clientes" },
      { label: "Career", href: "#trajetoria" },
      { label: "Skills", href: "#habilidades" },
      { label: "Contact", href: "#contato" },
    ],
    openMenu: "Open menu",
    sheetTitle: "Menu",
    sheetDescription: "Portfolio navigation",
    mainAria: "Main navigation",
    mobileAria: "Mobile navigation",
  },
  hero: {
    role: "Full Stack Developer",
    name: "Pedro Levi",
    bio: "I build web and mobile applications with a focus on architecture, quality and functional experiences.",
    stackLabel: "Technologies",
    viewProjects: "View projects",
    downloadCv: "Download CV",
    scrollLabel: "Scroll to the about section",
    socials: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
    },
  },
  about: {
    label: "about me",
    title: "About me",
    description: "Who I am behind the code and what drives me in every project.",
    facts: [
      { id: "formation", label: "Education", value: "Systems Analysis · UNOESTE" },
      { id: "location", label: "Location", value: "Rancharia, São Paulo" },
      { id: "email", label: "Email", value: "pedrolevidiass@gmail.com" },
      { id: "languages", label: "Languages", value: "Advanced English (CCAA)" },
    ],
    summary: [
      "Graduated in Systems Analysis and Development from UNOESTE, I build web and mobile solutions, from the backend with Node.js and Fastify to the app in React Native.",
      "My journey started in IT support and infrastructure, which taught me to diagnose the root cause before acting. Today I build complete projects, like a news portal with AI-generated content and a study app with 144 automated tests, always pursuing quality, good practices and continuous learning.",
    ],
    metricsTitle: "Engineering beyond the interface",
    metrics: [
      { value: "144+", label: "automated tests" },
      { value: "4+", label: "full stack projects" },
      { value: "3", label: "AI exploration areas" },
      { value: "3+", label: "years of education and technical experience" },
    ],
    interestsHeading: "Active interests",
    interests: [
      {
        id: "analysis",
        title: "Systems Analysis",
        description:
          "Modeling and architecture of solutions that solve the user's real problem.",
      },
      {
        id: "data",
        title: "Data Quality",
        description:
          "Data reliability, consistency and governance at every step of the flow.",
      },
      {
        id: "ai",
        title: "AI applied to development and automation",
        description:
          "Workflow automation, content generation and code assistance.",
      },
    ],
  },
  projects: {
    label: "projects",
    title: "Featured projects",
    description:
      "A selection of my work on GitHub, from the mobile app to the AI-powered portal. Metadata synced automatically with the repositories.",
    filterAll: "All",
    one: "project",
    many: "projects",
    updatedAt: "updated",
    github: "GitHub",
    viewProject: "View project",
    featuredBadge: "Main project",
    problemLabel: "Problem",
    solutionLabel: "Solution",
    highlightLabel: "Technical highlight",
    stackLabel: "Stack",
    backToProjects: "Back to projects",
    learningsTitle: "What I learned",
    previous: "Previous",
    next: "Next",
    demoLabel: "Demo",
    allOnGithub: "View all projects on GitHub",
    categories: {
      fullstack: "Full Stack",
      mobile: "Mobile",
      landing: "Landing",
    },
    featured: [
      {
        slug: "newra-news",
        title: "Newra News",
        tagline:
          "Full stack news portal with AI-powered automated content generation.",
        problem:
          "The portal needed to generate and organize daily news content.",
        solution: "Full stack architecture with Next.js + Fastify + Gemini.",
        highlight: "Turborepo monorepo and generative AI integration.",
        stack: ["Next.js", "Fastify", "Gemini", "Turborepo", "TypeScript"],
        category: "fullstack",
        learnings: [
          "Orchestrating a Turborepo monorepo with frontend and API in the same repository.",
          "Integrating generative AI (Gemini) into a real content production flow.",
          "Structuring a complete portal: from data modeling to daily publishing.",
        ],
      },
      {
        slug: "netsheet-engine",
        title: "Netsheet Engine",
        tagline:
          "Character sheet suite and product documentation for Cyberpunk 2020.",
        problem:
          "Cyberpunk 2020 character sheets scattered, inconsistent and hard to maintain.",
        solution: "Suite with full CRUD, PRD and product documentation.",
        highlight: "React 19 + Supabase with data modeled as a product.",
        stack: ["React 19", "Express", "Supabase", "TypeScript"],
        category: "fullstack",
        learnings: [
          "Modeling data as a product: a relational schema designed for the domain.",
          "Documenting the product (PRD) alongside the code, not afterwards.",
          "Composing React 19 + Express + Supabase end to end.",
        ],
      },
      {
        slug: "repertorio-progressivo",
        title: "Repertório Progressivo",
        tagline:
          "Mobile study organization app with notifications and routines.",
        problem:
          "Students with no study repertoire organization and no consistency.",
        solution: "Mobile app with push notifications and study routines.",
        highlight: "144 automated tests with Jest.",
        stack: ["React Native", "Expo", "TypeScript", "Jest"],
        category: "mobile",
        learnings: [
          "Writing 144 automated tests that protect the app's real behavior.",
          "Planning push notifications and routines in React Native/Expo.",
          "Thinking as a mobile product: the study cycle as the core feature.",
        ],
      },
      {
        slug: "trak-assessoria",
        title: "Trak Assessoria",
        tagline:
          "Institutional landing page for an accounting firm, with E2E tests.",
        problem: "Accounting firm without a professional digital presence.",
        solution: "Institutional landing page with Next.js 16 and Tailwind v4.",
        highlight: "E2E tests with Vitest and Playwright.",
        stack: ["Next.js 16", "Tailwind v4", "Vitest", "Playwright"],
        category: "landing",
        learnings: [
          "Delivering an institutional landing page with E2E tests (Vitest + Playwright).",
          "Translating a real client's requirements into design, content and code.",
          "Shipping with Next.js 16 and Tailwind v4 while keeping performance and accessibility.",
        ],
      },
    ],
  },
  clients: {
    label: "professional projects",
    title: "Professional projects",
    description:
      "Delivered and published work for clients — from idea to live website.",
    live: "Live",
    visit: "Visit project",
    previewAlt: "Site preview",
    clientLabel: "Client",
    typeLabel: "Type",
    techLabel: "Technologies",
    projects: [
      {
        name: "Dandarkness",
        client: "Dandarkness",
        type: "Artistic portfolio",
        tech: ["Next.js", "TypeScript", "Tailwind CSS"],
        outcome:
          "Published artistic portfolio with its own visual identity and fluid navigation on any device.",
        url: "https://dandarkness.vercel.app/",
        image: "/projects/dandarkness.jpg",
      },
    ],
  },
  process: {
    label: "how I work",
    title: "How I work",
    description:
      "How I turn a problem into software — from first contact to deployment.",
    steps: [
      {
        title: "Understand",
        description:
          "I understand the problem and the requirements before choosing the technology.",
      },
      {
        title: "Plan",
        description: "I structure architecture, data and application flow.",
      },
      {
        title: "Develop",
        description:
          "I build with reusable components, good practices and tests.",
      },
      {
        title: "Validate",
        description: "I test features and behavior before delivery.",
      },
      {
        title: "Deliver",
        description: "Deployment, documentation and maintenance.",
      },
    ],
  },
  career: {
    label: "career",
    title: "Professional journey",
    description:
      "From support to full stack: the journey that brought me here.",
    learningsTitle: "What I learned",
    chapters: [
      {
        year: "2023",
        title: "Internship",
        org: "Rancharia City Hall",
        period: "Jul 2023 · May 2025",
        learnings: [
          "User-facing service and clear daily communication.",
          "Document organization and inventory control.",
          "Patience to diagnose before acting.",
        ],
        tags: ["Customer service", "Organization", "Documentation"],
      },
      {
        year: "2025",
        title: "Education",
        org: "Systems Analysis • UNOESTE",
        period: "Jun 2022 · Jun 2025",
        learnings: [
          "Programming fundamentals and data modeling.",
          "Requirements engineering and web and mobile development.",
        ],
        tags: ["Logic", "Databases", "Web", "Mobile", "English (CCAA)"],
      },
      {
        year: "2025",
        title: "IT Apprentice",
        org: "Palmali",
        period: "May 2025 · Feb 2026",
        learnings: [
          "Root-cause diagnosis before acting (support).",
          "Network infrastructure and monitoring systems (CCTV).",
        ],
        tags: ["Support", "Networks", "Hardware", "Windows"],
      },
      {
        year: "2026",
        title: "Full Stack Developer",
        org: "Own projects + clients",
        period: "2026",
        learnings: [
          "Systems architecture and monorepo (Turborepo).",
          "AI applied to development and automation.",
          "Client delivery: from idea to deployment.",
        ],
        tags: ["Full Stack", "Architecture", "AI", "Clients"],
      },
    ],
  },
  skills: {
    label: "skills",
    title: "Skills",
    description:
      "Technologies and competences I use every day to turn problems into solutions.",
    blocks: [
      {
        id: "dev",
        title: "Development",
        description:
          "Web and mobile applications with React, Next.js and Node.js.",
        skills: ["React", "Next.js", "Node.js", "Fastify", "TypeScript"],
      },
      {
        id: "data",
        title: "Data",
        description: "Relational data modeling and persistence.",
        skills: ["MySQL", "SQL", "Supabase"],
      },
      {
        id: "ai",
        title: "AI & Automation",
        description:
          "Generative AI applied to development and workflow automation.",
        skills: ["Gemini API", "Claude Code", "Generative AI", "Automation"],
      },
      {
        id: "tools",
        title: "Tools",
        description:
          "Versioning, containers and the daily development workflow.",
        skills: ["Git", "GitHub", "Docker", "VS Code"],
      },
    ],
  },
  contact: {
    label: "contact",
    title: "Let's talk?",
    description:
      "Hiring or have a project? There's a direct path for each case.",
    hiringTitle: "Are you hiring?",
    hiringDescription:
      "Check out my CV, my projects and my journey at a glance.",
    hiringCta: "View CV",
    projectTitle: "Have a project?",
    projectDescription:
      "Let's talk about your idea and the path to launch.",
    projectCta: "Talk to me",
    goToSection: "Go to contact",
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
      phone: "Phone",
    },
  },
  controls: {
    theme: "Toggle theme",
    toEnglish: "Switch to English",
    toPortuguese: "Switch to Portuguese",
  },
};

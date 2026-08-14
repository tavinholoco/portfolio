import type { Dict } from "./index";

/** Website copy in English. */
export const en: Dict = {
  meta: {
    title: "Pedro Levi | Fullstack Developer",
    name: "Pedro Levi",
    description:
      "Pedro Levi Dias Rosa Paula's portfolio. Fullstack developer focused on React, Next.js, React Native and TypeScript. Projects, career and contact.",
    keywords: [
      "Pedro Levi",
      "Fullstack Developer",
      "React",
      "React Native",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Portfolio",
    ],
    ogSiteName: "Pedro Levi | Portfolio",
    ogDescription:
      "Projects, career and contact. Fullstack developer focused on React, Next.js, React Native and TypeScript.",
  },
  nav: {
    links: [
      { label: "Home", href: "#inicio" },
      { label: "About", href: "#sobre" },
      { label: "Projects", href: "#projetos" },
      { label: "Clients", href: "#clientes" },
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
      phone: "Phone",
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
    stats: [
      { value: "144+", label: "automated tests" },
      { value: "4+", label: "GitHub projects" },
      { value: "3", label: "AI interest areas" },
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
        title: "AI Training",
        description:
          "Exploring generative models, fine-tuning and AI automation in practice.",
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
      fullstack: "Fullstack",
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
    label: "clients",
    title: "Client projects",
    description:
      "Delivered and published work for clients. Each card leads straight to the project website.",
    live: "Live",
    visit: "Visit site",
    previewAlt: "Site preview",
    projects: [
      {
        name: "Dandarkness",
        description:
          "Dandarkness project portfolio, published and live. Direct access to the project website.",
        url: "https://dandarkness.vercel.app/",
        image: "/projects/dandarkness.jpg",
      },
    ],
  },
  career: {
    label: "career",
    title: "Professional journey",
    description:
      "Academic background and experiences that built my path so far.",
    educationTitle: "Education",
    experienceTitle: "Work Experience",
    education: [
      {
        id: "unoeste",
        title: "Systems Analysis and Development",
        org: "UNOESTE · Technology Degree",
        period: "Jun 2022 · Jun 2025",
        status: "Completed",
        details: [
          "Full training in software development, databases and requirements engineering.",
          "Solid foundation in programming logic, data structures and web and mobile development.",
        ],
        tags: ["Logic", "Databases", "Web", "Mobile"],
      },
      {
        id: "ccaa",
        title: "Advanced English",
        org: "CCAA Rancharia",
        period: "Jun 2022 · Dec 2025",
        status: "Completed",
        details: [
          "Course completed with a focus on technical reading, conversation and professional communication.",
          "Ability to consume documentation and collaborate in international environments.",
        ],
        tags: ["Technical reading", "Conversation"],
      },
    ],
    experience: [
      {
        id: "palmali",
        title: "IT Apprentice · Information Technology",
        org: "Palmali",
        period: "May 2025 · Feb 2026",
        details: [
          "Diagnosed and fixed issues on computers and printers (preventive and corrective maintenance), identifying the root cause before acting.",
          "Configured and installed Windows operating systems, preparing machines for immediate use by departments.",
          "Supported network infrastructure (cables, switches and Wi-Fi) and maintained monitoring systems (CCTV).",
        ],
        tags: ["Support", "Windows", "Networks", "Hardware"],
      },
      {
        id: "prefeitura",
        title: "Intern · Secretary Office",
        org: "Rancharia City Hall",
        period: "Jul 2023 · May 2025",
        details: [
          "Organized administrative documents and supported stock and materials management, with inventory checking and control.",
          "Provided in-person customer service, with clear communication and agile resolution of requests.",
        ],
        tags: ["Documentation", "Customer service", "Inventory"],
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
        id: "frontend",
        title: "Frontend & Mobile",
        description:
          "Responsive interfaces, reusable components and mobile apps with React.",
        level: { label: "Intermediate", value: 3 },
        skills: ["React.js", "React Native", "Next.js", "Expo"],
      },
      {
        id: "backend",
        title: "Backend",
        description:
          "Scalable APIs and server architecture focused on performance.",
        level: { label: "Intermediate", value: 3 },
        skills: ["Node.js", "Fastify", "TypeScript"],
      },
      {
        id: "dados",
        title: "Data & Versioning",
        description:
          "Relational data persistence and version control in the day to day.",
        level: { label: "Intermediate", value: 3 },
        skills: ["MySQL", "SQL", "Git", "GitHub"],
      },
      {
        id: "ia",
        title: "AI & Technical Support",
        description:
          "Automation with generative AI and hardware, network and infrastructure diagnostics.",
        level: { label: "Intermediate", value: 3 },
        skills: ["Claude Code", "VS Code", "Antigravity", "Hardware & Networks"],
      },
    ],
  },
  contact: {
    label: "contact",
    title: "Let's build something together?",
    description:
      "Open to projects, freelancing and collaborations. If you have an idea or need speed without giving up quality, let's talk.",
    emailButton: "Send email",
    whatsappButton: "WhatsApp",
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

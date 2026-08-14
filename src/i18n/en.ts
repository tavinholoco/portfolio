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
    repo: "Repo",
    demo: "Demo",
    allOnGithub: "View all projects on GitHub",
    inDevelopment: "In development",
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
          "News portal with daily AI-generated content. Turborepo monorepo with a Fastify API and a Next.js frontend integrated with Google Gemini.",
        category: "fullstack",
        inDevelopment: true,
        tags: ["Next.js", "Fastify", "Gemini API", "Turborepo"],
      },
      {
        repo: "NetsheetEngine",
        title: "Netsheet Engine",
        description:
          "Character sheet and PRD suite for Cyberpunk 2020, with React 19, Express and Supabase, from CRUD to product documentation.",
        category: "fullstack",
        inDevelopment: true,
        tags: ["React 19", "Express", "Supabase"],
      },
      {
        repo: "repertorio-progressivo",
        title: "Repertório Progressivo",
        description:
          "Mobile study organization app with push notifications and a suite of 144 automated tests (Jest), built with React Native, Expo and TypeScript.",
        category: "mobile",
        tags: ["React Native", "Expo", "Jest", "Push notifications"],
      },
      {
        repo: "Trak-Acessoria",
        title: "Trak Assessoria",
        description:
          "Institutional landing page for an accounting firm, with Next.js 16, Tailwind v4, Vitest and Playwright, E2E tests and responsive design.",
        category: "landing",
        tags: ["Next.js 16", "Tailwind v4", "Vitest", "Playwright"],
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

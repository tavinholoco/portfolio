import dandarkness from "@/assets/projects/dandarkness.webp";

import type { Dict } from "./index";

/** Website copy in English. */
export const en: Dict = {
  meta: {
    name: "Pedro Levi",
    knowsAbout: [
      "Web design",
      "Landing pages",
      "Web development",
      "Mobile development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "React Native",
      "Generative AI",
    ],
    ogSiteName: "Pedro Levi",
    siteAlternateName: "Pedro Levi | Portfolio",
  },
  routes: {
    home: {
      title: "Pedro Levi | Web designer for clients across Brazil",
      description:
        "Full stack developer in Rancharia, SP, Brazil. I build landing pages and portfolios for clients across Brazil.",
    },
    websites: {
      title: "Websites and landing pages | Pedro Levi",
      description:
        "Hand-built websites, landing pages and portfolios, fast and ready for mobile. Based in western São Paulo state, working across Brazil on WhatsApp.",
    },
    clients: {
      title: "Clients | Pedro Levi",
      description:
        "Work done for clients, with the goal of each one and what was built.",
    },
    projects: {
      title: "Projects | Pedro Levi",
      description:
        "Personal projects across web, mobile and AI. Each one starts from the problem it solved.",
    },
    info: {
      title: "About | Pedro Levi",
      description:
        "Who I am, how I got here, what I work with and where to find me.",
    },
    contact: {
      title: "Contact | Pedro Levi",
      description:
        "Want a website, or are you hiring? Reach me on WhatsApp, in Rancharia, SP, Brazil, or by email.",
    },
  },
  notFound: {
    title: "Page not found",
    description: "The address you opened does not exist or has moved.",
    back: "Back to the start",
  },
  nav: {
    openMenu: "Open menu",
    sheetTitle: "Menu",
    sheetDescription: "Portfolio navigation",
    mainAria: "Main navigation",
    mobileAria: "Mobile navigation",
    skipToContent: "Skip to content",
  },
  hero: {
    role: "Full Stack Developer",
    name: "Pedro Levi",
    heading: "Pedro Levi, web designer for clients across Brazil",
    downloadCv: "Download CV",
    pitch: "I build websites and landing pages for professionals and small businesses.",
    pitchCta: "See how it works",
  },
  websites: {
    heading: "Websites and landing pages",
    intro: [
      "I'm Pedro Levi, a developer from Rancharia, SP, Brazil.",
      "I build websites, landing pages and portfolios for professionals and small businesses that need to be found online.",
      "I work with Rancharia, Presidente Prudente and all of western São Paulo state, and with clients anywhere in Brazil on WhatsApp.",
    ],
    cta: "Talk on WhatsApp",
    servicesTitle: "What I do",
    services: [
      {
        id: "landing",
        title: "Landing pages",
        description:
          "A page focused on presenting your business and taking the visitor to the contact step.",
      },
      {
        id: "portfolio",
        title: "Portfolios",
        description: "A website to show your work with your own visual identity.",
      },
    ],
    examplesTitle: "Examples of my work",
    openExample: "Open",
    examplePreviewAlt: "Site preview",
    examples: [
      {
        id: "trak",
        name: "Trak Assessoria",
        kind: "Personal project",
        description:
          "Example of an institutional landing page for an artist management agency.",
        url: "https://trak-acessoria.vercel.app",
      },
      {
        id: "dandarkness",
        name: "Dandarkness",
        kind: "Client",
        description:
          "Artistic portfolio aligned with the client's visual identity.",
        url: "https://dandarkness.vercel.app/",
      },
    ],
    stepsTitle: "How it works",
    steps: [
      {
        title: "Understand",
        description:
          "You tell me on WhatsApp what you need and who you want to reach.",
      },
      {
        title: "Plan",
        description: "I organize the content and the path to the contact step.",
      },
      {
        title: "Build",
        description: "I build the site by hand, ready for phones and computers.",
      },
      {
        title: "Test",
        description: "I check the site on a phone and a computer before publishing.",
      },
      {
        title: "Publish",
        description: "I put the site online and send you the link.",
      },
    ],
    areaTitle: "Where I work",
    area: [
      "I'm in Rancharia, in western São Paulo state, near Presidente Prudente, and I work with clients across Brazil.",
      "Everything happens on WhatsApp, so you don't have to leave where you are.",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "How do I start?",
        answer: [
          "Message me on WhatsApp and tell me what you need.",
          "Then I ask whatever is still missing and explain the next steps.",
        ],
      },
      {
        question: "What do I need to send?",
        answer: [
          "The copy, photos and logo you already have, and the contact details that should appear on the site.",
          "If something is missing, I help you organize the content.",
        ],
      },
      {
        question: "What about the domain and hosting?",
        answer: [
          "We agree on that case by case, before starting.",
          "I guide you through the choice and set everything up for the site to go live.",
        ],
      },
      {
        question: "How does payment work?",
        answer: [
          "The price and the payment terms are agreed in our conversation, before I start the work.",
        ],
      },
      {
        question: "What if I need to change something later?",
        answer: [
          "Changes after the site is live are agreed separately.",
          "Just message me on WhatsApp and tell me what needs to change.",
        ],
      },
      {
        question: "Does the site work on phones?",
        answer: [
          "Yes, every site is built to work well on phones and computers.",
          "I check both before publishing.",
        ],
      },
      {
        question: "Do I need to meet you in person?",
        answer: [
          "No, we handle everything on WhatsApp.",
          "That is how I work with clients nearby and anywhere in Brazil.",
        ],
      },
    ],
    serviceType: "Web design",
  },
  about: {
    title: "About me",
    facts: [
      { id: "formation", label: "Education", value: "Systems Analysis · UNOESTE" },
      { id: "location", label: "Location", value: "Rancharia, SP, Brazil" },
      { id: "email", label: "Email" },
      { id: "languages", label: "Languages", value: "Advanced English (CCAA)" },
    ],
    summary: [
      "Graduated in Systems Analysis and Development from UNOESTE, I build web and mobile solutions, from the backend with Node.js and Fastify to the app in React Native.",
    ],
    metricsTitle: "Engineering beyond the interface",
    metrics: [
      { value: "144+", label: "automated tests" },
      { value: "4+", label: "full stack projects" },
      { value: "3", label: "AI study areas" },
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
          "Exploring generative models, automation and AI applications in practice.",
      },
    ],
  },
  projects: {
    title: "Featured projects",
    updatedAt: "updated",
    github: "GitHub",
    problemLabel: "Problem",
    solutionLabel: "Solution",
    highlightLabel: "Technical highlight",
    backToProjects: "Back to projects",
    learningsTitle: "What I learned",
    previous: "Previous",
    next: "Next",
    demoLabel: "Demo",
    previewAlt: "Project preview",
    websitesCta: "Want a site like this? See how it works",
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
        description:
          "Newra News case study: a full stack news portal with Next.js, Fastify and Gemini that generates and organizes content every day.",
        context: [
          "Newra News is a personal project: a news portal that needs fresh content every day.",
          "I built the frontend and the API in one monorepo and wired text generation to Gemini, from data modeling to daily publishing.",
        ],
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
        description:
          "Netsheet Engine case study: a character sheet suite for Cyberpunk 2020, built with React 19, Express and Supabase.",
        context: [
          "Netsheet Engine is a personal project for Cyberpunk 2020 players whose character sheets are scattered and inconsistent.",
          "I gathered the sheets into a suite with full CRUD and wrote the PRD and the product documentation alongside the code.",
        ],
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
        description:
          "Repertório Progressivo case study: a React Native study organization app with notifications, routines and 144 tests.",
        context: [
          "Repertório Progressivo is a personal project: an app for students who struggle to organize their studies and stay consistent.",
          "The app organizes study into routines and reminds the student with push notifications, backed by 144 automated tests.",
        ],
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
          "Example institutional landing page for an artist management agency, with E2E tests.",
        description:
          "Trak Assessoria case study: an example institutional landing page for an artist management agency, with Next.js 16 and E2E tests.",
        context: [
          "Trak Assessoria is a personal project: an example of an institutional landing page for an artist management agency.",
          "I built it to show how to present a service clearly and take the visitor to the contact step, with E2E tests covering the page.",
        ],
        problem: "How to present an artist management agency online with clarity.",
        solution: "Institutional landing page with Next.js 16 and Tailwind v4.",
        highlight: "E2E tests with Vitest and Playwright.",
        stack: ["Next.js 16", "Tailwind v4", "Vitest", "Playwright"],
        category: "landing",
        learnings: [
          "Building an institutional landing page with E2E tests (Vitest + Playwright).",
          "Translating what an artist management agency needs to show into design, content and code.",
          "Shipping with Next.js 16 and Tailwind v4 while keeping performance and accessibility.",
        ],
      },
    ],
  },
  clients: {
    title: "Clients",
    projectKind: "Professional project",
    responsibilitiesLabel: "Responsibilities",
    previewAlt: "Site preview",
    websitesCta: "Want a site too? See how it works",
    projects: [
      {
        name: "Dandarkness",
        description:
          "Artistic portfolio developed to present the client's work through a digital experience aligned with their visual identity.",
        responsibilities: ["Frontend", "UI", "Responsiveness", "Deploy"],
        /* Verificado no site publicado: assets em /_next/ com Turbopack e
           utilitárias do Tailwind. O ano vem do copyright do próprio site. */
        stack: ["Next.js", "Tailwind CSS", "Vercel"],
        year: "2026",
        url: "https://dandarkness.vercel.app/",
        image: dandarkness,
      },
    ],
  },
  process: {
    title: "How I work",
    description:
      "How I turn a problem into software, from first contact to deployment.",
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
    websitesCta: "See how it works",
    goToSection: "Go to contact",
    cards: [
      { id: "email", label: "Email" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "linkedin", label: "LinkedIn" },
      { id: "github", label: "GitHub" },
    ],
  },
  whatsapp: {
    service:
      "Hi, Pedro! I saw your websites page and would like to talk about a site.",
    contact: "Hi, Pedro! I'm coming from the contact page on your site.",
  },
  controls: {
    theme: "Toggle theme",
    toEnglish: "Switch to English",
    toPortuguese: "Switch to Portuguese",
  },
};

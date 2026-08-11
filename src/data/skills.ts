export type SkillBlock = {
  id: string;
  title: string;
  description: string;
  /** Nível em escala de 1 a 5 dots. */
  level: { label: string; value: number };
  skills: string[];
};

export const skillBlocks: SkillBlock[] = [
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
];

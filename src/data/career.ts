export type CareerItem = {
  id: string;
  title: string;
  org: string;
  period: string;
  status?: string;
  details: string[];
  tags: string[];
};

export const education: CareerItem[] = [
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
];

export const experience: CareerItem[] = [
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
];

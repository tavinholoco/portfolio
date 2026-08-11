/** Item de formação ou experiência da seção Trajetória. */
export type CareerItem = {
  id: string;
  title: string;
  org: string;
  period: string;
  status?: string;
  details: string[];
  tags: string[];
};

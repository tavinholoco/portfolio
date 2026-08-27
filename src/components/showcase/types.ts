import type { PalettePreset } from "@/components/background/background-config";

/**
 * Um item do showcase, servindo tanto Projetos quanto Clientes.
 *
 * Um tipo só para as duas rotas (regra 9 da seção 3.1): a diferença entre elas
 * é de dado, não de comportamento. O que muda é o destino, e por isso existe
 * `external` (regra 10): projeto próprio leva para a rota interna do case,
 * trabalho de cliente leva para o site do cliente, em aba nova.
 */
export type ShowcaseItem = {
  /** Chave estável da lista, e slug quando o destino é interno. */
  slug: string;
  title: string;
  /** O problema que o trabalho resolveu. Aparece junto do preview. */
  problem: string;
  stack: string[];
  /** Rótulo do tipo do item, ex.: "Full Stack" ou "Projeto profissional". */
  category: string;
  year: string;
  /** Ausente cai no mockup CSS de janela de browser (seção 4.4). */
  image?: string;
  /**
   * Como enquadrar a imagem no slot 16:10.
   *
   * `browser` preenche o slot (screenshot de site, também 16:10). `phone` é
   * uma print de celular, em retrato: preencher cortaria quase tudo, então ela
   * fica contida e centrada, com moldura de aparelho em volta.
   */
  imageKind?: "browser" | "phone";
  href: string;
  /** Destino externo abre em aba nova, com rel de segurança. */
  external?: boolean;
  /** Preset que o shader assume quando este item está ativo (seção 3.2). */
  palette: PalettePreset;
};

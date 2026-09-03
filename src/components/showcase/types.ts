
import type { StaticImageData } from "next/image";

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
  /**
   * O que foi feito no trabalho. Só os itens de cliente preenchem.
   *
   * Para projeto próprio a resposta é "tudo", e a linha ficaria ruído. Para
   * trabalho de cliente é informação distinta da stack: uma diz qual
   * tecnologia, a outra diz até onde foi o envolvimento.
   */
  responsibilities?: string[];
  /** Rótulo do tipo do item, ex.: "Full Stack" ou "Projeto profissional". */
  category: string;
  year: string;
  /** Ausente cai no mockup CSS de janela de browser (seção 4.4). */
  image?: StaticImageData;
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
};

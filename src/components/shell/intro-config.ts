/**
 * A abertura (§16.9 do plano): os números e as duas contas do componente,
 * fora do React para poderem ser testados.
 *
 * O Pedro escolheu o modelo "Letra a letra" no laboratório: cortina preta, as
 * letras do nome sobem uma a uma de dentro de uma máscara, o nome desliza e
 * encolhe até o lugar dele no header, e a cortina se dissolve. Uma vez por
 * sessão.
 */
export const INTRO = {
  /** Chave do sessionStorage, lida pelo script do <head> antes da pintura. */
  chave: "intro-vista",
  /** Duração da subida de cada letra, e o atraso entre uma letra e a próxima. */
  letraMs: 280,
  passoMs: 38,
  /** Respiro com o nome inteiro no centro, antes do deslize. */
  pausaMs: 180,
  /**
   * O deslize começa no máximo aqui, contado do início da navegação, mesmo
   * que o fundo ainda não tenha montado: a cortina existe para cobrir a
   * montagem, não para esperar por ela.
   */
  tetoMs: 1600,
  deslizeMs: 720,
  saidaMs: 480,
  /** Saída rápida quando a pessoa clica, tecla, rola ou toca. */
  puloMs: 200,
} as const;

/**
 * Quando o deslize começa, em ms desde o início da navegação.
 *
 * Nunca antes de as letras terminarem mais o respiro; depois disso, assim que
 * o fundo ficar pronto, com o teto valendo se ele demorar. `prontoEm` é
 * `Infinity` se o fundo não ficou pronto antes do teto, e 0 se já estava.
 */
export function momentoDoDeslize(fimLetras: number, prontoEm: number): number {
  return Math.max(
    fimLetras + INTRO.pausaMs,
    Math.min(prontoEm, INTRO.tetoMs)
  );
}

export type Retangulo = { left: number; top: number; width: number };

/**
 * O deslize em FLIP: de onde o nome está para onde está o do header, só com
 * `transform`, a partir do canto superior esquerdo (`transform-origin: 0 0`).
 *
 * A escala sai da largura. A altura acompanha porque o nome da cortina usa a
 * mesma razão de altura de linha do link do header, e é isso que faz o pouso
 * bater no pixel.
 */
export function flip(origem: Retangulo, destino: Retangulo) {
  return {
    dx: destino.left - origem.left,
    dy: destino.top - origem.top,
    escala: destino.width / origem.width,
  };
}

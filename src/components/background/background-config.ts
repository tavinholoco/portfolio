/** Cor normalizada para uniform GLSL: cada canal de 0 a 1. */
export type Rgb = readonly [number, number, number];

/** Uma paleta é o ramp de 3 cores que o campo indexa. */
export type Palette = readonly [Rgb, Rgb, Rgb];

/**
 * Fatia de luminância proibida para o backdrop das seções em `difference`.
 *
 * Com texto branco, o resultado do difference é `1 - L`, então o contraste
 * percebido é `|1 - 2L|`: ele vai a zero exatamente em L = 0.5, e o site vira
 * cinza sobre cinza sem que nada acuse erro. Esta faixa é o que o item de
 * contraste da Fase 6 exige que a paleta evite, e o teste desta pasta verifica
 * a composição inteira, não só as pontas do ramp.
 */
export const UNSAFE_LUMINANCE = { min: 0.35, max: 0.65 } as const;

/**
 * Quanto do campo entra na composição, por tema.
 *
 * Assimétrico de propósito, e a razão é aritmética, não gosto. Partindo do
 * fundo escuro (#0b0b0c) sobra folga para o campo inteiro, porque mesmo o
 * branco puro a 0.55 aterrissa em L de cerca de 0.29. Partindo do claro
 * (#f0f0f0, L de cerca de 0.87) só há 0.22 de curso até a faixa proibida.
 *
 * O claro era 0.08 até a V3.5, e com as paletas escuras esse era o teto: em
 * 0.12 a composição já entrava na faixa. O resultado era um cinza chapado, com
 * as ondas invisíveis. Com `palettesLight` a conta mudou, porque o ponto mais
 * escuro do campo deixou de ser quase preto, e o claro foi para 0.20.
 *
 * **Na §16 ele subiu para 0.40, e a folga estava para cima.** A faixa proibida
 * só limita o ponto mais escuro do ramp; acima do fundo não há limite nenhum.
 * Com o topo de cada paleta clara em branco, mais claro que `#f0f0f0`, a
 * espuma e o sol viram brilho, e o ponto escuro foi recalculado para a dose
 * nova. A amplitude de luminância do campo dobrou (0.074 para ~0.16) com a
 * mesma margem de antes, 0.045 contra 0.65. Medido pelo teste desta pasta.
 */
export const FIELD_MIX = { light: 0.4, dark: 0.55 } as const;

/**
 * Força da vinheta e amplitude do grain.
 *
 * Ambos mexem na luminância do backdrop, então não são números soltos de gosto:
 * a vinheta entra no teste de contraste junto com a mistura, e o grain fica
 * pequeno de propósito. Grain é ruído de alta frequência, ele pontilha o
 * resultado em vez de formar região contínua de luminância média, que é o que
 * de fato criaria uma zona morta no `difference`.
 */
export const VIGNETTE_STRENGTH = 0.1;
export const GRAIN_AMOUNT = 0.04;

/**
 * Evento que o fundo dispara na `window` quando fica pronto, ou quando cai no
 * fallback sem WebGL. A abertura espera por ele para subir a cortina (§16.9);
 * quem chega depois confere o atributo `data-fundo-pronto` no wrapper.
 */
export const FUNDO_PRONTO = "fundo-pronto";

/** Duração e curva do crossfade de tema, iguais a --shell-fade e --shell-ease. */
export const SHELL_FADE_MS = 900;
export const SHELL_EASE = [0.1, 0.4, 0.2, 1] as const;

/**
 * Vocabulário de paletas. Rotas e itens da lista escolhem daqui, em vez de cada
 * um trazer suas cores, para o site inteiro ter um humor coerente.
 */
export const palettes = {
  graphite: ["#0e1018", "#232838", "#454f6b"],
  cobalt: ["#05101f", "#0e3560", "#2a6ea8"],
  ember: ["#1c0c05", "#5e2a10", "#a85428"],
  moss: ["#07140e", "#183c2b", "#3f7a52"],
  plum: ["#150a1c", "#3d1560", "#7541a8"],
  sand: ["#1a1409", "#54401a", "#9c7a3c"],
  /* A do site desde a §16: no escuro é o grafite de sempre, aprovado pelo
     Pedro como estava; a diferença mora toda no set claro. */
  praia: ["#0e1018", "#232838", "#454f6b"],
} as const satisfies Record<string, readonly [string, string, string]>;

/**
 * As mesmas, claras, para o tema claro.
 *
 * Não são as escuras clareadas por acaso: o que importa é que o **ponto mais
 * escuro** de cada ramp fique alto o bastante para a composição sobre
 * `#f0f0f0` não cair na faixa proibida, na dose de `FIELD_MIX.light`. O topo é
 * branco, mais claro que o fundo, porque a folga do tema claro é para cima
 * (§16.2). As seis do vocabulário foram recalculadas para a dose de 0.40 pelo
 * mesmo método do teste, com o matiz de cada uma.
 *
 * A `praia` é a do site: mar e céu turquesa, areia creme, espuma branca. O
 * ciano e o amarelo guardam luminância alta mesmo saturados, ao contrário do
 * azul, e é isso que deixa o claro ter cor de verdade sem afundar o contraste.
 *
 * A ordem continua do escuro para o claro, como no set escuro, senão o campo
 * inverte: a espuma (v perto de 1) tem que ser o extremo claro dos dois lados.
 */
export const palettesLight = {
  graphite: ["#c0c4cd", "#e5e6ea", "#ffffff"],
  cobalt: ["#adc8de", "#e1ebf3", "#ffffff"],
  ember: ["#debead", "#f3e7e1", "#ffffff"],
  moss: ["#b2cab9", "#e4ece7", "#ffffff"],
  plum: ["#cfbee1", "#ece4f3", "#ffffff"],
  sand: ["#d2c3a6", "#f1ece4", "#ffffff"],
  praia: ["#7ed4e0", "#f7dc9a", "#ffffff"],
} as const satisfies Record<
  keyof typeof palettes,
  readonly [string, string, string]
>;

/** Nome de paleta aceito pelo motor do fundo. */
export type PalettePreset = keyof typeof palettes;

/**
 * A paleta do site, uma só.
 *
 * A v3 trocava de paleta por rota e no hover de cada item da lista. Saiu na
 * v3.5: o fundo passou a ser o mesmo em todo lugar, e as outras ficam como
 * vocabulário disponível, ainda cobertas pelo teste de contraste, para o dia
 * em que alguém quiser trocar a do site inteiro numa linha. Na §16 a do site
 * passou de `graphite` para `praia`, que só difere no tema claro.
 */
export const DEFAULT_PALETTE: PalettePreset = "praia";

/** Converte `#rrggbb` (ou `#rgb`) para canais de 0 a 1. */
export function hexToRgb(hex: string): Rgb {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Cor hexadecimal inválida: ${hex}`);
  }

  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

/** A paleta nomeada, já normalizada para o uniform. */
export function paletteFor(preset: PalettePreset, light = false): Palette {
  const fonte = light ? palettesLight[preset] : palettes[preset];
  return fonte.map(hexToRgb) as unknown as Palette;
}

/** Luminância relativa (WCAG), usada para decidir tema e checar contraste. */
export function relativeLuminance([r, g, b]: Rgb): number {
  const linear = (channel: number) =>
    channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Verdadeiro quando a cor de fundo é a do tema claro. */
export function isLightBack(back: Rgb): boolean {
  return relativeLuminance(back) > 0.5;
}

/** Dose de campo apropriada à cor de fundo, pela luminância dela. */
export function mixForBack(back: Rgb): number {
  return isLightBack(back) ? FIELD_MIX.light : FIELD_MIX.dark;
}

/**
 * Alvo da vinheta: branco no tema claro, preto no escuro. Vai como uniform e é
 * interpolado junto com o tema, senão viraria no meio do crossfade.
 */
export function vignetteTargetForBack(back: Rgb): number {
  return isLightBack(back) ? 1 : 0;
}

/** Interpolação linear por canal, no mesmo espaço em que o shader mistura. */
export function lerpRgb(from: Rgb, to: Rgb, t: number): Rgb {
  const k = Math.min(Math.max(t, 0), 1);
  return [
    from[0] + (to[0] - from[0]) * k,
    from[1] + (to[1] - from[1]) * k,
    from[2] + (to[2] - from[2]) * k,
  ];
}

/** Interpola as 3 cores do ramp de uma vez, para o tween de hover da lista. */
/**
 * Reproduz em JS o que o passe de composição faz com a cor: mistura o fundo com
 * a cor do campo em espaço sRGB (é assim que o `mix` do GLSL opera aqui, sem
 * workflow linear) e devolve a luminância do resultado. É a função que o teste
 * de contraste usa para provar que nenhuma paleta cai na faixa proibida.
 */
/** Reproduz a vinheta do passe de composição: puxa a cor para o alvo do tema. */
export function applyVignette(color: Rgb, target: number, amount: number): Rgb {
  return lerpRgb(color, [target, target, target], amount);
}

/**
 * Avaliador de cubic-bezier do CSS.
 *
 * O tween de tema roda em rAF (F6), e precisa da mesma curva que o CSS usa no
 * `:root`, senão o fundo e o shader chegam ao destino em ritmos diferentes
 * durante os 900ms. Newton-Raphson resolve t para um x dado, com bisseção como
 * rede quando a derivada é pequena demais.
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (x: number) => number {
  const curve = (a: number, b: number, t: number) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  };
  const slope = (a: number, b: number, t: number) => {
    const u = 1 - t;
    return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
  };

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 6; i++) {
      const error = curve(x1, x2, t) - x;
      if (Math.abs(error) < 1e-5) return curve(y1, y2, t);
      const derivative = slope(x1, x2, t);
      if (Math.abs(derivative) < 1e-6) break;
      t -= error / derivative;
    }

    let low = 0;
    let high = 1;
    t = x;
    while (high - low > 1e-5) {
      if (curve(x1, x2, t) < x) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return curve(y1, y2, t);
  };
}

/** A curva de --shell-ease, pronta para o tween. */
export const easeShell = cubicBezier(...SHELL_EASE);

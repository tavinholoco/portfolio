import type { RouteId } from "@/lib/routes";

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
 * Assimétrico de propósito, e a razão é aritmética, não gosto. Partindo de um
 * fundo claro (#f0f0f0, L de cerca de 0.87), puxar para qualquer cor mais
 * escura atravessa a faixa proibida; só uma dose pequena mantém o resultado
 * acima dela. Partindo do fundo escuro (#0b0b0c) sobra folga para o campo
 * inteiro, porque mesmo o branco puro a 0.55 aterrissa em L de cerca de 0.29.
 * Na prática: tinta no tema claro, campo cheio no tema escuro.
 */
export const FIELD_MIX = { light: 0.08, dark: 0.55 } as const;

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

/** Duração e curva do crossfade de tema, iguais a --shell-fade e --shell-ease. */
export const SHELL_FADE_MS = 900;
export const SHELL_EASE = [0.1, 0.4, 0.2, 1] as const;

/** Troca de paleta no hover da lista: mais curta que a troca de tema. */
export const PALETTE_FADE_MS = 600;

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
} as const satisfies Record<string, readonly [string, string, string]>;

/** Nome de paleta aceito por `setPalette` e pelos itens do showcase. */
export type PalettePreset = keyof typeof palettes;

/** Paleta de cada rota. O humor do site muda conforme se navega. */
export const paletteForRoute: Record<RouteId, PalettePreset> = {
  home: "graphite",
  clients: "ember",
  projects: "cobalt",
  info: "moss",
  contact: "plum",
};

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
export function paletteFor(preset: PalettePreset): Palette {
  const [a, b, c] = palettes[preset];
  return [hexToRgb(a), hexToRgb(b), hexToRgb(c)];
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
export function lerpPalette(from: Palette, to: Palette, t: number): Palette {
  return [
    lerpRgb(from[0], to[0], t),
    lerpRgb(from[1], to[1], t),
    lerpRgb(from[2], to[2], t),
  ];
}

/**
 * Reproduz em JS o que o passe de composição faz com a cor: mistura o fundo com
 * a cor do campo em espaço sRGB (é assim que o `mix` do GLSL opera aqui, sem
 * workflow linear) e devolve a luminância do resultado. É a função que o teste
 * de contraste usa para provar que nenhuma paleta cai na faixa proibida.
 */
export function composedLuminance(back: Rgb, field: Rgb, mix: number): number {
  return relativeLuminance(lerpRgb(back, field, mix));
}

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

/**
 * O que o resto do site precisa poder pedir ao fundo.
 *
 * Um handle mínimo em vez do `BackgroundRenderer` inteiro: quem chama daqui não
 * tem nada a ver com WebGL, e o tipo estreito impede que alguém saia mexendo no
 * ciclo de vida do motor de fora do componente que o criou.
 */
export type BackgroundHandle = {
  setProgress(progress: number): void;
  setPalette(preset: PalettePreset, immediate?: boolean): void;
};

let activeBackground: BackgroundHandle | null = null;

/**
 * Registro do fundo ativo, num singleton de módulo e não em contexto do React.
 *
 * A razão é frequência: o progresso de rolagem chega a cada frame. Passar isso
 * por estado ou contexto do React re-renderizaria a árvore 60 vezes por segundo
 * para atualizar um uniform de shader, que é justamente o trabalho que não
 * precisa passar pelo React.
 *
 * `null` é normal e esperado: acontece antes do canvas montar, e depois que ele
 * desmonta. Quem chama sempre usa encadeamento opcional.
 */
export function setActiveBackground(handle: BackgroundHandle | null): void {
  activeBackground = handle;
}

export function getActiveBackground(): BackgroundHandle | null {
  return activeBackground;
}

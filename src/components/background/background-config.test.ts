import { describe, expect, it } from "vitest";

import {
  FIELD_MIX,
  GRAIN_AMOUNT,
  SHELL_EASE,
  UNSAFE_LUMINANCE,
  VIGNETTE_STRENGTH,
  applyVignette,
  cubicBezier,
  easeShell,
  hexToRgb,
  isLightBack,
  lerpRgb,
  mixForBack,
  paletteFor,
  DEFAULT_PALETTE,
  palettes,
  palettesLight,
  relativeLuminance,
  vignetteTargetForBack,
  type PalettePreset,
  type Rgb,
} from "./background-config";

const LIGHT_BACK = hexToRgb("#f0f0f0");
const DARK_BACK = hexToRgb("#0b0b0c");

describe("hexToRgb", () => {
  it("converte 6 dígitos para canais de 0 a 1", () => {
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
    expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
  });

  it("aceita a forma curta de 3 dígitos", () => {
    expect(hexToRgb("#fff")).toEqual(hexToRgb("#ffffff"));
    expect(hexToRgb("#08f")).toEqual(hexToRgb("#0088ff"));
  });

  it("tolera o cerquilha ausente e espaços em volta", () => {
    expect(hexToRgb("  f0f0f0 ")).toEqual(hexToRgb("#f0f0f0"));
  });

  it("rejeita entrada inválida em vez de devolver cor silenciosamente errada", () => {
    expect(() => hexToRgb("#12345")).toThrow();
    expect(() => hexToRgb("nao-e-cor")).toThrow();
    expect(() => hexToRgb("")).toThrow();
  });
});

describe("relativeLuminance", () => {
  it("ancora nos extremos", () => {
    expect(relativeLuminance([0, 0, 0])).toBe(0);
    expect(relativeLuminance([1, 1, 1])).toBeCloseTo(1, 6);
  });

  it("pesa o verde acima do vermelho e do azul", () => {
    const green = relativeLuminance([0, 1, 0]);
    expect(green).toBeGreaterThan(relativeLuminance([1, 0, 0]));
    expect(green).toBeGreaterThan(relativeLuminance([0, 0, 1]));
  });
});

describe("tema derivado da cor de fundo", () => {
  it("classifica os dois fundos do site", () => {
    expect(isLightBack(LIGHT_BACK)).toBe(true);
    expect(isLightBack(DARK_BACK)).toBe(false);
  });

  it("dá dose pequena de campo no claro e dose cheia no escuro", () => {
    expect(mixForBack(LIGHT_BACK)).toBe(FIELD_MIX.light);
    expect(mixForBack(DARK_BACK)).toBe(FIELD_MIX.dark);
    expect(FIELD_MIX.light).toBeLessThan(FIELD_MIX.dark);
  });

  it("aponta a vinheta para o extremo do próprio tema", () => {
    expect(vignetteTargetForBack(LIGHT_BACK)).toBe(1);
    expect(vignetteTargetForBack(DARK_BACK)).toBe(0);
  });
});

describe("interpolação", () => {
  it("lerpRgb devolve as pontas e o meio", () => {
    const from: Rgb = [0, 0, 0];
    const to: Rgb = [1, 0.5, 0.25];
    expect(lerpRgb(from, to, 0)).toEqual(from);
    expect(lerpRgb(from, to, 1)).toEqual(to);
    expect(lerpRgb(from, to, 0.5)).toEqual([0.5, 0.25, 0.125]);
  });

  it("lerpRgb prende t fora de 0 a 1", () => {
    const from: Rgb = [0, 0, 0];
    const to: Rgb = [1, 1, 1];
    expect(lerpRgb(from, to, -3)).toEqual(from);
    expect(lerpRgb(from, to, 7)).toEqual(to);
  });

});

describe("cubicBezier", () => {
  it("ancora nos extremos e prende fora do domínio", () => {
    expect(easeShell(0)).toBe(0);
    expect(easeShell(1)).toBe(1);
    expect(easeShell(-1)).toBe(0);
    expect(easeShell(2)).toBe(1);
  });

  it("é monotônico", () => {
    let previous = -Infinity;
    for (let i = 0; i <= 50; i++) {
      const value = easeShell(i / 50);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("reproduz a identidade quando os controles estão na diagonal", () => {
    const linear = cubicBezier(0.25, 0.25, 0.75, 0.75);
    for (const x of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      expect(linear(x)).toBeCloseTo(x, 3);
    }
  });

  it("--shell-ease sai rápido, como o cubic-bezier do CSS pede", () => {
    /* y1 (0.4) acima de x1 (0.1) significa curva adiantada no começo. */
    expect(SHELL_EASE).toEqual([0.1, 0.4, 0.2, 1]);
    expect(easeShell(0.2)).toBeGreaterThan(0.2);
    expect(easeShell(0.5)).toBeGreaterThan(0.5);
  });
});

describe("paletas", () => {
  it("a paleta padrão do site existe", () => {
    expect(palettes[DEFAULT_PALETTE]).toBeDefined();
  });

  it("toda paleta tem exatamente 3 cores hexadecimais válidas", () => {
    for (const preset of Object.keys(palettes) as PalettePreset[]) {
      const ramp = palettes[preset];
      expect(ramp).toHaveLength(3);
      for (const color of ramp) expect(() => hexToRgb(color)).not.toThrow();
    }
  });

  it("o ramp vai do escuro para o claro nos dois sets, senão o campo inverte", () => {
    for (const preset of Object.keys(palettes) as PalettePreset[]) {
      for (const light of [false, true]) {
        const [a, b, c] = paletteFor(preset, light);
        expect(relativeLuminance(a)).toBeLessThan(relativeLuminance(b));
        expect(relativeLuminance(b)).toBeLessThan(relativeLuminance(c));
      }
    }
  });

  it("o set claro tem as mesmas chaves do escuro", () => {
    expect(Object.keys(palettesLight).sort()).toEqual(
      Object.keys(palettes).sort()
    );
  });
});

/**
 * O teste que sustenta o item de contraste da Fase 6.
 *
 * Com texto branco, o `difference` devolve `1 - L`, então o contraste percebido
 * é `|1 - 2L|` e vai a zero em L = 0.5. Aqui a composição inteira é reproduzida
 * em JS (mistura com o fundo, vinheta e amplitude do grain) e varrida ao longo
 * de todo o ramp, não só nas pontas: uma paleta que caísse na faixa proibida
 * deixaria o texto invisível sem gerar erro nenhum no navegador.
 */
describe("contraste do backdrop em mix-blend-mode: difference", () => {
  /*
   * Cada tema varre o SEU set de paletas. Varrer o escuro contra o fundo claro
   * provaria uma combinação que o site nunca compõe, e deixaria de provar a que
   * ele compõe de verdade.
   */
  const themes = [
    { name: "claro", back: LIGHT_BACK, mix: FIELD_MIX.light, light: true },
    { name: "escuro", back: DARK_BACK, mix: FIELD_MIX.dark, light: false },
  ] as const;

  function rampAt(preset: PalettePreset, t: number, light: boolean): Rgb {
    const [a, b, c] = paletteFor(preset, light);
    return t < 0.5 ? lerpRgb(a, b, t * 2) : lerpRgb(b, c, (t - 0.5) * 2);
  }

  for (const preset of Object.keys(palettes) as PalettePreset[]) {
    for (const theme of themes) {
      it(`${preset} no tema ${theme.name} nunca entra na faixa proibida`, () => {
        const target = vignetteTargetForBack(theme.back);

        for (let i = 0; i <= 40; i++) {
          const field = rampAt(preset, i / 40, theme.light);
          const composed = lerpRgb(theme.back, field, theme.mix);

          for (const vignette of [0, 0.5, 1]) {
            const shaded = applyVignette(
              composed,
              target,
              VIGNETTE_STRENGTH * vignette
            );

            for (const grain of [-GRAIN_AMOUNT / 2, 0, GRAIN_AMOUNT / 2]) {
              const luminance = relativeLuminance([
                Math.min(Math.max(shaded[0] + grain, 0), 1),
                Math.min(Math.max(shaded[1] + grain, 0), 1),
                Math.min(Math.max(shaded[2] + grain, 0), 1),
              ]);

              const safe =
                luminance < UNSAFE_LUMINANCE.min ||
                luminance > UNSAFE_LUMINANCE.max;
              expect(
                safe,
                `L=${luminance.toFixed(3)} caiu na faixa proibida`
              ).toBe(true);
            }
          }
        }
      });
    }
  }

});

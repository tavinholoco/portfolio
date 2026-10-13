import { describe, expect, it } from "vitest";

import {
  FIELD_TARGET_MAX,
  FIELD_TARGET_MAX_SMALL,
  MAX_DPR,
  MAX_FPS,
  POINTER_TIME_CONSTANT,
  SMALL_SCREEN_WIDTH,
  SUN_TIME_CONSTANT,
  fieldTargetSize,
  shouldRenderFrame,
} from "./renderer";

/**
 * Simula o rAF de uma tela e conta quantos tiques viram quadro em 1 s. O
 * jitter imita o que o navegador entrega: timestamps no vsync, com desvio de
 * décimos de milissegundo para os dois lados.
 */
function quadrosPorSegundo(hz: number, jitterMs = 0): number {
  let ultimo = 0;
  let quadros = 0;
  for (let i = 1; i <= hz; i++) {
    const desvio = jitterMs * (i % 2 === 0 ? 1 : -1);
    const agora = 1000 + (i * 1000) / hz + desvio;
    if (shouldRenderFrame(agora, ultimo, MAX_FPS)) {
      ultimo = agora;
      quadros++;
    }
  }
  return quadros;
}

/**
 * Só a aritmética pura do motor é testada aqui. O resto da classe precisa de
 * contexto WebGL, que o Vitest em `environment: node` não tem, e é verificado
 * no navegador (canvas com dimensões maiores que zero e console limpo).
 */
describe("fieldTargetSize", () => {
  it("põe o lado maior no teto em tela paisagem", () => {
    const size = fieldTargetSize(1920, 1080, FIELD_TARGET_MAX);
    /* 640 * 1080/1920. Subiu junto com o teto na v3.5. */
    expect(size.width).toBe(FIELD_TARGET_MAX);
    expect(size.height).toBe(360);
  });

  it("põe o lado maior no teto em tela retrato", () => {
    const size = fieldTargetSize(390, 844, FIELD_TARGET_MAX_SMALL);
    /* 256 * 390/844, arredondado. */
    expect(size.height).toBe(FIELD_TARGET_MAX_SMALL);
    expect(size.width).toBe(118);
  });

  it("preserva a proporção da tela dentro de um pixel", () => {
    for (const [width, height] of [
      [1440, 900],
      [2560, 1440],
      [375, 812],
      [768, 1024],
    ]) {
      const size = fieldTargetSize(width, height, FIELD_TARGET_MAX);
      expect(size.width / size.height).toBeCloseTo(width / height, 1);
    }
  });

  it("trata o quadrado como paisagem, sem cair em caso especial", () => {
    expect(fieldTargetSize(500, 500, 320)).toEqual({ width: 320, height: 320 });
  });

  it("nunca devolve dimensão degenerada, mesmo em proporção extrema", () => {
    const wide = fieldTargetSize(4000, 3, FIELD_TARGET_MAX);
    expect(wide.height).toBeGreaterThanOrEqual(2);

    const tall = fieldTargetSize(3, 4000, FIELD_TARGET_MAX);
    expect(tall.width).toBeGreaterThanOrEqual(2);
  });

  it("sobrevive a tamanho zero, que acontece antes do primeiro layout", () => {
    const size = fieldTargetSize(0, 0, FIELD_TARGET_MAX);
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });
});

describe("limites de custo do motor", () => {
  it("mantém os tetos que o checklist da Fase 6 exige", () => {
    expect(MAX_DPR).toBe(1.5);
    expect(FIELD_TARGET_MAX).toBeLessThanOrEqual(640);
    expect(SMALL_SCREEN_WIDTH).toBe(768);
  });

  it("tela pequena renderiza um alvo menor que a grande", () => {
    expect(FIELD_TARGET_MAX_SMALL).toBeLessThan(FIELD_TARGET_MAX);
  });

  it("não passa de 30 quadros por segundo", () => {
    expect(MAX_FPS).toBeLessThanOrEqual(30);
  });
});

describe("shouldRenderFrame", () => {
  it("desenha o primeiro tique, antes de existir quadro anterior", () => {
    expect(shouldRenderFrame(16.7, 0, MAX_FPS)).toBe(true);
  });

  it("desenha um tique sim, um não, numa tela de 60 Hz", () => {
    expect(quadrosPorSegundo(60)).toBe(30);
  });

  it("desenha um a cada quatro numa tela de 120 Hz, em vez de 120 quadros", () => {
    expect(quadrosPorSegundo(120)).toBe(30);
  });

  it("não cai para 20 fps com o jitter do vsync numa tela de 60 Hz", () => {
    /* Sem a folga, o tique que chega a 33.2 ms seria pulado e o próximo só
       viria em 50 ms. */
    expect(quadrosPorSegundo(60, 0.3)).toBe(30);
  });

  it("fica perto do teto em telas cuja taxa não divide 30, sem passar dele", () => {
    for (const hz of [75, 90, 144, 165, 240]) {
      const quadros = quadrosPorSegundo(hz);
      expect(quadros, `${hz} Hz`).toBeLessThanOrEqual(MAX_FPS);
      expect(quadros, `${hz} Hz`).toBeGreaterThanOrEqual(24);
    }
  });

  it("volta a desenhar logo depois de uma pausa longa", () => {
    expect(shouldRenderFrame(60_000, 1000, MAX_FPS)).toBe(true);
  });
});

describe("ponteiros", () => {
  it("o sol segue o mouse bem mais devagar que o horizonte", () => {
    expect(SUN_TIME_CONSTANT).toBeGreaterThanOrEqual(POINTER_TIME_CONSTANT * 8);
  });
});

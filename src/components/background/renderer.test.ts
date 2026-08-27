import { describe, expect, it } from "vitest";

import {
  FIELD_TARGET_MAX,
  FIELD_TARGET_MAX_SMALL,
  MAX_DPR,
  SMALL_SCREEN_WIDTH,
  fieldTargetSize,
} from "./renderer";

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
});

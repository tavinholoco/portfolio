import { describe, expect, it } from "vitest";

import { GRAIN_SIZE, createGrainBuffer } from "./grain-texture";

/**
 * O wrapper que cria a `Texture` do OGL não é testado aqui de propósito: o
 * Vitest roda em `environment: node` e não tem contexto GL nenhum. Separar o
 * buffer puro do wrapper é justamente o que E8 pede, e é o buffer que carrega
 * toda a lógica.
 */
describe("createGrainBuffer", () => {
  it("devolve RGBA do tamanho pedido", () => {
    const buffer = createGrainBuffer(8);
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(buffer).toHaveLength(8 * 8 * 4);
  });

  it("usa 256 como lado padrão da textura", () => {
    expect(createGrainBuffer(GRAIN_SIZE)).toHaveLength(
      GRAIN_SIZE * GRAIN_SIZE * 4
    );
  });

  it("é monocromático: os três canais de cor são iguais", () => {
    const buffer = createGrainBuffer(16);
    for (let i = 0; i < buffer.length; i += 4) {
      expect(buffer[i + 1]).toBe(buffer[i]);
      expect(buffer[i + 2]).toBe(buffer[i]);
    }
  });

  it("é totalmente opaco", () => {
    const buffer = createGrainBuffer(16);
    for (let i = 3; i < buffer.length; i += 4) {
      expect(buffer[i]).toBe(255);
    }
  });

  it("é determinístico para a mesma semente", () => {
    expect(Array.from(createGrainBuffer(16, 42))).toEqual(
      Array.from(createGrainBuffer(16, 42))
    );
  });

  it("muda de resultado com semente diferente", () => {
    expect(Array.from(createGrainBuffer(16, 1))).not.toEqual(
      Array.from(createGrainBuffer(16, 2))
    );
  });

  it("espalha os valores pela faixa, em vez de concentrar num tom", () => {
    const buffer = createGrainBuffer(64);
    const values: number[] = [];
    for (let i = 0; i < buffer.length; i += 4) values.push(buffer[i]);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

    expect(min).toBeLessThan(16);
    expect(max).toBeGreaterThan(239);
    /* Grain centrado: o shader subtrai 0.5, então a média precisa ficar no meio. */
    expect(mean).toBeGreaterThan(112);
    expect(mean).toBeLessThan(144);
  });

  it("rejeita lado inválido em vez de alocar buffer sem sentido", () => {
    expect(() => createGrainBuffer(0)).toThrow();
    expect(() => createGrainBuffer(-8)).toThrow();
    expect(() => createGrainBuffer(8.5)).toThrow();
  });
});

import { describe, expect, it } from "vitest";

import { flip, INTRO, momentoDoDeslize } from "./intro-config";

describe("momentoDoDeslize", () => {
  const letras = 650;

  it("com o fundo pronto antes das letras, desliza depois do respiro", () => {
    expect(momentoDoDeslize(letras, 0)).toBe(letras + INTRO.pausaMs);
    expect(momentoDoDeslize(letras, 400)).toBe(letras + INTRO.pausaMs);
  });

  it("com o fundo pronto depois, desliza quando ele fica pronto", () => {
    expect(momentoDoDeslize(letras, 1200)).toBe(1200);
  });

  it("com o fundo atrasado, o teto vale: a cortina não espera para sempre", () => {
    expect(momentoDoDeslize(letras, Infinity)).toBe(INTRO.tetoMs);
    expect(momentoDoDeslize(letras, 5000)).toBe(INTRO.tetoMs);
  });

  it("em aparelho lento, nunca corta as letras no meio", () => {
    expect(momentoDoDeslize(2000, Infinity)).toBe(2000 + INTRO.pausaMs);
  });

  it("o teto deixa as letras inteiras e o respiro caberem", () => {
    const letrasInteiras = INTRO.letraMs + INTRO.passoMs * 9;
    expect(letrasInteiras + INTRO.pausaMs).toBeLessThan(INTRO.tetoMs);
  });
});

describe("flip", () => {
  it("leva o canto e a largura de um retângulo ao outro", () => {
    const origem = { left: 380, top: 306, width: 516 };
    const destino = { left: 57.6, top: 57.6, width: 172.5 };
    const { dx, dy, escala } = flip(origem, destino);
    expect(origem.left + dx).toBeCloseTo(destino.left);
    expect(origem.top + dy).toBeCloseTo(destino.top);
    expect(origem.width * escala).toBeCloseTo(destino.width);
  });
});

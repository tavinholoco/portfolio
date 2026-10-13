import { describe, expect, it } from "vitest";

import {
  DETAIL_SIZE,
  FIELD_TARGET_MAX,
  FIELD_TARGET_MAX_SMALL,
  FRAME_GUARD,
  MAX_DPR,
  MAX_FPS,
  POINTER_TIME_CONSTANT,
  SMALL_SCREEN_WIDTH,
  SUN_TIME_CONSTANT,
  fieldTargetSize,
  isSoftwareRenderer,
  shouldDowngrade,
  shouldRenderFrame,
  yieldToMain,
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

describe("isSoftwareRenderer", () => {
  it("reconhece os renderizadores sem GPU", () => {
    for (const nome of [
      /* O do Chromium sem janela, que é onde o Lighthouse roda. */
      "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)",
      "Google SwiftShader",
      "llvmpipe (LLVM 15.0.7, 256 bits)",
      "Mesa softpipe",
      "Microsoft Basic Render Driver",
    ]) {
      expect(isSoftwareRenderer(nome), nome).toBe(true);
    }
  });

  it("não confunde GPU de verdade com software", () => {
    for (const nome of [
      "ANGLE (AMD, AMD Radeon RX 6600 (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
      "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)",
      "Apple GPU",
      "Mali-G52 MC2",
      "Adreno (TM) 610",
    ]) {
      expect(isSoftwareRenderer(nome), nome).toBe(false);
    }
  });
});

describe("shouldDowngrade", () => {
  const janela = (ms: number) => new Array<number>(FRAME_GUARD.window).fill(ms);

  it("não desce com a máquina dando conta dos 30 fps", () => {
    expect(shouldDowngrade(janela(33.3))).toBe(false);
  });

  it("desce quando a mediana da janela passa do limite", () => {
    expect(shouldDowngrade(janela(60))).toBe(true);
  });

  it("não decide antes de a janela encher", () => {
    expect(shouldDowngrade(janela(60).slice(1))).toBe(false);
  });

  it("não desce por causa de picos isolados", () => {
    /* Um terço da janela em pico de hidratação ainda deixa a mediana em 33. */
    const picos = janela(33.3).map((ms, i) => (i % 3 === 0 ? 200 : ms));
    expect(shouldDowngrade(picos)).toBe(false);
  });

  it("o limite fica acima do intervalo do teto, e a pausa acima do limite", () => {
    expect(FRAME_GUARD.slowIntervalMs).toBeGreaterThan(1000 / MAX_FPS);
    expect(FRAME_GUARD.pauseMs).toBeGreaterThan(FRAME_GUARD.slowIntervalMs);
  });
});

describe("textura de ruído e montagem", () => {
  it("a textura assada tem lado potência de 2, que o REPEAT do WebGL1 exige", () => {
    expect(Math.log2(DETAIL_SIZE) % 1).toBe(0);
  });

  it("yieldToMain resolve, com ou sem scheduler.yield", async () => {
    await expect(yieldToMain()).resolves.toBeUndefined();
  });
});

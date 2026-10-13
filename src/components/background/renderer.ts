import type {
  Mesh,
  Program,
  RenderTarget,
  Renderer,
  Texture,
  Triangle,
} from "ogl";

import {
  DEFAULT_PALETTE,
  GRAIN_AMOUNT,
  SHELL_FADE_MS,
  VIGNETTE_STRENGTH,
  easeShell,
  hexToRgb,
  mixForBack,
  isLightBack,
  paletteFor,
  vignetteTargetForBack,
  type PalettePreset,
  type Rgb,
} from "./background-config";
import { GRAIN_SIZE, createGrainTexture } from "./grain-texture";
import { bakeFragment } from "./shaders/bake";
import { compositeFragment } from "./shaders/composite";
import { fieldFragment } from "./shaders/field";
import { fullscreenVertex } from "./shaders/vertex";

/**
 * As classes do OGL entram por parâmetro, não por import estático.
 *
 * O motivo é E1: `ssr: false` é inválido em Server Component no Next 16, então
 * o caminho correto é o componente cliente renderizar o `<canvas/>` no SSR
 * normalmente e trazer o `ogl` com `await import()` dentro do efeito. Recebendo
 * o módulo por parâmetro, esta classe não puxa o `ogl` para o bundle inicial e
 * continua importável em ambiente sem WebGL.
 */
export type OglModule = {
  Renderer: typeof Renderer;
  Program: typeof Program;
  Mesh: typeof Mesh;
  Triangle: typeof Triangle;
  RenderTarget: typeof RenderTarget;
  Texture: typeof Texture;
};

/** Teto de densidade de pixel. Acima disso o custo sobe sem ganho visível. */
export const MAX_DPR = 1.5;

/**
 * Lado maior do RenderTarget do campo.
 *
 * O campo é renderizado pequeno e esticado com filtro LINEAR: a interpolação
 * bilinear do hardware faz o papel do blur de graça. É o que dispensa o passe
 * de blur da referência e derruba o fill rate.
 *
 * Subiram de 320 e 200 na v3.5, junto com a troca do campo de noise pelo campo
 * de ondas. O borrão de graça era virtude enquanto o campo era suave: ele
 * derretia justamente a aresta de espuma que dá forma sólida às ondas.
 *
 * **Os dois valores são medidos, não escolhidos.** A primeira tentativa foi
 * 640 e 384, e o Lighthouse mobile da home caiu de 93 para 85. Um controle com
 * o shader novo e a resolução antiga deu 93 de novo, com LCP e TBT iguais aos
 * do baseline: o campo de ondas em si não custa nada, o custo é só resolução.
 * Como o desktop lê o teto grande e o mobile lê o pequeno, só o pequeno
 * precisava baixar. Em 256 o mobile empata com o baseline e o desktop vai a
 * 100; em 288 o mobile já cai para 91.
 *
 * Ou seja: **mexer em `FIELD_TARGET_MAX_SMALL` custa Lighthouse mobile, mexer
 * em `FIELD_TARGET_MAX` não.** Se um dia precisar de mais nitidez, é o grande
 * que tem folga.
 */
export const FIELD_TARGET_MAX = 640;
export const FIELD_TARGET_MAX_SMALL = 256;

/** Abaixo desta largura de viewport, DPR 1 e alvo menor (checklist da Fase 6). */
export const SMALL_SCREEN_WIDTH = 768;

/**
 * Constante de tempo da perseguição do ponteiro, em segundos.
 *
 * Suavização exponencial em vez de um fator fixo por frame: com fator fixo, o
 * ponteiro chegaria ao alvo no dobro da velocidade num monitor de 120Hz, e o
 * fundo teria personalidade diferente dependendo do hardware de quem visita.
 */
export const POINTER_TIME_CONSTANT = 0.25;

/**
 * Constante de tempo do sol, que tem ponteiro próprio.
 *
 * O Pedro achou o sol rápido demais seguindo o mouse (§16 do plano). Com 3 s
 * ele leva uns 9 s para assentar, então lê como deriva e não como reação.
 */
export const SUN_TIME_CONSTANT = 3;

/**
 * Teto de quadros por segundo do fundo.
 *
 * O movimento mais rápido da cena é a crista perto da praia, a uns 18 px/s: a
 * 30 fps isso dá 0.6 px por quadro, abaixo do que o olho separa. Sem o teto o
 * rAF segue a tela, e um celular de 120 Hz desenhava 120 quadros por segundo,
 * quatro vezes o necessário.
 *
 * **Medido, não estimado** (§16 do plano). No Chromium sem GPU, que é onde o
 * Lighthouse roda e onde o WebGL vira trabalho de CPU pelo SwiftShader, o fundo
 * sem teto tirava 16% da vazão de JS da página; a 30 fps, 4.4%. O main thread
 * não é o gargalo (o callback do rAF fica abaixo de 0.2 ms): o custo é o
 * processo de GPU disputando núcleo com ele.
 */
export const MAX_FPS = 30;

/**
 * Folga do intervalo entre quadros. Os timestamps do rAF chegam alinhados ao
 * vsync, com jitter de décimos de milissegundo: sem a folga, um tique que
 * chegasse a 33.2 ms seria pulado numa tela de 60 Hz e o fundo cairia a 20 fps.
 */
const FRAME_SLACK_MS = 1;

/**
 * Decide se um tique do rAF vira quadro.
 *
 * O rAF continua batendo no ritmo da tela e o motor só desenha quando passou o
 * intervalo do teto. Não existe API para pedir taxa menor ao navegador, e um
 * `setInterval` perderia o alinhamento com o vsync. Pura e exportada para ser
 * testada sem contexto GL.
 */
export function shouldRenderFrame(
  now: number,
  lastRenderAt: number,
  maxFps: number
): boolean {
  if (lastRenderAt === 0) return true;
  return now - lastRenderAt >= 1000 / maxFps - FRAME_SLACK_MS;
}

/** Lado da textura de ruído assada no mount (shaders/bake.ts). */
export const DETAIL_SIZE = 256;

/**
 * Degrau de qualidade do fundo (§16.3).
 *
 * `full` desenha o grão da areia e a renda de espuma e usa a resolução de
 * sempre. `lite` pula as duas leituras de textura, fica em DPR 1 e no alvo
 * pequeno. A troca é de mão única: o motor desce e não sobe, porque subir de
 * novo faria o fundo pulsar entre os dois numa máquina no limite.
 */
export type Quality = "full" | "lite";

/**
 * Renderizador por software: sem GPU, o WebGL vira trabalho de processador.
 *
 * É onde o Lighthouse e o PageSpeed rodam (SwiftShader), e onde vive quem tem
 * driver bloqueado ou máquina virtual. **O `failIfMajorPerformanceCaveat`, que
 * seria o caminho oficial, não recusa o contexto no SwiftShader** (medido na
 * §16.2), por isso o nome do renderizador.
 */
export function isSoftwareRenderer(name: string): boolean {
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}

/**
 * A guarda de tempo de quadro.
 *
 * Com o teto de 30 fps o intervalo esperado entre quadros é de 33 ms. Se a
 * mediana de uma janela inteira passa de 50 ms, a máquina não está dando conta
 * e o motor desce para `lite`. Mediana, e não média, para um pico isolado de
 * hidratação ou de troca de rota não derrubar a qualidade; e só depois do
 * aquecimento, que é quando a página ainda está carregando o resto.
 */
export const FRAME_GUARD = {
  warmupMs: 3000,
  window: 60,
  slowIntervalMs: 50,
  /** Acima disto não é quadro lento, é pausa: aba oculta, canvas fora da tela. */
  pauseMs: 250,
} as const;

/** Decide, sobre uma janela de intervalos entre quadros, se é hora de descer. */
export function shouldDowngrade(intervals: readonly number[]): boolean {
  if (intervals.length < FRAME_GUARD.window) return false;
  const sorted = [...intervals].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] > FRAME_GUARD.slowIntervalMs;
}

/**
 * Devolve o main thread ao navegador entre dois passos da montagem.
 *
 * A montagem inteira numa tarefa só (avaliar o chunk do OGL, criar o contexto,
 * compilar, desenhar) dava uns 250 ms no Lighthouse mobile, todos contando no
 * TBT. Criar o contexto sozinho já custa uns 24 ms reais no SwiftShader, então
 * não há como ficar abaixo de 50 ms simulados nele; o resto, fatiado, sai da
 * conta (§16.5).
 */
export function yieldToMain(): Promise<void> {
  const scheduler = (
    globalThis as unknown as { scheduler?: { yield?: () => Promise<void> } }
  ).scheduler;
  if (scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Intervalo entre consultas de "já compilou?" durante a pré-compilação. */
const PRECOMPILE_POLL_MS = 16;

/**
 * Compila os programas em segundo plano, antes de o OGL compilar.
 *
 * O OGL compila e confere o status do link na hora, e essa conferência espera
 * a compilação inteira no main thread. No Chrome sem GPU, que é onde o
 * Lighthouse roda, o SwiftShader compila tudo no link: o campo leva uns 100 ms
 * reais, e o simulador do Lighthouse ainda multiplica isso por quatro.
 *
 * Com `KHR_parallel_shader_compile` a compilação corre fora do main thread e o
 * código só consulta se acabou, devolvendo o main thread entre as consultas. O
 * Chrome guarda o programa ligado num cache por código-fonte, que sobrevive a
 * apagar o programa: quando o OGL compila o mesmo texto em seguida, leva uns
 * 3 ms (§16.5). Sem a extensão, não faz nada e o OGL compila como sempre.
 *
 * O texto tem que ser idêntico ao que o OGL vai compilar, e é: ele passa o
 * código ao WebGL sem prefixo nem `bindAttribLocation`.
 */
async function precompile(
  gl: WebGLRenderingContext,
  pairs: ReadonlyArray<readonly [vertex: string, fragment: string]>,
  cancelled: () => boolean
): Promise<void> {
  const parallel = gl.getExtension("KHR_parallel_shader_compile") as {
    COMPLETION_STATUS_KHR: number;
  } | null;
  if (!parallel) return;

  const programs = pairs.map(([vertex, fragment]) => {
    const program = gl.createProgram();
    if (!program) return null;
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) continue;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
      /* Só marca: o shader vive até o programa ser apagado. */
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    return program;
  });

  const ready = () =>
    programs.every(
      (program) =>
        !program ||
        gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)
    );
  while (!cancelled() && !ready()) {
    await new Promise((resolve) => setTimeout(resolve, PRECOMPILE_POLL_MS));
  }

  for (const program of programs) if (program) gl.deleteProgram(program);
}

/**
 * Nome do renderizador WebGL.
 *
 * O `RENDERER` simples já traz o nome real no Firefox, e só no Chrome e no
 * Safari vem mascarado como "WebKit WebGL". Pedir a extensão só nesse caso
 * evita o aviso de depreciação que o Firefox imprime ao vê-la.
 */
function rendererName(gl: WebGLRenderingContext): string {
  const plain = String(gl.getParameter(gl.RENDERER) ?? "");
  if (plain && !/webkit webgl/i.test(plain)) return plain;
  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  return debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : plain;
}

/**
 * Dimensões do RenderTarget preservando a proporção da tela.
 *
 * Pura e exportada porque é a única aritmética do motor que dá para verificar
 * sem contexto GL.
 */
export function fieldTargetSize(
  width: number,
  height: number,
  maxSide: number
): { width: number; height: number } {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const ratio = safeWidth / safeHeight;

  return ratio >= 1
    ? { width: maxSide, height: Math.max(2, Math.round(maxSide / ratio)) }
    : { width: Math.max(2, Math.round(maxSide * ratio)), height: maxSide };
}

/**
 * Mede o elemento que define o tamanho do canvas.
 *
 * Precisa ser o contêiner, nunca o próprio canvas: o construtor do OGL chama
 * `setSize(300, 150)` por padrão e essa chamada grava `style.width` e
 * `style.height` inline no canvas. A partir daí o `clientWidth` do canvas
 * reporta o valor que o OGL escreveu, não o que o CSS pediu, e o fundo ficaria
 * preso em 300x150 para sempre.
 */
function elementSize(element: HTMLElement): { width: number; height: number } {
  return {
    width: Math.max(element.clientWidth, 1),
    height: Math.max(element.clientHeight, 1),
  };
}

/** Interpolação de um vetor de números, base dos dois tweens do motor. */
function lerpArray(from: number[], to: number[], t: number): number[] {
  return from.map((value, index) => value + (to[index] - value) * t);
}

type Tween = { from: number[]; to: number[]; start: number; duration: number };

export type BackgroundRendererOptions = {
  /** Chamado quando o contexto WebGL se perde, para o fallback CSS aparecer. */
  onContextLost?: () => void;
};

/**
 * O motor do fundo. Sem React de propósito: quem mexe em WebGL é esta classe, e
 * o componente só liga e desliga.
 *
 * Dois passes, um draw cada: o campo vai para um RenderTarget pequeno, e a
 * composição estica esse alvo na tela somando grain e vinheta. No mount, um
 * terceiro desenho, único, assa a textura de ruído que o campo lê (§16).
 */
export class BackgroundRenderer {
  private readonly ogl: OglModule;
  private readonly options: BackgroundRendererOptions;

  private renderer: Renderer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private fieldTarget: RenderTarget | null = null;
  private fieldMesh: Mesh | null = null;
  private compositeMesh: Mesh | null = null;
  private grain: Texture | null = null;
  private detailTarget: RenderTarget | null = null;

  private quality: Quality = "full";
  private frameIntervals: number[] = [];

  private frameId = 0;
  private framePending = false;
  private running = false;
  private destroyed = false;
  private degraded = false;
  private documentHidden = false;
  private intersecting = true;
  private reducedMotion = false;

  private startedAt = 0;
  private lastFrameAt = 0;
  private pointer: [number, number] = [0, 0];
  private sunPointer: [number, number] = [0, 0];
  private pointerTarget: [number, number] = [0, 0];

  private preset: PalettePreset = DEFAULT_PALETTE;
  private themeTween: Tween | null = null;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private motionQuery: MediaQueryList | null = null;

  constructor(ogl: OglModule, options: BackgroundRendererOptions = {}) {
    this.ogl = ogl;
    this.options = options;
  }

  /**
   * Cria o contexto e monta a cena. Resolve false quando o WebGL não está
   * disponível, e aí o chamador mostra o fallback em gradiente CSS, ou quando
   * o motor foi destruído no meio do caminho.
   *
   * **É assíncrona de propósito**, em três tempos (§16.5): cria o contexto e
   * devolve o main thread; compila os programas em segundo plano
   * (`precompile`); e monta o resto, com o OGL compilando pelo cache. Depois de
   * cada espera, `destroyed` é conferido de novo, porque o componente pode ter
   * desmontado enquanto o motor esperava.
   */
  async mount(
    canvas: HTMLCanvasElement,
    preset: PalettePreset = DEFAULT_PALETTE
  ): Promise<boolean> {
    if (this.destroyed) return false;

    const { Renderer, Program, Mesh, Triangle, RenderTarget } = this.ogl;

    /* Medido antes de existir Renderer, senão o setSize do construtor já teria
       sobrescrito o tamanho do canvas com o padrão de 300x150. */
    const size = elementSize(canvas.parentElement ?? canvas);

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        width: size.width,
        height: size.height,
        dpr: this.currentDpr(),
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      /* Sem WebGL não é erro do site, é ambiente. O fallback CSS assume. */
      this.degraded = true;
      return false;
    }

    this.canvas = canvas;
    this.renderer = renderer;
    const gl = renderer.gl;

    /*
     * Sem GPU o motor já nasce no degrau leve. O DPR foi decidido antes de
     * existir contexto para perguntar, então é refeito aqui.
     */
    if (isSoftwareRenderer(rendererName(gl))) {
      this.quality = "lite";
      renderer.dpr = this.currentDpr();
      renderer.setSize(size.width, size.height);
    }
    canvas.dataset.quality = this.quality;

    await yieldToMain();
    if (this.destroyed) return false;

    /*
     * O campo só leva o bloco de grão e renda no degrau completo. No leve, que
     * é o do Lighthouse, ele nem é compilado.
     */
    const fieldSource =
      this.quality === "full" ? "#define DETAIL\n" + fieldFragment : fieldFragment;

    await precompile(
      gl,
      [
        [fullscreenVertex, fieldSource],
        [fullscreenVertex, compositeFragment],
        ...(this.quality === "full"
          ? [[fullscreenVertex, bakeFragment] as const]
          : []),
      ],
      () => this.destroyed
    );
    if (this.destroyed) return false;

    this.reducedMotion = this.prefersReducedMotion();
    this.documentHidden = document.visibilityState === "hidden";

    const back = this.readBackFromCanvas(canvas);
    /* A paleta inicial precisa seguir o tema inicial, senão o site abre no
       claro com as cores do escuro até a primeira troca. */
    const palette = paletteFor(preset, isLightBack(back));
    this.preset = preset;
    const target = fieldTargetSize(
      size.width,
      size.height,
      this.currentMaxSide()
    );

    this.fieldTarget = new RenderTarget(gl, {
      width: target.width,
      height: target.height,
      depth: false,
      /* LINEAR é o blur: o alvo pequeno é esticado na composição. */
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    this.grain = createGrainTexture(gl, this.ogl.Texture, GRAIN_SIZE);

    const geometry = new Triangle(gl);

    /*
     * A textura de ruído do campo, desenhada uma vez. No degrau leve ela nem é
     * lida, então não é desenhada: o grain ocupa o lugar só para o sampler ter
     * textura válida. A guarda que desce de full para lite não volta, então
     * nunca falta a textura assada para quem precisa dela.
     */
    if (this.quality === "full") {
      this.detailTarget = new RenderTarget(gl, {
        width: DETAIL_SIZE,
        height: DETAIL_SIZE,
        depth: false,
        wrapS: gl.REPEAT,
        wrapT: gl.REPEAT,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });
      const bakeMesh = new Mesh(gl, {
        geometry,
        program: new Program(gl, {
          vertex: fullscreenVertex,
          fragment: bakeFragment,
          depthTest: false,
          depthWrite: false,
        }),
      });
      renderer.render({
        scene: bakeMesh,
        target: this.detailTarget,
        frustumCull: false,
        sort: false,
      });
      bakeMesh.program.remove();
    }

    this.fieldMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: fullscreenVertex,
        fragment: fieldSource,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          /* Semente nova a cada load: dois acessos nunca abrem iguais. */
          uSeed: { value: Math.random() * 1000 },
          uResolution: { value: [target.width, target.height] },
          uPointer: { value: [0, 0] },
          uSunPointer: { value: [0, 0] },
          uPalette: { value: palette.map((color) => [...color]) },
          uDetailTex: { value: this.detailTarget?.texture ?? this.grain },
          uDetail: { value: this.quality === "full" ? 1 : 0 },
        },
      }),
    });

    this.compositeMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: fullscreenVertex,
        fragment: compositeFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uField: { value: this.fieldTarget.texture },
          uGrain: { value: this.grain },
          uBack: { value: [...back] },
          uMix: { value: mixForBack(back) },
          uGrainAmount: { value: GRAIN_AMOUNT },
          uGrainScale: { value: 1 / GRAIN_SIZE },
          uVignette: { value: VIGNETTE_STRENGTH },
          uVignetteTarget: { value: vignetteTargetForBack(back) },
        },
      }),
    });

    canvas.addEventListener("webglcontextlost", this.handleContextLost);
    this.observe(canvas);

    this.startedAt = performance.now();
    this.renderFrame(this.startedAt);
    this.syncLoop();
    return true;
  }

  /** Reajusta canvas, viewport e RenderTarget ao tamanho atual. */
  resize(): void {
    if (this.degraded) return;
    if (!this.renderer || !this.fieldTarget || !this.fieldMesh) return;

    const size = this.canvasSize();
    this.renderer.dpr = this.currentDpr();
    this.renderer.setSize(size.width, size.height);

    const target = fieldTargetSize(
      size.width,
      size.height,
      this.currentMaxSide()
    );
    if (
      target.width !== this.fieldTarget.width ||
      target.height !== this.fieldTarget.height
    ) {
      this.fieldTarget.setSize(target.width, target.height);
      this.fieldMesh.program.uniforms.uResolution.value = [
        target.width,
        target.height,
      ];
    }

    this.requestFrame();
  }

  /** Alvo do ponteiro, de -1 a 1. O lerp acontece a cada frame. */
  setPointer(x: number, y: number): void {
    this.pointerTarget = [
      Math.min(Math.max(x, -1), 1),
      Math.min(Math.max(y, -1), 1),
    ];
  }

  /**
   * Troca a cor de fundo do tema.
   *
   * A cor é parseada uma vez aqui e interpolada por rAF com a curva de
   * `--shell-ease`, em vez de lida do getComputedStyle a cada frame, o que
   * forçaria layout (F6). A dose de campo e o alvo da vinheta acompanham,
   * senão o shader chegaria ao tema novo antes ou depois do CSS.
   *
   * **A paleta viaja no mesmo tween**, e não num paralelo, porque cada tema
   * tem o seu conjunto: o claro usa `palettesLight`, cujo ponto mais escuro é
   * alto o bastante para o campo aparecer sem entrar na faixa proibida. Dois
   * tweens independentes chegariam em instantes diferentes e a composição
   * passaria por combinações que ninguém mediu.
   */
  setTheme(hex: string): void {
    if (!this.compositeMesh) return;

    const back = hexToRgb(hex);
    const palette = paletteFor(this.preset, isLightBack(back));
    const to = [
      ...back,
      mixForBack(back),
      vignetteTargetForBack(back),
      ...palette.flatMap((color) => [...color]),
    ];

    if (this.reducedMotion) {
      this.themeTween = null;
      this.applyThemeFlat(to);
      this.requestFrame();
      return;
    }

    this.themeTween = {
      from: this.currentThemeFlat(),
      to,
      start: performance.now(),
      duration: SHELL_FADE_MS,
    };
    this.syncLoop();
  }

  /** Verdadeiro quando o WebGL falhou ou o contexto se perdeu. */
  isDegraded(): boolean {
    return this.degraded;
  }

  /** Solta listeners, observers, o loop e a memória de GPU. */
  destroy(): void {
    this.destroyed = true;
    this.stop();

    this.canvas?.removeEventListener(
      "webglcontextlost",
      this.handleContextLost
    );
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.motionQuery?.removeEventListener("change", this.handleMotionChange);

    this.fieldMesh?.program.remove();
    this.compositeMesh?.program.remove();

    const lose = this.renderer?.gl.getExtension("WEBGL_lose_context") as
      | { loseContext: () => void }
      | null;
    lose?.loseContext();

    this.renderer = null;
    this.canvas = null;
    this.fieldTarget = null;
    this.fieldMesh = null;
    this.compositeMesh = null;
    this.grain = null;
    this.detailTarget = null;
    this.resizeObserver = null;
    this.intersectionObserver = null;
    this.motionQuery = null;
  }

  /* ------------------------------------------------------------------ */

  private observe(canvas: HTMLCanvasElement): void {
    document.addEventListener("visibilitychange", this.handleVisibility);

    /* Observa o contêiner, não o canvas: o canvas tem tamanho inline escrito
       pelo próprio OGL e nunca mudaria por conta própria. */
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);

    /*
     * O canvas é fixo e cobre a tela inteira, então este observer não pega
     * rolagem: ele pega o canvas sendo escondido por CSS ou removido do fluxo,
     * casos que o visibilitychange não cobre.
     */
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.intersecting = entries.some((entry) => entry.isIntersecting);
      this.syncLoop();
    });
    this.intersectionObserver.observe(canvas);

    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.motionQuery.addEventListener("change", this.handleMotionChange);
  }

  private handleVisibility = (): void => {
    const estavaOculto = this.documentHidden;
    this.documentHidden = document.visibilityState === "hidden";

    /*
     * Remede ao voltar a ficar visível.
     *
     * Uma aba aberta em segundo plano não faz layout: o contêiner mede 0 no
     * mount e o canvas nasce em 1x1. O ResizeObserver não resolve sozinho,
     * porque ele entrega nas etapas de renderização, que uma página oculta não
     * executa. Sem isto, a aba voltaria pintando um único pixel esticado na
     * tela inteira, ou seja, uma cor chapada.
     */
    if (estavaOculto && !this.documentHidden) this.resize();

    this.syncLoop();
  };

  private handleMotionChange = (event: MediaQueryListEvent): void => {
    this.reducedMotion = event.matches;
    this.syncLoop();
    this.requestFrame();
  };

  private handleContextLost = (event: Event): void => {
    /* Sem preventDefault o contexto nunca poderia ser restaurado. */
    event.preventDefault();
    this.degraded = true;
    this.stop();
    this.options.onContextLost?.();
  };

  private prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  private isSmallScreen(): boolean {
    return window.innerWidth < SMALL_SCREEN_WIDTH;
  }

  private currentDpr(): number {
    if (this.isSmallScreen() || this.quality === "lite") return 1;
    return Math.min(window.devicePixelRatio || 1, MAX_DPR);
  }

  private currentMaxSide(): number {
    return this.isSmallScreen() || this.quality === "lite"
      ? FIELD_TARGET_MAX_SMALL
      : FIELD_TARGET_MAX;
  }

  private canvasSize(): { width: number; height: number } {
    const canvas = this.canvas;
    if (!canvas) return { width: 1, height: 1 };
    return elementSize(canvas.parentElement ?? canvas);
  }

  /** Cor de fundo inicial, lida uma vez do CSS. Depois só via setTheme (F6). */
  private readBackFromCanvas(canvas: HTMLCanvasElement): Rgb {
    const raw = getComputedStyle(canvas).getPropertyValue("--c-bg").trim();
    try {
      return hexToRgb(raw);
    } catch {
      return [0, 0, 0];
    }
  }

  private currentPaletteFlat(): number[] {
    const value = this.fieldMesh?.program.uniforms.uPalette.value as
      | number[][]
      | undefined;
    return value ? value.flat() : new Array<number>(9).fill(0);
  }

  private applyPaletteFlat(flat: number[]): void {
    if (!this.fieldMesh) return;
    this.fieldMesh.program.uniforms.uPalette.value = [
      flat.slice(0, 3),
      flat.slice(3, 6),
      flat.slice(6, 9),
    ];
  }

  /** Os 5 do composite mais os 9 da paleta, num vetor só. */
  private currentThemeFlat(): number[] {
    const uniforms = this.compositeMesh?.program.uniforms;
    if (!uniforms) return new Array<number>(14).fill(0);
    return [
      ...(uniforms.uBack.value as number[]),
      uniforms.uMix.value as number,
      uniforms.uVignetteTarget.value as number,
      ...this.currentPaletteFlat(),
    ];
  }

  private applyThemeFlat(flat: number[]): void {
    const uniforms = this.compositeMesh?.program.uniforms;
    if (!uniforms) return;
    uniforms.uBack.value = flat.slice(0, 3);
    uniforms.uMix.value = flat[3];
    uniforms.uVignetteTarget.value = flat[4];
    this.applyPaletteFlat(flat.slice(5, 14));
  }

  /**
   * Decide se o loop deve rodar.
   *
   * Sob movimento reduzido o motor nunca entra em loop contínuo: renderiza um
   * frame e para. O loop só liga para terminar um tween de tema ou paleta, e
   * mesmo assim os tweens são aplicados de uma vez nesse modo.
   */
  private syncLoop(): void {
    const shouldRun =
      !this.destroyed &&
      !this.degraded &&
      !this.documentHidden &&
      this.intersecting &&
      this.renderer !== null &&
      !this.reducedMotion;

    if (shouldRun) this.start();
    else this.stop();
  }

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.frameId = requestAnimationFrame(this.loop);
  }

  private stop(): void {
    this.framePending = false;
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  /**
   * Renderiza um frame avulso quando o loop está parado.
   *
   * O `framePending` importa: o resize e a troca de tema podem chegar várias
   * vezes antes do próximo frame, e sem a guarda cada chamada agendaria um
   * rAF próprio, todos renderizando o mesmo estado.
   */
  private requestFrame(): void {
    if (
      this.running ||
      this.framePending ||
      this.destroyed ||
      this.degraded ||
      !this.renderer
    ) {
      return;
    }
    this.framePending = true;
    requestAnimationFrame((now) => {
      if (this.running) {
        this.framePending = false;
        return;
      }
      this.renderFrame(now);
    });
  }

  private loop = (now: number): void => {
    this.frameId = requestAnimationFrame(this.loop);
    if (!shouldRenderFrame(now, this.lastFrameAt, MAX_FPS)) return;
    this.watchFrameTime(now);
    this.renderFrame(now);
  };

  /**
   * Alimenta a guarda com o intervalo desde o último quadro. Só no degrau
   * completo, só depois do aquecimento, e ignorando pausas, que não são
   * lentidão de GPU (ver FRAME_GUARD).
   */
  private watchFrameTime(now: number): void {
    if (this.quality !== "full" || this.lastFrameAt === 0) return;
    if (now - this.startedAt < FRAME_GUARD.warmupMs) return;

    const interval = now - this.lastFrameAt;
    if (interval > FRAME_GUARD.pauseMs) return;

    this.frameIntervals.push(interval);
    if (this.frameIntervals.length < FRAME_GUARD.window) return;

    const slow = shouldDowngrade(this.frameIntervals);
    this.frameIntervals = [];
    if (slow) this.downgrade();
  }

  /** Desce para o degrau leve: sem grão nem renda, DPR 1 e alvo pequeno. */
  private downgrade(): void {
    this.quality = "lite";
    if (this.canvas) this.canvas.dataset.quality = this.quality;
    if (this.fieldMesh) this.fieldMesh.program.uniforms.uDetail.value = 0;
    this.resize();
  }

  private renderFrame(now: number): void {
    this.framePending = false;
    const renderer = this.renderer;
    const fieldMesh = this.fieldMesh;
    const compositeMesh = this.compositeMesh;
    const fieldTarget = this.fieldTarget;
    if (!renderer || !fieldMesh || !compositeMesh || !fieldTarget) return;

    this.advanceTweens(now);

    /* Preso a 100ms para a volta de uma aba pausada não dar um salto. */
    const delta =
      this.lastFrameAt === 0
        ? 1 / 60
        : Math.min((now - this.lastFrameAt) / 1000, 0.1);
    this.lastFrameAt = now;

    /* O campo fica congelado no primeiro frame sob movimento reduzido. */
    if (!this.reducedMotion) {
      fieldMesh.program.uniforms.uTime.value = (now - this.startedAt) / 1000;

      const follow = 1 - Math.exp(-delta / POINTER_TIME_CONSTANT);
      this.pointer = [
        this.pointer[0] + (this.pointerTarget[0] - this.pointer[0]) * follow,
        this.pointer[1] + (this.pointerTarget[1] - this.pointer[1]) * follow,
      ];
      fieldMesh.program.uniforms.uPointer.value = this.pointer;

      const followSun = 1 - Math.exp(-delta / SUN_TIME_CONSTANT);
      this.sunPointer = [
        this.sunPointer[0] +
          (this.pointerTarget[0] - this.sunPointer[0]) * followSun,
        this.sunPointer[1] +
          (this.pointerTarget[1] - this.sunPointer[1]) * followSun,
      ];
      fieldMesh.program.uniforms.uSunPointer.value = this.sunPointer;
    }

    renderer.render({
      scene: fieldMesh,
      target: fieldTarget,
      frustumCull: false,
      sort: false,
    });
    renderer.render({ scene: compositeMesh, frustumCull: false, sort: false });
  }

  private advanceTweens(now: number): void {
    if (this.themeTween) {
      const step = this.stepTween(this.themeTween, now);
      this.applyThemeFlat(step.flat);
      if (step.done) this.themeTween = null;
    }
  }

  private stepTween(
    tween: Tween,
    now: number
  ): { flat: number[]; done: boolean } {
    const elapsed = (now - tween.start) / tween.duration;
    const done = elapsed >= 1;
    const t = done ? 1 : easeShell(elapsed);
    return { flat: lerpArray(tween.from, tween.to, t), done };
  }
}

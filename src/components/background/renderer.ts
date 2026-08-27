import type {
  Mesh,
  Program,
  RenderTarget,
  Renderer,
  Texture,
  Triangle,
} from "ogl";

import {
  GRAIN_AMOUNT,
  PALETTE_FADE_MS,
  SHELL_FADE_MS,
  VIGNETTE_STRENGTH,
  easeShell,
  hexToRgb,
  mixForBack,
  paletteFor,
  vignetteTargetForBack,
  type PalettePreset,
  type Rgb,
} from "./background-config";
import { GRAIN_SIZE, createGrainTexture } from "./grain-texture";
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
 * de blur da referência e derruba o fill rate em mais de 10x.
 */
export const FIELD_TARGET_MAX = 320;
export const FIELD_TARGET_MAX_SMALL = 200;

/** Abaixo desta largura de viewport, DPR 1 e alvo menor (checklist da Fase 6). */
export const SMALL_SCREEN_WIDTH = 768;

/**
 * Constante de tempo da perseguição do ponteiro, em segundos.
 *
 * Suavização exponencial em vez de um fator fixo por frame: com fator fixo, o
 * ponteiro chegaria ao alvo no dobro da velocidade num monitor de 120Hz, e o
 * fundo teria personalidade diferente dependendo do hardware de quem visita.
 */
const POINTER_TIME_CONSTANT = 0.25;

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
 * composição estica esse alvo na tela somando grain e vinheta.
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
  private pointerTarget: [number, number] = [0, 0];

  private themeTween: Tween | null = null;
  private paletteTween: Tween | null = null;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private motionQuery: MediaQueryList | null = null;

  constructor(ogl: OglModule, options: BackgroundRendererOptions = {}) {
    this.ogl = ogl;
    this.options = options;
  }

  /**
   * Cria o contexto e monta a cena. Devolve false quando o WebGL não está
   * disponível, e aí o chamador mostra o fallback em gradiente CSS.
   */
  mount(canvas: HTMLCanvasElement, preset: PalettePreset = "graphite"): boolean {
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

    this.reducedMotion = this.prefersReducedMotion();
    this.documentHidden = document.visibilityState === "hidden";

    const palette = paletteFor(preset);
    const back = this.readBackFromCanvas(canvas);
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

    this.fieldMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: fullscreenVertex,
        fragment: fieldFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          /* Semente nova a cada load: dois acessos nunca abrem iguais. */
          uSeed: { value: Math.random() * 1000 },
          uResolution: { value: [target.width, target.height] },
          uProgress: { value: 0 },
          uPointer: { value: [0, 0] },
          uPalette: { value: palette.map((color) => [...color]) },
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

  /** Progresso de rolagem normalizado, alimentado pelo Lenis na Fase 3. */
  setProgress(progress: number): void {
    if (!this.fieldMesh) return;
    this.fieldMesh.program.uniforms.uProgress.value = Number.isFinite(progress)
      ? progress
      : 0;
    this.requestFrame();
  }

  /** Alvo do ponteiro, de -1 a 1. O lerp acontece a cada frame. */
  setPointer(x: number, y: number): void {
    this.pointerTarget = [
      Math.min(Math.max(x, -1), 1),
      Math.min(Math.max(y, -1), 1),
    ];
  }

  /** Troca a paleta com crossfade. Por rota e por item da lista. */
  setPalette(preset: PalettePreset, immediate = false): void {
    if (!this.fieldMesh) return;

    const to = paletteFor(preset).flatMap((color) => [...color]);

    if (immediate || this.reducedMotion) {
      this.paletteTween = null;
      this.applyPaletteFlat(to);
      this.requestFrame();
      return;
    }

    this.paletteTween = {
      from: this.currentPaletteFlat(),
      to,
      start: performance.now(),
      duration: PALETTE_FADE_MS,
    };
    this.syncLoop();
  }

  /**
   * Troca a cor de fundo do tema.
   *
   * A cor é parseada uma vez aqui e interpolada por rAF com a curva de
   * `--shell-ease`, em vez de lida do getComputedStyle a cada frame, o que
   * forçaria layout (F6). A dose de campo e o alvo da vinheta acompanham,
   * senão o shader chegaria ao tema novo antes ou depois do CSS.
   */
  setTheme(hex: string): void {
    if (!this.compositeMesh) return;

    const back = hexToRgb(hex);
    const to = [...back, mixForBack(back), vignetteTargetForBack(back)];

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
    if (this.isSmallScreen()) return 1;
    return Math.min(window.devicePixelRatio || 1, MAX_DPR);
  }

  private currentMaxSide(): number {
    return this.isSmallScreen() ? FIELD_TARGET_MAX_SMALL : FIELD_TARGET_MAX;
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

  private currentThemeFlat(): number[] {
    const uniforms = this.compositeMesh?.program.uniforms;
    if (!uniforms) return new Array<number>(5).fill(0);
    return [
      ...(uniforms.uBack.value as number[]),
      uniforms.uMix.value as number,
      uniforms.uVignetteTarget.value as number,
    ];
  }

  private applyThemeFlat(flat: number[]): void {
    const uniforms = this.compositeMesh?.program.uniforms;
    if (!uniforms) return;
    uniforms.uBack.value = flat.slice(0, 3);
    uniforms.uMix.value = flat[3];
    uniforms.uVignetteTarget.value = flat[4];
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
   * O `framePending` importa: setProgress e setPalette podem ser chamados
   * várias vezes antes do próximo frame, e sem a guarda cada chamada agendaria
   * um rAF próprio, todos renderizando o mesmo estado.
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
    this.renderFrame(now);
  };

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

    if (this.paletteTween) {
      const step = this.stepTween(this.paletteTween, now);
      this.applyPaletteFlat(step.flat);
      if (step.done) this.paletteTween = null;
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

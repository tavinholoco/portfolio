import type { OGLRenderingContext, Texture } from "ogl";

/** Lado padrão da textura de grain, em pixels. */
export const GRAIN_SIZE = 256;

/**
 * Gerador determinístico (mulberry32).
 *
 * `Math.random` serviria, mas um PRNG semeado deixa `createGrainBuffer` pura e
 * testável, que é o ponto de E8: o Vitest roda em `environment: node` e não tem
 * contexto GL nenhum, então o buffer precisa ser verificável sem WebGL.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Buffer RGBA de ruído monocromático, pronto para virar textura.
 *
 * Cinza em vez de ruído por canal: grain colorido brigaria com a lei de que a
 * cor do site vem só da paleta do shader. O alfa é sempre opaco porque o passe
 * de composição não usa o canal.
 */
export function createGrainBuffer(size: number, seed = 1): Uint8Array {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`Lado da textura de grain inválido: ${size}`);
  }

  const random = mulberry32(seed);
  const buffer = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size; i++) {
    const value = Math.floor(random() * 256);
    const offset = i * 4;
    buffer[offset] = value;
    buffer[offset + 1] = value;
    buffer[offset + 2] = value;
    buffer[offset + 3] = 255;
  }

  return buffer;
}

/**
 * Envolve o buffer numa Texture do OGL.
 *
 * REPEAT porque a textura ladrilha a tela inteira em coordenada de pixel, e
 * NEAREST porque interpolar grain o borraria e mataria justamente o efeito.
 * `generateMipmaps: false` pelo mesmo motivo.
 *
 * A classe `Texture` chega por parâmetro em vez de import estático porque o
 * `ogl` inteiro entra por `await import()` no cliente (E1).
 */
export function createGrainTexture(
  gl: OGLRenderingContext,
  TextureClass: typeof Texture,
  size = GRAIN_SIZE,
  seed = 1
): Texture {
  return new TextureClass(gl, {
    image: createGrainBuffer(size, seed),
    width: size,
    height: size,
    wrapS: gl.REPEAT,
    wrapT: gl.REPEAT,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
    generateMipmaps: false,
    flipY: false,
  });
}

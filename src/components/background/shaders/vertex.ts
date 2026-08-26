/**
 * Vertex shader compartilhado pelos dois passes.
 *
 * A geometria é o `Triangle` do OGL: um único triângulo que cobre a tela
 * inteira (posições -1,-1 / 3,-1 / -1,3), mais barato que um quad porque
 * dispensa o segundo triângulo e a costura da diagonal. O `uv` vem de 0 a 2 e
 * a parte visível cai em 0..1.
 *
 * GLSL ES 1.00 de propósito: roda igual em contexto WebGL1 e WebGL2, sem
 * precisar de diretiva `#version`.
 */
export const fullscreenVertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * Passe 2: a composição.
 *
 * Amostra o campo do RenderTarget (esticado com LINEAR, que é o blur de graça),
 * mistura com a cor de fundo do tema por `uMix`, soma grain e aplica uma
 * vinheta discreta.
 *
 * `uBack` e `uMix` são interpolados em JS durante a troca de tema, com a mesma
 * curva do CSS, em vez de lidos do getComputedStyle a cada frame (F6).
 *
 * O grain é amostrado em coordenada de tela (`gl_FragCoord`), não em `vUv`.
 * Isso o mantém fixo no lugar quando o campo se move, que é o que dá look de
 * filme. Amostrado em vUv ele escorregaria junto com o campo e cintilaria.
 *
 * A vinheta puxa para `uVignetteTarget`, que é preto no tema escuro e branco no
 * claro, em vez de escurecer sempre. O motivo é a faixa proibida de luminância
 * (ver background-config.ts): escurecer as bordas do tema claro empurraria o
 * backdrop na direção de L = 0.5, onde o texto em `difference` some. Puxando
 * para o extremo do próprio tema, a vinheta só aumenta o contraste.
 */
export const compositeFragment = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uField;
uniform sampler2D uGrain;
uniform vec3 uBack;
uniform float uMix;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uVignette;
uniform float uVignetteTarget;

void main() {
  vec3 field = texture2D(uField, vUv).rgb;
  vec3 color = mix(uBack, field, uMix);

  /* Vinheta antes do grain, para o grain não ser atenuado nas bordas. */
  float edge = smoothstep(0.25, 0.85, length(vUv - 0.5));
  color = mix(color, vec3(uVignetteTarget), edge * uVignette);

  /* Centrado em zero: escurece e clareia, em vez de só clarear. */
  float grain = texture2D(uGrain, gl_FragCoord.xy * uGrainScale).r - 0.5;
  color += grain * uGrainAmount;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

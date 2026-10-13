/**
 * Passe único de mount: a textura de ruído do campo (§16 do plano).
 *
 * Desenhado **uma vez**, num RenderTarget de 256x256 com REPEAT, e lido pelo
 * campo como `uDetailTex`. Nada disto roda por quadro. O que ele troca é ruído
 * procedural 2D por uma leitura de textura: no alvo de baixa resolução e sem
 * mipmap, uma leitura custa bem menos que um snoise, inclusive no SwiftShader.
 * Com mipmap e em resolução cheia foi o contrário, 4x mais caro (§16.2).
 *
 * Os três canais são ladrilháveis, porque o campo lê a textura em coordenada
 * de chão, que cresce sem limite rumo ao horizonte:
 *
 * - R: fBm de 5 oitavas de ruído de gradiente periódico. Desregula a densidade
 *   da renda, senão ela fica com cara de estampa.
 * - G: Worley de 16 células por ladrilho, guardando F2 menos F1, que é zero na
 *   fronteira entre células. O limiar sobre ele desenha a renda de espuma.
 * - B: grão de areia, ruído branco por texel com um pouco de gradiente fino.
 *
 * O hash é o de Dave Hoskins (domínio público), sem seno, para dar o mesmo
 * resultado em GPU de qualquer fabricante.
 */
export const bakeFragment = /* glsl */ `
precision highp float;

varying vec2 vUv;

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* Ruído de gradiente periódico: o reticulado dá a volta em 'per', e é isso
   que fecha o ladrilho sem emenda. */
float pnoise(vec2 p, float per) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 g00 = hash22(mod(i, per)) * 2.0 - 1.0;
  vec2 g10 = hash22(mod(i + vec2(1.0, 0.0), per)) * 2.0 - 1.0;
  vec2 g01 = hash22(mod(i + vec2(0.0, 1.0), per)) * 2.0 - 1.0;
  vec2 g11 = hash22(mod(i + vec2(1.0, 1.0), per)) * 2.0 - 1.0;
  float a = dot(g00, f);
  float b = dot(g10, f - vec2(1.0, 0.0));
  float c = dot(g01, f - vec2(0.0, 1.0));
  float d = dot(g11, f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

/* Worley ladrilhável: a vizinhança 3x3 dá a volta em 'n' células. */
float worleyEdge(vec2 uv, float n, float salt) {
  vec2 p = uv * n;
  vec2 i = floor(p);
  vec2 f = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y));
      vec2 c = mod(i + o, n);
      vec2 pt = o + 0.1 + 0.8 * hash22(c + salt);
      float dd = length(pt - f);
      if (dd < f1) {
        f2 = f1;
        f1 = dd;
      } else if (dd < f2) {
        f2 = dd;
      }
    }
  }
  return f2 - f1;
}

void main() {
  vec2 uv = fract(vUv);

  float s = 0.0;
  float a = 0.5;
  float per = 4.0;
  for (int i = 0; i < 5; i++) {
    s += a * pnoise(uv * per + 17.0, per);
    per *= 2.0;
    a *= 0.5;
  }
  float r = clamp(0.5 + s * 0.9, 0.0, 1.0);

  float g = clamp(worleyEdge(uv, 16.0, 3.0) * 2.0, 0.0, 1.0);

  float white = hash12(floor(uv * 256.0) + 5.0);
  float fine = pnoise(uv * 64.0, 64.0);
  float b = clamp(0.5 + (white - 0.5) * 0.8 + fine * 0.35, 0.0, 1.0);

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

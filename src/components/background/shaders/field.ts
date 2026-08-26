/**
 * Passe 1: o campo.
 *
 * Renderiza num RenderTarget pequeno (lado maior de ~320px, ver renderer.ts) e
 * é esticado depois com filtro LINEAR. A interpolação bilinear do próprio
 * hardware faz o papel do blur de graça, o que dispensa o ping pong de blur
 * clássico e derruba o fill rate em mais de 10x. Num campo suave o resultado é
 * visualmente equivalente.
 *
 * O simplex noise abaixo é o algoritmo canônico de Stefan Gustavson e Ashima
 * Arts (domínio público), reescrito aqui em vez de importado, porque é a forma
 * padrão do algoritmo e não queremos uma dependência de GLSL só para isso.
 *
 * `uBack` não entra neste passe: a mistura com a cor de fundo do tema acontece
 * no passe de composição, que é onde o tween de tema de F6 aterrissa. Aplicar
 * nos dois lugares aplicaria o fundo duas vezes.
 */
export const fieldFragment = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSeed;
uniform vec2 uResolution;
uniform float uProgress;
uniform vec2 uPointer;
uniform vec3 uPalette[3];

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

/* fBm de 3 oitavas. O passo 2.02 em vez de 2.0 evita que as oitavas alinhem os
   zeros do noise e produzam faixas visíveis. */
float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    sum += amp * snoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  /* Corrige a proporção para o campo não esticar junto com a janela. */
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 p = (vUv - 0.5) * aspect;

  float t = uTime * 0.06 + uSeed;

  /*
   * Domain warping: a coordenada do campo principal é deslocada por um segundo
   * campo de noise. É isso que dá aspecto de fluido em vez de nuvem genérica, e
   * é a razão de o resultado não parecer um shader de tutorial.
   */
  vec3 q = vec3(p * 1.6, t);
  vec2 warp = vec2(fbm(q), fbm(q + vec3(5.2, 1.3, 0.0)));

  /* A assinatura própria da v3: o campo responde ao scroll e ao ponteiro. */
  vec3 r = vec3(
    p * 1.6 + warp * 0.9 + uPointer * 0.22,
    t * 0.8 + uProgress * 0.75
  );

  float v = clamp(fbm(r) * 0.5 + 0.5, 0.0, 1.0);

  /* Ramp de 3 cores, sem ramificação. */
  vec3 color = mix(uPalette[0], uPalette[1], smoothstep(0.0, 0.5, v));
  color = mix(color, uPalette[2], smoothstep(0.5, 1.0, v));

  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Passe 1: o campo.
 *
 * Renderiza num RenderTarget pequeno (lado maior de ~640px, ver renderer.ts) e
 * é esticado depois com filtro LINEAR. A interpolação bilinear do próprio
 * hardware faz o papel do blur de graça, o que dispensa o ping pong de blur
 * clássico e derruba o fill rate.
 *
 * Na v3.5 o campo deixou de ser fBm com domain warping, que lia como líquido, e
 * passou a ser um campo de ondas de praia: céu, mar em perspectiva, espuma com
 * aresta dura e vaivém na areia. **O ramp de 3 cores no fim de `main` não
 * mudou, e é isso que mantém a garantia de contraste de pé.** Ver o comentário
 * de `waveField`.
 *
 * O alvo do RenderTarget subiu junto: com 320px a bilinear derretia a aresta
 * de espuma, que é exatamente a forma que a v3.5 foi buscar.
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

/*
 * O campo de ondas de praia (v3.5).
 *
 * Devolve um escalar em [0,1] que o ramp de 3 cores logo abaixo traduz em cor.
 * **Manter a saída dentro de [0,1] é o que preserva a garantia de contraste do
 * site:** o teste de background-config varre o ramp inteiro, ponta a ponta,
 * provando que nenhuma cor produzida por ele cai na faixa de luminância onde
 * texto branco em 'difference' desaparece. Ele testa o ramp, não o campo, então
 * trocar o gerador não enfraquece a prova, desde que o contradomínio não mude.
 *
 * A geometria é um plano em perspectiva: 'd' é a distância vertical até o
 * horizonte e 'z = 1/d' projeta profundidade. Cuidado com a orientação, porque
 * ela é contraintuitiva: **z pequeno é perto do observador** (base da tela) e
 * **z grande é longe** (junto ao horizonte). A areia fica em z pequeno, o mar
 * em z grande, e a linha d'água é o z onde os dois se encontram.
 */
float waveField(vec2 uv, vec2 aspect, float t, float progress, vec2 pointer) {
  /* Rolar a página caminha de leve em direção ao mar. */
  float horizon = 0.62 + progress * 0.05 + pointer.y * 0.01;

  /* A coluna do rastro do sol, seguida de longe pelo ponteiro. */
  float sunX = 0.5 + pointer.x * 0.06;

  if (uv.y > horizon) {
    /* Céu: gradiente vertical, mais claro junto ao horizonte, com uma banda de
       nuvem lenta em fbm de baixa frequência e o halo do sol descendo. */
    float k = (uv.y - horizon) / max(1.0 - horizon, 0.001);
    float sky = mix(0.66, 0.30, k);
    sky += fbm(vec3(uv.x * 2.2, uv.y * 3.0, t * 0.15)) * 0.09;
    sky += exp(-abs(uv.x - sunX) * 6.0) * (1.0 - k) * 0.20;
    return clamp(sky, 0.0, 1.0);
  }

  float d = horizon - uv.y;
  float z = 1.0 / max(d, 0.004);
  float x = (uv.x - 0.5) * z * aspect.x;

  /*
   * Duas trens de crista com períodos diferentes, viajando em direção ao
   * observador, com a fase deformada por fbm. Sem o warp as cristas viram
   * listras regulares de tutorial.
   */
  float warp = fbm(vec3(x * 0.35, z * 0.25, t * 0.4));
  float w = sin(z * 0.9 - t * 1.6 + warp * 2.2) * 0.6
          + sin(z * 1.7 - t * 2.3 + warp * 1.3) * 0.4;

  /*
   * Perto do horizonte um período inteiro de onda cabe em menos de um pixel e
   * o resultado cintila. Apagar o detalhe conforme z cresce é o que troca esse
   * moiré por uma faixa calma de mar distante.
   */
  w *= 1.0 - smoothstep(7.0, 22.0, z);

  /* Espuma nas cristas: smoothstep de faixa curta. É esta aresta que dá forma
     sólida no lugar do borrão que o campo de noise produzia. */
  float foam = smoothstep(0.38, 0.48, w);

  /* Vaivém: a linha d'água sobe e desce em período longo. Menor é mais perto. */
  float swash = 0.5 + 0.5 * sin(t * 0.35);
  float waterline = mix(3.2, 2.2, swash);

  /* 0 na areia (z pequeno), 1 no mar (z grande). */
  float shore = smoothstep(waterline - 0.4, waterline + 0.4, z);

  /* Água escura, clareando um pouco perto do observador. */
  float water = mix(0.20, 0.38, clamp(d * 2.2, 0.0, 1.0));

  /* Areia clara, e a faixa recém molhada guarda resíduo de espuma. */
  float sand = mix(0.46, 0.62, clamp((waterline - z) * 0.5, 0.0, 1.0));

  float v = mix(sand, water, shore);
  v += foam * shore * 0.42;

  /*
   * A linha de arrebentação: uma faixa clara presa à linha d'água, que sobe e
   * desce com ela. Sem isto a espuma fica espalhada pelo mar inteiro e a
   * imagem perde o único lugar onde uma praia de verdade tem branco sólido.
   * A cauda é assimétrica de propósito: mais longa do lado da areia, que é o
   * resíduo que a água deixa ao recuar.
   */
  float toEdge = z - waterline;
  float uprush = 1.0 - smoothstep(0.0, 0.45, abs(toEdge));
  float residue = (1.0 - smoothstep(0.0, 1.4, max(-toEdge, 0.0))) * 0.4;
  v += (uprush + residue) * (0.55 + 0.45 * foam) * 0.34;

  /* Cintilância do sol, só dentro da coluna do rastro. */
  v += exp(-abs(uv.x - sunX) * 5.0) * smoothstep(0.0, 0.6, w) * shore * 0.16;

  return clamp(v, 0.0, 1.0);
}

void main() {
  /* Corrige a proporção para o campo não esticar junto com a janela. */
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

  float t = uTime * 0.09 + uSeed;

  float v = waveField(vUv, aspect, t, uProgress, uPointer);

  /* Ramp de 3 cores, sem ramificação. */
  vec3 color = mix(uPalette[0], uPalette[1], smoothstep(0.0, 0.5, v));
  color = mix(color, uPalette[2], smoothstep(0.5, 1.0, v));

  gl_FragColor = vec4(color, 1.0);
}
`;

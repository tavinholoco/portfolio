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
 * A §16 do plano acrescentou o sol que anda sozinho, as nuvens num teto em
 * perspectiva, o vaivém sincronizado com a chegada da crista, a areia molhada e
 * a renda de espuma que se desfaz. Tudo continua neste passe e devolve o mesmo
 * `v`: a composição não mudou, e o ramp também não.
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
uniform vec2 uPointer;
uniform vec2 uSunPointer;
uniform vec3 uPalette[3];

/*
 * O detalhe fino (grão e renda) só existe no degrau completo. O motor prefixa
 * '#define DETAIL' quando monta nele; no degrau leve, que é o do Lighthouse, o
 * bloco nem é compilado. uDetail desliga em tempo de execução, para a guarda de
 * tempo de quadro descer sem recompilar.
 */
#ifdef DETAIL
uniform sampler2D uDetailTex;
uniform float uDetail;
#endif

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
 * Ruído de valor 2D: barato de rodar e, principalmente, de compilar.
 *
 * No Chrome sem GPU, que é onde o Lighthouse roda, o SwiftShader compila o
 * shader inteiro no link, de forma síncrona, e o custo cresce com cada cópia de
 * snoise que o compilador expande. O vaivém só precisa de um número suave que
 * varia devagar ao longo da praia, então não paga um snoise (§16.5).
 */
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 2.0 - 1.0;
}

float sat(float x) { return clamp(x, 0.0, 1.0); }

const float TAU = 6.2831853;

/* Fração do ciclo do vaivém gasta subindo a praia. O resto é a descida, que
   começa lenta e acelera ladeira abaixo. */
const float UPRUSH = 0.28;

/*
 * O céu (§16): gradiente, sol que anda sozinho e nuvens.
 *
 * As nuvens são o mesmo fbm de 3 oitavas que o céu já calculava, aplicado num
 * teto em perspectiva que espelha o plano do mar ('zc = 1/dc'): comprimem em
 * faixas perto do horizonte e crescem no alto da tela. A aresta é curta, como a
 * da espuma, para ler como forma e não como borrão. Perto do sol ficam em
 * contraluz: o corpo escurece e só a borda acende. O fbm chega pronto em
 * 'cover': ver o comentário de waveField sobre a chamada única.
 */
float skyField(vec2 uv, vec2 aspect, float horizon, vec2 sun, float cover) {
  float dc = uv.y - horizon;
  float k = dc / max(1.0 - horizon, 0.001);
  float sky = mix(0.62, 0.16, sqrt(k));

  float r = length((uv - sun) * aspect);

  float haze = smoothstep(0.02, 0.16, dc);
  float body = smoothstep(0.0, 0.10, cover) * haze;
  float rim = (smoothstep(-0.04, 0.01, cover) - smoothstep(0.03, 0.14, cover)) * haze;

  float nearSun = exp(-r * 4.5);
  float disc = 1.0 - smoothstep(0.034, 0.040, r);
  float glow = exp(-r * 11.0) * 0.30 + exp(-r * 3.0) * 0.07;
  float band = exp(-dc * 28.0) * exp(-abs(uv.x - sun.x) * 1.8) * 0.12;

  float v = sky + band + glow * (1.0 - body * 0.5) + disc * (1.0 - body * 0.65) * 0.6;
  float lit = mix(sky + 0.07, sky - 0.06, smoothstep(0.05, 0.6, nearSun));
  v = mix(v, lit, body * 0.85);
  v += rim * nearSun * 0.45;
  return v;
}

/*
 * O campo de ondas de praia.
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
 *
 * Todo detalhe novo da §16 mora aqui, no alvo de baixa resolução, e herda o
 * mesmo esticão bilinear do resto. Detalhe em resolução cheia custou 4x no
 * SwiftShader, que é onde o Lighthouse roda (lei 20).
 */
float waveField(vec2 uv, vec2 aspect, float t, vec2 pointer, vec2 sunPointer) {
  float horizon = 0.62 + pointer.y * 0.01;

  /*
   * O sol anda sozinho: vai e volta num arco baixo, uma volta inteira a cada
   * 4 min, mais alto no meio do caminho. A fase sai de uTime em segundos, não
   * de 't', para o período não depender da velocidade das ondas. O ponteiro só
   * empurra de leve, pelo uSunPointer de constante de tempo lenta.
   */
  float sunPhase = uTime * (TAU / 240.0) + uSeed;
  float sunX = 0.55 + 0.22 * sin(sunPhase) + sunPointer.x * 0.03;
  float arc = (sunX - 0.55) / 0.25;
  vec2 sun = vec2(sunX, horizon + 0.07 + 0.06 * (1.0 - arc * arc));

  float d = horizon - uv.y;
  float z = 1.0 / max(d, 0.004);
  float x = (uv.x - 0.5) * z * aspect.x;

  /* O teto das nuvens, espelho do plano do mar: 'zc = 1/dc'. */
  float zc = 1.0 / (max(-d, 0.0) + 0.09);
  vec2 cloud = vec2((uv.x - 0.5) * zc * aspect.x * 0.22 + t * 0.05,
                    zc * 0.55 + t * 0.025);

  /*
   * **Uma chamada de fbm só, para céu e mar.** Cada pixel usa uma das duas, e
   * escolher a coordenada antes de chamar faz o compilador expandir o fbm uma
   * vez, não duas. É metade dos snoise no código compilado, e o SwiftShader
   * compila tudo no link, de forma síncrona, no main thread (§16.5).
   */
  bool isSky = uv.y > horizon;
  float n = fbm(isSky ? vec3(cloud, t * 0.04) : vec3(x * 0.35, z * 0.25, t * 0.4));

  if (isSky) {
    return sat(skyField(uv, aspect, horizon, sun, n + 0.04));
  }

  /*
   * Duas trens de crista com períodos diferentes, viajando em direção ao
   * observador, com a fase deformada por fbm. Sem o warp as cristas viram
   * listras regulares de tutorial.
   *
   * **O sinal do termo de tempo é a direção da onda, e é fácil errar.**
   * Com 'z * k - t * w', a fase constante exige z crescente, e a crista
   * viaja para o horizonte, ou seja, mar adentro. Somando, z decresce e a
   * crista vem para a praia, que é o que a arrebentação faz. Lembre que
   * aqui z pequeno é perto do observador.
   */
  float warp = n;
  float w = sin(z * 0.9 + t * 1.6 + warp * 2.2) * 0.6
          + sin(z * 1.7 + t * 2.3 + warp * 1.3) * 0.4;

  /*
   * Perto do horizonte um período inteiro de onda cabe em menos de um pixel e
   * o resultado cintila. Apagar o detalhe conforme z cresce é o que troca esse
   * moiré por uma faixa calma de mar distante.
   */
  w *= 1.0 - smoothstep(7.0, 22.0, z);
  float foam = smoothstep(0.38, 0.48, w);

  /* Maré: a linha média da água sobe e desce em período longo. */
  float tide = 0.5 + 0.5 * sin(t * 0.35);
  float zs = mix(3.1, 2.6, tide);

  float water = mix(0.20, 0.38, sat(d * 2.2));
  float seaMask = smoothstep(zs - 0.12, zs + 0.30, z);

  /* Arrebentação: perto da linha média a crista vira espuma larga. */
  float near = 1.0 - smoothstep(0.0, 1.8, z - zs);
  float surf = smoothstep(0.05, 0.50, w) * near * seaMask;

  float sea = water + foam * 0.42 * (1.0 - near * 0.5) + surf * 0.34;
  /* Cintilância do sol, só dentro da coluna do rastro. */
  sea += exp(-abs(uv.x - sun.x) * 5.0) * smoothstep(0.0, 0.6, w) * 0.16;

  float v = sea;
  float lace = surf * 0.9;
  float sandMask = 0.0;
  float drift = 0.0;

  if (z < zs + 0.6) {
    /*
     * O vaivém, sincronizado com o trem de cristas principal: c = 0 quando a
     * crista chega à linha média. A água sobe rápido e freia, deixa uma linha
     * de espuma no alcance máximo, e desce acelerando. O alcance varia ao
     * longo da praia (as línguas de espuma).
     */
    float sn = vnoise(vec2(x * 0.35, t * 0.4));
    float phi = zs * 0.9 + t * 1.6 + sn * 1.6;
    float c = fract((phi - 1.5708) / TAU);

    float uq = 1.0 - c / UPRUSH;
    float bq = max(c - UPRUSH, 0.0) / (1.0 - UPRUSH);
    float e = c < UPRUSH ? 1.0 - uq * uq : 1.0 - bq * bq;

    float cusp = vnoise(vec2(x * 0.55, t * 0.12 + 3.7));
    float reach = 0.80 * (0.72 + 0.38 * cusp);
    float zEdge = zs - e * reach;
    float zMax = zs - reach;

    /* Fração da subida em que este ponto está: 0 na linha média, 1 no alcance. */
    float hh = (zs - z) / reach;

    /* Areia seca: clareia subindo a praia, com manchas e marcas de vento. */
    float sandV = mix(0.44, 0.60, sat((zs - z) * 0.55));
    float ripple = sin(z * 26.0 + x * 1.3 + warp * 5.0);

    /*
     * Areia molhada: a água deixou este ponto há 'age' de ciclo. Ela escurece,
     * porque a luz entra mais fundo e é absorvida, e espelha o sol pela
     * película d'água. Depois seca.
     */
    float cu = UPRUSH + (1.0 - UPRUSH) * sqrt(sat(1.0 - hh));
    float age = fract(c - cu);
    float wet = exp(-age * 3.5) * (1.0 - smoothstep(0.95, 1.08, hh));
    wet = max(wet, (1.0 - smoothstep(0.0, 0.35, hh)) * 0.7);

    sandV += ripple * 0.018 * (1.0 - wet) + warp * 0.10;
    sandV -= wet * 0.13;
    sandV += wet * exp(-abs(uv.x - sun.x) * 7.0) * 0.20;

    /* Lâmina d'água: fina na borda, mostra a areia; grossa vira mar. */
    float covered = smoothstep(-0.015, 0.015, z - zEdge);
    float film = sat((z - zEdge) / 0.55);
    float filmV = mix(sandV - 0.05, water + 0.06, film);

    float ebb = c < UPRUSH ? 1.0 : 1.0 - bq;
    float edgeLine = exp(-abs(z - zEdge) * 34.0) * (0.35 + 0.65 * ebb);
    float wrack = exp(-abs(z - zMax) * 20.0) * step(UPRUSH, c) * (1.0 - bq);

    float shoreV = mix(sandV, filmV, covered) + edgeLine * 0.30 + wrack * 0.16;

    v = mix(shoreV, sea, seaMask);
    sandMask = (1.0 - covered * film) * (1.0 - seaMask) * (1.0 - wet * 0.45);

    /* A renda mora na frente da lâmina, não na lâmina inteira. */
    float front = 1.0 - film;
    float filmLace = covered * front * front * (0.35 + 0.65 * ebb);
    lace = mix(max(filmLace, wrack * 0.35) + edgeLine * 0.5, lace, seaMask);
    drift = e * reach;
  }

  /*
   * Grão e renda leem a textura assada no mount, em coordenada de chão: maiores
   * perto, menores rumo à água. Uma leitura cada, e só onde há areia ou
   * espuma. Só existem com DETAIL, e uDetail ainda desliga em tempo de execução.
   */
#ifdef DETAIL
  if (uDetail > 0.5) {
    vec2 g = vec2(x, z);
    if (sandMask > 0.004) {
      v += (texture2D(uDetailTex, g * 0.5).b - 0.5) * sandMask * 0.12;
    }
    /*
     * Renda: uma escala só, células grandes. Fresca, cobre quase tudo; conforme
     * a espuma se desfaz o limiar desce, sobra a rede, depois nada. É o limiar
     * que anima a dissolução, não a textura.
     */
    if (lace > 0.004) {
      vec4 l = texture2D(uDetailTex, vec2(g.x, g.y + drift) * 0.40 + vec2(t * 0.02, 0.0));
      float kk = mix(0.04, 0.66, lace) + (l.r - 0.5) * 0.35;
      float net = 1.0 - smoothstep(kk, kk + 0.10, l.g);
      v += net * smoothstep(0.0, 0.25, lace) * 0.28;
    }
  }
#endif

  return sat(v);
}

void main() {
  /* Corrige a proporção para o campo não esticar junto com a janela. */
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

  float t = uTime * 0.09 + uSeed;

  float v = waveField(vUv, aspect, t, uPointer, uSunPointer);

  /* Ramp de 3 cores, sem ramificação. */
  vec3 color = mix(uPalette[0], uPalette[1], smoothstep(0.0, 0.5, v));
  color = mix(color, uPalette[2], smoothstep(0.5, 1.0, v));

  gl_FragColor = vec4(color, 1.0);
}
`;

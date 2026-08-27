import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

/**
 * Mede para que lado as cristas do fundo viajam.
 *
 * Existe porque o sinal do termo de tempo no shader inverte a direção da
 * onda e **nada acusa**: o fundo continua bonito, animado e sem erro no
 * console, só que o mar corre para o horizonte em vez de quebrar na praia.
 * Foi assim que a v3.5 subiu na primeira tentativa, e quem viu foi o Pedro,
 * não a suíte. Rode com `pnpm waves`.
 *
 * Controle negativo: troque o `+ t` por `- t` no `field.ts` e este teste tem
 * que reprovar. Já foi conferido que reprova.
 *
 * Não dá para ler o canvas do site: ele nasce sem `preserveDrawingBuffer`, e
 * tanto `readPixels` quanto `drawImage` voltam vazios depois do composite. A
 * saída é compilar **o mesmo GLSL**, lido do arquivo que o site importa, num
 * contexto próprio, e renderizar dois instantes escolhidos. Determinístico, sem
 * depender de rAF nem de composite.
 */
function glslDe(caminho: string): string {
  const fonte = readFileSync(caminho, "utf8");
  const i = fonte.indexOf("/* glsl */ `") + "/* glsl */ `".length;
  const j = fonte.lastIndexOf("`;");
  return fonte.slice(i, j);
}

test("as cristas vêm para a praia, não para o horizonte", async ({ page }) => {
  const vertex = glslDe("src/components/background/shaders/vertex.ts");
  const field = glslDe("src/components/background/shaders/field.ts");

  await page.goto("/");

  const resultado = await page.evaluate(
    ({ vertex, field }) => {
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 256;
      const gl = cv.getContext("webgl2", { preserveDrawingBuffer: true });
      if (!gl) return { erro: "sem webgl2" };

      const compilar = (tipo: number, src: string) => {
        const sh = gl.createShader(tipo)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(sh) ?? "erro de compilação");
        }
        return sh;
      };

      const prog = gl.createProgram()!;
      gl.attachShader(prog, compilar(gl.VERTEX_SHADER, vertex));
      gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, field));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        return { erro: gl.getProgramInfoLog(prog) ?? "link falhou" };
      }
      gl.useProgram(prog);

      /* Triângulo fullscreen, o mesmo do OGL: uv vai de 0 a 2. */
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]),
        gl.STATIC_DRAW
      );
      const locPos = gl.getAttribLocation(prog, "position");
      const locUv = gl.getAttribLocation(prog, "uv");
      gl.enableVertexAttribArray(locPos);
      gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(locUv);
      gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, 16, 8);

      const u = (n: string) => gl.getUniformLocation(prog, n);
      gl.uniform1f(u("uSeed"), 0);
      gl.uniform2f(u("uResolution"), 256, 256);
      gl.uniform2f(u("uPointer"), 0, 0);
      /* graphite */
      gl.uniform3fv(
        u("uPalette[0]"),
        new Float32Array([
          0.055, 0.063, 0.094, 0.137, 0.157, 0.22, 0.271, 0.31, 0.42,
        ])
      );

      const perfil = (tempo: number) => {
        gl.uniform1f(u("uTime"), tempo);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const px = new Uint8Array(256 * 4);
        /* Uma coluna central inteira. readPixels tem y=0 embaixo, igual ao uv. */
        gl.readPixels(128, 0, 1, 256, gl.RGBA, gl.UNSIGNED_BYTE, px);
        const out: number[] = [];
        for (let y = 0; y < 256; y++) {
          out.push(px[y * 4] + px[y * 4 + 1] + px[y * 4 + 2]);
        }
        return out;
      };

      /* uTime em segundos; o shader faz t = uTime * 0.09. */
      return { a: perfil(0), b: perfil(4) };
    },
    { vertex, field }
  );

  expect(resultado.erro, `shader não subiu: ${resultado.erro}`).toBeUndefined();
  const a = resultado.a!;
  const b = resultado.b!;
  expect(a.some((v) => v !== a[0])).toBe(true);

  /* Só a metade de baixo, que é onde está o mar. Acima do horizonte é céu. */
  let melhor = { d: 0, erro: Infinity };
  for (let d = -60; d <= 60; d++) {
    let soma = 0;
    let n = 0;
    for (let y = 20; y < 150; y++) {
      const yb = y + d;
      if (yb < 0 || yb >= b.length) continue;
      soma += Math.abs(a[y] - b[yb]);
      n++;
    }
    const erro = soma / n;
    if (erro < melhor.erro) melhor = { d, erro };
  }

  /*
   * Em uv, y cresce para CIMA na tela e z cresce em direção ao horizonte.
   * O padrão em `a` na altura y aparece em `b` na altura y+d. Se d é negativo,
   * o padrão desceu em uv, ou seja veio para a praia.
   */
  console.log(
    `deslocamento=${melhor.d} (uv, y para cima)  erro=${melhor.erro.toFixed(2)}  ` +
      `direcao=${melhor.d < 0 ? "VEM PARA A PRAIA" : melhor.d > 0 ? "VAI PARA O HORIZONTE" : "parado"}`
  );

  expect(melhor.d).toBeLessThan(0);
});

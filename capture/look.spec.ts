import { test } from "@playwright/test";

/**
 * Captura de tela sob demanda, para inspecionar o site durante o desenvolvimento.
 *
 * Existe porque boa parte do que a v3 faz não é observável por DOM nem por
 * `getComputedStyle`: o resultado de `mix-blend-mode` é um efeito de composição,
 * e o shader é pixel. Para julgar essas duas coisas é preciso olhar a imagem.
 *
 * Uso:
 *   pnpm look
 *   LOOK_PATHS=/,/#contato LOOK_THEMES=light pnpm look
 *   LOOK_PATHS=/ LOOK_FULL=1 pnpm look
 *
 * As imagens vão para `.captures/`, que é ignorada pelo git.
 */

const paths = (process.env.LOOK_PATHS ?? "/").split(",").filter(Boolean);
const themes = (process.env.LOOK_THEMES ?? "dark,light")
  .split(",")
  .filter(Boolean);
const fullPage = process.env.LOOK_FULL === "1";

/** Tempo para o campo do shader sair do frame inicial e assentar. */
const SETTLE_MS = Number(process.env.LOOK_SETTLE ?? 1400);

function slug(value: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return cleaned || "home";
}

for (const path of paths) {
  for (const theme of themes) {
    test(`captura ${path} no tema ${theme}`, async ({ page }) => {
      /* O tema é aplicado antes do primeiro paint pelo script inline dos
         layouts, que lê o localStorage. Semear aqui evita capturar o flash. */
      await page.addInitScript((value) => {
        try {
          localStorage.setItem("theme", value);
        } catch {
          /* modo privado: cai no padrão escuro, e a captura ainda serve */
        }
      }, theme);

      await page.goto(path);
      await page.waitForLoadState("networkidle");

      /* Se o caminho tem âncora, rola até ela antes de capturar. */
      const hash = path.includes("#") ? path.slice(path.indexOf("#") + 1) : "";
      if (hash) {
        await page
          .locator(`#${hash}`)
          .scrollIntoViewIfNeeded()
          .catch(() => {});
      }

      await page.waitForTimeout(SETTLE_MS);

      await page.screenshot({
        path: `.captures/${slug(path)}-${theme}.png`,
        fullPage,
      });
    });
  }
}

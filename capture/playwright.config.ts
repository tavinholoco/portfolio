import { defineConfig, devices } from "@playwright/test";

/**
 * Config separada da suíte de E2E, de propósito.
 *
 * O que roda aqui não é teste, é captura de tela sob demanda, usada para
 * inspecionar o site durante o desenvolvimento. Misturar com `playwright.config.ts`
 * faria o CI gastar tempo gerando imagens que ninguém olha, e faria `pnpm test:e2e`
 * falhar por motivo estético.
 *
 * Reaproveita o servidor de produção se já houver um de pé, então rode
 * `pnpm build` antes.
 *
 * ⚠️ Se já houver um servidor na porta 3000 iniciado **antes** do último
 * `pnpm build`, ele continua servindo o build velho: o `next start` lê o
 * `.next` na hora que sobe. O sintoma é uma captura sem CSS nenhum, porque o
 * HTML antigo aponta para arquivos de estilo que o build novo renomeou.
 * Derrube o servidor antes de capturar depois de um build.
 */
export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  reporter: "list",
  use: {
    /* O spread vem primeiro de propósito: depois dele, ele sobrescreveria o
       viewport e o site seria capturado em 1280x720. */
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});

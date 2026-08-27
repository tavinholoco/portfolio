import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do portfólio: as invariantes de shell, showcase, navegação e o <html lang>
 * por rota. Usa o servidor de produção (`pnpm start`), então rode `pnpm build`
 * antes de testar localmente; no CI o build é uma etapa separada.
 *
 * ⚠️ `reuseExistingServer` aproveita qualquer servidor já de pé na porta 3000,
 * inclusive um iniciado **antes** do último build, que continua servindo o
 * `.next` antigo. O sintoma é teste falhando por uma correção que já está no
 * código. Se um teste insistir em ver o estado velho, derrube a porta 3000
 * antes de rodar.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

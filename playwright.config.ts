import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do portfólio: valida o <html lang> por rota (SSR) e o funcionamento
 * das rotas principais. Usa o servidor de produção (`pnpm start`), então rode
 * `pnpm build` antes de testar localmente; no CI o build é uma etapa separada.
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

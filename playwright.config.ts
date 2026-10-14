import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do portfólio: as invariantes de shell, showcase, navegação e o <html lang>
 * por rota. Roda contra o `pnpm start`, que é o `wrangler dev` servindo a pasta
 * `out/` do export estático com o mesmo servidor de assets da Cloudflare:
 * `_headers`, `_redirects` e `html_handling` valem aqui como em produção, e é
 * isso que deixa o E2E provar a lei 22. Rode `pnpm build` antes de testar
 * localmente; no CI o build é uma etapa separada.
 *
 * ⚠️ `reuseExistingServer` aproveita qualquer servidor já de pé na porta 3000,
 * inclusive um iniciado **antes** do último build. O sintoma é teste falhando
 * por uma correção que já está no código. Se um teste insistir em ver o estado
 * velho, derrube a porta 3000 antes de rodar.
 *
 * ⚠️ No Windows, encerrar o `wrangler dev` deixa `workerd.exe` órfão, que
 * segura a porta e a pasta `out/`: o build seguinte falha com `EBUSY`. Mate o
 * `node` do wrangler e depois os `workerd.exe` antes de buildar de novo: na
 * ordem inversa, o wrangler sobe o `workerd` outra vez (§17.5).
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

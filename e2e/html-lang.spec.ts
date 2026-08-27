import { expect, test } from "@playwright/test";

/**
 * O <html lang> deve nascer correto no HTML servido (SSR) em cada rota, sem
 * depender de script no cliente. Cada caso valida as duas coisas:
 *  1. o HTML bruto servido (request.get) já contém o lang certo; e
 *  2. o atributo no DOM renderizado também.
 */
const routes = [
  { path: "/", lang: "pt" },
  { path: "/clientes/", lang: "pt" },
  { path: "/projetos/", lang: "pt" },
  { path: "/info/", lang: "pt" },
  { path: "/contato/", lang: "pt" },
  { path: "/en/", lang: "en" },
  { path: "/en/clients/", lang: "en" },
  { path: "/en/projects/", lang: "en" },
  { path: "/en/info/", lang: "en" },
  { path: "/en/contact/", lang: "en" },
  { path: "/projetos/newra-news/", lang: "pt" },
  { path: "/en/projects/newra-news/", lang: "en" },
  { path: "/projetos/netsheet-engine/", lang: "pt" },
  { path: "/en/projects/repertorio-progressivo/", lang: "en" },
] as const;

test.describe("<html lang> por rota (SSR)", () => {
  for (const { path, lang } of routes) {
    test(`${path} nasce com lang="${lang}"`, async ({ page, request }) => {
      // 1. HTML bruto do servidor (SSR), não passa por JS de cliente.
      const response = await request.get(path);
      expect(response.ok(), `${path} deveria responder 200`).toBeTruthy();
      const html = await response.text();
      expect(html).toContain(`<html lang="${lang}"`);

      // 2. DOM renderizado no navegador.
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
    });
  }
});

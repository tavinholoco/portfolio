import { INTRO } from "../src/components/shell/intro-config";

import { expect, test, type Page } from "./fixtures";

/**
 * A abertura (§16.9): cortina preta, as letras do nome sobem, o nome desliza
 * até o header e a cortina se dissolve. Uma vez por sessão.
 *
 * Todo o resto da suíte roda com ela desligada pela fixture; aqui ela liga.
 * As garantias que importam são as que quebrariam sem aviso: ninguém fica
 * preso, o clique chega na página, o nome do header (o LCP) nunca some, e o
 * pouso bate no pixel.
 */
test.use({ intro: true });

/** Espera o JS da abertura assumir: ele cancela a reserva do CSS ao montar. */
async function esperarHidratar(page: Page) {
  await page.waitForFunction(
    () => document.querySelector(".intro")?.getAnimations().length === 0
  );
}

test.describe("a abertura", () => {
  test("aparece na primeira visita, pousa sobre o nome do header e some", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "");
    await expect(page.locator(".intro")).toBeVisible();

    const pouso = await page.evaluate(async () => {
      const nome = document.querySelector("[data-intro-nome]")!;
      for (let i = 0; i < 200; i++) {
        const deslize = nome
          .getAnimations()
          .find((a) => a.id === "intro-deslize");
        if (deslize) {
          await deslize.finished;
          break;
        }
        await new Promise((r) => setTimeout(r, 25));
      }
      const r = (el: Element) => {
        const b = el.getBoundingClientRect();
        return { left: b.left, top: b.top, width: b.width, height: b.height };
      };
      return {
        nome: r(nome),
        link: r(document.querySelector("[data-intro-alvo]")!),
      };
    });
    for (const lado of ["left", "top", "width", "height"] as const) {
      expect(Math.abs(pouso.nome[lado] - pouso.link[lado])).toBeLessThan(1);
    }

    await expect(page.locator("html")).not.toHaveAttribute("data-intro");
    await expect(page.locator(".intro")).toBeHidden();
    expect(
      await page.evaluate((chave) => sessionStorage.getItem(chave), INTRO.chave)
    ).toBe("1");
  });

  test("o nome do header continua visível por baixo da cortina (LCP)", async ({
    page,
  }) => {
    /* O link do header é o elemento de LCP nas cinco rotas. A cortina só
       cobre, e o LCP não leva oclusão em conta; se o link ficasse invisível
       durante a abertura, o LCP passaria a contar só no fim dela. */
    await page.goto("/");
    await expect(page.locator(".intro")).toBeVisible();
    const link = page.locator("[data-intro-alvo]");
    expect(await link.evaluate((a) => getComputedStyle(a).opacity)).toBe("1");
    expect(await link.evaluate((a) => a.checkVisibility())).toBe(true);
  });

  test("não volta na mesma sessão", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", {
      timeout: 8000,
    });
    await page.goto("/info/");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro");
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("não aparece com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro");
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("não bloqueia o clique: a nav funciona com a cortina na tela", async ({
    page,
  }) => {
    /*
     * Sem `pointer-events: none` na cortina, o Playwright acusaria que ela
     * intercepta o clique, e a pessoa ficaria esperando a abertura acabar
     * para conseguir navegar.
     */
    await page.goto("/");
    await esperarHidratar(page);
    await expect(page.locator(".intro")).toBeVisible();
    await page.locator('header nav a[href="/projetos/"]').click();
    await expect(page).toHaveURL(/\/projetos\/$/);
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("uma tecla encerra na hora", async ({ page }) => {
    await page.goto("/");
    await esperarHidratar(page);
    await expect(page.locator(".intro")).toBeVisible();
    await page.keyboard.press("Shift");
    /* Bem antes dos ~2 s que ela levaria sozinha. */
    await expect(page.locator(".intro")).toBeHidden({ timeout: 700 });
    expect(
      await page.evaluate((chave) => sessionStorage.getItem(chave), INTRO.chave)
    ).toBe("1");
  });

  test("sem o JS, a reserva do CSS tira a cortina sozinha", async ({ page }) => {
    /*
     * O script do <head> é inline e roda mesmo assim, então a cortina
     * aparece. Sem os chunks, ninguém hidrata e nada a tiraria: é a reserva
     * de 4 s do CSS que garante que ninguém fica preso numa tela preta.
     */
    /* Só os scripts: o CSS mora na mesma pasta, e é ele que tira a cortina. */
    await page.route("**/_next/static/**", (rota) =>
      rota.request().resourceType() === "script" ? rota.abort() : rota.continue()
    );
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "");
    await expect(page.locator(".intro")).toBeVisible();
    await expect(page.locator(".intro")).toBeHidden({ timeout: 6000 });
  });
});

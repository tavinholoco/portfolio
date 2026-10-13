import { test as base, type BrowserContext } from "@playwright/test";

import { INTRO } from "../src/components/shell/intro-config";

export { devices, expect, type Page } from "@playwright/test";

/**
 * A abertura aparece uma vez por sessão (§16.9), e todo contexto do Playwright
 * nasce sem `sessionStorage`: sem isto, a cortina cobriria a tela no começo de
 * **todo** teste, por uns 2 s. A chave é semeada antes de qualquer script da
 * página, então o `<head>` nem chega a marcar o `<html>`.
 *
 * Os testes da própria abertura ligam com `test.use({ intro: true })`. Quem
 * cria contexto à mão com `browser.newContext()` não passa por aqui e precisa
 * chamar `pularIntro(context)`.
 */
export async function pularIntro(context: BrowserContext) {
  await context.addInitScript((chave) => {
    try {
      sessionStorage.setItem(chave, "1");
    } catch {
      /* sem sessionStorage a abertura não aparece mesmo */
    }
  }, INTRO.chave);
}

export const test = base.extend<{ intro: boolean }>({
  intro: [false, { option: true }],
  /* `entregar` é o `use` da fixture; com o nome `use` o ESLint o confunde com
     o hook do React. */
  context: async ({ context, intro }, entregar) => {
    if (!intro) await pularIntro(context);
    await entregar(context);
  },
});

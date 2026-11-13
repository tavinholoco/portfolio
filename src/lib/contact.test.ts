import { describe, expect, it } from "vitest";

import { profile } from "@/data/profile";
import { dictionaries } from "@/i18n";

import { contactDisplay, whatsappLink } from "./contact";

/**
 * Fase 4 do plano V4. O texto do cartão do LinkedIn estava digitado nos dois
 * dicionários com um endereço que não é o dele, enquanto o link ia para o
 * certo. Agora o que se lê deriva do que se clica.
 */
describe("os contatos escritos derivam do perfil", () => {
  it("o LinkedIn e o GitHub escritos saem dos links", () => {
    expect(contactDisplay.linkedin).toBe("in/pedrolevidias");
    expect(profile.linkedin).toContain(contactDisplay.linkedin);
    expect(contactDisplay.github).toBe("@tavinholoco");
  });

  it("o email é o do domínio, e os dicionários não digitam contato nenhum", () => {
    expect(contactDisplay.email).toBe("contato@pedrolevi.com.br");
    for (const lang of ["pt", "en"] as const) {
      const texto = JSON.stringify(dictionaries[lang]);
      expect(texto).not.toMatch(/@gmail\.com|pedro-levi-dias|99626/);
    }
  });
});

describe("whatsappLink", () => {
  it("leva o número do perfil e a mensagem do dicionário, codificada", () => {
    for (const lang of ["pt", "en"] as const) {
      for (const origem of ["service", "contact"] as const) {
        const url = new URL(whatsappLink(lang, origem));
        expect(`${url.origin}${url.pathname}`).toBe(profile.whatsapp);
        expect(url.searchParams.get("text")).toBe(
          dictionaries[lang].whatsapp[origem]
        );
      }
    }
  });

  it("a mensagem muda com a página e com o idioma", () => {
    const todas = (["pt", "en"] as const).flatMap((lang) =>
      (["service", "contact"] as const).map((origem) => whatsappLink(lang, origem))
    );
    expect(new Set(todas).size).toBe(4);
  });
});

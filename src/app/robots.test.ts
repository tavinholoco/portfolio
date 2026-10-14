import { afterEach, describe, expect, it, vi } from "vitest";

function setEnv(vars: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  setEnv({
    NEXT_PUBLIC_SITE_URL: undefined,
    WORKERS_CI: undefined,
  });
});

describe("robots", () => {
  it("permite tudo e aponta o sitemap absoluto", async () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: "https://pedrolevi.com.br" });
    vi.resetModules();
    const { default: robots } = await import("./robots");

    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://pedrolevi.com.br/sitemap.xml",
    });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { FeaturedProject } from "@/i18n";

import { getFeaturedProjects } from "./github";

const featured: FeaturedProject[] = [
  {
    slug: "newra-news",
    title: "Newra News",
    tagline: "Portal de notícias.",
    problem: "Problema.",
    solution: "Solução.",
    highlight: "Destaque.",
    stack: ["Next.js"],
    category: "fullstack",
    learnings: ["Aprendizado."],
  },
];

function mockFetchResponse(ok: boolean, body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("getFeaturedProjects", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      mockFetchResponse(true, [
        {
          name: "newra-news",
          description: "no github",
          html_url: "https://github.com/tavinholoco/newra-news",
          homepage: "https://newra-news-web.vercel.app",
          language: "TypeScript",
          stargazers_count: 5,
          pushed_at: "2026-04-10T12:00:00Z",
        },
      ])
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    globalThis.fetch = originalFetch;
  });

  it("mescla os dados reais do repositório com a curadoria", async () => {
    const [project] = await getFeaturedProjects(featured, "pt");

    expect(project.repo).toBe("newra-news");
    expect(project.language).toBe("TypeScript");
    expect(project.repoUrl).toBe("https://github.com/tavinholoco/newra-news");
    expect(project.demoUrl).toBe("https://newra-news-web.vercel.app");
    expect(project.updatedAt).not.toBeNull();
    // O resto da curadoria é preservado
    expect(project.title).toBe("Newra News");
    expect(project.category).toBe("fullstack");
  });

  it("formata a data no idioma da rota (pt-BR vs en-US)", async () => {
    const [pt] = await getFeaturedProjects(featured, "pt");
    const [en] = await getFeaturedProjects(featured, "en");

    expect(pt.updatedAt).toMatch(/\w/);
    expect(en.updatedAt).toMatch(/\w/);
    // Locales diferentes não geram a mesma string de mês/ano
    expect(pt.updatedAt).not.toBe(en.updatedAt);
  });

  it("cai no fallback estático quando a API falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const [project] = await getFeaturedProjects(featured, "pt");

    expect(project.language).toBeNull();
    expect(project.updatedAt).toBeNull();
    expect(project.repoUrl).toBe("https://github.com/tavinholoco/newra-news");
    // A demo curada (src/data/projects.ts) sobrevive à falha da API
    expect(project.demoUrl).toBe("https://newra-news-web.vercel.app");
  });

  it("cai no fallback estático quando a resposta não é ok", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchResponse(false, { message: "rate limit" }, 403)
    );

    const [project] = await getFeaturedProjects(featured, "en");

    expect(project.language).toBeNull();
    expect(project.updatedAt).toBeNull();
    // A demo curada (src/data/projects.ts) sobrevive à falha da API
    expect(project.demoUrl).toBe("https://newra-news-web.vercel.app");
  });

  /*
   * O token existe por causa do build na Cloudflare, onde o limite de 60
   * por hora sem token é dividido com quem mais usa a mesma máquina (§17.5).
   * O par prova que ele vai quando existe e que nada muda quando não existe.
   */
  describe("GITHUB_TOKEN", () => {
    afterEach(() => {
      delete process.env.GITHUB_TOKEN;
    });

    function cabecalhosDaChamada(): Record<string, string> {
      const chamada = vi.mocked(globalThis.fetch).mock.calls[0];
      return (chamada[1]?.headers ?? {}) as Record<string, string>;
    }

    it("manda Authorization quando o token existe", async () => {
      process.env.GITHUB_TOKEN = "github_pat_teste";
      await getFeaturedProjects(featured, "pt");
      expect(cabecalhosDaChamada().Authorization).toBe(
        "Bearer github_pat_teste"
      );
    });

    it("não manda Authorization sem o token", async () => {
      await getFeaturedProjects(featured, "pt");
      expect(cabecalhosDaChamada()).not.toHaveProperty("Authorization");
    });

    /*
     * Token vencido: a primeira chamada leva 401, e a segunda, sem o token,
     * traz o dado. Sem a volta, o case sairia sem linguagem em todo build, e
     * o build passaria (§17.16).
     */
    it("com o token recusado (401), busca de novo sem ele e o dado chega", async () => {
      process.env.GITHUB_TOKEN = "github_pat_vencido";
      const comDado = await mockFetchResponse(true, [
        {
          name: "newra-news",
          description: null,
          html_url: "https://github.com/tavinholoco/newra-news",
          homepage: null,
          language: "TypeScript",
          stargazers_count: 0,
          pushed_at: "2026-04-10T12:00:00Z",
        },
      ])();
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) })
        .mockResolvedValueOnce(comDado);
      vi.stubGlobal("fetch", fetchMock);
      const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});

      const [project] = await getFeaturedProjects(featured, "pt");

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[1][1].headers).not.toHaveProperty("Authorization");
      expect(project.language).toBe("TypeScript");
      expect(aviso).toHaveBeenCalledOnce();
      aviso.mockRestore();
    });

    it("sem token, um 401 não gera segunda chamada", async () => {
      const fetchMock = mockFetchResponse(false, {}, 401);
      vi.stubGlobal("fetch", fetchMock);
      await getFeaturedProjects(featured, "pt");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});

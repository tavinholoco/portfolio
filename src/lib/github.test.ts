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
          homepage: "https://newra.vercel.app",
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
    expect(project.demoUrl).toBe("https://newra.vercel.app");
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
    expect(project.demoUrl).toBe("https://newra.vercel.app");
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
    expect(project.demoUrl).toBe("https://newra.vercel.app");
  });
});

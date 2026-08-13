import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("junta classes simples", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("ignora valores falsy", () => {
    expect(cn("a", undefined, null, false, "", "b")).toBe("a b");
  });

  it("mescla conflitos de classes do Tailwind (twMerge)", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("funciona com arrays e objetos do clsx", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});

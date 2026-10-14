import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Capturas e laboratórios locais, ignorados pelo git. Os scripts .cjs de
    // medição usam require() e reprovavam o `pnpm lint` só na máquina de
    // desenvolvimento, porque no CI a pasta não existe.
    ".captures/**",
    // Estado local do `wrangler dev` (o `pnpm start`): bundles gerados que
    // sujavam o lint só depois de um E2E local, pelo mesmo motivo.
    ".wrangler/**",
  ]),
]);

export default eslintConfig;

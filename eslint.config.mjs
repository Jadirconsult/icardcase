// ESLint flat config — `next lint` foi removido no Next 16; roda via `eslint .`.
// Presets do eslint-config-next: core-web-vitals (react, hooks, a11y, next) +
// typescript (typescript-eslint recommended).
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Defaults do eslint-config-next (repetidos porque globalIgnores sobrescreve).
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Não é código do site.
    'public/**',
    'docs/**',
    // Artefatos de ferramentas locais (agentes, Playwright, Vercel CLI).
    '.agents/**',
    '.claude/**',
    '.impeccable/**',
    '.playwright-mcp/**',
    '.vercel/**',
  ]),
])

export default eslintConfig

// eslint.config.mjs
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.next/**',
      '.wrangler/**',
      'node_modules/**',
      '_backup_nextjs/**',
    ],
  },
];

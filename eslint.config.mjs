// eslint.config.mjs
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.astro'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    extends: [...tseslint.configs.recommended],
  },
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '_backup_nextjs/**'],
  },
];

import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default [
  { ignores: ['dist/**','node_modules/**','.astro/**','.playwright-cli/**','.previewdist*/**','.superpowers/**','.codex-remote-attachments/**','playwright-report/**','test-results/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  { languageOptions: {globals: {process:'readonly',document:'readonly',window:'readonly',console:'readonly',requestAnimationFrame:'readonly',matchMedia:'readonly',IntersectionObserver:'readonly',HTMLElement:'readonly',HTMLInputElement:'readonly',HTMLSelectElement:'readonly',HTMLButtonElement:'readonly',HTMLFormElement:'readonly',HTMLTableSectionElement:'readonly',URL:'readonly',Response:'readonly',setTimeout:'readonly'}}, rules: {'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_'}]} },
];

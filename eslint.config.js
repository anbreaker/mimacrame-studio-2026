// @ts-check
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsonc from 'eslint-plugin-jsonc';
import * as jsoncParser from 'jsonc-eslint-parser';
import playwright from 'eslint-plugin-playwright';

import componentDecoratorOrder from './.eslint/rules/component-decorator-order.js';
import injectBeforeSignals from './.eslint/rules/inject-before-signals.js';
import alphabeticalInputsSignals from './.eslint/rules/alphabetical-inputs-signals.js';
import alphabeticalComponentImports from './.eslint/rules/alphabetical-component-imports.js';

const customRules = {
  'component-decorator-order': componentDecoratorOrder,
  'inject-before-signals': injectBeforeSignals,
  'alphabetical-inputs-signals': alphabeticalInputsSignals,
  'alphabetical-component-imports': alphabeticalComponentImports,
};

export default tseslint.config(
  // Block 1: Global ignores
  {
    ignores: ['www/', 'dist/', 'node_modules/', 'reports/', '.stryker-tmp/'],
  },

  // Block 2: TypeScript files
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@angular-eslint': angular.tsPlugin,
      'simple-import-sort': simpleImportSort,
      custom: { rules: customRules },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Angular rules
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],

      // Import ordering
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Angular & RxJS
            ['^@angular', '^rxjs'],
            // Internal aliases
            ['^@(core|components|features|pages|shared|environments|assets|styles|i18n)'],
            // Relative imports
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Custom Angular rules
      'custom/component-decorator-order': 'error',
      'custom/inject-before-signals': 'error',
      'custom/alphabetical-inputs-signals': 'warn',
      'custom/alphabetical-component-imports': 'warn',
    },
  },

  // Block 3: Store files — relax member-ordering
  {
    files: ['**/*.store.ts'],
    rules: {
      '@typescript-eslint/member-ordering': 'off',
    },
  },

  // Block 4: HTML templates
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angular.templatePlugin,
      custom: { rules: customRules },
    },
    languageOptions: {
      parser: angular.templateParser,
    },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },

  // Block 5: Spec files — relax no-explicit-any
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Block 6: E2E / Playwright tests
  {
    files: ['tests/**/*.ts'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
    },
  },

  // Block 7: JSON files
  {
    files: ['**/*.json'],
    ignores: ['**/tsconfig*.json', 'package-lock.json'],
    plugins: { jsonc },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      'jsonc/sort-keys': 'error',
      'jsonc/no-comments': 'error',
    },
  },

  // Block 8: tsconfig JSON files — allow comments
  {
    files: ['**/tsconfig*.json'],
    plugins: { jsonc },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      'jsonc/no-comments': 'off',
    },
  }
);

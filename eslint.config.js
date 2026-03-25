// @ts-check
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsonc from 'eslint-plugin-jsonc';
import * as jsoncParser from 'jsonc-eslint-parser';
import playwright from 'eslint-plugin-playwright';
import perfectionist from 'eslint-plugin-perfectionist';
import stylistic from '@stylistic/eslint-plugin';

import componentDecoratorOrder from './.eslint/rules/component-decorator-order.js';
import injectBeforeSignals from './.eslint/rules/inject-before-signals.js';
import alphabeticalInputsSignals from './.eslint/rules/alphabetical-inputs-signals.js';
import alphabeticalComponentImports from './.eslint/rules/alphabetical-component-imports.js';

const customRules = {
  'alphabetical-component-imports': alphabeticalComponentImports,
  'alphabetical-inputs-signals': alphabeticalInputsSignals,
  'component-decorator-order': componentDecoratorOrder,
  'inject-before-signals': injectBeforeSignals,
};

export default tseslint.config(
  // Block 1: Global ignores
  {
    ignores: ['www/', 'dist/', 'node_modules/', 'reports/', '.stryker-tmp/', 'functions/'],
  },

  // Block 1.5: JS files (Global config files, ESLint rules, etc)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Block 2: TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        createDefaultProgram: true,
        project: ['tsconfig.json'],
      },
    },
    plugins: {
      '@angular-eslint': angular.tsPlugin,
      '@stylistic': stylistic,
      '@typescript-eslint': tseslint.plugin,
      custom: { rules: customRules },
      perfectionist,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Angular rules
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',

      // General rules
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // Fully automatic sorting rules via perfectionist
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          partitionByComment: true,
          partitionByNewLine: true,
          type: 'natural',
        },
      ],
      'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'natural' }],
      'perfectionist/sort-enums': ['error', { order: 'asc', type: 'natural' }],
      'perfectionist/sort-classes': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: 'ng(OnChanges|OnInit|DoCheck|AfterContentInit|AfterContentChecked|AfterViewInit|AfterViewChecked|OnDestroy)',
              groupName: 'lifecycle',
            },
            // Injects
            {
              elementValuePattern: 'inject(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'private-inject',
              modifiers: ['private'],
            },
            {
              elementValuePattern: 'inject(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'protected-inject',
              modifiers: ['protected'],
            },
            {
              elementValuePattern: 'inject(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'public-inject',
              modifiers: ['public'],
            },
            // Signals
            {
              elementValuePattern: 'signal(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'private-signal',
              modifiers: ['private'],
            },
            {
              elementValuePattern: 'signal(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'protected-signal',
              modifiers: ['protected'],
            },
            {
              elementValuePattern: 'signal(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'public-signal',
              modifiers: ['public'],
            },
            // Computeds
            {
              elementValuePattern: 'computed(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'private-computed',
              modifiers: ['private'],
            },
            {
              elementValuePattern: 'computed(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'protected-computed',
              modifiers: ['protected'],
            },
            {
              elementValuePattern: 'computed(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'public-computed',
              modifiers: ['public'],
            },
            {
              elementValuePattern: 'input(\\.required)?(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'input',
            },
            {
              elementValuePattern: 'output(<[\\s\\S]*>)?\\([\\s\\S]*\\)',
              groupName: 'output',
            },
          ],
          groups: [
            'index-signature',
            'static-property',
            'private-inject',
            'protected-inject',
            'public-inject',
            'private-signal',
            'protected-signal',
            'public-signal',
            'private-computed',
            'protected-computed',
            'public-computed',
            'input',
            'output',
            'private-property',
            'protected-property',
            'public-property',
            'constructor',
            'lifecycle',
            ['method', 'private-method', 'protected-method', 'public-method'],
          ],
          newlinesBetween: 'ignore',
          order: 'asc',
          type: 'natural',
        },
      ],

      // Import ordering
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Third-party packages (Angular, RxJS, and others like @ngx-translate)
            [
              '^@angular',
              '^rxjs',
              '^@(?!(core|components|features|pages|shared|environments|assets|styles|i18n))',
              '^\\w',
            ],
            // Internal aliases
            ['^@(core|components|features|pages|shared|environments|assets|styles|i18n)'],
            // Relative imports
            ['^\\.'],
          ],
        },
      ],

      // Custom Angular rules
      'custom/alphabetical-component-imports': 'warn',
      'custom/alphabetical-inputs-signals': 'warn',
      'custom/inject-before-signals': 'error',
    },
  },

  // Block 2.5: API serverless functions — override tsconfig project
  {
    files: ['api/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.api.json'],
      },
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
    languageOptions: {
      parser: angular.templateParser,
    },
    plugins: {
      '@angular-eslint/template': angular.templatePlugin,
      custom: { rules: customRules },
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
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
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
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: { jsonc },
    rules: {
      'jsonc/no-comments': 'error',
      'jsonc/sort-keys': 'error',
    },
  },

  // Block 8: tsconfig JSON files — allow comments
  {
    files: ['**/tsconfig*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: { jsonc },
    rules: {
      'jsonc/no-comments': 'off',
    },
  }
);

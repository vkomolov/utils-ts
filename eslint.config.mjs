import js from '@eslint/js';
import globals from 'globals';

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.{ts,js}'],

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      /* TypeScript */
      ...tsPlugin.configs.recommended.rules,

      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

      '@typescript-eslint/no-unused-vars': 'off',

      /* disable JS no-undef because TS handles it */
      'no-undef': 'off',

      /* Imports */
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      /* Unused imports */
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      /* Quality */
      'no-debugger': 'warn',
      'no-console': 'off',
    },
  },

  prettierConfig,

  {
    ignores: ['node_modules', 'dist', 'coverage', '.idea', '.vscode'],
  },
];

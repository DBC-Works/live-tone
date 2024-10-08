import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import globals from 'globals'
import typeScriptESLint from '@typescript-eslint/eslint-plugin'
import typeScriptESLintParser from '@typescript-eslint/parser'

import eslintConfigPrettier from 'eslint-config-prettier'

import reactRefresh from 'eslint-plugin-react-refresh'
import html from 'eslint-plugin-html'
import jsdoc from 'eslint-plugin-jsdoc'
import markdown from 'eslint-plugin-markdown'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const compat = new FlatCompat()

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/dist/**', '**/coverage/**'],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends(
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react-hooks/recommended'
  ),
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parser: typeScriptESLintParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      typeScriptESLint,
      html,
      markdown,
      jsdoc,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      complexity: ['error', 10],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'jsx-a11y/alt-text': 'error',
    },
  },
]

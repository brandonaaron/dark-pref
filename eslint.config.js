import globals from 'globals'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default [
  { ignores: ['dist', 'docs'] },
  eslint.configs.recommended,
  stylistic.configs['recommended-flat'],
  {
    rules: {
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/multiline-ternary': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.commonjs,
      },
    },
  },
  {
    files: ['*.ts', '**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.mocha,
      },
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
]

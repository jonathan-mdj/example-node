import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['eslint.config.mjs', 'node_modules']
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    rules: {}
  }
]

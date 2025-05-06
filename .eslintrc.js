// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    env: {
      node: true,
      es2020: true,
      jest: true
    },
    rules: {
      // add or override any rules here
    }
  };
  
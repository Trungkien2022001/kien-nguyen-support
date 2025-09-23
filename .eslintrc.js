module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Code quality rules
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'prefer-arrow-callback': 'warn',
    'arrow-spacing': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'indent': ['warn', 2],
    'no-trailing-spaces': 'warn',
    'eol-last': 'warn',
  },
};
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'quotes': [ 'error', 'single', { 'avoidEscape': true } ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase']
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.js',
        '**/tests/unit/**/*.spec.js'
      ],
      env: {
        jest: true
      }
    }
  ]
}

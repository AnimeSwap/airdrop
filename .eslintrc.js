module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'semi': ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'eol-last': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      'multiline': {
        'delimiter': 'none',
        'requireLast': true
      },
      'singleline': {
        'delimiter': 'comma',
        'requireLast': false
      },
      'multilineDetection': 'brackets'
    }],
  },
};

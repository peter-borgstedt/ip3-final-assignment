// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: {},
  },
  extends: [ 'eslint:recommended' ],
  rules: {
    'no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' }],
    semi: [2, 'always'],
    'no-unreachable': [ 'warn' ]
  }
};

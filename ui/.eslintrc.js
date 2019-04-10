module.exports = {
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'airbnb', 'plugin:prettier/recommended'],
  rules: {
    'node/prefer-global/console': ['warning', 'always']
  }
};

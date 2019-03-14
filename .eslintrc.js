module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  rules: {
    'node/prefer-global/console': ['warning', 'always']
  }
};

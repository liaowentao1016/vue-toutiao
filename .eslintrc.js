module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/essential', '@vue/standard'],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'space-before-function-paren': 0,
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'space-before-blocks': 'off',
    'no-multi-spaces': 0
  },

  extends: ['plugin:vue/essential', '@vue/standard']
}

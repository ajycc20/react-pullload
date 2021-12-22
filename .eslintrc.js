module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // 自定义你的规则
    '@typescript-eslint/no-require-imports': 'off',
  },
};

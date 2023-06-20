module.exports = {
  ...require('@mj/eslint-config/eslint-react.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}

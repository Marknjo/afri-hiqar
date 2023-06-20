module.exports = {
  ...require('@mj/eslint-config/eslint-react'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}

module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['import', '@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: '.',
      },
    },
  },
  rules: {
    'eslint-disable import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/**/*.[jt]s',
        '**/__mocks__/**/*.[jt]s',
        '**/?(*.)+(spec|test).[jt]s',
      ],
      extends: ['plugin:vitest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': [
          'on',
          { devDependencies: ['**/?(*.)+(spec|test).[jt]s'] },
        ],
        'vitest/max-nested-describe': [
          'error',
          {
            max: 3,
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    '**/*.js',
    '**/*.cjs',
    'node_modules',
    '.turbo',
    'dist',
    'coverage',
    'tests-setup',
  ],
}

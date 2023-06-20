module.exports = {
  env: { browser: true, es2021: true },

  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'function-declaration',
      },
    ],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react/no-unescaped-entities': 'off',
    'react-refresh/only-export-components': 'warn',
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
          'off',
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
    '**/*.json',
    '**/*.cjs',
    'node_modules',
    'public',
    'styles',
    'coverage',
    'dist',
    '.turbo',
    'vite.config.ts',
  ],
}

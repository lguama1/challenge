const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tseslintPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');

module.exports = [
  {
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      'test/**/*',
      'src/bin/**/*',
      '**/.scannerwork',
      '**/*/config.ts',
      'src/middlewares/TransformErrors.ts'
    ],
  },
	{
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { 
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      'unused-imports': unusedImportsPlugin,
    },
		rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
			"unused-imports/no-unused-imports": "error",
		},
	},
];

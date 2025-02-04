module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
      ecmaVersion: 2020, // Allows parsing of modern ECMAScript features
      sourceType: 'module', // Allows use of imports
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      'prettier', // Uses eslint-config-prettier to disable ESLint rules that might conflict with prettier
    ],
    rules: {
      'prettier/prettier': 'error', // Shows prettier errors as ESLint errors
      // Add or override rules as needed
    },
    env: {
      node: true, // For backend
      jest: true, // For tests
    },
  };
  
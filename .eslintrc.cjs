module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:astro/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  ],
  rules: {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "prefer-const": "warn",
    "no-trailing-spaces": "warn",
    "no-multiple-empty-lines": ["warn", { max: 2, maxEOF: 1 }],
  },
};

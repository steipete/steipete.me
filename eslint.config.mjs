import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
    },
  },
  {
    files: ["src/**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".astro"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Astro: "readonly",
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
];

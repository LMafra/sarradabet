import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/**"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
];

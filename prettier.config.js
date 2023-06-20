/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 2,
  quoteProps: "consistent",
  arrowParens: "always",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
  ],
  pluginSearchDirs: false,
  tailwindFunctions: ["cva"],
  importOrder: [
    "^(react$)|^(react/(.*)$)",
    "^(next$)|^(next/(.*)$)",
    "<THIRD_PARTY_MODULES>",
    "^~/(.*)$",
    "^[./]",
    "",
    "<TYPES>",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.1.3",
};

module.exports = config;

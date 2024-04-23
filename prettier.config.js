/** @type {import("prettier").Config} */
const config = {
  printWidth: 70,
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
  importOrderTypeScriptVersion: "5.4.5",
};

module.exports = config;

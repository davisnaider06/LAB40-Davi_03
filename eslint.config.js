// Configuração do ESLint (flat config) para o LAB40.
const js = require("@eslint/js");

const nodeGlobals = {
  require: "readonly",
  module: "writable",
  process: "readonly",
  console: "readonly",
  __dirname: "readonly",
  URL: "readonly",
  fetch: "readonly",
};
const browserGlobals = {
  window: "readonly",
  document: "readonly",
  fetch: "readonly",
  console: "readonly",
};

module.exports = [
  { ignores: ["node_modules/**", "coverage/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "test/**/*.js", "scripts/**/*.js", "eslint.config.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: nodeGlobals },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: browserGlobals },
  },
];

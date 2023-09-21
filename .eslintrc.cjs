module.exports = {
  root: true,
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.js"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
}
